// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Redux/Slices/authSlice";
import productsReducer from "./Slices/productsSlice";
import wishlistReducer from "./Slices/wishlistSlice";
import cartReducer from "./Slices/cartSlice";
import recentlyWatchedReducer, { STORAGE_KEY } from "./Slices/recentlywatchedSlice";
import ordersReducer from "./Slices/orderSlice";
import adminReducer from "./Slices/adminSlice";
import adminOrdersReducer from "./Slices/adminOrdersSlice";
import adminProductsReducer from "./Slices/adminProductsSlice";
import adminUsersReducer from "./Slices/adminUserSlice";

const preloadedAuth = (() => {
  try {
    const raw = sessionStorage.getItem("user");
    if (!raw) return { auth: { user: null } };
    // ensure boolean coercion for admin flags if needed
    const parsed = JSON.parse(raw);
    parsed.is_staff = !!parsed.is_staff;
    parsed.is_superuser = !!parsed.is_superuser;
    return { auth: { user: parsed } };
  } catch {
    return { auth: { user: null } };
  }
})();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    products: productsReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    recentlyWatched: recentlyWatchedReducer,
    orders: ordersReducer,
    adminOrders: adminOrdersReducer,
    adminProducts: adminProductsReducer,
    adminUsers: adminUsersReducer,
  },
  preloadedState: preloadedAuth,
});

export default store;


// let prev = null;
// store.subscribe(() => {
//   try {
//     const cur = JSON.stringify(store.getState().recentlyWatched || []);
//     if (cur === prev) return;
//     sessionStorage.setItem(STORAGE_KEY, cur);
//     prev = cur;
//   } catch {
//     // ignore storage errors
//   }
// });

// // initialize baseline to avoid immediate write
// try {
//   prev = JSON.stringify(store.getState().recentlyWatched || []);
//   sessionStorage.setItem(STORAGE_KEY, prev);
// } catch {}

