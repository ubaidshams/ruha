import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import {
  Save,
  ArrowLeft,
  Upload,
  X,
  Plus,
  Star,
  Tag,
  Package,
  Gift,
  Image,
  TrendingUp,
} from "lucide-react";

import {
  createProduct,
  updateProduct,
  fetchProductById,
} from "../store/slices/productsSlice";
import { fetchCategories } from "../store/slices/categoriesSlice";
import {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
} from "../store/slices/adminSlice";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const isEdit = !!id;

  const { product, loading } = useSelector(state => state.products);
  const { isLoading } = useSelector(state => state.admin);
  const { categories } = useSelector(state => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: [],
    specifications: {
      material: "",
      dimensions: "",
      weight: "",
    },
    tags: [],
    stock: "",
    isBlindBox: false,
    modelUrl: "",
    isViral: false,
    featured: false,
  });

  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const { isLoading: isAdminLoading } = useSelector(state => state.admin);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const predefinedTags = [
    "kawaii",
    "cute",
    "gift",
    "office",
    "college",
    "travel",
    "desk",
    "party",
    "summer",
    "date",
    "mystery",
    "limited",
    "sale",
  ];

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchProductById(id));
    }
  }, [isEdit, id, dispatch]);

  useEffect(() => {
    if (isEdit && product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        category: product.category || "",
        images: product.images || [],
        specifications: {
          material: product.specifications?.material || "",
          dimensions: product.specifications?.dimensions || "",
          weight: product.specifications?.weight || "",
        },
        tags: product.tags || [],
        stock: product.stock?.toString() || "",
        isBlindBox: product.isBlindBox || false,
        modelUrl: product.modelUrl || "",
        isViral: product.isViral || false,
        featured: product.featured || false,
      });
    }
  }, [isEdit, product]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    }

    if (
      !formData.price ||
      isNaN(formData.price) ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one product image is required";
    }

    if (
      !formData.stock ||
      isNaN(formData.stock) ||
      parseInt(formData.stock) < 0
    ) {
      newErrors.stock = "Valid stock quantity is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    };

    try {
      if (isEdit) {
        await dispatch(updateProduct({ id, productData })).unwrap();
      } else {
        await dispatch(createProduct(productData)).unwrap();
      }
      navigate("/admin");
    } catch (error) {
      console.error("Failed to save product:", error);
      setErrors({ submit: "Failed to save product. Please try again." });
    }
  };

  const handleImageUpload = async event => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (files.length === 1) {
        // Single file upload
        const result = await dispatch(uploadImage(files[0])).unwrap();
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, result.imageUrl],
        }));
      } else {
        // Multiple files upload
        const result = await dispatch(uploadMultipleImages(files)).unwrap();
        const imageUrls = result.images.map(img => img.imageUrl);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...imageUrls],
        }));
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setErrors({ images: "Failed to upload images. Please try again." });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = async index => {
    const imageToRemove = formData.images[index];

    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    // Optionally delete from Cloudinary if you have the publicId
    // You would need to store the publicId along with the URL
    // For now, we'll just remove it from the local state
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const addTag = tag => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }));
    }
    setNewTag("");
  };

  const removeTag = index => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSpecChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value,
      },
    }));
  };

  if (isEdit && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bubblegum"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-blush via-lavender-mist/30 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-bubblegum hover:text-bubblegum/80 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </button>
          <h1 className="text-4xl md:text-5xl font-heading text-dark-slate mb-2">
            {isEdit ? "Edit" : "Add New"} Product
            <span className="text-bubblegum"> ✨</span>
          </h1>
          <p className="text-dark-slate/70">
            {isEdit
              ? "Update product information"
              : "Create a new kawaii product"}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 rounded-kawaii p-6 shadow-kawaii-soft"
          >
            <h2 className="text-2xl font-heading text-dark-slate mb-6 flex items-center gap-2">
              <Package className="w-6 h-6" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-slate mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => handleInputChange("name", e.target.value)}
                  className={`w-full px-4 py-3 bg-white/80 border rounded-kawaii focus:outline-none focus:ring-2 focus:ring-bubblegum ${
                    errors.name ? "border-red-500" : "border-white/50"
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-slate mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={e => handleInputChange("category", e.target.value)}
                  className={`w-full px-4 py-3 bg-white/80 border rounded-kawaii focus:outline-none focus:ring-2 focus:ring-bubblegum ${
                    errors.category ? "border-red-500" : "border-white/50"
                  }`}
                >
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-slate mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => handleInputChange("price", e.target.value)}
                  className={`w-full px-4 py-3 bg-white/80 border rounded-kawaii focus:outline-none focus:ring-2 focus:ring-bubblegum ${
                    errors.price ? "border-red-500" : "border-white/50"
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-slate mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={e => handleInputChange("stock", e.target.value)}
                  className={`w-full px-4 py-3 bg-white/80 border rounded-kawaii focus:outline-none focus:ring-2 focus:ring-bubblegum ${
                    errors.stock ? "border-red-500" : "border-white/50"
                  }`}
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-dark-slate mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={e => handleInputChange("description", e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 bg-white/80 border rounded-kawaii focus:outline-none focus:ring-2 focus:ring-bubblegum ${
                  errors.description ? "border-red-500" : "border-white/50"
                }`}
                placeholder="Describe your kawaii product..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/50 rounded-kawaii p-6 shadow-kawaii-soft"
          >
            <h2 className="text-2xl font-heading text-dark-slate mb-6 flex items-center gap-2">
              <Image className="w-6 h-6" />
              Product Images *
            </h2>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Upload Area */}
            <div
              onClick={handleFileSelect}
              className={`border-2 border-dashed rounded-kawaii p-8 text-center cursor-pointer transition-colors ${
                isUploading
                  ? "border-bubblegum/50 bg-bubblegum/5"
                  : "border-white/50 hover:border-bubblegum/50 hover:bg-bubblegum/5"
              }`}
            >
              {isUploading ? (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bubblegum mx-auto"></div>
                  <p className="text-dark-slate/70">
                    Uploading images... {uploadProgress}%
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-bubblegum/70 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-dark-slate">
                      Click to upload images
                    </p>
                    <p className="text-sm text-dark-slate/70">
                      or drag and drop your images here
                    </p>
                    <p className="text-xs text-dark-slate/50 mt-2">
                      PNG, JPG, GIF up to 5MB each
                    </p>
                  </div>
                </div>
              )}
            </div>

            {errors.images && (
              <p className="text-red-500 text-sm mt-2">{errors.images}</p>
            )}

            {/* Uploaded Images Grid */}
            {formData.images.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-dark-slate mb-3">
                  Uploaded Images ({formData.images.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-kawaii"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-bubblegum text-white text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Specifications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/50 rounded-kawaii p-6 shadow-kawaii-soft"
          >
            <h2 className="text-2xl font-heading text-dark-slate mb-6">
              Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-slate mb-2">
                  Material
                </label>
                <input
                  type="text"
                  value={formData.specifications.material}
                  onChange={e => handleSpecChange("material", e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-white/50 rounded-kawaii focus:outline-none focus:ring-2 focus:ring-bubblegum"
                  placeholder="e.g., Cotton, Plastic"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-slate mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={formData.specifications.dimensions}
                  onChange={e => handleSpecChange("dimensions", e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-white/50 rounded-kawaii focus:outline-none focus:ring-2 focus:ring-bubblegum"
                  placeholder="e.g., 10cm x 15cm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-slate mb-2">
                  Weight
                </label>
                <input
                  type="text"
                  value={formData.specifications.weight}
                  onChange={e => handleSpecChange("weight", e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-white/50 rounded-kawaii focus:outline-none focus:ring-2 focus:ring-bubblegum"
                  placeholder="e.g., 200g"
                />
              </div>
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/50 rounded-kawaii p-6 shadow-kawaii-soft"
          >
            <h2 className="text-2xl font-heading text-dark-slate mb-6 flex items-center gap-2">
              <Tag className="w-6 h-6" />
              Tags
            </h2>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyPress={e => e.key === "Enter" && addTag(newTag)}
                  className="flex-1 px-4 py-3 bg-white/80 border border-white/50 rounded-kawaii focus:outline-none focus:ring-2 focus:ring-bubblegum"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={() => addTag(newTag)}
                  className="px-6 py-3 bg-bubblegum text-white rounded-kawaii hover:bg-bubblegum/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Predefined Tags */}
              <div>
                <p className="text-sm text-dark-slate/70 mb-2">Quick add:</p>
                <div className="flex flex-wrap gap-2">
                  {predefinedTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="px-3 py-1 text-sm bg-bubblegum/10 text-bubblegum rounded-full hover:bg-bubblegum hover:text-white transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Tags */}
              {formData.tags.length > 0 && (
                <div>
                  <p className="text-sm text-dark-slate/70 mb-2">
                    Selected tags:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-bubblegum text-white text-sm rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="hover:bg-white/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Special Options */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/50 rounded-kawaii p-6 shadow-kawaii-soft"
          >
            <h2 className="text-2xl font-heading text-dark-slate mb-6 flex items-center gap-2">
              <Gift className="w-6 h-6" />
              Special Options
            </h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBlindBox}
                  onChange={e =>
                    handleInputChange("isBlindBox", e.target.checked)
                  }
                  className="w-5 h-5 text-bubblegum border-white/50 rounded focus:ring-bubblegum"
                />
                <div>
                  <span className="font-medium text-dark-slate">
                    Blind Box (Mystery Item)
                  </span>
                  <p className="text-sm text-dark-slate/70">
                    This will be treated as a mystery item for customers
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer bg-white/50 p-3 rounded-lg border border-white/50">
                <input
                  type="checkbox"
                  checked={formData.isViral}
                  onChange={e => handleInputChange("isViral", e.target.checked)}
                  className="w-5 h-5 text-bubblegum focus:ring-bubblegum rounded"
                />
                <div>
                  <span className="font-medium text-dark-slate flex items-center gap-2">
                    <Star size={16} className="text-electric-teal" /> Viral Now
                  </span>
                  <p className="text-xs text-dark-slate/70">
                    Appears in the homepage trending section
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer bg-white/50 p-3 rounded-lg border border-white/50">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={e =>
                    handleInputChange("featured", e.target.checked)
                  }
                  className="w-5 h-5 text-bubblegum focus:ring-bubblegum rounded"
                />
                <div>
                  <span className="font-medium text-dark-slate flex items-center gap-2">
                    <Star size={16} className="text-sunshine" /> Featured
                    Product
                  </span>
                  <p className="text-xs text-dark-slate/70">
                    Highlighted in featured lists
                  </p>
                </div>
              </label>

              <div>
                <label className="block text-sm font-medium text-dark-slate mb-2">
                  3D Model URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.modelUrl}
                  onChange={e => handleInputChange("modelUrl", e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-white/50 rounded-kawaii focus:outline-none focus:ring-2 focus:ring-bubblegum"
                  placeholder="https://example.com/model.glb"
                />
                <p className="text-sm text-dark-slate/70 mt-1">
                  URL to 3D model file (GLB/GLTF format) for 360° viewing
                </p>
              </div>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 justify-end"
          >
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="px-8 py-3 bg-white/80 text-dark-slate rounded-kawaii hover:bg-white/90 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || isAdminLoading || isUploading}
              className="px-8 py-3 bg-gradient-to-r from-bubblegum to-electric-teal text-white rounded-kawaii hover:from-bubblegum/90 hover:to-electric-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading || isAdminLoading || isUploading
                ? "Saving..."
                : isEdit
                ? "Update Product"
                : "Create Product"}
            </button>
          </motion.div>

          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-kawaii p-4"
            >
              <p className="text-red-600">{errors.submit}</p>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
