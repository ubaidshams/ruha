import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, ShoppingBag, Heart } from "lucide-react";
import KawaiiModelViewer from "./KawaiiModelViewer";

const KawaiiProductCard = ({ product, index = 0 }) => {
  const [show3D, setShow3D] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistToggle = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Add to wishlist action
  };

  const toggle3DView = e => {
    e.preventDefault();
    e.stopPropagation();
    setShow3D(!show3D);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <Link to={`/product/${product._id}`} className="block">
        <div className="card-kawaii overflow-hidden">
          {/* Product Image/3D Model Container */}
          <div className="relative aspect-square bg-gradient-to-br from-soft-blush/20 to-lavender-mist/10 overflow-hidden">
            {/* 3D Model Viewer */}
            {product.modelUrl && show3D ? (
              <div className="absolute inset-0">
                <KawaiiModelViewer
                  productId={`product-${product._id}`}
                  url={product.modelUrl}
                  className="w-full h-full"
                  autoRotate={true}
                  showControls={false}
                  scale={0.8}
                />
              </div>
            ) : (
              /* Regular Product Image */
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}

            {/* View Toggle Button */}
            {product.modelUrl && (
              <button
                onClick={toggle3DView}
                className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors z-10"
                title={show3D ? "View Image" : "View 3D"}
              >
                <span className="text-lg">{show3D ? "🖼️" : "🎮"}</span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-3 right-3 rounded-full p-2 shadow-lg transition-colors z-10 ${
                isWishlisted
                  ? "bg-bubblegum text-white"
                  : "bg-white/80 backdrop-blur-sm text-dark-slate hover:bg-white"
              }`}
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart
                className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
              />
            </button>

            {/* Stock Status */}
            {product.stock <= 5 && product.stock > 0 && (
              <div className="absolute bottom-3 left-3">
                <span className="bg-sunshine text-dark-slate px-2 py-1 rounded-full text-xs font-bold">
                  Only {product.stock} left!
                </span>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute bottom-3 right-3">
              <span className="bg-bubblegum/90 text-white px-2 py-1 rounded-full text-xs font-medium">
                {product.category}
              </span>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="btn-kawaii-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
              >
                <ShoppingBag className="w-4 h-4 mr-1" />
                Quick Add
              </motion.button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Rating */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-sm text-dark-slate/70">
                <Star className="w-4 h-4 text-sunshine mr-1" />
                <span className="font-medium">
                  {product.rating?.average || "4.5"}
                </span>
                <span className="ml-1">({product.rating?.count || 0})</span>
              </div>

              {product.isBlindBox && (
                <span className="text-xs bg-sunshine/20 text-sunshine px-2 py-1 rounded-full font-medium">
                  Mystery ✨
                </span>
              )}
            </div>

            {/* Product Name */}
            <h3 className="font-semibold text-dark-slate mb-2 line-clamp-2 group-hover:text-bubblegum transition-colors">
              {product.name}
            </h3>

            {/* Price and Action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-bubblegum">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <span className="text-sm text-dark-slate/50 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-kawaii-sm"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  // TODO: Add to cart action
                }}
              >
                Add to Cart
              </motion.button>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {product.tags.slice(0, 3).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="text-xs bg-electric-teal/10 text-electric-teal px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {product.tags.length > 3 && (
                  <span className="text-xs text-dark-slate/50 px-2 py-1">
                    +{product.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default KawaiiProductCard;
