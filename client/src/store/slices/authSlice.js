import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Async thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get user"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(`${API_URL}/auth/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Profile update failed"
      );
    }
  }
);

// Check if token exists and try to restore user session
const token = localStorage.getItem("ruha-token");
let initialState = {
  user: null,
  token: token,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  message: null,
};

// If token exists, set axios default header and mark as authenticated
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  initialState.isAuthenticated = true;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("ruha-token");
      delete axios.defaults.headers.common["Authorization"];
    },
    clearError: state => {
      state.error = null;
    },
    clearMessage: state => {
      state.message = null;
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem("ruha-token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },
  },
  extraReducers: builder => {
    builder
      // Register
      .addCase(registerUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.message = action.payload.message;
        localStorage.setItem("ruha-token", action.payload.token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${action.payload.token}`;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Login
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;

        // Ensure user data is properly set
        if (action.payload.user) {
          state.user = action.payload.user;
          console.log("🚀 Login fulfilled - User set:", state.user);
        } else {
          console.error(
            "🚀 Login fulfilled - No user data in response:",
            action.payload
          );
          state.user = null;
        }

        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.message = action.payload.message;
        state.error = null;

        // Persist token
        localStorage.setItem("ruha-token", action.payload.token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${action.payload.token}`;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, state => {
        state.isLoading = true;
      })

      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;

        // Ensure user data is properly set from the response
        if (action.payload.user) {
          state.user = action.payload.user;
          console.log("🚀 GetCurrentUser fulfilled - User set:", state.user);
          state.isAuthenticated = true;
          state.error = null;
        } else {
          console.error(
            "🚀 GetCurrentUser fulfilled - No user data in response:",
            action.payload
          );
          // If no user data but we have a token, keep the existing user state
          if (state.token && !state.user) {
            console.log(
              "🚀 No user data but token exists - clearing auth state"
            );
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            localStorage.removeItem("ruha-token");
            delete axios.defaults.headers.common["Authorization"];
          }
        }
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
        localStorage.removeItem("ruha-token");
        delete axios.defaults.headers.common["Authorization"];
      })
      // Update Profile
      .addCase(updateProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        if (state.user) {
          state.user = { ...state.user, ...action.payload.user };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, clearMessage, setCredentials } =
  authSlice.actions;

// Simple action creators for backward compatibility
export const login = loginUser;
export const register = registerUser;

export default authSlice.reducer;
