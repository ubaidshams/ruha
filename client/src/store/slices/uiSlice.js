import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // 3D Model Loading States
  modelLoadingStates: {}, // { [productId]: 'loading' | 'loaded' | 'error' }

  // Global 3D Settings
  is3DEnabled: true,
  preferredQuality: "medium", // 'low' | 'medium' | 'high'

  // UI States
  isCursorCustom: true,
  isModalOpen: false,
  currentModal: null,

  // Loading states
  isLoading: false,

  // Animations
  pageTransition: {
    isAnimating: false,
    direction: "forward", // 'forward' | 'backward'
  },

  // 3D Effects
  particleEffects: {
    enabled: true,
    intensity: "medium", // 'low' | 'medium' | 'high'
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Model Loading State Management
    setModelLoadingState: (state, action) => {
      const { productId, status } = action.payload;
      state.modelLoadingStates[productId] = status;
    },

    setModelLoaded: (state, action) => {
      const productId = action.payload;
      state.modelLoadingStates[productId] = "loaded";
    },

    setModelError: (state, action) => {
      const productId = action.payload;
      state.modelLoadingStates[productId] = "error";
    },

    // Global 3D Settings
    toggle3DEnabled: state => {
      state.is3DEnabled = !state.is3DEnabled;
    },

    setPreferredQuality: (state, action) => {
      state.preferredQuality = action.payload;
    },

    // Cursor Management
    toggleCustomCursor: state => {
      state.isCursorCustom = !state.isCursorCustom;
    },

    // Modal Management
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.currentModal = action.payload;
    },

    closeModal: state => {
      state.isModalOpen = false;
      state.currentModal = null;
    },

    // Loading States
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Page Transitions
    startPageTransition: (state, action) => {
      state.pageTransition.isAnimating = true;
      state.pageTransition.direction = action.payload || "forward";
    },

    completePageTransition: state => {
      state.pageTransition.isAnimating = false;
    },

    // Particle Effects
    toggleParticleEffects: state => {
      state.particleEffects.enabled = !state.particleEffects.enabled;
    },

    setParticleIntensity: (state, action) => {
      state.particleEffects.intensity = action.payload;
    },

    // Utility Actions
    resetLoadingStates: state => {
      state.modelLoadingStates = {};
      state.isLoading = false;
    },
  },
});

export const {
  setModelLoadingState,
  setModelLoaded,
  setModelError,
  toggle3DEnabled,
  setPreferredQuality,
  toggleCustomCursor,
  openModal,
  closeModal,
  setLoading,
  startPageTransition,
  completePageTransition,
  toggleParticleEffects,
  setParticleIntensity,
  resetLoadingStates,
} = uiSlice.actions;

export default uiSlice.reducer;
