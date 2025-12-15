import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Grid,
  List,
  Star,
  Heart,
  ShoppingCart,
  Tag,
  DollarSign,
} from "lucide-react";
import {
  searchProducts,
  clearSearchResults,
  setFilters,
  clearFilters,
} from "../store/slices/productsSlice";
import { fetchCategories } from "../store/slices/categoriesSlice";
import KawaiiProductCard from "../components/ui/KawaiiProductCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const SearchPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    searchResults,
    isLoadingSearch,
    searchQuery,
    filters,
    categories,
    isLoading,
  } = useSelector(state => state.products);

  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchParams.get("q") || "");
  const [localFilters, setLocalFilters] = useState({
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    tags: searchParams.get("tags") ? searchParams.get("tags").split(",") : [],
    sort: searchParams.get("sort") || "relevance",
  });

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle search when query changes
  useEffect(() => {
    const query = searchParams.get("q");
    if (query && query !== searchQuery) {
      setLocalQuery(query);
      handleSearch(query);
    }
  }, [searchParams]);

  const handleSearch = async (query = localQuery) => {
    if (!query.trim()) return;

    // Update URL with search query
    const newParams = new URLSearchParams(searchParams);
    newParams.set("q", query.trim());
    setSearchParams(newParams);

    // Dispatch search action
    dispatch(searchProducts(query.trim()));
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);

    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "" && key !== "tags") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key === "tags" && value.length > 0) {
      newParams.set("tags", value.join(","));
    } else if (key === "tags") {
      newParams.delete("tags");
    }
    setSearchParams(newParams);

    // If we have a search query, re-search with filters
    if (searchQuery) {
      const filterParams = {
        q: searchQuery,
        ...Object.fromEntries(
          Object.entries(newFilters).filter(
            ([_, v]) => v && v.length > 0 && v !== ""
          )
        ),
      };
      dispatch(searchProducts(searchQuery));
    }
  };

  const clearAllFilters = () => {
    setLocalFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      tags: [],
      sort: "relevance",
    });
    dispatch(clearFilters());

    // Clear URL params except search query
    const newParams = new URLSearchParams();
    if (searchQuery) {
      newParams.set("q", searchQuery);
    }
    setSearchParams(newParams);
  };

  const toggleTag = tag => {
    const newTags = localFilters.tags.includes(tag)
      ? localFilters.tags.filter(t => t !== tag)
      : [...localFilters.tags, tag];
    handleFilterChange("tags", newTags);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      localFilters.category ||
      localFilters.minPrice ||
      localFilters.maxPrice ||
      localFilters.tags.length > 0
    );
  }, [localFilters]);

  const popularTags = [
    "kawaii",
    "cute",
    "gift",
    "office",
    "college",
    "desk",
    "limited",
    "viral",
    "3d",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-blush via-lavender-mist/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-heading text-dark-slate mb-2">
            Search Kawaii Treasures
            <span className="text-bubblegum"> 🔍</span>
          </h1>
          <p className="text-lg text-dark-slate/70">
            Find the perfect items with our magical search ✨
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-slate/50" />
            <input
              type="text"
              placeholder="Search for products, brands, or categories..."
              value={localQuery}
              onChange={e => setLocalQuery(e.target.value)}
              onKeyPress={e => e.key === "Enter" && handleSearch()}
              className="w-full pl-12 pr-20 py-4 text-lg rounded-kawaii border-2 border-bubblegum/20 focus:border-bubblegum focus:outline-none bg-white/50 backdrop-blur-sm"
            />
            <button
              onClick={() => handleSearch()}
              disabled={!localQuery.trim() || isLoadingSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-kawaii px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingSearch ? "Searching..." : "Search"}
            </button>
          </div>
        </motion.div>

        {/* Search Results Header */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-dark-slate">
                Search Results for "{searchQuery}"
              </h2>
              <span className="text-dark-slate/70">
                ({(searchResults || []).length} items found)
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-bubblegum text-white"
                      : "bg-white/50 text-dark-slate/70 hover:bg-bubblegum/10"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${
                    viewMode === "list"
                      ? "bg-bubblegum text-white"
                      : "bg-white/50 text-dark-slate/70 hover:bg-bubblegum/10"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters || hasActiveFilters
                    ? "bg-bubblegum text-white"
                    : "bg-white/50 text-dark-slate/70 hover:bg-bubblegum/10"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                    {
                      [localFilters.category, ...localFilters.tags].filter(
                        Boolean
                      ).length
                    }
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:w-80 flex-shrink-0"
              >
                <div className="card-kawaii p-6 sticky top-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-dark-slate flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filters
                    </h3>
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-bubblegum hover:underline"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-dark-slate mb-2">
                        Category
                      </label>
                      <select
                        value={localFilters.category}
                        onChange={e =>
                          handleFilterChange("category", e.target.value)
                        }
                        className="w-full input-kawaii"
                      >
                        <option value="">All Categories</option>
                        {categories?.map(category => (
                          <option key={category?._id} value={category?.slug}>
                            {category?.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-dark-slate mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Price Range
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={localFilters.minPrice}
                          onChange={e =>
                            handleFilterChange("minPrice", e.target.value)
                          }
                          className="flex-1 input-kawaii"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={localFilters.maxPrice}
                          onChange={e =>
                            handleFilterChange("maxPrice", e.target.value)
                          }
                          className="flex-1 input-kawaii"
                        />
                      </div>
                    </div>

                    {/* Tags Filter */}
                    <div>
                      <label className="block text-sm font-medium text-dark-slate mb-2 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {popularTags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                              localFilters.tags.includes(tag)
                                ? "bg-bubblegum text-white border-bubblegum"
                                : "bg-white/50 text-dark-slate/70 border-gray-200 hover:border-bubblegum"
                            }`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-medium text-dark-slate mb-2">
                        Sort By
                      </label>
                      <select
                        value={localFilters.sort}
                        onChange={e =>
                          handleFilterChange("sort", e.target.value)
                        }
                        className="w-full input-kawaii"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Results */}
          <div className="flex-1">
            {isLoadingSearch ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (searchResults || []).length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {(searchResults || []).map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <KawaiiProductCard product={product} viewMode={viewMode} />
                  </motion.div>
                ))}
              </motion.div>
            ) : searchQuery ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-dark-slate mb-2">
                  No results found
                </h3>
                <p className="text-dark-slate/70 mb-6">
                  Try adjusting your search terms or filters
                </p>
                <button
                  onClick={clearAllFilters}
                  className="btn-outline-kawaii"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🔍✨</div>
                <h3 className="text-xl font-semibold text-dark-slate mb-2">
                  Start Your Search
                </h3>
                <p className="text-dark-slate/70">
                  Enter a search term above to find amazing kawaii products
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
