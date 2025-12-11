// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../user_api"; // adjust path if needed

// Helpers
const getAxiosError = (err) => {
  if (err?.response?.data) return err.response.data;
  return { detail: err.message || "Network error" };
};

// normalize user shape and coerce admin flags
const normalizeUser = (u) => {
  if (!u) return null;
  return {
    ...u,
    is_staff: !!u.is_staff,
    is_superuser: !!u.is_superuser,
  };
};

// init user from sessionStorage (normalized)
const storedUser = (() => {
  try {
    const raw = sessionStorage.getItem("user");
    if (!raw) return null;
    return normalizeUser(JSON.parse(raw));
  } catch {
    return null;
  }
})();

/**
 * Thunks
 */

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, v);
      });

      const res = await api.post("user/signup/", formData);
      // If backend returns user on signup and you want to auto-login, normalize and persist here.
      // const user = normalizeUser(res.data.user ?? res.data);
      // sessionStorage.setItem("user", JSON.stringify(user));
      // return user;
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
      // backend may return { user: {...} } or user object directly
      const raw = res.data.user ?? res.data;
      const user = normalizeUser(raw);

      // persist canonical user
      try {
        sessionStorage.setItem("user", JSON.stringify(user));
      } catch (e) {
        /* ignore storage errors */
      }

      return user;
    } catch (err) {
      return rejectWithValue(getAxiosError(err));
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      // server should clear cookie; we still clear client state
      const res = await api.post("user/logout/");
      try {
        sessionStorage.removeItem("user");
      } catch (e) {}
      return res.data;
    } catch (err) {
      // clear client state even if server call failed
      try {
        sessionStorage.removeItem("user");
      } catch (e) {}
      return rejectWithValue(getAxiosError(err));
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue, getState, signal }) => {
    try {
      // ensure cookies are sent even if instance isn't configured
      const res = await api.get("user/profile/", { withCredentials: true, signal });

      // backend might return either { user: {...} } or the user object directly
      const raw = res.data.user ?? res.data;

      // preserve existing user flags if server omitted them
      const existing = getState().auth?.user ?? null;

      const merged = {
        ...(existing || {}),
        ...(raw || {}),
      };

      // coerce booleans explicitly
      const user = normalizeUser(merged);

      try {
        sessionStorage.setItem("user", JSON.stringify(user));
      } catch (e) {
        /* ignore storage errors */
      }

      return user;
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
      const raw = res.data.user ?? res.data;
      const user = normalizeUser(raw);
      try {
        sessionStorage.setItem("user", JSON.stringify(user));
      } catch (e) {}
      return user;
    } catch (err) {
      if (err?.response?.status === 401) return rejectWithValue({ detail: "Unauthorized" });
      return rejectWithValue(getAxiosError(err));
    }
  }
);

/**
 * Slice
 */
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
      const user = normalizeUser(action.payload);
      state.user = user;
      try {
        if (user) sessionStorage.setItem("user", JSON.stringify(user));
        else sessionStorage.removeItem("user");
      } catch (e) {}
    },
    clearUser(state) {
      state.user = null;
      try {
        sessionStorage.removeItem("user");
      } catch (e) {}
    },
  },
  extraReducers: (builder) => {
    builder
      // signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
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
        state.user = action.payload; // action.payload is normalized user
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
        try {
          sessionStorage.removeItem("user");
        } catch (e) {}
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        // clear client state anyway so UI logs out
        state.user = null;
        try {
          sessionStorage.removeItem("user");
        } catch (e) {}
        state.error = action.payload ?? action.error;
      })

      // fetchProfile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // normalized user
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
        state.user = action.payload; // normalized user
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? action.error;
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
