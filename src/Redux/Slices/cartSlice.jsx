// src/Redux/Slices/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../user_api";

/**
 * Helper: normalize server cart response into shape:
 * { items: [ { id: cartItemId, product: { id, name, ... }, quantity, unit_price, added_at } ], subtotal }
 */
const normalizeCartResponse = (data) => {
  const obj = data ?? {};
  // if the server returns the whole cart object
  const items = Array.isArray(obj.items) ? obj.items : Array.isArray(data) ? data : [];
  const subtotal = obj.subtotal ?? obj.total ?? items.reduce((s, it) => {
    const price = it.unit_price ?? it.product?.new_price ?? it.product?.price ?? 0;
    return s + (price * (it.quantity ?? 0));
  }, 0);
  return { items, subtotal };
};

// GET /api/v1/cart/
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/v1/cart/");
      return normalizeCartResponse(res.data);
    } catch (err) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  }
);

// Add item: try POST /api/v1/cart/ { product, quantity }
// fallback to /api/v1/cart/add/
export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async ({ productId, quantity = 1 }, { dispatch, rejectWithValue }) => {
    try {
      // prefer RESTful create
      try {
        const res = await api.post("/api/v1/cart/", { product: productId, quantity });
        await dispatch(fetchCart());
        return normalizeCartResponse(res.data);
      } catch (e) {
        // fallback older endpoints
        const res2 = await api.post("/api/v1/cart/add/", { product: productId, quantity });
        await dispatch(fetchCart());
        return normalizeCartResponse(res2.data);
      }
    } catch (err) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  }
);

// Remove item: try DELETE /api/v1/cart/<cartItemId>/ if we can find cartItemId from state
// fallback to POST /api/v1/cart/remove/ { product }
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (productId, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState().cart;
      const items = Array.isArray(state.items) ? state.items : [];
      // find the cart item record with this product id
      const found = items.find((it) => {
        const pid = it?.product?.id ?? it?.product_id ?? it?.product;
        return String(pid) === String(productId);
      });

      if (found && (found.id || found.pk)) {
        const cartItemId = found.id ?? found.pk;
        await api.delete(`/api/v1/cart/${cartItemId}/`);
        await dispatch(fetchCart());
        return { removed: productId };
      }

      // fallback endpoint
      try {
        await api.post("/api/v1/cart/remove/", { product: productId });
        await dispatch(fetchCart());
        return { removed: productId };
      } catch (fallbackErr) {
        return rejectWithValue(fallbackErr.response?.data ?? fallbackErr.message);
      }
    } catch (err) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  }
);

// Update quantity: try PATCH /api/v1/cart/<cartItemId>/ { quantity }
// fallback to POST /api/v1/cart/update/
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState().cart;
      const items = Array.isArray(state.items) ? state.items : [];
      const found = items.find((it) => {
        const pid = it?.product?.id ?? it?.product_id ?? it?.product;
        return String(pid) === String(productId);
      });

      if (found && (found.id || found.pk)) {
        const cartItemId = found.id ?? found.pk;
        const res = await api.patch(`/api/v1/cart/${cartItemId}/`, { quantity });
        await dispatch(fetchCart());
        return normalizeCartResponse(res.data);
      }

      // fallback older endpoint
      const res2 = await api.post("/api/v1/cart/update/", { product: productId, quantity });
      await dispatch(fetchCart());
      return normalizeCartResponse(res2.data);
    } catch (err) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  }
);

// Clear cart: try POST /api/v1/cart/clear/ or DELETE all items by iterating
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      // try endpoint
      try {
        const res = await api.post("/api/v1/cart/clear/");
        await dispatch(fetchCart());
        return normalizeCartResponse(res.data);
      } catch (e) {
        // fallback: delete each cart item if we have ids
        const state = getState().cart;
        const items = Array.isArray(state.items) ? state.items : [];
        for (const it of items) {
          const id = it.id ?? it.pk;
          if (id) {
            await api.delete(`/api/v1/cart/${id}/`).catch(() => {});
          }
        }
        await dispatch(fetchCart());
        return { items: [], subtotal: 0 };
      }
    } catch (err) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  }
);

// Checkout: server side logic; prefer /api/v1/cart/checkout/
export const checkoutCart = createAsyncThunk(
  "cart/checkoutCart",
  async ({ clearAfter = true } = {}, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/api/v1/cart/checkout/", { clear_after: clearAfter });
      if (res?.data?.cleared) {
        // server cleared cart
        await dispatch(fetchCart());
      } else {
        // try fetch anyway
        await dispatch(fetchCart());
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    loading: false,
    items: [], // array of cart item objects from server
    subtotal: 0,
    error: null,
  },
  reducers: {
    // local setter for optimistic/local-only updates
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
        // after server confirms removal we rely on fetchCart; however if payload contains items update them
        const data = action.payload ?? {};
        if (data.items) {
          state.items = data.items;
          state.subtotal = data.subtotal ?? state.subtotal;
        } else {
          // optimistic: remove from local if product id known
          const removedPid = action.meta?.arg;
          state.items = state.items.filter((it) => String((it?.product?.id ?? it?.product_id ?? it?.product)) !== String(removedPid));
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
