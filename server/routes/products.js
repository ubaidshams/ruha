const express = require("express");
const { body, query, param, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

// Get all products with filtering, sorting, and pagination
router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("category")
      .optional()
      .isIn(["Sip", "Carry", "Play", "Tech", "Glam", "Decor"]),
    query("minPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Minimum price must be positive"),
    query("maxPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Maximum price must be positive"),
    query("sort")
      .optional()
      .isIn([
        "price-asc",
        "price-desc",
        "name-asc",
        "name-desc",
        "newest",
        "featured",
      ]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const {
        page = 1,
        limit = 20,
        category,
        tags,
        search,
        minPrice,
        maxPrice,
        sort = "newest",
      } = req.query;

      // Build filter object
      const filter = { isActive: true };

      if (category) {
        filter.category = category;
      }

      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : tags.split(",");
        filter.tags = { $in: tagArray };
      }

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
      }

      if (search) {
        filter.$text = { $search: search };
      }

      // Build sort object
      let sortObj = {};
      switch (sort) {
        case "price-asc":
          sortObj = { price: 1 };
          break;
        case "price-desc":
          sortObj = { price: -1 };
          break;
        case "name-asc":
          sortObj = { name: 1 };
          break;
        case "name-desc":
          sortObj = { name: -1 };
          break;
        case "featured":
          sortObj = { featured: -1, createdAt: -1 };
          break;
        default: // newest
          sortObj = { createdAt: -1 };
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [products, total] = await Promise.all([
        Product.find(filter)
          .sort(sortObj)
          .skip(skip)
          .limit(parseInt(limit))
          .select("-blindBoxContents"), // Hide blind box contents from public
        Product.countDocuments(filter),
      ]);

      res.json({
        products,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          count: products.length,
          totalItems: total,
        },
      });
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get single product by ID
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid product ID format")],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Invalid product ID",
          errors: errors.array(),
        });
      }

      const product = await Product.findOne({
        _id: req.params.id,
        isActive: true,
      }).select("-blindBoxContents");

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ product });
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get blind box contents (admin only)
router.get(
  "/:id/contents",
  [
    auth,
    adminAuth,
    param("id").isMongoId().withMessage("Invalid product ID format"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Invalid product ID",
          errors: errors.array(),
        });
      }

      const product = await Product.findOne({
        _id: req.params.id,
        isBlindBox: true,
      });

      if (!product) {
        return res.status(404).json({ message: "Blind box product not found" });
      }

      res.json({ contents: product.blindBoxContents });
    } catch (error) {
      console.error("Get blind box contents error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Create product (admin only)
router.post(
  "/",
  [
    auth,
    adminAuth,
    [
      body("name").notEmpty().withMessage("Product name is required"),
      body("description")
        .notEmpty()
        .withMessage("Product description is required"),
      body("price").isFloat({ min: 0 }).withMessage("Price must be positive"),
      body("category")
        .isIn(["Sip", "Carry", "Play", "Tech", "Glam", "Decor"])
        .withMessage("Invalid category"),
      body("stock").isInt({ min: 0 }).withMessage("Stock must be non-negative"),
      body("images")
        .isArray({ min: 1 })
        .withMessage("At least one image is required"),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const product = new Product(req.body);
      await product.save();

      res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      console.error("Create product error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update product (admin only)
router.put(
  "/:id",
  [
    auth,
    adminAuth,
    param("id").isMongoId().withMessage("Invalid product ID format"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Invalid product ID",
          errors: errors.array(),
        });
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete product (admin only)
router.delete(
  "/:id",
  [
    auth,
    adminAuth,
    param("id").isMongoId().withMessage("Invalid product ID format"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Invalid product ID",
          errors: errors.array(),
        });
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get featured products
router.get("/featured/list", async (req, res) => {
  try {
    const products = await Product.find({
      featured: true,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .select("-blindBoxContents");

    res.json({ products });
  } catch (error) {
    console.error("Get featured products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Search products
router.get(
  "/search/query",
  [query("q").notEmpty().withMessage("Search query is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { q: query } = req.query;

      const products = await Product.find({
        $text: { $search: query },
        isActive: true,
      })
        .select("-blindBoxContents")
        .limit(20);

      res.json({ products, query });
    } catch (error) {
      console.error("Search products error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all products for admin (including inactive)
router.get("/admin/all", [auth, adminAuth], async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .select("+blindBoxContents"); // Include blind box contents for admin

    res.json({ products });
  } catch (error) {
    console.error("Get admin products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get product statistics for admin dashboard
router.get("/admin/stats", [auth, adminAuth], async (req, res) => {
  try {
    const [
      totalProducts,
      lowStockProducts,
      activeProducts,
      inactiveProducts,
      totalStockValue,
    ] = await Promise.all([
      Product.countDocuments({}),
      Product.find({ stock: { $lte: 10 }, stock: { $gt: 0 } }).countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: false }),
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            total: { $sum: { $multiply: ["$price", "$stock"] } },
          },
        },
      ]),
    ]);

    res.json({
      totalProducts,
      lowStockProducts,
      activeProducts,
      inactiveProducts,
      totalStockValue: totalStockValue[0]?.total || 0,
    });
  } catch (error) {
    console.error("Get product stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a review to a product
router.post(
  "/:id/reviews",
  [
    auth,
    param("id").isMongoId().withMessage("Invalid product ID format"),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment")
      .notEmpty()
      .withMessage("Comment is required")
      .isLength({ max: 1000 })
      .withMessage("Comment must be less than 1000 characters"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { rating, comment } = req.body;
      const userId = req.user.id; // From auth middleware

      // Find the product
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Check if user already reviewed this product
      const existingReview = product.reviews.find(
        review => review.user.toString() === userId
      );

      if (existingReview) {
        return res.status(400).json({
          message: "You have already reviewed this product",
        });
      }

      // Add the review
      const newReview = {
        user: userId,
        rating,
        comment,
        createdAt: new Date(),
        isApproved: true, // Auto-approve for now
      };

      product.reviews.push(newReview);

      // Recalculate average rating
      const totalRating = product.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      product.rating.average = totalRating / product.reviews.length;
      product.rating.count = product.reviews.length;

      await product.save();

      // Populate user information for the response
      await product.populate("reviews.user", "username email");

      res.status(201).json({
        message: "Review added successfully",
        review: newReview,
        rating: product.rating,
      });
    } catch (error) {
      console.error("Add review error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete a review (admin only)
router.delete(
  "/:id/reviews/:reviewId",
  [
    auth,
    adminAuth,
    param("id").isMongoId().withMessage("Invalid product ID format"),
    param("reviewId").isMongoId().withMessage("Invalid review ID format"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      // Find the product
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Find and remove the review
      const reviewIndex = product.reviews.findIndex(
        review => review._id.toString() === req.params.reviewId
      );

      if (reviewIndex === -1) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Remove the review
      product.reviews.splice(reviewIndex, 1);

      // Recalculate average rating
      if (product.reviews.length > 0) {
        const totalRating = product.reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        product.rating.average = totalRating / product.reviews.length;
      } else {
        product.rating.average = 0;
      }
      product.rating.count = product.reviews.length;

      await product.save();

      res.json({
        message: "Review deleted successfully",
        rating: product.rating,
      });
    } catch (error) {
      console.error("Delete review error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
