import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, TrendingUp, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchFeaturedProducts,
  fetchViralProducts,
} from "../store/slices/productsSlice";
import { fetchCategories } from "../store/slices/categoriesSlice";
import KawaiiModelViewer from "../components/ui/KawaiiModelViewer";
import SEO from "../components/ui/SEO";

const HomePage = () => {
  const dispatch = useDispatch();
  const { featuredProducts, viralProducts, loading, isLoadingViral } =
    useSelector(state => state.products);
  const { categories } = useSelector(state => state.categories);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchViralProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Default colors for categories if none specified
  const defaultColors = [
    "from-blue-400 to-cyan-400",
    "from-pink-400 to-rose-400",
    "from-purple-400 to-indigo-400",
    "from-green-400 to-emerald-400",
    "from-yellow-400 to-orange-400",
    "from-violet-400 to-purple-400",
    "from-red-400 to-pink-400",
    "from-teal-400 to-cyan-400",
  ];

  const defaultIcons = ["🥤", "👜", "🎮", "💻", "💄", "🏠", "🎁", "📱"];

  const categoryPills = categories.map((category, index) => ({
    name: category.name,
    path: `/products/${category.name}`,
    color: category.color || defaultColors[index % defaultColors.length],
    icon: category.icon || defaultIcons[index % defaultIcons.length],
  }));

  // Remove hardcoded trending items - will be populated by viralProducts from API

  return (
    <div className="min-h-screen">
      <SEO
        title="Welcome to Kawaii Cloud - Ruha Digital Playground"
        description="Discover adorable kawaii-inspired products, bags, and accessories. From cute drinkware to playful tech gadgets, explore trending kawaii items in our immersive 3D shopping experience."
        keywords="kawaii shop, cute products, kawaii bags, kawaii accessories, kawaii drinks, kawaii toys, kawaii tech, kawaii decor, online kawaii store, kawaii cloud"
        type="website"
      />
      {/* Hero Section with 3D Kawaii Model */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-100"></div>

        {/* Kawaii 3D Model Viewer */}
        <div className="absolute inset-0 z-10">
          <KawaiiModelViewer
            productId="hero-scene"
            url="https://my.spline.design/ruha-hero-3d-copy-1732037041/"
            className="w-full h-full"
            autoRotate={true}
            showControls={false}
            scale={1}
          />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-20 flex items-center justify-center h-full">
          <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-8xl font-heading text-dark-slate"
            >
              Welcome to
              <span className="block text-gradient bg-gradient-to-r from-bubblegum to-electric-teal bg-clip-text text-transparent">
                Kawaii Cloud
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-dark-slate/80 max-w-2xl mx-auto"
            >
              Where 3D magic meets shopping joy. Explore our collection of
              <span className="font-semibold text-bubblegum">
                {" "}
                trending kawaii products
              </span>{" "}
              in an immersive digital playground.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/products" className="btn-kawaii text-lg px-8 py-4">
                Start Shopping
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/bag-builder"
                className="btn-outline-kawaii text-lg px-8 py-4"
              >
                Build Your Bag
                <Sparkles className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-dark-slate/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-bubblegum rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Category Pills */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-heading text-center text-dark-slate mb-12"
          >
            Shop by Category
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryPills.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={category.path}
                  className={`block p-6 rounded-kawaii bg-gradient-to-br ${category.color} shadow-kawaii-soft hover:shadow-kawaii-glow transition-all duration-300 text-white text-center`}
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div className="font-semibold text-lg">{category.name}</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Viral Now Carousel */}
      <section className="py-16 px-4 bg-gradient-to-r from-soft-blush/50 to-lavender-mist/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-12"
          >
            <TrendingUp className="w-8 h-8 text-bubblegum mr-3" />
            <h2 className="text-4xl font-heading text-dark-slate">Viral Now</h2>
            <Sparkles className="w-8 h-8 text-electric-teal ml-3" />
          </motion.div>

          {isLoadingViral ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card-kawaii animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-kawaii"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : viralProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {viralProducts.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Link to={`/product/${item._id}`} className="block">
                    <div className="card-kawaii overflow-hidden">
                      <div className="relative">
                        <img
                          src={item.images?.[0] || "/placeholder-product.jpg"}
                          alt={item.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="bg-sunshine text-dark-slate px-2 py-1 rounded-full text-xs font-bold flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            Viral
                          </span>
                        </div>
                      </div>

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
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="btn-kawaii-sm"
                          >
                            Add to Cart
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-xl font-heading mb-2">
                No viral products yet!
              </h3>
              <p className="text-dark-slate/70">
                Check back soon for trending items.
              </p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <Link to="/products" className="btn-outline-kawaii">
              View All Products
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-heading text-center text-dark-slate mb-12"
          >
            Featured Collection
          </motion.h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card-kawaii animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-kawaii"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Link to={`/product/${product._id}`} className="block">
                    <div className="card-kawaii">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-dark-slate mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-bubblegum">
                            ₹{product.price.toLocaleString()}
                          </span>
                          <button className="btn-kawaii-sm">Add to Cart</button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
