import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Gift,
  Truck,
  Sparkles,
  ArrowLeft,
  CreditCard,
  Lock,
  Heart,
  RotateCcw,
  Shield,
} from "lucide-react";
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  toggleGiftMode,
} from "../store/slices/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items,
    total,
    itemCount,
    shippingCost,
    freeShippingThreshold,
    giftMode,
    loading,
  } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleQuantityChange = (productId, newQuantity, customization) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart({ productId, customization }));
    } else {
      dispatch(
        updateCartItem({ productId, quantity: newQuantity, customization })
      );
    }
  };

  const handleRemoveItem = (productId, customization) => {
    dispatch(removeFromCart({ productId, customization }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const shippingProgress = Math.min((total / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - total);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-blush via-lavender-mist/30 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <ShoppingBag className="w-24 h-24 text-bubblegum/50 mx-auto mb-6" />
          <h2 className="text-2xl font-heading text-dark-slate mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-dark-slate/70 mb-8">
            Sign in to view your cart and start shopping for kawaii products!
          </p>
          <div className="space-y-4">
            <Link to="/login" className="btn-kawaii block w-full text-center">
              Sign In
            </Link>
            <Link
              to="/products"
              className="btn-outline-kawaii block w-full text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-blush via-lavender-mist/30 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bubblegum"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-blush via-lavender-mist/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-md mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <ShoppingBag className="w-24 h-24 text-bubblegum/50 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-2xl font-heading text-dark-slate mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-dark-slate/70 mb-8">
              Looks like you haven't added any kawaii products to your cart yet.
            </p>
            <div className="space-y-4">
              <Link
                to="/products"
                className="btn-kawaii block w-full text-center"
              >
                Start Shopping
              </Link>
              <Link
                to="/bag-builder"
                className="btn-outline-kawaii block w-full text-center"
              >
                Build Your Bag
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-blush via-lavender-mist/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/products"
            className="flex items-center gap-2 text-bubblegum hover:text-electric-teal transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <h1 className="text-4xl md:text-5xl font-heading text-dark-slate">
            Your Cart
            <span className="text-bubblegum"> ({itemCount} items)</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free Shipping Progress */}
            {remainingForFreeShipping > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 rounded-kawaii p-6 shadow-kawaii-soft border border-white/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Truck className="w-6 h-6 text-bubblegum" />
                  <span className="font-semibold text-dark-slate">
                    Add ₹{remainingForFreeShipping.toLocaleString()} more for
                    free shipping!
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-bubblegum to-electric-teal rounded-full"
                  />
                </div>
              </motion.div>
            )}

            {/* Gift Mode Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 rounded-kawaii p-6 shadow-kawaii-soft border border-white/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Gift className="w-6 h-6 text-sunshine" />
                  <div>
                    <span className="font-semibold text-dark-slate">
                      Gift Mode
                    </span>
                    <p className="text-sm text-dark-slate/70">
                      Add a beautiful Ruha ribbon wrapping (₹50)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(toggleGiftMode())}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    giftMode ? "bg-bubblegum" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      giftMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </motion.div>

            {/* Cart Items List */}
            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.product._id}-${JSON.stringify(
                      item.customization || {}
                    )}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/80 rounded-kawaii p-6 shadow-kawaii-soft border border-white/50"
                  >
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <Link
                        to={`/product/${item.product._id}`}
                        className="flex-shrink-0"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-kawaii hover:scale-105 transition-transform"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Link
                              to={`/product/${item.product._id}`}
                              className="font-semibold text-dark-slate hover:text-bubblegum transition-colors line-clamp-2"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-dark-slate/70 mt-1 line-clamp-2">
                              {item.product.description}
                            </p>

                            {/* Customization Details */}
                            {item.customization &&
                              Object.keys(item.customization).length > 0 && (
                                <div className="mt-2">
                                  {item.customization.charms &&
                                    item.customization.charms.length > 0 && (
                                      <div className="flex items-center gap-2 text-xs text-bubblegum">
                                        <Sparkles className="w-3 h-3" />
                                        <span>
                                          With{" "}
                                          {item.customization.charms.length}{" "}
                                          charm(s)
                                        </span>
                                      </div>
                                    )}
                                </div>
                              )}

                            <div className="flex items-center gap-4 mt-3">
                              <span className="text-lg font-bold text-bubblegum">
                                ₹{item.product.price.toLocaleString()}
                              </span>
                              {item.product.stock <= 5 && (
                                <span className="text-xs bg-sunshine text-dark-slate px-2 py-1 rounded-full font-medium">
                                  Only {item.product.stock} left!
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Wishlist Button */}
                          <button className="p-2 text-dark-slate/50 hover:text-bubblegum transition-colors">
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-white/50 rounded-kawaii">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product._id,
                                  item.quantity - 1,
                                  item.customization
                                )
                              }
                              className="p-2 hover:bg-bubblegum/10 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product._id,
                                  item.quantity + 1,
                                  item.customization
                                )
                              }
                              disabled={item.quantity >= item.product.stock}
                              className="p-2 hover:bg-bubblegum/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-dark-slate">
                              ₹
                              {(
                                item.product.price * item.quantity
                              ).toLocaleString()}
                            </span>
                            <button
                              onClick={() =>
                                handleRemoveItem(
                                  item.product._id,
                                  item.customization
                                )
                              }
                              className="p-2 text-red-500 hover:bg-red-50 rounded-kawaii transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Clear Cart */}
            {items.length > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-600 transition-colors text-sm"
              >
                Clear entire cart
              </motion.button>
            )}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Summary Card */}
            <div className="bg-white/80 rounded-kawaii p-6 shadow-kawaii-soft border border-white/50 sticky top-8">
              <h3 className="text-xl font-semibold text-dark-slate mb-4">
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-dark-slate/70">Subtotal</span>
                  <span className="font-medium">₹{total.toLocaleString()}</span>
                </div>

                {giftMode && (
                  <div className="flex items-center justify-between">
                    <span className="text-dark-slate/70">Gift Wrapping</span>
                    <span className="font-medium">₹50</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-dark-slate/70">Shipping</span>
                  <span
                    className={
                      shippingCost === 0
                        ? "text-green-600 font-medium"
                        : "font-medium"
                    }
                  >
                    {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                  </span>
                </div>

                <div className="border-t border-white/50 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-dark-slate">
                      Total
                    </span>
                    <span className="text-xl font-bold text-bubblegum">
                      ₹
                      {(
                        total +
                        shippingCost +
                        (giftMode ? 50 : 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/checkout")}
                className="w-full btn-kawaii py-4 mt-6 flex items-center justify-center gap-2 text-lg"
              >
                <CreditCard className="w-5 h-5" />
                Secure Checkout
                <Lock className="w-4 h-4" />
              </motion.button>

              {/* Security Notice */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-dark-slate/60">
                  <Lock className="w-3 h-3" />
                  <span>256-bit SSL encrypted</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white/80 rounded-kawaii p-6 shadow-kawaii-soft border border-white/50">
              <h4 className="font-semibold text-dark-slate mb-4">
                Why shop with us?
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-bubblegum" />
                  <span className="text-sm text-dark-slate">
                    Free shipping on orders over ₹999
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-bubblegum" />
                  <span className="text-sm text-dark-slate">
                    30-day return policy
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-bubblegum" />
                  <span className="text-sm text-dark-slate">
                    Secure payment processing
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
