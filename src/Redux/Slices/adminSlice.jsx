// src/features/admin/adminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../../admin_api"

export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminApi.get("products/");
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminApi.get("users/");
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  "admin/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminApi.get("orders/");
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    users: [],
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // products
      .addCase(fetchAdminProducts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAdminProducts.fulfilled, (s, a) => { s.loading = false; s.products = a.payload; })
      .addCase(fetchAdminProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error; })

      // users
      .addCase(fetchAdminUsers.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAdminUsers.fulfilled, (s, a) => { s.loading = false; s.users = a.payload; })
      .addCase(fetchAdminUsers.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error; })

      // orders
      .addCase(fetchAdminOrders.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAdminOrders.fulfilled, (s, a) => { s.loading = false; s.orders = a.payload; })
      .addCase(fetchAdminOrders.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error; });
  },
});

export default adminSlice.reducer;
