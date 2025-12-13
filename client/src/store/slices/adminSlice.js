import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Async thunks
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchAdminProducts",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/products/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const fetchProductStats = createAsyncThunk(
  "admin/fetchProductStats",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/products/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (productData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${API_URL}/products`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, productData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(
        `${API_URL}/products/${id}`,
        productData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

const initialState = {
  products: [],
  stats: {
    totalProducts: 0,
    lowStockProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    totalStockValue: 0,
  },
  loading: false,
  error: null,
  isModalOpen: false,
  editingProduct: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    openProductModal: (state, action) => {
      state.isModalOpen = true;
      state.editingProduct = action.payload || null;
    },
    closeProductModal: state => {
      state.isModalOpen = false;
      state.editingProduct = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Admin Products
      .addCase(fetchAdminProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Product Stats
      .addCase(fetchProductStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      // Create Product
      .addCase(createProduct.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
        state.isModalOpen = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Product
      .addCase(updateProduct.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          p => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.isModalOpen = false;
        state.editingProduct = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, openProductModal, closeProductModal } =
  adminSlice.actions;

export default adminSlice.reducer;
