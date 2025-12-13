import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  ShoppingCart,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import {
  fetchAdminProducts,
  fetchProductStats,
} from "../../store/slices/adminSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { products, stats, loading } = useSelector(state => state.admin);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchProductStats());
  }, [dispatch]);

  const categories = ["all", "Sip", "Carry", "Play", "Tech", "Glam", "Decor"];

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteClick = product => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    // TODO: Implement delete product functionality
    console.log("Deleting product:", productToDelete._id);
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bubblegum"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-blush via-lavender-mist/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-heading text-dark-slate mb-2">
            Admin Dashboard
            <span className="text-bubblegum"> 👑</span>
          </h1>
          <p className="text-lg text-dark-slate/70">
            Manage your kawaii empire with love and care ✨
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="card-kawaii p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-slate/70 mb-1">
                  Total Products
                </p>
                <p className="text-3xl font-bold text-dark-slate">
                  {stats?.totalProducts || 0}
                </p>
              </div>
              <Package className="w-8 h-8 text-bubblegum" />
            </div>
          </div>

          <div className="card-kawaii p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-slate/70 mb-1">
                  Low Stock Alert
                </p>
                <p className="text-3xl font-bold text-sunshine">
                  {stats?.lowStockProducts || 0}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-sunshine" />
            </div>
          </div>

          <div className="card-kawaii p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-slate/70 mb-1">
                  Active Products
                </p>
                <p className="text-3xl font-bold text-electric-teal">
                  {stats?.activeProducts || 0}
                </p>
              </div>
              <Eye className="w-8 h-8 text-electric-teal" />
            </div>
          </div>

          <div className="card-kawaii p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-slate/70 mb-1">Stock Value</p>
                <p className="text-2xl font-bold text-dark-slate">
                  ₹{(stats?.totalStockValue || 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-electric-teal" />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-kawaii p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-dark-slate mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/admin/products/new"
              className="btn-kawaii p-4 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </Link>
            <Link
              to="/admin/orders"
              className="btn-outline-kawaii p-4 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              View Orders
            </Link>
            <Link
              to="/admin/analytics"
              className="btn-outline-kawaii p-4 flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              Analytics
            </Link>
          </div>
        </motion.div>

        {/* Product Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-kawaii"
        >
          <div className="p-6 border-b border-white/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-dark-slate">
                Product Management
              </h2>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-slate/50" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="input-kawaii pl-10 w-full sm:w-64"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-slate/50" />
                  <select
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                    className="input-kawaii pl-10 pr-8 appearance-none cursor-pointer"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bubblegum/5">
                <tr>
                  <th className="text-left p-4 font-semibold text-dark-slate">
                    Product
                  </th>
                  <th className="text-left p-4 font-semibold text-dark-slate">
                    Category
                  </th>
                  <th className="text-left p-4 font-semibold text-dark-slate">
                    Price
                  </th>
                  <th className="text-left p-4 font-semibold text-dark-slate">
                    Stock
                  </th>
                  <th className="text-left p-4 font-semibold text-dark-slate">
                    3D Model
                  </th>
                  <th className="text-left p-4 font-semibold text-dark-slate">
                    Status
                  </th>
                  <th className="text-left p-4 font-semibold text-dark-slate">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-white/30 hover:bg-bubblegum/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium text-dark-slate">
                            {product.name}
                          </div>
                          <div className="text-sm text-dark-slate/70 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-bubblegum/10 text-bubblegum text-xs rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-dark-slate">
                      ₹{product.price.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-semibold ${
                          product.stock <= 5
                            ? "text-red-500"
                            : product.stock <= 10
                            ? "text-sunshine"
                            : "text-dark-slate"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      {product.model3dUrl ? (
                        <span className="text-green-600 text-sm flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          3D Ready
                        </span>
                      ) : (
                        <span className="text-dark-slate/50 text-sm flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          2D Only
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          product.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="p-2 text-electric-teal hover:bg-electric-teal/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-12 text-center text-dark-slate/70">
              <Package className="w-12 h-12 mx-auto mb-4 text-dark-slate/30" />
              <p className="text-lg">No products found</p>
              <p className="text-sm">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-kawaii p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold text-dark-slate mb-4">
              Confirm Delete
            </h3>
            <p className="text-dark-slate/80 mb-6">
              Are you sure you want to delete "{productToDelete?.name}"? This
              action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-kawaii hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 btn-outline-kawaii"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
