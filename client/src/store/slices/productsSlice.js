import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Async thunks

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      // Filter out undefined values to prevent validation errors
      const filteredParams = Object.entries(params).reduce(
        (acc, [key, value]) => {
          if (
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value !== "undefined"
          ) {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      const queryString = new URLSearchParams(filteredParams).toString();
      const response = await axios.get(`${API_URL}/products?${queryString}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeaturedProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/featured/list`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch featured products"
      );
    }
  }
);

export const fetchViralProducts = createAsyncThunk(
  "products/fetchViralProducts",
  async (limit = 8, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/products/viral?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch viral products"
      );
    }
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/products/search/query?q=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search products"
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${API_URL}/products`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
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
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

export const addReview = createAsyncThunk(
  "products/addReview",
  async ({ productId, rating, comment }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(
        `${API_URL}/products/${productId}/reviews`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add review"
      );
    }
  }
);

export const deleteReview = createAsyncThunk(
  "products/deleteReview",
  async ({ productId, reviewId }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.delete(
        `${API_URL}/products/${productId}/reviews/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete review"
      );
    }
  }
);

const initialState = {
  products: [],
  featuredProducts: [],
  viralProducts: [],
  relatedProducts: [],
  product: null,
  searchResults: [],
  pagination: {
    current: 1,
    total: 0,
    count: 0,
    totalItems: 0,
  },
  filters: {
    category: "",
    tags: [],
    search: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  },
  isLoading: false,
  isLoadingProduct: false,
  isLoadingFeatured: false,
  isLoadingViral: false,
  isLoadingSearch: false,
  error: null,
  message: null,
  searchQuery: "",
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearMessage: state => {
      state.message = null;
    },
    clearSearchResults: state => {
      state.searchResults = [];
      state.searchQuery = "";
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: state => {
      state.filters = {
        category: "",
        tags: [],
        search: "",
        minPrice: "",
        maxPrice: "",
        sort: "newest",
      };
    },
    setCurrentPage: (state, action) => {
      state.pagination.current = action.payload;
    },
    // For blind box product selection
    selectBlindBoxItem: (state, action) => {
      if (state.product && state.product.isBlindBox) {
        state.selectedBlindBoxItem = action.payload;
      }
    },
    clearSelectedBlindBoxItem: state => {
      delete state.selectedBlindBoxItem;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Single Product
      .addCase(fetchProduct.pending, state => {
        state.isLoadingProduct = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoadingProduct = false;
        state.product = action.payload.product;
        delete state.selectedBlindBoxItem; // Clear previous selection
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoadingProduct = false;
        state.error = action.payload;
      })

      // Fetch Featured Products
      .addCase(fetchFeaturedProducts.pending, state => {
        state.isLoadingFeatured = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.isLoadingFeatured = false;
        state.featuredProducts = action.payload.products;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.isLoadingFeatured = false;
        state.error = action.payload;
      })
      // Fetch Viral Products
      .addCase(fetchViralProducts.pending, state => {
        state.isLoadingViral = true;
        state.error = null;
      })
      .addCase(fetchViralProducts.fulfilled, (state, action) => {
        state.isLoadingViral = false;
        state.viralProducts = action.payload.products;
      })
      .addCase(fetchViralProducts.rejected, (state, action) => {
        state.isLoadingViral = false;
        state.error = action.payload;
      })
      // Search Products
      .addCase(searchProducts.pending, state => {
        state.isLoadingSearch = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoadingSearch = false;
        state.searchResults = action.payload.products;
        state.searchQuery = action.payload.query;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoadingSearch = false;
        state.error = action.payload;
      })
      // Create Product
      .addCase(createProduct.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.unshift(action.payload.product);
        state.message = action.payload.message;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Product
      .addCase(updateProduct.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedProduct = action.payload.product;
        const index = state.products.findIndex(
          p => p._id === updatedProduct._id
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
        if (state.product && state.product._id === updatedProduct._id) {
          state.product = updatedProduct;
        }
        state.message = action.payload.message;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.filter(p => p._id !== action.meta.arg);
        if (state.product && state.product._id === action.meta.arg) {
          state.product = null;
        }
        state.message = action.payload.message;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Related Products
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload.products;
      })
      // Add Review
      .addCase(addReview.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.product && state.product._id === action.meta.arg.productId) {
          // Add the review to the current product
          state.product.reviews = state.product.reviews || [];
          state.product.reviews.push(action.payload.review);
          // Update rating
          state.product.rating = action.payload.rating;
        }
        state.message = action.payload.message;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Review
      .addCase(deleteReview.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.product && state.product._id === action.meta.arg.productId) {
          // Remove the review from the current product
          if (state.product.reviews) {
            state.product.reviews = state.product.reviews.filter(
              review => review._id !== action.meta.arg.reviewId
            );
          }
          // Update rating
          state.product.rating = action.payload.rating;
        }
        state.message = action.payload.message;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearMessage,
  clearSearchResults,
  setFilters,
  clearFilters,
  setCurrentPage,
  selectBlindBoxItem,
  clearSelectedBlindBoxItem,
} = productsSlice.actions;

// Simple action creators for backward compatibility
export const fetchProductById = fetchProduct;

// Create a new async thunk for related products
export const fetchRelatedProducts = createAsyncThunk(
  "products/fetchRelatedProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products?limit=4`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch related products"
      );
    }
  }
);

export default productsSlice.reducer;
