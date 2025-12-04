// src/redux/recentlyWatchedSlice.js
import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "recentlyWatched";
const MAX_ITEMS = 4;

const safeParse = (s) => {
  try {
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
};

const initialState = safeParse(sessionStorage.getItem(STORAGE_KEY));

const slice = createSlice({
  name: "recentlyWatched",
  initialState,
  reducers: {
    addRecentlyWatched(state, action) {
      const product = action.payload;
      const filtered = state.filter((p) => p.id !== product.id);
      filtered.unshift(product);
      return filtered.slice(0, MAX_ITEMS);
    },
    removeRecentlyWatched(state, action) {
      const id = action.payload;
      return state.filter((p) => p.id !== id);
    },
    clearRecentlyWatched() {
      return [];
    },
    setRecentlyWatched(state, action) {
      const list = Array.isArray(action.payload) ? action.payload.slice(0, MAX_ITEMS) : [];
      return list;
    },
  },
});

export const {
  addRecentlyWatched,
  removeRecentlyWatched,
  clearRecentlyWatched,
  setRecentlyWatched,
} = slice.actions;

export default slice.reducer;
export { STORAGE_KEY, MAX_ITEMS };
