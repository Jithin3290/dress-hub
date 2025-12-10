// src/redux/adminOrdersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../../admin_api";

// fetch paginated orders
export const fetchAdminOrders = createAsyncThunk(
  "adminOrders/fetch",
  async ({ page = 1, pageSize = 10, search = "", ordering = "-created_at" } = {}, { rejectWithValue }) => {
    try {
      const params = { page, page_size: pageSize, ordering };
      if (search) params.search = search;
      const res = await adminApi.get("admin_orders/", { params });
      // DRF paginator: { count, next, previous, results }
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

// fetch single order detail
export const fetchAdminOrderDetail = createAsyncThunk(
  "adminOrders/fetchDetail",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await adminApi.get(`admin_orders/${orderId}/`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// patch arbitrary fields on order (admin)
export const patchAdminOrder = createAsyncThunk(
  "adminOrders/patch",
  async ({ orderId, patch }, { rejectWithValue }) => {
    try {
      const res = await adminApi.patch(`admin_orders/${orderId}/`, patch);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// change only status
export const changeAdminOrderStatus = createAsyncThunk(
  "adminOrders/changeStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const res = await adminApi.patch(`admin_orders/${orderId}/status/`, { status });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState: {
    items: [],
    loading: false,
    error: null,
    page: 1,
    pageSize: 10,
    total: 0,
    search: "",
    ordering: "-created_at",
    selectedOrder: null,
  },
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
      state.page = 1;
    },
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1;
    },
    setOrdering(state, action) {
      state.ordering = action.payload;
      state.page = 1;
    },
    clearSelectedOrder(state) {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchAdminOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchAdminOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(patchAdminOrder.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map((o) => (o.id === updated.id ? updated : o));
        if (state.selectedOrder?.id === updated.id) state.selectedOrder = updated;
      })
      .addCase(patchAdminOrder.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(changeAdminOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map((o) => (o.id === updated.id ? updated : o));
        if (state.selectedOrder?.id === updated.id) state.selectedOrder = updated;
      })
      .addCase(changeAdminOrderStatus.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setPage, setPageSize, setSearch, setOrdering, clearSelectedOrder } = adminOrdersSlice.actions;
export default adminOrdersSlice.reducer;
