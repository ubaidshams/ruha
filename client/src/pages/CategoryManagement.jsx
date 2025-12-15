import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Package,
  Search,
  Filter,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../store/slices/categoriesSlice";

// Icon options for categories
const ICON_OPTIONS = [
  "📦",
  "🛍️",
  "🎮",
  "💄",
  "📱",
  "🎵",
  "🏠",
  "👕",
  "💍",
  "👟",
  "🎨",
  "📚",
  "⚽",
  "🎂",
  "🌸",
  "💖",
  "☕",
  "🍕",
  "🎁",
  "🎉",
  "💎",
  "🔥",
  "⭐",
  "🌈",
];

// Color options for categories
const COLOR_OPTIONS = [
  { name: "Blue", value: "from-blue-400 to-cyan-400" },
  { name: "Purple", value: "from-purple-400 to-pink-400" },
  { name: "Green", value: "from-green-400 to-emerald-400" },
  { name: "Orange", value: "from-orange-400 to-red-400" },
  { name: "Pink", value: "from-pink-400 to-rose-400" },
  { name: "Indigo", value: "from-indigo-400 to-purple-400" },
  { name: "Teal", value: "from-teal-400 to-cyan-400" },
  { name: "Sunshine", value: "from-yellow-400 to-orange-400" },
];

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(state => state.categories);

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "📦",
    color: "from-blue-400 to-cyan-400",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && category.isActive) ||
      (filterActive === "inactive" && !category.isActive);

    return matchesSearch && matchesFilter;
  });

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "📦",
      color: "from-blue-400 to-cyan-400",
      order: 0,
      isActive: true,
    });
    setEditingCategory(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await dispatch(
          updateCategory({
            id: editingCategory._id,
            ...formData,
          })
        ).unwrap();
      } else {
        await dispatch(createCategory(formData)).unwrap();
      }

      setShowForm(false);
      resetForm();
      dispatch(fetchCategories());
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEdit = category => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "📦",
      color: category.color || "from-blue-400 to-cyan-400",
      order: category.order || 0,
      isActive: category.isActive !== false,
    });
    setShowForm(true);
  };

  const handleDelete = async categoryId => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await dispatch(deleteCategory(categoryId)).unwrap();
        dispatch(fetchCategories());
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const toggleActiveStatus = async category => {
    try {
      await dispatch(
        updateCategory({
          id: category._id,
          ...category,
          isActive: !category.isActive,
        })
      ).unwrap();
      dispatch(fetchCategories());
    } catch (error) {
      console.error("Error updating category status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-blush via-lavender-mist/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-heading text-dark-slate mb-2">
                Category Management
                <span className="text-bubblegum"> 📁</span>
              </h1>
              <p className="text-lg text-dark-slate/70">
                Organize your products into beautiful categories ✨
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="btn-kawaii flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Category
            </button>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-kawaii p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-slate/50" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input-kawaii pl-10 w-full"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-slate/50" />
              <select
                value={filterActive}
                onChange={e => setFilterActive(e.target.value)}
                className="input-kawaii pl-10 pr-8 appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`card-kawaii relative overflow-hidden ${
                  !category.isActive ? "opacity-60" : ""
                }`}
              >
                {/* Category Header with Color */}
                <div
                  className={`h-20 bg-gradient-to-r ${category.color} relative`}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute bottom-2 left-3 text-white">
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => toggleActiveStatus(category)}
                      className="p-1 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                      title={category.isActive ? "Deactivate" : "Activate"}
                    >
                      {category.isActive ? (
                        <Eye className="w-4 h-4 text-white" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Category Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-dark-slate truncate">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-1 text-electric-teal hover:bg-electric-teal/10 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {category.description && (
                    <p className="text-sm text-dark-slate/70 mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        category.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="text-dark-slate/50">
                      Order: {category.order}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredCategories.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Package className="w-16 h-16 mx-auto mb-4 text-dark-slate/30" />
            <h3 className="text-xl font-semibold text-dark-slate mb-2">
              {searchTerm || filterActive !== "all"
                ? "No categories found"
                : "No categories yet"}
            </h3>
            <p className="text-dark-slate/70 mb-6">
              {searchTerm || filterActive !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first category to get started"}
            </p>
            {!searchTerm && filterActive === "all" && (
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="btn-kawaii"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Category
              </button>
            )}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bubblegum mx-auto"></div>
            <p className="text-dark-slate/70 mt-4">Loading categories...</p>
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-kawaii p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-dark-slate">
                  {editingCategory ? "Edit Category" : "Create Category"}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-dark-slate mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-kawaii w-full"
                    placeholder="Category name"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-dark-slate mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input-kawaii w-full"
                    placeholder="Category description"
                    rows={3}
                  />
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-sm font-medium text-dark-slate mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {ICON_OPTIONS.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon }))}
                        className={`p-2 text-xl border-2 rounded-lg hover:scale-110 transition-transform ${
                          formData.icon === icon
                            ? "border-bubblegum bg-bubblegum/10"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-dark-slate mb-2">
                    Color Scheme
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {COLOR_OPTIONS.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() =>
                          setFormData(prev => ({ ...prev, color: color.value }))
                        }
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.color === color.value
                            ? "border-dark-slate scale-105"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`h-4 rounded bg-gradient-to-r ${color.value} mb-1`}
                        ></div>
                        <div className="text-xs font-medium">{color.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-dark-slate mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="input-kawaii w-full"
                    min="0"
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-dark-slate">
                    Active
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-kawaii flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {loading
                      ? "Saving..."
                      : editingCategory
                      ? "Update"
                      : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="flex-1 btn-outline-kawaii"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryManagement;
