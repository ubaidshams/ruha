import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (profileData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(
        `${API_URL}/users/profile`,
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const addUserAddress = createAsyncThunk(
  "user/addUserAddress",
  async (addressData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(
        `${API_URL}/users/addresses`,
        addressData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add address"
      );
    }
  }
);

export const updateUserAddress = createAsyncThunk(
  "user/updateUserAddress",
  async ({ index, addressData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(
        `${API_URL}/users/addresses/${index}`,
        addressData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update address"
      );
    }
  }
);

export const deleteUserAddress = createAsyncThunk(
  "user/deleteUserAddress",
  async (index, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.delete(
        `${API_URL}/users/addresses/${index}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete address"
      );
    }
  }
);

export const fetchUserAddresses = createAsyncThunk(
  "user/fetchUserAddresses",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/users/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch addresses"
      );
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "user/addToWishlist",
  async (productId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(
        `${API_URL}/users/wishlist/${productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to wishlist"
      );
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "user/removeFromWishlist",
  async (productId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.delete(
        `${API_URL}/users/wishlist/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from wishlist"
      );
    }
  }
);

export const fetchWishlist = createAsyncThunk(
  "user/fetchWishlist",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/users/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

const initialState = {
  profile: null,
  addresses: [],
  wishlist: [],
  isLoading: false,
  isLoadingProfile: false,
  isLoadingAddresses: false,
  isLoadingWishlist: false,
  error: null,
  message: null,
  // UI state
  isProfileModalOpen: false,
  isAddressModalOpen: false,
  editingAddressIndex: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearMessage: state => {
      state.message = null;
    },

    // Modal state management
    setProfileModalOpen: (state, action) => {
      state.isProfileModalOpen = action.payload;
    },
    toggleProfileModal: state => {
      state.isProfileModalOpen = !state.isProfileModalOpen;
    },

    setAddressModalOpen: (state, action) => {
      state.isAddressModalOpen = action.payload;
    },
    toggleAddressModal: state => {
      state.isAddressModalOpen = !state.isAddressModalOpen;
    },

    setEditingAddressIndex: (state, action) => {
      state.editingAddressIndex = action.payload;
    },

    clearEditingAddressIndex: state => {
      state.editingAddressIndex = null;
    },

    // Local state updates (optimistic updates)
    updateProfileLocally: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },

    addAddressLocally: (state, action) => {
      state.addresses.push(action.payload);
    },

    updateAddressLocally: (state, action) => {
      const { index, address } = action.payload;
      if (state.addresses[index]) {
        state.addresses[index] = { ...state.addresses[index], ...address };
      }
    },

    removeAddressLocally: (state, action) => {
      const index = action.payload;
      state.addresses.splice(index, 1);
    },

    addToWishlistLocally: (state, action) => {
      const productId = action.payload;
      if (!state.wishlist.some(item => item._id === productId)) {
        state.wishlist.push({ _id: productId });
      }
    },

    removeFromWishlistLocally: (state, action) => {
      const productId = action.payload;
      state.wishlist = state.wishlist.filter(item => item._id !== productId);
    },
  },

  extraReducers: builder => {
    builder
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, state => {
        state.isLoadingProfile = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoadingProfile = false;
        state.profile = action.payload.user;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoadingProfile = false;
        state.error = action.payload;
      })

      // Update User Profile
      .addCase(updateUserProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.isProfileModalOpen = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add User Address
      .addCase(addUserAddress.pending, state => {
        state.isLoadingAddresses = true;
        state.error = null;
      })
      .addCase(addUserAddress.fulfilled, (state, action) => {
        state.isLoadingAddresses = false;
        state.addresses = action.payload.addresses;
        state.message = action.payload.message;
        state.isAddressModalOpen = false;
      })
      .addCase(addUserAddress.rejected, (state, action) => {
        state.isLoadingAddresses = false;
        state.error = action.payload;
      })

      // Update User Address
      .addCase(updateUserAddress.pending, state => {
        state.isLoadingAddresses = true;
        state.error = null;
      })
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        state.isLoadingAddresses = false;
        state.addresses = action.payload.addresses;
        state.message = action.payload.message;
        state.isAddressModalOpen = false;
        state.editingAddressIndex = null;
      })
      .addCase(updateUserAddress.rejected, (state, action) => {
        state.isLoadingAddresses = false;
        state.error = action.payload;
      })

      // Delete User Address
      .addCase(deleteUserAddress.pending, state => {
        state.isLoadingAddresses = true;
        state.error = null;
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.isLoadingAddresses = false;
        state.addresses = action.payload.addresses;
        state.message = action.payload.message;
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.isLoadingAddresses = false;
        state.error = action.payload;
      })

      // Fetch User Addresses
      .addCase(fetchUserAddresses.pending, state => {
        state.isLoadingAddresses = true;
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.isLoadingAddresses = false;
        state.addresses = action.payload.addresses;
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.isLoadingAddresses = false;
        state.error = action.payload;
      })

      // Add to Wishlist
      .addCase(addToWishlist.pending, state => {
        state.isLoadingWishlist = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoadingWishlist = false;
        state.wishlist = action.payload.wishlist;
        state.message = action.payload.message;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoadingWishlist = false;
        state.error = action.payload;
      })

      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, state => {
        state.isLoadingWishlist = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoadingWishlist = false;
        state.wishlist = action.payload.wishlist;
        state.message = action.payload.message;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoadingWishlist = false;
        state.error = action.payload;
      })

      // Fetch Wishlist
      .addCase(fetchWishlist.pending, state => {
        state.isLoadingWishlist = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoadingWishlist = false;
        state.wishlist = action.payload.wishlist;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoadingWishlist = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearMessage,
  setProfileModalOpen,
  toggleProfileModal,
  setAddressModalOpen,
  toggleAddressModal,
  setEditingAddressIndex,
  clearEditingAddressIndex,
  updateProfileLocally,
  addAddressLocally,
  updateAddressLocally,
  removeAddressLocally,
  addToWishlistLocally,
  removeFromWishlistLocally,
} = userSlice.actions;

export default userSlice.reducer;
