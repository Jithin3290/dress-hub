// src/Redux/Slices/wishlistSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../user_api";

const normalizeWishlistResponse = (data) => {
  const rawItems = Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : [];
  
  const ids = rawItems
    .map((it) => {
      if (it && typeof it === "object") {
        // Check for product_detail first, then fallback to other fields
        if (it.product_detail && it.product_detail.id) {
          return it.product_detail.id;
        }
        return it.product?.id ?? it.product_id ?? it.product ?? it.id ?? null;
      }
      return it;
    })
    .filter((v) => v !== undefined && v !== null)
    .map((v) => String(v));
  
  return { ids, raw: rawItems };
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/wishlist/");
      const data = res.data;
      console.log(data)
      const normalized = normalizeWishlistResponse(data);
      return normalized;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  }
);

export const addWishlistItem = createAsyncThunk(
  "wishlist/addWishlistItem",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      await api.post("/wishlist/", { product: productId });
      await dispatch(fetchWishlist());
      return String(productId);
    } catch (err) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  }
);

export const removeWishlistItem = createAsyncThunk(
  "wishlist/removeWishlistItem",
  async (productId, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState().wishlist;
      const raw = Array.isArray(state.raw) ? state.raw : [];
      
      const found = raw.find((it) => {
        if (!it || typeof it !== "object") return false;
        
        let pid;
        // Check for product_detail first
        if (it.product_detail && it.product_detail.id) {
          pid = it.product_detail.id;
        } else {
          pid = it.product?.id ?? it.product_id ?? it.product;
        }
        
        return String(pid) === String(productId);
      });

      if (found && (found.id || found.pk)) {
        const wishlistItemId = found.id ?? found.pk;
        await api.delete(`/wishlist/${wishlistItemId}/`);
        await dispatch(fetchWishlist());
        return String(productId);
      }

      try {
        await api.post("/wishlist/remove/", { product: productId });
        await dispatch(fetchWishlist());
        return String(productId);
      } catch (fallbackErr) {
        return rejectWithValue(fallbackErr.response?.data ?? fallbackErr.message);
      }
    } catch (err) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async (productId, { getState, dispatch, rejectWithValue }) => {
    try {
      const currentIds = (getState().wishlist.items || []).map(String);
      const idStr = String(productId);
      const exists = currentIds.includes(idStr);
      if (exists) {
        await dispatch(removeWishlistItem(productId)).unwrap();
      } else {
        await dispatch(addWishlistItem(productId)).unwrap();
      }
      // ensure final state
      await dispatch(fetchWishlist());
      return idStr;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? err.message ?? err);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    raw: [],
    loading: false,
    error: null,
  },
  reducers: {
    setWish(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload.map(String) : [];
      state.raw = [];
    },
    setWishLocal(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload.map(String) : [];
    },
    clearWishLocal(state) {
      state.items = [];
      state.raw = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || { ids: [], raw: [] };
        state.items = Array.isArray(payload.ids) ? payload.ids.map(String) : [];
        state.raw = Array.isArray(payload.raw) ? payload.raw : [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      })
      .addCase(addWishlistItem.pending, (state) => {
        state.error = null;
      })
      .addCase(addWishlistItem.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message;
      })
      .addCase(removeWishlistItem.pending, (state) => {
        state.error = null;
      })
      .addCase(removeWishlistItem.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message;
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message;
      });
  },
});

export const { setWish, setWishLocal, clearWishLocal } = wishlistSlice.actions;
export default wishlistSlice.reducer;
