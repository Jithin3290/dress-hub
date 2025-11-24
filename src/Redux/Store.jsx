import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Redux/Slices/authSlice";
import productsReducer from "./Slices/productsSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    products:productsReducer,
  },
});
