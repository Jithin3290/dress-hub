// src/redux/ordersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* Assumes axios.defaults.baseURL and axios auth header set elsewhere */

// --- Async thunks ---
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/order/my-orders/");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const codCheckout = createAsyncThunk(
  "orders/codCheckout",
  async (payload /* { orders: [...] } */, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/order/checkout/cod/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createRazorpayOrder = createAsyncThunk(
  "orders/createRazorpayOrder",
  async (payload /* { orders: [...] } */, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/order/checkout/razorpay/create/", payload);
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
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post("/api/order/checkout/razorpay/verify/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateOrderAddress = createAsyncThunk(
  "orders/updateOrderAddress",
  async ({ order_id, shipping_address }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/order/${order_id}/update-address/`, { shipping_address });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  "orders/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/order/notifications/");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "orders/markNotificationRead",
  async (payload /* { id? } or {} to mark all */, { rejectWithValue }) => {
    try {
      const res = await axios.patch("/api/order/notifications/", payload || {});
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
  loading: false,        // general loading flag for list/create/verify
  checkoutLoading: false,
  createOrderData: null, // response from createRazorpayOrder or codCheckout
  verifyResult: null,    // response from verifyRazorpayPayment
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
    state.checkoutItems = action.payload; // array of items
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

export const { clearOrderState, clearError,setCheckoutItems, clearCheckoutItems } = ordersSlice.actions;
export default ordersSlice.reducer;
