import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Bag Builder State
  isBuilderOpen: false,
  selectedBag: null,
  selectedCharms: [],
  previewImage: null,

  // Available charms data
  availableCharms: [
    {
      id: "star-rainbow",
      name: "Rainbow Star",
      price: 99,
      image: "/assets/charms/rainbow-star.png",
      category: "stars",
      color: "rainbow",
    },
    {
      id: "heart-pink",
      name: "Pink Heart",
      price: 89,
      image: "/assets/charms/pink-heart.png",
      category: "hearts",
      color: "pink",
    },
    {
      id: "unicorn-silver",
      name: "Silver Unicorn",
      price: 149,
      image: "/assets/charms/silver-unicorn.png",
      category: "animals",
      color: "silver",
    },
    {
      id: "moon-gold",
      name: "Gold Moon",
      price: 129,
      image: "/assets/charms/gold-moon.png",
      category: "celestial",
      color: "gold",
    },
    {
      id: "flower-coral",
      name: "Coral Flower",
      price: 109,
      image: "/assets/charms/coral-flower.png",
      category: "nature",
      color: "coral",
    },
    {
      id: "cupcake-purple",
      name: "Purple Cupcake",
      price: 119,
      image: "/assets/charms/purple-cupcake.png",
      category: "food",
      color: "purple",
    },
    {
      id: "mushroom-red",
      name: "Red Mushroom",
      price: 99,
      image: "/assets/charms/red-mushroom.png",
      category: "nature",
      color: "red",
    },
    {
      id: "starfish-orange",
      name: "Orange Starfish",
      price: 109,
      image: "/assets/charms/orange-starfish.png",
      category: "nature",
      color: "orange",
    },
    {
      id: "panda-black",
      name: "Black Panda",
      price: 139,
      image: "/assets/charms/black-panda.png",
      category: "animals",
      color: "black",
    },
    {
      id: "butterfly-blue",
      name: "Blue Butterfly",
      price: 119,
      image: "/assets/charms/blue-butterfly.png",
      category: "nature",
      color: "blue",
    },
    {
      id: "gem-purple",
      name: "Purple Gem",
      price: 129,
      image: "/assets/charms/purple-gem.png",
      category: "gems",
      color: "purple",
    },
    {
      id: "ice-cream-pink",
      name: "Pink Ice Cream",
      price: 99,
      image: "/assets/charms/pink-icecream.png",
      category: "food",
      color: "pink",
    },
  ],

  // Available base bags
  baseBags: [
    {
      id: "tote-white",
      name: "Classic White Tote",
      price: 799,
      image: "/assets/bags/white-tote.png",
      colors: ["white", "cream", "beige"],
      maxCharms: 8,
    },
    {
      id: "tote-pink",
      name: "Bubblegum Pink Tote",
      price: 849,
      image: "/assets/bags/pink-tote.png",
      colors: ["pink", "light-pink", "rose"],
      maxCharms: 8,
    },
    {
      id: "tote-lavender",
      name: "Lavender Mist Tote",
      price: 849,
      image: "/assets/bags/lavender-tote.png",
      colors: ["lavender", "purple", "violet"],
      maxCharms: 8,
    },
    {
      id: "tote-teal",
      name: "Electric Teal Tote",
      price: 899,
      image: "/assets/bags/teal-tote.png",
      colors: ["teal", "turquoise", "aqua"],
      maxCharms: 8,
    },
    {
      id: "tote-yellow",
      name: "Sunshine Yellow Tote",
      price: 849,
      image: "/assets/bags/yellow-tote.png",
      colors: ["yellow", "golden", "amber"],
      maxCharms: 8,
    },
    {
      id: "tote-black",
      name: "Midnight Black Tote",
      price: 899,
      image: "/assets/bags/black-tote.png",
      colors: ["black", "charcoal", "dark-gray"],
      maxCharms: 8,
    },
  ],

  // Builder settings
  maxCharms: 8,
  charmPrice: 99, // Average charm price
  wrappingFee: 50,

  // UI state
  isLoading: false,
  error: null,

  // Position tracking for charms (for drag and drop)
  charmPositions: [],

  // Bundle info
  bundleTotal: 0,
  isBundleReady: false,
};

const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    // Builder UI state
    openBuilder: state => {
      state.isBuilderOpen = true;
    },
    closeBuilder: state => {
      state.isBuilderOpen = false;
      // Optionally reset state when closing
      state.selectedBag = null;
      state.selectedCharms = [];
      state.charmPositions = [];
      state.bundleTotal = 0;
      state.isBundleReady = false;
    },

    // Bag selection
    selectBag: (state, action) => {
      state.selectedBag = action.payload;
      state.maxCharms = action.payload.maxCharms || 8;
      // Reset charms if they exceed the new bag's capacity
      if (state.selectedCharms.length > state.maxCharms) {
        state.selectedCharms = state.selectedCharms.slice(0, state.maxCharms);
      }
      state.bundleTotal = calculateBundleTotal(state);
    },

    // Charm selection
    addCharm: (state, action) => {
      const charm = action.payload;

      if (state.selectedCharms.length >= state.maxCharms) {
        state.error = `Maximum ${state.maxCharms} charms allowed`;
        return;
      }

      if (state.selectedCharms.some(c => c.id === charm.id)) {
        state.error = "Charm already added";
        return;
      }

      state.selectedCharms.push(charm);
      state.error = null;
      state.bundleTotal = calculateBundleTotal(state);
      state.isBundleReady =
        state.selectedBag && state.selectedCharms.length > 0;
    },

    removeCharm: (state, action) => {
      const charmId = action.payload;
      state.selectedCharms = state.selectedCharms.filter(c => c.id !== charmId);
      state.charmPositions = state.charmPositions.filter(
        pos => pos.charmId !== charmId
      );
      state.error = null;
      state.bundleTotal = calculateBundleTotal(state);
      state.isBundleReady =
        state.selectedBag && state.selectedCharms.length > 0;
    },

    // Reorder charms
    reorderCharms: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const draggedCharm = state.selectedCharms[fromIndex];

      state.selectedCharms.splice(fromIndex, 1);
      state.selectedCharms.splice(toIndex, 0, draggedCharm);
    },

    // Position tracking for drag and drop
    setCharmPosition: (state, action) => {
      const { charmId, x, y, z } = action.payload;

      const existingIndex = state.charmPositions.findIndex(
        pos => pos.charmId === charmId
      );

      if (existingIndex !== -1) {
        state.charmPositions[existingIndex] = { charmId, x, y, z };
      } else {
        state.charmPositions.push({ charmId, x, y, z });
      }
    },

    removeCharmPosition: (state, action) => {
      const charmId = action.payload;
      state.charmPositions = state.charmPositions.filter(
        pos => pos.charmId !== charmId
      );
    },

    // Bundle management
    createBundle: state => {
      if (!state.selectedBag || state.selectedCharms.length === 0) {
        state.error = "Please select a bag and at least one charm";
        return;
      }

      const bundle = {
        id: `bundle-${Date.now()}`,
        bag: state.selectedBag,
        charms: [...state.selectedCharms],
        totalPrice: state.bundleTotal,
        charmPositions: [...state.charmPositions],
        createdAt: new Date().toISOString(),
      };

      state.bundleTotal = calculateBundleTotal(state);
      state.isBundleReady = true;

      return bundle;
    },

    clearBundle: state => {
      state.selectedCharms = [];
      state.charmPositions = [];
      state.bundleTotal = 0;
      state.isBundleReady = false;
      state.error = null;
    },

    // Error handling
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: state => {
      state.error = null;
    },

    // Loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Reset builder
    resetBuilder: state => {
      state.selectedBag = null;
      state.selectedCharms = [];
      state.charmPositions = [];
      state.bundleTotal = 0;
      state.isBundleReady = false;
      state.error = null;
    },

    // Add customized product to cart/bundle
    addCustomizedProduct: (state, action) => {
      const { bag, charms } = action.payload;

      if (!bag || !charms || charms.length === 0) {
        state.error = "Invalid bundle data";
        return;
      }

      // Create a new bundle from the provided data
      const bundle = {
        bag,
        charms,
        totalPrice:
          bag.price + charms.reduce((sum, charm) => sum + charm.price, 0),
        createdAt: new Date().toISOString(),
      };

      state.selectedBag = bag;
      state.selectedCharms = charms;
      state.bundleTotal = bundle.totalPrice;
      state.isBundleReady = true;
      state.error = null;
    },
  },
});

// Helper function to calculate bundle total
function calculateBundleTotal(state) {
  if (!state.selectedBag) return 0;

  let total = state.selectedBag.price;

  state.selectedCharms.forEach(charm => {
    total += charm.price;
  });

  return total;
}

export const {
  openBuilder,
  closeBuilder,
  selectBag,
  addCharm,
  removeCharm,
  reorderCharms,
  setCharmPosition,
  removeCharmPosition,
  createBundle,
  clearBundle,
  setError,
  clearError,
  setLoading,
  resetBuilder,
  addCustomizedProduct,
} = builderSlice.actions;

export default builderSlice.reducer;
