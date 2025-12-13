import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Package,
  ShoppingBag,
  RotateCcw,
  Plus,
  X,
  Sparkles,
  Heart,
  Star,
  Check,
} from "lucide-react";
import { addBundleToCart } from "../store/slices/cartSlice";
import { addCustomizedProduct } from "../store/slices/builderSlice";

const BagBuilderPage = () => {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const [selectedBag, setSelectedBag] = useState({
    color: "#FFB6C1", // Soft pink
    type: "Classic Tote",
    price: 1599,
  });
  const [selectedCharms, setSelectedCharms] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedCharm, setDraggedCharm] = useState(null);
  const [totalPrice, setTotalPrice] = useState(1599);

  const bagColors = [
    { name: "Soft Pink", value: "#FFB6C1", price: 0 },
    { name: "Lavender", value: "#E6E6FA", price: 0 },
    { name: "Mint Green", value: "#98FB98", price: 0 },
    { name: "Sky Blue", value: "#87CEEB", price: 0 },
    { name: "Sunshine Yellow", value: "#FFD700", price: 0 },
    { name: "Pearl White", value: "#F8F8FF", price: 100 },
    { name: "Midnight Black", value: "#2F4F4F", price: 150 },
    { name: "Rose Gold", value: "#E8B4B8", price: 200 },
  ];

  const availableCharms = [
    {
      id: "1",
      name: "Kawaii Star",
      image: "/assets/charms/star.png",
      price: 299,
      category: "Stars",
    },
    {
      id: "2",
      name: "Rainbow Unicorn",
      image: "/assets/charms/unicorn.png",
      price: 399,
      category: "Fantasy",
    },
    {
      id: "3",
      name: "Heart Gem",
      image: "/assets/charms/heart.png",
      price: 249,
      category: "Hearts",
    },
    {
      id: "4",
      name: "Cute Cat",
      image: "/assets/charms/cat.png",
      price: 349,
      category: "Animals",
    },
    {
      id: "5",
      name: "Sparkle Moon",
      image: "/assets/charms/moon.png",
      price: 279,
      category: "Celestial",
    },
    {
      id: "6",
      name: "Cherry Blossom",
      image: "/assets/charms/sakura.png",
      price: 329,
      category: "Nature",
    },
    {
      id: "7",
      name: "Coffee Cup",
      image: "/assets/charms/coffee.png",
      price: 199,
      category: "Food",
    },
    {
      id: "8",
      name: "Lightning Bolt",
      image: "/assets/charms/lightning.png",
      price: 229,
      category: "Symbols",
    },
  ];

  useEffect(() => {
    const charmTotal = selectedCharms.reduce(
      (sum, charm) => sum + charm.price,
      0
    );
    setTotalPrice(selectedBag.price + charmTotal);
  }, [selectedBag, selectedCharms]);

  const handleColorChange = color => {
    setSelectedBag(prev => ({
      ...prev,
      color: color.value,
      price: 1599 + color.price,
    }));
  };

  const handleCharmSelect = charm => {
    if (selectedCharms.find(c => c.id === charm.id)) {
      setSelectedCharms(prev => prev.filter(c => c.id !== charm.id));
    } else {
      setSelectedCharms(prev => [...prev, charm]);
    }
  };

  const handleDragStart = (e, charm) => {
    setIsDragging(true);
    setDraggedCharm(charm);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = e => {
    e.preventDefault();
    if (draggedCharm) {
      handleCharmSelect(draggedCharm);
    }
    setIsDragging(false);
    setDraggedCharm(null);
  };

  const handleAddToCart = async () => {
    const bundle = {
      bag: selectedBag,
      charms: selectedCharms,
      totalPrice,
    };

    try {
      await dispatch(addBundleToCart(bundle)).unwrap();
      // Show success animation or redirect
    } catch (error) {
      console.error("Failed to add bundle to cart:", error);
    }
  };

  const clearBuilder = () => {
    setSelectedBag({
      color: "#FFB6C1",
      type: "Classic Tote",
      price: 1599,
    });
    setSelectedCharms([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-blush via-lavender-mist/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading text-dark-slate mb-4">
            Bag Builder
            <span className="text-bubblegum"> Studio</span>
          </h1>
          <p className="text-lg text-dark-slate/70 max-w-2xl mx-auto">
            Create your perfect kawaii tote bag by customizing colors and adding
            adorable charms. Make it uniquely yours!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bag Canvas */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/50 rounded-kawaii p-8 shadow-kawaii-soft">
              <h2 className="text-2xl font-heading text-dark-slate mb-6 flex items-center gap-2">
                <Package className="w-6 h-6" />
                Your Bag Canvas
              </h2>

              {/* Canvas Area */}
              <div
                ref={canvasRef}
                className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-kawaii p-8 min-h-96 border-2 border-dashed border-gray-300"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{ backgroundColor: selectedBag.color + "20" }}
              >
                {/* Bag Base */}
                <div className="absolute inset-8 flex items-center justify-center">
                  <motion.div
                    className="w-80 h-80 rounded-kawaii shadow-lg relative overflow-hidden"
                    style={{ backgroundColor: selectedBag.color }}
                    animate={{ scale: isDragging ? 1.05 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {/* Bag handles */}
                    <div className="absolute top-4 left-8 right-8 h-8">
                      <div className="w-full h-full border-4 border-white/60 rounded-full"></div>
                    </div>
                    <div className="absolute top-4 left-1/4 right-1/4 h-8">
                      <div className="w-full h-full border-4 border-white/60 rounded-full"></div>
                    </div>

                    {/* Bag interior */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-white/80 text-lg font-medium mb-2">
                          {selectedBag.type}
                        </div>
                        <div className="text-white/60 text-sm">
                          Drop charms here
                        </div>
                      </div>
                    </div>

                    {/* Selected Charms on Bag */}
                    {selectedCharms.map((charm, index) => (
                      <motion.div
                        key={charm.id}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className="absolute w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer"
                        style={{
                          left: `${20 + (index % 3) * 25}%`,
                          top: `${40 + Math.floor(index / 3) * 20}%`,
                        }}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => handleCharmSelect(charm)}
                      >
                        <div className="text-2xl">✨</div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Drop zone indicator */}
                {isDragging && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-bubblegum/20 border-2 border-bubblegum border-dashed rounded-kawaii flex items-center justify-center"
                  >
                    <div className="text-bubblegum font-semibold text-lg">
                      Drop your charm here!
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Bag Info */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white/50 rounded-kawaii p-4">
                  <div className="text-sm text-dark-slate/70 mb-1">
                    Bag Type
                  </div>
                  <div className="font-semibold text-dark-slate">
                    {selectedBag.type}
                  </div>
                </div>
                <div className="bg-white/50 rounded-kawaii p-4">
                  <div className="text-sm text-dark-slate/70 mb-1">
                    Charms Added
                  </div>
                  <div className="font-semibold text-dark-slate">
                    {selectedCharms.length}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Controls Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Color Selection */}
            <div className="bg-white/50 rounded-kawaii p-6 shadow-kawaii-soft">
              <h3 className="text-lg font-semibold text-dark-slate mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Bag Color
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {bagColors.map(color => (
                  <motion.button
                    key={color.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleColorChange(color)}
                    className={`p-3 rounded-kawaii border-2 transition-all ${
                      selectedBag.color === color.value
                        ? "border-bubblegum shadow-lg"
                        : "border-white/50 hover:border-bubblegum/50"
                    }`}
                  >
                    <div
                      className="w-full h-8 rounded-full mb-2"
                      style={{ backgroundColor: color.value }}
                    />
                    <div className="text-sm font-medium text-dark-slate">
                      {color.name}
                    </div>
                    {color.price > 0 && (
                      <div className="text-xs text-bubblegum">
                        +₹{color.price}
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Charms Library */}
            <div className="bg-white/50 rounded-kawaii p-6 shadow-kawaii-soft">
              <h3 className="text-lg font-semibold text-dark-slate mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Charms Library
              </h3>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-4">
                {["All", "Stars", "Hearts", "Animals", "Fantasy"].map(
                  category => (
                    <button
                      key={category}
                      className="px-3 py-1 text-xs bg-bubblegum/10 text-bubblegum rounded-full hover:bg-bubblegum hover:text-white transition-colors"
                    >
                      {category}
                    </button>
                  )
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {availableCharms.map(charm => (
                  <motion.div
                    key={charm.id}
                    draggable
                    onDragStart={e => handleDragStart(e, charm)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCharmSelect(charm)}
                    className={`p-3 rounded-kawaii border-2 cursor-pointer transition-all ${
                      selectedCharms.find(c => c.id === charm.id)
                        ? "border-bubblegum bg-bubblegum/10"
                        : "border-white/50 hover:border-bubblegum/50"
                    }`}
                  >
                    <div className="w-full h-16 bg-gradient-to-br from-bubblegum/20 to-electric-teal/20 rounded-lg mb-2 flex items-center justify-center text-2xl">
                      ✨
                    </div>
                    <div className="text-sm font-medium text-dark-slate line-clamp-2">
                      {charm.name}
                    </div>
                    <div className="text-xs text-bubblegum font-semibold">
                      ₹{charm.price}
                    </div>
                    {selectedCharms.find(c => c.id === charm.id) && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                        <Check className="w-3 h-3" />
                        Added
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Total & Actions */}
            <div className="bg-white/50 rounded-kawaii p-6 shadow-kawaii-soft">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span className="text-dark-slate">Total:</span>
                  <span className="text-bubblegum">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={selectedCharms.length === 0}
                    className="w-full btn-kawaii py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add Bundle to Cart
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearBuilder}
                    className="w-full btn-outline-kawaii py-3 flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Clear Builder
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Selected Charms Summary */}
        {selectedCharms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-white/50 rounded-kawaii p-6 shadow-kawaii-soft"
          >
            <h3 className="text-xl font-semibold text-dark-slate mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-bubblegum" />
              Your Selected Charms
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {selectedCharms.map((charm, index) => (
                <motion.div
                  key={charm.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-bubblegum/20 to-electric-teal/20 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">
                    ✨
                  </div>
                  <div className="text-sm font-medium text-dark-slate line-clamp-2">
                    {charm.name}
                  </div>
                  <div className="text-xs text-bubblegum">₹{charm.price}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BagBuilderPage;
