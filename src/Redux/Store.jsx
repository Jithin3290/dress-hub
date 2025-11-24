import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Redux/Slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
