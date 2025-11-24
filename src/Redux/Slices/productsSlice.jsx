// src/Redux/Slices/productsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../user_api"; // adjust path if needed

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ limit = 5, category = null } = {}, { rejectWithValue }) => {
    try {
      const params = { page_size: limit, ordering: "-created_at" };
      if (category) params["category__slug"] = category;
      console.log("fetchProducts params:", params);
      const res = await api.get("products/", { params });
      console.log("Products request =>", res.config.method.toUpperCase(), res.config.url, res.config.params);
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

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], loading: false, error: null },
  reducers: { clearProducts(state) { state.items = []; state.loading = false; state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.items = action.payload || []; })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? action.error; });
  },
});

export const { clearProducts } = productsSlice.actions;
export default productsSlice.reducer;
