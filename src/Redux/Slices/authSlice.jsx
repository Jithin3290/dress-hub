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


export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, v);
      });

      const res = await api.post("user/signup/", formData)

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
        "user/login/",
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
      const res = await api.post("user/logout/blacklist/");
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
      const res = await api.get("user/profile/");
      return res.data;
    } catch (err) {
      if (err?.response?.status === 401) return rejectWithValue({ detail: "Unauthorized" });
      return rejectWithValue(getAxiosError(err));
    }
  }
);

/**
 * updateProfile thunk.
 * call: dispatch(updateProfile({ data, multipart }))
 * data: plain object, may include File under profile_picture
 * multipart: boolean, set true if sending files
 */
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ data, multipart = false }, { rejectWithValue }) => {
    try {
      let body = data;
      const config = {};

      if (multipart) {
        const fd = new FormData();
        Object.entries(data).forEach(([k, v]) => {
          if (v !== undefined && v !== null) fd.append(k, v);
        });
        body = fd;
        config.headers = { "Content-Type": "multipart/form-data" };
      } else {
        config.headers = { "Content-Type": "application/json" };
      }

      // Adjust endpoint if your backend expects /user/:id instead of /profile/
      const res = await api.patch("user/profile/", body, config);
      return res.data;
    } catch (err) {
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
    saving: false,
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
      })

      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.saving = false;
        const user = action.payload.user ?? action.payload;
        state.user = user;
        sessionStorage.setItem("user", JSON.stringify(user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? action.error;
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
