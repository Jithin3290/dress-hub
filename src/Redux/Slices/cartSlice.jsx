// src/Redux/Slices/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../user_api";

/**
 * Helper: normalize server cart response into shape:
 * { items: [ { id: cartItemId, product: { id, name, ... } | product_detail, quantity, unit_price, size, added_at } ], subtotal }
 */
const normalizeCartResponse = (data) => {
  const obj = data ?? {};
  const items = Array.isArray(obj.items) ? obj.items : Array.isArray(data) ? data : [];

  const subtotal = obj.subtotal ?? obj.total ?? items.reduce((s, it) => {
    const priceRaw = it.unit_price ?? it.product?.new_price ?? it.product?.price ?? it.product_detail?.new_price ?? 0;
    const price = Number(priceRaw ?? 0);
    const qty = Number(it.quantity ?? 0);
    return s + price * qty;
  }, 0);

  return { items, subtotal };
};

/* ============================
   Thunks: CRUD on /cart/
   ============================ */

// GET /api/v1/cart/
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/cart/");
      return normalizeCartResponse(res.data);
    } catch (err) {
      console.error("fetchCart error:", err);
      return rejectWithValue(err.response?.data ?? String(err.message ?? err));
    }
  }
);

// POST /api/v1/cart/ { product, quantity, size }
export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async ({ productId, product, quantity = 1, size = null } = {}, { dispatch, rejectWithValue }) => {
    try {
      const pid = productId ?? product;
      if (!pid) throw new Error("productId is required");

      const payload = { product: pid, quantity, size };
      const res = await api.post("/cart/", payload);
      await dispatch(fetchCart());
      return normalizeCartResponse(res.data);
    } catch (err) {
      console.error("addCartItem error:", err, err?.response?.data ?? "");
      return rejectWithValue(err.response?.data ?? String(err.message ?? err));
    }
  }
);

// PATCH /api/v1/cart/<id>/ { quantity }
// Requires resolving cartItemId. Caller should pass cartItemId when available.
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity, size = null, cartItemId = null } = {}, { getState, dispatch, rejectWithValue }) => {
    try {
      // basic validation
      if (typeof quantity === "undefined") {
        return rejectWithValue({ detail: "Missing 'quantity' in request." });
      }

      let id = cartItemId;
      if (!id) {
        const state = getState().cart;
        const items = Array.isArray(state.items) ? state.items : [];
        const found = items.find((it) => {
          const pid = it?.product?.id ?? it?.product_id ?? it?.product ?? it?.product_detail?.id ?? null;
          const sz = it?.size ?? null;
          return String(pid) === String(productId) && String(sz ?? "") === String(size ?? "");
        });
        id = found?.id ?? found?.pk ?? null;
      }

      if (!id) {
        const msg = "Cannot update cart: cartItemId not found for productId (and size).";
        console.error(msg, { productId, size });
        return rejectWithValue({ detail: msg });
      }

      const res = await api.patch(`/cart/${id}/`, { quantity });
      await dispatch(fetchCart());
      return normalizeCartResponse(res.data);
    } catch (err) {
      console.error("updateCartItem error:", err, err?.response?.data ?? "");
      return rejectWithValue(err.response?.data ?? String(err.message ?? err));
    }
  }
);

// DELETE /api/v1/cart/<id>/
// Requires resolving cartItemId. Caller should pass cartItemId when available.
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ productId, size = null, cartItemId = null } = {}, { getState, dispatch, rejectWithValue }) => {
    try {
      let id = cartItemId;
      if (!id) {
        const state = getState().cart;
        const items = Array.isArray(state.items) ? state.items : [];

        const found = items.find((it) => {
          const pid = it?.product?.id ?? it?.product_id ?? it?.product ?? it?.product_detail?.id ?? null;
          const sz = it?.size ?? null;
          return String(pid) === String(productId) && String(sz ?? "") === String(size ?? "");
        });

        id = found?.id ?? found?.pk ?? null;
      }

      if (!id) {
        const msg = "Cannot remove cart item: cartItemId not found for productId (and size).";
        console.error(msg, { productId, size });
        return rejectWithValue({ detail: msg });
      }

      await api.delete(`/cart/${id}/`);
      await dispatch(fetchCart());
      return { removed: productId, size };
    } catch (err) {
      console.error("removeCartItem error:", err, err?.response?.data ?? "");
      return rejectWithValue(err.response?.data ?? String(err.message ?? err));
    }
  }
);

// Clear cart: delete each cart item by id (fallback if no server clear endpoint)
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState().cart;
      const items = Array.isArray(state.items) ? state.items : [];
      for (const it of items) {
        const id = it.id ?? it.pk;
        if (id) {
          try {
            await api.delete(`/cart/${id}/`);
          } catch (e) {
            console.warn("clearCart: failed to delete", id, e?.response?.data ?? e.message);
          }
        }
      }
      await dispatch(fetchCart());
      return { cleared: true };
    } catch (err) {
      console.error("clearCart error:", err);
      return rejectWithValue(err.response?.data ?? String(err.message ?? err));
    }
  }
);

// Checkout: prefer server endpoint POST /cart/checkout/, fallback to clearing items client-side
export const checkoutCart = createAsyncThunk(
  "cart/checkoutCart",
  async ({ clearAfter = true } = {}, { getState, dispatch, rejectWithValue }) => {
    try {
      try {
        const res = await api.post("/cart/checkout/", { clear_after: clearAfter });
        await dispatch(fetchCart());
        return res.data;
      } catch (err) {
        console.warn("checkoutCart: server checkout failed or missing, falling back", err?.response?.status);
      }

      // fallback: delete items
      const state = getState().cart;
      const items = Array.isArray(state.items) ? state.items : [];
      for (const it of items) {
        const id = it.id ?? it.pk;
        if (id) {
          try {
            await api.delete(`/cart/${id}/`);
          } catch (e) {
            console.warn("checkoutCart: failed to delete cart item", id, e?.response?.data ?? e.message);
          }
        }
      }
      await dispatch(fetchCart());
      return { cleared: true };
    } catch (err) {
      console.error("checkoutCart error:", err);
      return rejectWithValue(err.response?.data ?? String(err.message ?? err));
    }
  }
);

/* ============================
   Slice
   ============================ */

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    loading: false,
    items: [],
    subtotal: 0,
    error: null,
  },
  reducers: {
    setCartLocal(state, action) {
      const payload = action.payload ?? {};
      state.items = payload.items ?? state.items;
      state.subtotal = payload.subtotal ?? state.subtotal;
    },
    clearLocalCart(state) {
      state.items = [];
      state.subtotal = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload ?? { items: [], subtotal: 0 };
        state.items = data.items ?? [];
        state.subtotal = data.subtotal ?? 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      })

      // addCartItem
      .addCase(addCartItem.pending, (state) => {
        state.error = null;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        const data = action.payload ?? { items: state.items, subtotal: state.subtotal };
        state.items = data.items ?? state.items;
        state.subtotal = data.subtotal ?? state.subtotal;
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message;
      })

      // removeCartItem
      .addCase(removeCartItem.fulfilled, (state, action) => {
        const data = action.payload ?? {};
        if (data.items) {
          state.items = data.items;
          state.subtotal = data.subtotal ?? state.subtotal;
          return;
        }

        // meta.arg is the object: { productId, size, cartItemId }
        const arg = action.meta?.arg ?? {};
        const removedPid = arg.productId ?? arg.product ?? null;
        const removedSize = arg.size ?? null;

        if (removedPid != null) {
          state.items = state.items.filter((it) => {
            const pid = it?.product?.id ?? it?.product_id ?? it?.product ?? it?.product_detail?.id ?? null;
            const sz = it?.size ?? null;
            return !(String(pid) === String(removedPid) && String(sz ?? "") === String(removedSize ?? ""));
          });
        }
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message;
      })

      // updateCartItem
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const data = action.payload ?? {};
        if (data.items) {
          state.items = data.items;
          state.subtotal = data.subtotal ?? state.subtotal;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message;
      })

      // clearCart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.subtotal = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message;
      })

      // checkoutCart
      .addCase(checkoutCart.fulfilled, (state, action) => {
        if (action.payload?.cleared) {
          state.items = [];
          state.subtotal = 0;
        }
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message;
      });
  },
});

export const { setCartLocal, clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;
