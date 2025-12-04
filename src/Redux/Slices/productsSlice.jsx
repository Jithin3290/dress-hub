// src/Redux/Slices/productsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../user_api"; // adjust path if needed

/**
 * fetchProducts
 * - params: { limit, category }
 * - expects your API to return either an array or a paginated { results: [] } object
 */
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ limit = 5, category = null } = {}, { rejectWithValue }) => {
    try {
      const params = { page_size: limit, ordering: "-created_at" };
      if (category) params["category__slug"] = category;
      const res = await api.get("products/", { params });
      const data = res.data;
      if (Array.isArray(data)) return data;
      if (data?.results && Array.isArray(data.results)) return data.results;
      return [];
    } catch (err) {
      const payload = err?.response?.data ?? err.message ?? "Network error";
      return rejectWithValue(payload);
    }
  }
);

/**
 * fetchProduct
 * - fetch single product by id OR slug
 * - call with { id } or { slug }
 */
export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async ({ id = null, slug = null } = {}, { rejectWithValue }) => {
    try {
      if (!id && !slug) throw new Error("id or slug required");
      const url = id ? `products/${id}/` : `products/${slug}/`;
      const res = await api.get(url);
      return res.data;
    } catch (err) {
      const payload = err?.response?.data ?? err.message ?? "Network error";
      return rejectWithValue(payload);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
    selected: null,
    selectedLoading: false,
    selectedError: null,
  },
  reducers: {
    clearProducts(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
    setSelectedProduct(state, action) {
      state.selected = action.payload;
      state.selectedError = null;
    },
    clearSelectedProduct(state) {
      state.selected = null;
      state.selectedError = null;
      state.selectedLoading = false;
    },
  },
  extraReducers: (builder) => {
    // list lifecycle
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error;
      })

      // single product lifecycle
      .addCase(fetchProduct.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selected = action.payload || null;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.payload ?? action.error;
      });
  },
});

export const { clearProducts, setSelectedProduct, clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
