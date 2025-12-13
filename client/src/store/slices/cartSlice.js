import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Async thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${API_URL}/cart/add`, cartData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (
    { productId, quantity, customization },
    { rejectWithValue, getState }
  ) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(
        `${API_URL}/cart/update/${productId}`,
        {
          quantity,
          customization,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cart"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, customization }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.delete(
        `${API_URL}/cart/remove/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { customization },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from cart"
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.delete(`${API_URL}/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

export const getCartTotal = createAsyncThunk(
  "cart/getCartTotal",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/cart/total`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get cart total"
      );
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  shippingCost: 0,
  freeShippingThreshold: 999,
  isGiftMode: false,
  giftWrapCost: 50,
  isLoading: false,
  error: null,
  message: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearMessage: state => {
      state.message = null;
    },
    // For guest cart (before authentication)
    addToGuestCart: (state, action) => {
      const { product, quantity = 1, customization = {} } = action.payload;

      const existingItemIndex = state.items.findIndex(
        item =>
          item.product._id === product._id &&
          JSON.stringify(item.customization) === JSON.stringify(customization)
      );

      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({
          product,
          quantity,
          customization,
          _id: Date.now().toString(), // Temporary ID for guest items
        });
      }

      // Update totals
      state.itemCount = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.total = state.items.reduce((total, item) => {
        const itemTotal = item.product.price * item.quantity;
        const customizationTotal =
          (item.customization?.charms || []).reduce(
            (sum, charm) => sum + (charm.price || 0),
            0
          ) * item.quantity;
        return total + itemTotal + customizationTotal;
      }, 0);
      state.shippingCost = state.total >= state.freeShippingThreshold ? 0 : 99;
    },
    updateGuestCartItem: (state, action) => {
      const { productId, quantity, customization } = action.payload;

      const itemIndex = state.items.findIndex(
        item =>
          item.product._id === productId &&
          JSON.stringify(item.customization || {}) ===
            JSON.stringify(customization || {})
      );

      if (itemIndex !== -1) {
        if (quantity === 0) {
          state.items.splice(itemIndex, 1);
        } else {
          state.items[itemIndex].quantity = quantity;
        }

        // Update totals
        state.itemCount = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.total = state.items.reduce((total, item) => {
          const itemTotal = item.product.price * item.quantity;
          const customizationTotal =
            (item.customization?.charms || []).reduce(
              (sum, charm) => sum + (charm.price || 0),
              0
            ) * item.quantity;
          return total + itemTotal + customizationTotal;
        }, 0);
        state.shippingCost =
          state.total >= state.freeShippingThreshold ? 0 : 99;
      }
    },
    removeFromGuestCart: (state, action) => {
      const { productId, customization } = action.payload;

      state.items = state.items.filter(
        item =>
          !(
            item.product._id === productId &&
            JSON.stringify(item.customization || {}) ===
              JSON.stringify(customization || {})
          )
      );

      // Update totals
      state.itemCount = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.total = state.items.reduce((total, item) => {
        const itemTotal = item.product.price * item.quantity;
        const customizationTotal =
          (item.customization?.charms || []).reduce(
            (sum, charm) => sum + (charm.price || 0),
            0
          ) * item.quantity;
        return total + itemTotal + customizationTotal;
      }, 0);
      state.shippingCost = state.total >= state.freeShippingThreshold ? 0 : 99;
    },

    clearGuestCart: state => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.shippingCost = 0;
    },
    toggleGiftMode: state => {
      state.isGiftMode = !state.isGiftMode;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.cart || [];
        // Calculate totals
        state.itemCount = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.total = state.items.reduce((total, item) => {
          const itemTotal = item.product.price * item.quantity;
          const customizationTotal =
            (item.customization?.charms || []).reduce(
              (sum, charm) => sum + (charm.price || 0),
              0
            ) * item.quantity;
          return total + itemTotal + customizationTotal;
        }, 0);
        state.shippingCost =
          state.total >= state.freeShippingThreshold ? 0 : 99;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.cart;
        state.message = action.payload.message;
        // Recalculate totals
        state.itemCount = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.total = state.items.reduce((total, item) => {
          const itemTotal = item.product.price * item.quantity;
          const customizationTotal =
            (item.customization?.charms || []).reduce(
              (sum, charm) => sum + (charm.price || 0),
              0
            ) * item.quantity;
          return total + itemTotal + customizationTotal;
        }, 0);
        state.shippingCost =
          state.total >= state.freeShippingThreshold ? 0 : 99;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.cart;
        state.message = action.payload.message;
        // Recalculate totals
        state.itemCount = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.total = state.items.reduce((total, item) => {
          const itemTotal = item.product.price * item.quantity;
          const customizationTotal =
            (item.customization?.charms || []).reduce(
              (sum, charm) => sum + (charm.price || 0),
              0
            ) * item.quantity;
          return total + itemTotal + customizationTotal;
        }, 0);
        state.shippingCost =
          state.total >= state.freeShippingThreshold ? 0 : 99;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.cart;
        state.message = action.payload.message;
        // Recalculate totals
        state.itemCount = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.total = state.items.reduce((total, item) => {
          const itemTotal = item.product.price * item.quantity;
          const customizationTotal =
            (item.customization?.charms || []).reduce(
              (sum, charm) => sum + (charm.price || 0),
              0
            ) * item.quantity;
          return total + itemTotal + customizationTotal;
        }, 0);
        state.shippingCost =
          state.total >= state.freeShippingThreshold ? 0 : 99;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Clear Cart
      .addCase(clearCart.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = [];
        state.total = 0;
        state.itemCount = 0;
        state.shippingCost = 0;
        state.message = action.payload.message;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Cart Total
      .addCase(getCartTotal.fulfilled, (state, action) => {
        state.total = action.payload.total;
        state.itemCount = action.payload.itemCount;
        state.shippingCost = action.payload.shippingCost;
        state.freeShippingThreshold = action.payload.freeShippingThreshold;
      });
  },
});

export const {
  clearError,
  clearMessage,
  addToGuestCart,
  updateGuestCartItem,
  removeFromGuestCart,
  clearGuestCart,
  toggleGiftMode,
} = cartSlice.actions;

// Add bundle to cart action for bag builder
export const addBundleToCart = bundleData => {
  return dispatch => {
    const { product, customization, quantity = 1 } = bundleData;
    dispatch(addToGuestCart({ product, quantity, customization }));
  };
};

export default cartSlice.reducer;
