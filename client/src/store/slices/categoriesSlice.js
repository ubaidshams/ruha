import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Async thunks
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${API_URL}/categories`, categoryData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create category"
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, categoryData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(
        `${API_URL}/categories/${id}`,
        categoryData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update category"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.delete(`${API_URL}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  }
);

export const fetchAllCategories = createAsyncThunk(
  "categories/fetchAllCategories",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/categories/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all categories"
      );
    }
  }
);

const initialState = {
  categories: [],
  allCategories: [], // For admin use (includes inactive categories)
  isLoading: false,
  isLoadingAll: false,
  error: null,
  message: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearMessage: state => {
      state.message = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.categories;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Category
      .addCase(createCategory.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories.push(action.payload.category);
        state.allCategories.push(action.payload.category);
        state.message = action.payload.message;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Category
      .addCase(updateCategory.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedCategory = action.payload.category;

        // Update in categories array
        const categoryIndex = state.categories.findIndex(
          cat => cat._id === updatedCategory._id
        );
        if (categoryIndex !== -1) {
          state.categories[categoryIndex] = updatedCategory;
        }

        // Update in allCategories array
        const allCategoryIndex = state.allCategories.findIndex(
          cat => cat._id === updatedCategory._id
        );
        if (allCategoryIndex !== -1) {
          state.allCategories[allCategoryIndex] = updatedCategory;
        }

        state.message = action.payload.message;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Category
      .addCase(deleteCategory.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.meta.arg;

        // Remove from categories array
        state.categories = state.categories.filter(
          cat => cat._id !== deletedId
        );

        // Remove from allCategories array
        state.allCategories = state.allCategories.filter(
          cat => cat._id !== deletedId
        );

        state.message = action.payload.message;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch All Categories (Admin)
      .addCase(fetchAllCategories.pending, state => {
        state.isLoadingAll = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.isLoadingAll = false;
        state.allCategories = action.payload.categories;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.isLoadingAll = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMessage } = categoriesSlice.actions;

export default categoriesSlice.reducer;
