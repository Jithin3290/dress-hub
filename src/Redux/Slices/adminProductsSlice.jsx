// src/redux/adminProductsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../../admin_api";

// fetch paginated products
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetch",
  async ({ page = 1, pageSize = 10, search = "", category = "" } = {}, { rejectWithValue }) => {
    try {
      const params = { page, page_size: pageSize };
      if (search) params.search = search;
      if (category) params.category = category;
      const res = await adminApi.get("admin_products/", { params });
      return {
        data: res.data.results ?? res.data,
        total: res.data.count ?? 0,
        page,
        pageSize,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// create product (supports FormData)
export const createAdminProduct = createAsyncThunk(
  "adminProducts/create",
  async ({ payload, asFormData = false } = {}, { rejectWithValue }) => {
    try {
      if (asFormData) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
          if (v === undefined || v === null) return;
          if (k === "sizes_input") {
            fd.append("sizes_input", JSON.stringify(v)); // send array of strings as JSON string
            return;
          }
          fd.append(k, v);
        });
        // 'image' file must be appended by caller as payload.image (File)
        const res = await adminApi.post("admin_products/", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
      } else {
        const res = await adminApi.post("admin_products/", payload);
        return res.data;
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// patch product (supports FormData)
export const patchAdminProduct = createAsyncThunk(
  "adminProducts/patch",
  async ({ id, patch, asFormData = false } = {}, { rejectWithValue }) => {
    try {
      if (asFormData) {
        const fd = new FormData();
        Object.entries(patch).forEach(([k, v]) => {
          if (v === undefined || v === null) return;
          if (k === "sizes_input") {
            fd.append("sizes_input", JSON.stringify(v));
            return;
          }
          fd.append(k, v);
        });
        const res = await adminApi.patch(`admin_products/${id}/`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
      } else {
        const res = await adminApi.patch(`admin_products/${id}/`, patch);
        return res.data;
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteAdminProduct = createAsyncThunk(
  "adminProducts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await adminApi.delete(`admin_products/${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState: {
    items: [],
    loading: false,
    error: null,
    page: 1,
    pageSize: 10,
    total: 0,
    search: "",
    category: "",
    selectedProduct: null,
  },
  reducers: {
    setPage(state, action) { state.page = action.payload; },
    setPageSize(state, action) { state.pageSize = action.payload; state.page = 1; },
    setSearch(state, action) { state.search = action.payload; state.page = 1; },
    setCategory(state, action) { state.category = action.payload; state.page = 1; },
    clearSelectedProduct(state) { state.selectedProduct = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAdminProducts.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.data;
        s.total = a.payload.total;
        s.page = a.payload.page;
        s.pageSize = a.payload.pageSize;
      })
      .addCase(fetchAdminProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })

      .addCase(createAdminProduct.fulfilled, (s, a) => {
        s.items = [a.payload, ...s.items];
      })
      .addCase(createAdminProduct.rejected, (s, a) => { s.error = a.payload || a.error.message; })

      .addCase(patchAdminProduct.fulfilled, (s, a) => {
        const updated = a.payload;
        s.items = s.items.map((p) => (p.id === updated.id ? updated : p));
        if (s.selectedProduct?.id === updated.id) s.selectedProduct = updated;
      })
      .addCase(patchAdminProduct.rejected, (s, a) => { s.error = a.payload || a.error.message; })

      .addCase(deleteAdminProduct.fulfilled, (s, a) => {
        s.items = s.items.filter((p) => p.id !== a.payload);
      })
      .addCase(deleteAdminProduct.rejected, (s, a) => { s.error = a.payload || a.error.message; });
  },
});

export const { setPage, setPageSize, setSearch, setCategory, clearSelectedProduct } = adminProductsSlice.actions;
export default adminProductsSlice.reducer;
