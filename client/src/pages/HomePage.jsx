import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, TrendingUp, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturedProducts } from "../store/slices/productsSlice";
import KawaiiModelViewer from "../components/ui/KawaiiModelViewer";

const HomePage = () => {
  const dispatch = useDispatch();
  const { featuredProducts, loading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  const categoryPills = [
    {
      name: "Sip",
      path: "/products/Sip",
      color: "from-blue-400 to-cyan-400",
      icon: "🥤",
    },
    {
      name: "Carry",
      path: "/products/Carry",
      color: "from-pink-400 to-rose-400",
      icon: "👜",
    },
    {
      name: "Play",
      path: "/products/Play",
      color: "from-purple-400 to-indigo-400",
      icon: "🎮",
    },
    {
      name: "Tech",
      path: "/products/Tech",
      color: "from-green-400 to-emerald-400",
      icon: "💻",
    },
    {
      name: "Glam",
      path: "/products/Glam",
      color: "from-yellow-400 to-orange-400",
      icon: "💄",
    },
    {
      name: "Decor",
      path: "/products/Decor",
      color: "from-violet-400 to-purple-400",
      icon: "🏠",
    },
  ];

  const trendingItems = [
    {
      id: 1,
      name: "Nebula Quencher Tumbler",
      image: "/assets/products/tumbler-blue.jpg",
      price: 1299,
      category: "Sip",
      rating: 4.8,
      reviews: 234,
      viral: true,
    },
    {
      id: 2,
      name: "Chibi Astronaut Fan",
      image: "/assets/products/astro-fan.jpg",
      price: 899,
      category: "Tech",
      rating: 4.9,
      reviews: 156,
      viral: true,
    },
    {
      id: 3,
      name: "Cloud Puffy Tote",
      image: "/assets/products/puffy-bag-pink.jpg",
      price: 1599,
      category: "Carry",
      rating: 4.7,
      reviews: 89,
      viral: true,
    },
    {
      id: 4,
      name: "Ruha Mystery Minion",
      image: "/assets/products/mystery-box.jpg",
      price: 499,
      category: "Play",
      rating: 4.6,
      reviews: 312,
      viral: true,
    },
  ];

  return (
    <div className="min-h-screen">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Link to={`/product/${item.id}`} className="block">
                  <div className="card-kawaii overflow-hidden">
                    <div className="relative">
                      <img
                        src={item.image}
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
                          {item.rating}
                          <span className="ml-1">({item.reviews})</span>
                        </div>
                      </div>

                      <h3 className="font-semibold text-dark-slate mb-2 line-clamp-2">
                        {item.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-bubblegum">
                          ₹{item.price.toLocaleString()}
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
