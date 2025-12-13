import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Filter states
  category: "",
  tags: [],
  priceRange: {
    min: 0,
    max: 10000,
  },
  sortBy: "newest",
  searchQuery: "",

  // Mood filters (custom category-based filters)
  moodFilters: {
    giftIdeas: false,
    dateNight: false,
    deskSetup: false,
    travel: false,
    office: false,
    party: false,
    kawaii: false,
    viral: false,
    pastel: false,
    summer: false,
  },

  // UI states
  isFilterOpen: false,
  activeFiltersCount: 0,

  // Category data
  categories: [
    { id: "Sip", name: "Sip", icon: "🥤", color: "#FF69B4" },
    { id: "Carry", name: "Carry", icon: "👜", color: "#00CED1" },
    { id: "Play", name: "Play", icon: "🎮", color: "#FFD700" },
    { id: "Tech", name: "Tech", icon: "📱", color: "#FF69B4" },
    { id: "Glam", name: "Glam", icon: "💄", color: "#FF1493" },
    { id: "Decor", name: "Decor", icon: "✨", color: "#9370DB" },
  ],

  // Sort options
  sortOptions: [
    { value: "newest", label: "Newest First" },
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ],

  // Price range options
  priceRanges: [
    { label: "All Prices", min: 0, max: 10000 },
    { label: "Under ₹500", min: 0, max: 500 },
    { label: "₹500 - ₹1000", min: 500, max: 1000 },
    { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
    { label: "₹2000 - ₹5000", min: 2000, max: 5000 },
    { label: "Over ₹5000", min: 5000, max: 10000 },
  ],
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    // Category filters
    setCategory: (state, action) => {
      state.category = action.payload;
      state.activeFiltersCount = getActiveFiltersCount(state);
    },
    clearCategory: state => {
      state.category = "";
      state.activeFiltersCount = getActiveFiltersCount(state);
    },

    // Tag filters
    addTag: (state, action) => {
      if (!state.tags.includes(action.payload)) {
        state.tags.push(action.payload);
        state.activeFiltersCount = getActiveFiltersCount(state);
      }
    },
    removeTag: (state, action) => {
      state.tags = state.tags.filter(tag => tag !== action.payload);
      state.activeFiltersCount = getActiveFiltersCount(state);
    },
    clearTags: state => {
      state.tags = [];
      state.activeFiltersCount = getActiveFiltersCount(state);
    },

    // Price range filters
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
      state.activeFiltersCount = getActiveFiltersCount(state);
    },
    clearPriceRange: state => {
      state.priceRange = { min: 0, max: 10000 };
      state.activeFiltersCount = getActiveFiltersCount(state);
    },

    // Sort filters
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },

    // Search filters
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: state => {
      state.searchQuery = "";
    },

    // Mood filters
    toggleMoodFilter: (state, action) => {
      const filterKey = action.payload;
      if (state.moodFilters.hasOwnProperty(filterKey)) {
        state.moodFilters[filterKey] = !state.moodFilters[filterKey];
        state.activeFiltersCount = getActiveFiltersCount(state);
      }
    },
    setMoodFilters: (state, action) => {
      state.moodFilters = { ...state.moodFilters, ...action.payload };
      state.activeFiltersCount = getActiveFiltersCount(state);
    },
    clearMoodFilters: state => {
      Object.keys(state.moodFilters).forEach(key => {
        state.moodFilters[key] = false;
      });
      state.activeFiltersCount = getActiveFiltersCount(state);
    },

    // UI state
    setFilterOpen: (state, action) => {
      state.isFilterOpen = action.payload;
    },
    toggleFilterOpen: state => {
      state.isFilterOpen = !state.isFilterOpen;
    },

    // Clear all filters
    clearAllFilters: state => {
      state.category = "";
      state.tags = [];
      state.priceRange = { min: 0, max: 10000 };
      state.searchQuery = "";
      Object.keys(state.moodFilters).forEach(key => {
        state.moodFilters[key] = false;
      });
      state.activeFiltersCount = 0;
    },

    // Reset to default
    resetFilters: state => {
      state.category = "";
      state.tags = [];
      state.priceRange = { min: 0, max: 10000 };
      state.sortBy = "newest";
      state.searchQuery = "";
      Object.keys(state.moodFilters).forEach(key => {
        state.moodFilters[key] = false;
      });
      state.isFilterOpen = false;
      state.activeFiltersCount = 0;
    },
  },
});

// Helper function to count active filters
function getActiveFiltersCount(state) {
  let count = 0;

  if (state.category) count++;
  if (state.tags.length > 0) count += state.tags.length;
  if (state.priceRange.min !== 0 || state.priceRange.max !== 10000) count++;
  if (state.searchQuery.trim()) count++;

  Object.values(state.moodFilters).forEach(value => {
    if (value) count++;
  });

  return count;
}

export const {
  setCategory,
  clearCategory,
  addTag,
  removeTag,
  clearTags,
  setPriceRange,
  clearPriceRange,
  setSortBy,
  setSearchQuery,
  clearSearchQuery,
  toggleMoodFilter,
  setMoodFilters,
  clearMoodFilters,
  setFilterOpen,
  toggleFilterOpen,
  clearAllFilters,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
