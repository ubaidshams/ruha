const express = require("express");
const router = express.Router();
const { auth, adminAuth } = require("../middleware/auth");
const Category = require("../models/Category");

// GET /api/categories - Fetch all active categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
});

// POST /api/categories - Create new category (Admin only)
router.post("/", [auth, adminAuth], async (req, res) => {
  try {
    const { name, slug, icon, description, color, order } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Check if category with same name or slug already exists
    const existingCategory = await Category.findOne({
      $or: [
        { name: name.trim() },
        {
          slug:
            slug ||
            name
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-"),
        },
      ],
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name or slug already exists",
      });
    }

    const category = new Category({
      name: name.trim(),
      slug:
        slug ||
        name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-"),
      icon: icon || "📦",
      description: description || "",
      color: color || "from-blue-400 to-cyan-400",
      order: order || 0,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
});

// PUT /api/categories/:id - Update category (Admin only)
router.put("/:id", [auth, adminAuth], async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, icon, description, color, order, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check for duplicate name/slug if being updated
    if (name || slug) {
      const duplicateCategory = await Category.findOne({
        _id: { $ne: id },
        $or: [
          { name: name?.trim() || category.name },
          { slug: slug || category.slug },
        ],
      });

      if (duplicateCategory) {
        return res.status(400).json({
          success: false,
          message: "Category with this name or slug already exists",
        });
      }
    }

    // Update fields
    if (name) category.name = name.trim();
    if (slug) category.slug = slug;
    if (icon) category.icon = icon;
    if (description !== undefined) category.description = description;
    if (color) category.color = color;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
});

// DELETE /api/categories/:id - Delete category (Admin only)
router.delete("/:id", [auth, adminAuth], async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await Category.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
});

// GET /api/categories/all - Fetch all categories (including inactive) for admin
router.get("/all", [auth, adminAuth], async (req, res) => {
  try {
    const categories = await Category.find({})
      .sort({ order: 1, name: 1 })
      .lean();

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error fetching all categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
});

module.exports = router;
