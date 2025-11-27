import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Redux/Slices/authSlice";
import productsReducer from "./Slices/productsSlice"
import wishlistReducer from "./Slices/wishlistSlice";
import cartReducer from "./Slices/cartSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    products:productsReducer,
    wishlist:wishlistReducer,
    cart: cartReducer,
  },
});
