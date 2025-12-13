import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Package,
  Sparkles,
  Gift,
  Eye,
  Maximize2,
} from "lucide-react";
import {
  fetchProductById,
  fetchRelatedProducts,
} from "../store/slices/productsSlice";
import { addToCart } from "../store/slices/cartSlice";
import { toggleWishlist } from "../store/slices/userSlice";
import KawaiiModelViewer from "../components/ui/KawaiiModelViewer";

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showBlindBoxModal, setShowBlindBoxModal] = useState(false);
  const [viewMode, setViewMode] = useState("image"); // 'image' or '3d'

  const { product, relatedProducts, loading } = useSelector(
    state => state.products
  );
  const { isAuthenticated } = useSelector(state => state.auth);
  const { wishlist } = useSelector(state => state.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchRelatedProducts(id));
    }
  }, [id, dispatch]);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);

    // For blind box items, show the unboxing experience
    if (product.isBlindBox) {
      setShowBlindBoxModal(true);
      return;
    }

    try {
      await dispatch(
        addToCart({
          productId: product._id,
          quantity,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBlindBoxUnbox = async () => {
    try {
      await dispatch(
        addToCart({
          productId: product._id,
          quantity,
        })
      ).unwrap();
      setShowBlindBoxModal(false);
    } catch (error) {
      console.error("Failed to add blind box to cart:", error);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex(prev =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(prev =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const isWishlisted = product && wishlist.includes(product._id);

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bubblegum"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-blush via-lavender-mist/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-dark-slate/70 mb-8"
        >
          <Link to="/" className="hover:text-bubblegum">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-bubblegum">
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/products/${product.category}`}
            className="hover:text-bubblegum"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-dark-slate">{product.name}</span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* View Mode Toggle */}
            {product.model3dUrl && (
              <div className="flex justify-center gap-2 mb-4">
                <button
                  onClick={() => setViewMode("image")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-kawaii transition-colors ${
                    viewMode === "image"
                      ? "bg-bubblegum text-white"
                      : "bg-white/80 text-dark-slate hover:bg-bubblegum/10"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  View Image
                </button>
                <button
                  onClick={() => setViewMode("3d")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-kawaii transition-colors ${
                    viewMode === "3d"
                      ? "bg-bubblegum text-white"
                      : "bg-white/80 text-dark-slate hover:bg-bubblegum/10"
                  }`}
                >
                  <Maximize2 className="w-4 h-4" />
                  3D View
                </button>
              </div>
            )}

            <div className="relative aspect-square rounded-kawaii overflow-hidden bg-white shadow-kawaii-soft">
              {viewMode === "3d" && product.model3dUrl ? (
                <KawaiiModelViewer
                  productId={`product-${product._id}`}
                  url={product.model3dUrl}
                  className="w-full h-full"
                  autoRotate={true}
                  showControls={true}
                  scale={0.9}
                />
              ) : (
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Stock indicator */}
              {product.stock <= 5 && product.stock > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="bg-sunshine text-dark-slate px-3 py-1 rounded-full text-sm font-bold">
                    Only {product.stock} left!
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index
                        ? "border-bubblegum"
                        : "border-white/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-bubblegum bg-bubblegum/10 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                {product.isBlindBox && (
                  <span className="flex items-center gap-1 text-sm font-medium text-sunshine bg-sunshine/10 px-3 py-1 rounded-full">
                    <Gift className="w-4 h-4" />
                    Mystery Box
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-heading text-dark-slate mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-sunshine mr-1" />
                  <span className="text-lg font-semibold">
                    {product.rating.average || "4.5"}
                  </span>
                  <span className="text-dark-slate/70 ml-1">
                    ({product.rating.count || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-bubblegum">
                ₹{product.price.toLocaleString()}
              </span>
              {product.stock > 0 ? (
                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  In Stock
                </span>
              ) : (
                <span className="text-sm text-red-600 font-medium">
                  Out of Stock
                </span>
              )}
            </div>

            <p className="text-dark-slate/80 leading-relaxed">
              {product.description}
            </p>

            {/* Product Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y border-white/50">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-bubblegum" />
                <span className="text-sm text-dark-slate">Free Shipping</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-bubblegum" />
                <span className="text-sm text-dark-slate">30-Day Returns</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-bubblegum" />
                <span className="text-sm text-dark-slate">1-Year Warranty</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium text-dark-slate">Quantity:</span>
              <div className="flex items-center border border-white/50 rounded-kawaii">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-bubblegum/10 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="px-3 py-2 hover:bg-bubblegum/10 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className="flex-1 btn-kawaii py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  isAuthenticated && dispatch(toggleWishlist(product._id))
                }
                className={`p-4 rounded-kawaii transition-colors ${
                  isWishlisted
                    ? "bg-bubblegum text-white"
                    : "bg-white/80 text-dark-slate hover:bg-bubblegum/10 border border-white/50"
                }`}
              >
                <Heart className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 bg-white/80 text-dark-slate hover:bg-bubblegum/10 border border-white/50 rounded-kawaii transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Blind Box Warning */}
            {product.isBlindBox && (
              <div className="bg-sunshine/10 border border-sunshine/30 rounded-kawaii p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-5 h-5 text-sunshine" />
                  <span className="font-semibold text-sunshine">
                    Mystery Box!
                  </span>
                </div>
                <p className="text-sm text-dark-slate/80">
                  This is a mystery item! You won't know what you're getting
                  until you unbox it. Each box contains one of several surprise
                  items.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="bg-white/50 rounded-kawaii p-6">
            <h3 className="text-xl font-semibold text-dark-slate mb-4">
              Product Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-dark-slate mb-2">
                  Specifications
                </h4>
                <ul className="space-y-2 text-sm text-dark-slate/80">
                  {product.specifications?.material && (
                    <li>
                      <span className="font-medium">Material:</span>{" "}
                      {product.specifications.material}
                    </li>
                  )}
                  {product.specifications?.dimensions && (
                    <li>
                      <span className="font-medium">Dimensions:</span>{" "}
                      {product.specifications.dimensions}
                    </li>
                  )}
                  {product.specifications?.weight && (
                    <li>
                      <span className="font-medium">Weight:</span>{" "}
                      {product.specifications.weight}
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-dark-slate mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-bubblegum/10 text-bubblegum px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-heading text-dark-slate mb-8 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Link to={`/product/${relatedProduct._id}`} className="block">
                    <div className="card-kawaii">
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-dark-slate mb-2 line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-bubblegum">
                            ₹{relatedProduct.price.toLocaleString()}
                          </span>
                          <div className="flex items-center text-sm text-dark-slate/70">
                            <Star className="w-4 h-4 text-sunshine mr-1" />
                            {relatedProduct.rating.average || "4.5"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Blind Box Unboxing Modal */}
      <AnimatePresence>
        {showBlindBoxModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowBlindBoxModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-kawaii p-8 max-w-md w-full text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="mb-6">
                <Gift className="w-16 h-16 text-sunshine mx-auto mb-4" />
                <h3 className="text-2xl font-heading text-dark-slate mb-2">
                  Mystery Box Unboxing!
                </h3>
                <p className="text-dark-slate/80">
                  Get ready for the surprise! Click below to reveal your mystery
                  item.
                </p>
              </div>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBlindBoxUnbox}
                  className="w-full btn-kawaii py-3 text-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Unbox Now!
                </motion.button>
                <button
                  onClick={() => setShowBlindBoxModal(false)}
                  className="w-full text-dark-slate/70 hover:text-dark-slate transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;
