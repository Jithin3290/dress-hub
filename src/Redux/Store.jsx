import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Redux/Slices/authSlice";
import productsReducer from "./Slices/productsSlice"
import wishlistReducer from "./Slices/wishlistSlice";
import cartReducer from "./Slices/cartSlice"
import recentlyWatchedReducer, { STORAGE_KEY } from "./Slices/recentlywatchedSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    products:productsReducer,
    wishlist:wishlistReducer,
    cart: cartReducer,
    recentlyWatched: recentlyWatchedReducer,
  },
});


let prev = null;
store.subscribe(() => {
  try {
    const cur = JSON.stringify(store.getState().recentlyWatched || []);
    if (cur === prev) return;
    sessionStorage.setItem(STORAGE_KEY, cur);
    prev = cur;
  } catch {
    // ignore storage errors
  }
});

// initialize baseline to avoid immediate write
try {
  prev = JSON.stringify(store.getState().recentlyWatched || []);
  sessionStorage.setItem(STORAGE_KEY, prev);
} catch {}

