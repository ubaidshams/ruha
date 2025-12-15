import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2, Star } from "lucide-react";
import { fetchWishlist, removeFromWishlist } from "../store/slices/userSlice";
import { addToCart } from "../store/slices/cartSlice";
import KawaiiProductCard from "../components/ui/KawaiiProductCard";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { wishlist, isLoadingWishlist } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleMoveToCart = product => {
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    dispatch(removeFromWishlist(product._id));
  };

  const handleRemoveFromWishlist = productId => {
    dispatch(removeFromWishlist(productId));
  };

  if (isLoadingWishlist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">💖</div>
          <p className="text-dark-slate/70">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-heading text-center mb-8 text-gradient"
        >
          💖 Your Wishlist
        </motion.h1>

        {!wishlist || wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-white/50 p-12 rounded-kawaii shadow-kawaii-soft"
          >
            <div className="text-6xl mb-4">🥺</div>
            <h3 className="text-2xl font-heading mb-2">
              Your wishlist is empty!
            </h3>
            <p className="text-dark-slate/70 mb-6">
              Start adding your favorite kawaii items to save them for later.
            </p>
            <Link to="/products" className="btn-kawaii">
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-dark-slate/70">
                {wishlist?.length || 0}{" "}
                {wishlist?.length === 1 ? "item" : "items"} saved
              </p>
              <Link
                to="/products"
                className="text-bubblegum hover:text-electric-teal transition-colors"
              >
                Continue Shopping →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(wishlist || []).map((item, index) => (
                <motion.div
                  key={item._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="card-kawaii relative overflow-hidden">
                    {/* Product Image */}
                    <div className="relative">
                      <img
                        src={item.images?.[0] || "/placeholder-product.jpg"}
                        alt={item.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={e => {
                          e.target.src = "/placeholder-product.jpg";
                        }}
                      />

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFromWishlist(item._id)}
                        className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-100 text-red-500 rounded-full shadow-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>

                      {/* Quick Actions Overlay */}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <Link
                            to={`/product/${item._id}`}
                            className="btn-kawaii-sm bg-white/20 text-white hover:bg-white/30"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="btn-kawaii-sm bg-bubblegum hover:bg-bubblegum/80"
                          >
                            <ShoppingBag size={16} className="mr-1" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-bubblegum bg-bubblegum/10 px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                        <div className="flex items-center text-sm text-dark-slate/70">
                          <Star className="w-4 h-4 text-sunshine mr-1" />
                          {item.rating?.average?.toFixed(1) || "0.0"}
                          <span className="ml-1">
                            ({item.rating?.count || 0})
                          </span>
                        </div>
                      </div>

                      <h3 className="font-semibold text-dark-slate mb-2 line-clamp-2">
                        {item.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-bubblegum">
                          ₹{item.price?.toLocaleString() || "0"}
                        </span>

                        <button
                          onClick={() => handleMoveToCart(item)}
                          className="btn-kawaii-sm flex items-center gap-1"
                        >
                          <ShoppingBag size={14} />
                          Add
                        </button>
                      </div>

                      {item.stock <= 5 && item.stock > 0 && (
                        <p className="text-xs text-orange-500 mt-2">
                          Only {item.stock} left in stock!
                        </p>
                      )}

                      {item.stock === 0 && (
                        <p className="text-xs text-red-500 mt-2">
                          Out of stock
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Wishlist Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12 p-6 bg-white/30 rounded-kawaii"
            >
              <h3 className="text-xl font-heading mb-4">
                Ready to make these yours?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/cart" className="btn-kawaii">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Go to Cart
                </Link>
                <Link to="/products" className="btn-outline-kawaii">
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
