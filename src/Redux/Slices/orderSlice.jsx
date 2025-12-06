// src/redux/ordersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../user_api"; // <- use your axios instance

// --- Async thunks ---
// If you need the token from state, use getState() below and set header per-request.

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue, getState }) => {
    try {
      // example: attach token from state if you store it
      const token = getState().auth?.accessToken;
      if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await api.get("order/my-orders/"); // final URL: http://localhost:8000/api/v1/order/my-orders/
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const codCheckout = createAsyncThunk(
  "orders/codCheckout",
  async (payload /* { orders: [...] } */, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth?.accessToken;
      if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await api.post("order/checkout/cod/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createRazorpayOrder = createAsyncThunk(
  "orders/createRazorpayOrder",
  async (payload /* { orders: [...] } */, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth?.accessToken;
      if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await api.post("order/checkout/razorpay/create/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const verifyRazorpayPayment = createAsyncThunk(
  "orders/verifyRazorpayPayment",
  async (
    payload /* { razorpay_payment_id, razorpay_order_id, razorpay_signature, orders_payload } */,
    { rejectWithValue, getState }
  ) => {
    try {
      const token = getState().auth?.accessToken;
      if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await api.post("order/checkout/razorpay/verify/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateOrderAddress = createAsyncThunk(
  "orders/updateOrderAddress",
  async ({ order_id, shipping_address }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth?.accessToken;
      if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await api.patch(`order/${order_id}/update-address/`, { shipping_address });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  "orders/fetchNotifications",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth?.accessToken;
      if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await api.get("order/notifications/");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "orders/markNotificationRead",
  async (payload /* { id? } or {} to mark all */, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth?.accessToken;
      if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await api.patch("order/notifications/", payload || {});
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// --- Slice ---
const initialState = {
  orders: [],
  notifications: [],
  loading: false,
  checkoutLoading: false,
  createOrderData: null,
  verifyResult: null,
  error: null,
  checkoutItems: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderState(state) {
      state.createOrderData = null;
      state.verifyResult = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
    setCheckoutItems(state, action) {
      state.checkoutItems = action.payload;
    },
    clearCheckoutItems(state) {
      state.checkoutItems = null;
    },
  },
  extraReducers: (builder) => {
    // fetchUserOrders
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // codCheckout
    builder
      .addCase(codCheckout.pending, (state) => {
        state.checkoutLoading = true;
        state.error = null;
      })
      .addCase(codCheckout.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.createOrderData = action.payload;
      })
      .addCase(codCheckout.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.error = action.payload;
      });

    // createRazorpayOrder
    builder
      .addCase(createRazorpayOrder.pending, (state) => {
        state.checkoutLoading = true;
        state.error = null;
        state.createOrderData = null;
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.createOrderData = action.payload;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.error = action.payload;
      });

    // verifyRazorpayPayment
    builder
      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.checkoutLoading = true;
        state.error = null;
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.verifyResult = action.payload;
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.error = action.payload;
      });

    // updateOrderAddress
    builder
      .addCase(updateOrderAddress.fulfilled, (state, action) => {
        const updated = action.payload;
        state.orders = state.orders.map((o) => (o.id === updated.id ? updated : o));
      })
      .addCase(updateOrderAddress.rejected, (state, action) => {
        state.error = action.payload;
      });

    // notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(markNotificationRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearOrderState, clearError, setCheckoutItems, clearCheckoutItems } = ordersSlice.actions;
export default ordersSlice.reducer;
