import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../../admin_api.jsx";


export const fetchUsers = createAsyncThunk(
  "adminUsers/fetch",
  async (params = {}, thunkAPI) => {
    try {
      const { page = 1, page_size = 10, search = "", ordering = "" } = params;
      const res = await adminApi.get("admin_user/", {
        params: { page, page_size, search, ordering },
      });
      return {
        data: res.data.results,
        meta: {
          count: res.data.count,
          next: res.data.next,
          previous: res.data.previous,
          page,
          page_size,
        },
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteUser = createAsyncThunk("adminUsers/delete", async (id, thunkAPI) => {
  try {
    await adminApi.delete(`admin_user/${id}/`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const toggleBanUser = createAsyncThunk(
  "adminUsers/toggleBan",
  async (id, thunkAPI) => {
    try {
      const res = await adminApi.post(`admin_user/${id}/toggle-ban/`);
      return res.data;
    } catch (err) {
      // fallback: try patching is_banned (in case toggle endpoint missing)
      try {
        const state = thunkAPI.getState();
        const found = state.adminUsers.items.find((u) => String(u.id) === String(id));
        const currentlyBanned = found?.is_banned ?? false;
        const res2 = await adminApi.patch(`admin_user/${id}/`, { is_banned: !currentlyBanned });
        return res2.data;
      } catch (err2) {
        return thunkAPI.rejectWithValue(err.response?.data || err2.response?.data || err.message);
      }
    }
  }
);

export const patchUser = createAsyncThunk("adminUsers/patch", async ({ id, payload }, thunkAPI) => {
  try {
    const res = await adminApi.patch(`admin_user/${id}/`, payload);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState: {
    items: [],
    loading: false,
    error: null,
    meta: { count: 0, next: null, previous: null, page: 1, page_size: 10 },
  },
  reducers: {
    setPageSize(state, action) {
      state.meta.page_size = action.payload;
    },
    // optionally clear error
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.meta = { ...state.meta, ...action.payload.meta };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter((u) => String(u.id) !== String(action.payload));
        state.meta.count = Math.max(0, state.meta.count - 1);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(toggleBanUser.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map((u) => (String(u.id) === String(updated.id) ? updated : u));
      })
      .addCase(toggleBanUser.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(patchUser.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map((u) => (String(u.id) === String(updated.id) ? updated : u));
      })
      .addCase(patchUser.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setPageSize, clearError } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
