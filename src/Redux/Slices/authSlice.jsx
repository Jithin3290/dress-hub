// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../user_api"; // adjust path if needed

// init user from sessionStorage
const storedUser = (() => {
  try {
    const raw = sessionStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

/**
 * Helpers
 */
const getAxiosError = (err) => {
  if (err?.response?.data) return err.response.data;
  return { detail: err.message || "Network error" };
};

/**
 * Thunks using axios instance (baseURL = http://localhost:8000/api/v1/user)
 */

/**
 * payload: { email, name, phone_number, password1, password2, profile_picture? }
 */
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, v);
      });

      const res = await api.post("/signup/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(getAxiosError(err));
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/login/",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(getAxiosError(err));
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/logout/blacklist/");
      return res.data;
    } catch (err) {
      return rejectWithValue(getAxiosError(err));
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/profile/");
      return res.data;
    } catch (err) {
      // treat 401 as unauthorized
      if (err?.response?.status === 401) return rejectWithValue({ detail: "Unauthorized" });
      return rejectWithValue(getAxiosError(err));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    loading: false,
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      sessionStorage.setItem("user", JSON.stringify(action.payload));
    },
    clearUser(state) {
      state.user = null;
      sessionStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload.user ?? action.payload;
        state.user = user;
        sessionStorage.setItem("user", JSON.stringify(user));
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error;
      })

      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload.user ?? action.payload;
        state.user = user;
        sessionStorage.setItem("user", JSON.stringify(user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error;
      })

      // logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        sessionStorage.removeItem("user");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        // clear client state anyway so UI logs out
        state.user = null;
        sessionStorage.removeItem("user");
        state.error = action.payload ?? action.error;
      })

      // fetchProfile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        sessionStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error;
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
