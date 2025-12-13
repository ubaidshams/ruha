import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Grid, List, Filter } from "lucide-react";

import { fetchProducts } from "../store/slices/productsSlice";
import { toggleFilterOpen } from "../store/slices/filterSlice";
import { addToCart } from "../store/slices/cartSlice";
import KawaiiProductCard from "../components/ui/KawaiiProductCard";

const ProductListingPage = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { products, loading, pagination } = useSelector(
    state => state.products
  );
  const { activeFiltersCount } = useSelector(state => state.filters);

  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const params = {
      category,
      sort: sortBy,
      page: currentPage,
      limit: 20,
      ...Object.fromEntries(searchParams.entries()),
    };
    dispatch(fetchProducts(params));
  }, [category, sortBy, currentPage, searchParams, dispatch]);

  const moodFilters = [
    { name: "Gift Ideas", value: "gift" },
    { name: "Date Night", value: "date" },
    { name: "Desk Setup", value: "desk" },
    { name: "Travel", value: "travel" },
    { name: "Office", value: "office" },
    { name: "College", value: "college" },
    { name: "Party", value: "party" },
    { name: "Summer", value: "summer" },
  ];

  const categories = [
    { name: "All", value: null },
    { name: "Sip", value: "Sip" },
    { name: "Carry", value: "Carry" },
    { name: "Play", value: "Play" },
    { name: "Tech", value: "Tech" },
    { name: "Glam", value: "Glam" },
    { name: "Decor", value: "Decor" },
  ];

  const handleAddToCart = product => {
    dispatch(
      addToCart({
        productId: product._id,
        quantity: 1,
      })
    );
  };

  const toggleMoodFilter = filterValue => {
    const currentFilters = searchParams.get("tags")?.split(",") || [];
    const newFilters = currentFilters.includes(filterValue)
      ? currentFilters.filter(f => f !== filterValue)
      : [...currentFilters, filterValue];

    if (newFilters.length > 0) {
      searchParams.set("tags", newFilters.join(","));
    } else {
      searchParams.delete("tags");
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-blush via-lavender-mist/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading text-dark-slate mb-4"
          >
            {category ? category : "All Products"}
            <span className="text-bubblegum"> Collection</span>
          </motion.h1>
          <p className="text-lg text-dark-slate/70">
            Discover amazing kawaii products that bring joy to your everyday
            life
          </p>
        </div>

        {/* Mood Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-dark-slate mb-4">
            Shop by Mood
          </h3>
          <div className="flex flex-wrap gap-3">
            {moodFilters.map(filter => {
              const isActive = searchParams
                .get("tags")
                ?.split(",")
                .includes(filter.value);
              return (
                <motion.button
                  key={filter.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleMoodFilter(filter.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-bubblegum text-white shadow-kawaii-soft"
                      : "bg-white/80 text-dark-slate hover:bg-bubblegum/10 border border-white/50"
                  }`}
                >
                  {filter.name}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => {
              const isActive =
                (!category && !cat.value) || category === cat.value;
              return (
                <Link
                  key={cat.value || "all"}
                  to={cat.value ? `/products/${cat.value}` : "/products"}
                  className={`px-6 py-3 rounded-kawaii text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-bubblegum to-electric-teal text-white shadow-kawaii-soft"
                      : "bg-white/80 text-dark-slate hover:bg-bubblegum/10 border border-white/50"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleFilterOpen())}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-kawaii border border-white/50 hover:bg-bubblegum/10 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-bubblegum text-white text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-kawaii ${
                  viewMode === "grid"
                    ? "bg-bubblegum text-white"
                    : "bg-white/80 text-dark-slate"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-kawaii ${
                  viewMode === "list"
                    ? "bg-bubblegum text-white"
                    : "bg-white/80 text-dark-slate"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white/80 rounded-kawaii border border-white/50 text-dark-slate"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card-kawaii animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-kawaii"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {products.map((product, index) => (
              <KawaiiProductCard
                key={product._id}
                product={product}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.total > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/80 rounded-kawaii disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {[...Array(pagination.total)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 rounded-kawaii ${
                  currentPage === i + 1
                    ? "bg-bubblegum text-white"
                    : "bg-white/80 text-dark-slate"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage(prev => Math.min(prev + 1, pagination.total))
              }
              disabled={currentPage === pagination.total}
              className="px-4 py-2 bg-white/80 rounded-kawaii disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListingPage;
