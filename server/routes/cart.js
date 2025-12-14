const express = require("express");
const { body, validationResult } = require("express-validator");
const { auth } = require("../middleware/auth");
const User = require("../models/User");
const Product = require("../models/Product");

const router = express.Router();

// Get cart for authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("cart.product")
      .select("cart");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ cart: user.cart });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add item to cart
router.post(
  "/add",
  [
    auth,
    body("productId").notEmpty().withMessage("Product ID is required"),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
    body("customization").optional().isObject(),
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

      const { productId, quantity, customization } = req.body;

      // Check if product exists and has enough stock
      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Only ${product.stock} items left in stock`,
        });
      }

      const user = await User.findById(req.user._id);

      // Find existing cart item
      const existingItemIndex = user.cart.findIndex(
        item =>
          item.product.toString() === productId &&
          JSON.stringify(item.customization) === JSON.stringify(customization)
      );

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        const newQuantity = user.cart[existingItemIndex].quantity + quantity;

        if (newQuantity > product.stock) {
          return res.status(400).json({
            message: `Cannot add more items. Only ${product.stock} items left in stock`,
          });
        }

        user.cart[existingItemIndex].quantity = newQuantity;
      } else {
        // Add new item to cart
        user.cart.push({
          product: productId,
          quantity,
          customization: customization || {},
        });
      }

      await user.save();
      await user.populate("cart.product");

      res.json({
        message: "Item added to cart successfully",
        cart: user.cart,
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update cart item quantity
router.put(
  "/update/:productId",
  [
    auth,
    body("quantity")
      .isInt({ min: 0 })
      .withMessage("Quantity must be non-negative"),
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

      const { productId } = req.params;
      const { quantity, customization } = req.body;

      const user = await User.findById(req.user._id);

      const cartItemIndex = user.cart.findIndex(item => {
        return (
          item.product.toString() === productId &&
          JSON.stringify(item.customization || {}) ===
            JSON.stringify(customization || {})
        );
      });

      if (cartItemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart" });
      }

      if (quantity === 0) {
        // Remove item if quantity is 0
        user.cart.splice(cartItemIndex, 1);
      } else {
        // Check stock availability
        const product = await Product.findById(productId);
        if (!product || product.stock < quantity) {
          return res.status(400).json({
            message: `Only ${product?.stock || 0} items left in stock`,
          });
        }

        user.cart[cartItemIndex].quantity = quantity;
      }

      await user.save();
      await user.populate("cart.product");

      res.json({
        message: "Cart updated successfully",
        cart: user.cart,
      });
    } catch (error) {
      console.error("Update cart error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Remove item from cart
router.delete(
  "/remove/:productId",
  [auth, body("customization").optional().isObject()],
  async (req, res) => {
    try {
      const { productId } = req.params;
      const { customization } = req.body;

      const user = await User.findById(req.user._id);

      const cartItemIndex = user.cart.findIndex(item => {
        return (
          item.product.toString() === productId &&
          JSON.stringify(item.customization || {}) ===
            JSON.stringify(customization || {})
        );
      });

      if (cartItemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart" });
      }

      user.cart.splice(cartItemIndex, 1);
      await user.save();

      res.json({
        message: "Item removed from cart successfully",
        cart: user.cart,
      });
    } catch (error) {
      console.error("Remove from cart error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Clear entire cart
router.delete("/clear", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.json({
      message: "Cart cleared successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Merge guest cart with user cart
router.post("/merge", auth, async (req, res) => {
  try {
    const { guestCart } = req.body;

    if (!Array.isArray(guestCart)) {
      return res.status(400).json({ message: "Invalid guest cart format" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let merged = false;

    // Process each guest cart item
    for (const guestItem of guestCart) {
      const { productId, quantity, customization } = guestItem;

      // Validate product exists
      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        continue; // Skip invalid products
      }

      // Find existing cart item
      const existingItemIndex = user.cart.findIndex(
        item =>
          item.product.toString() === productId &&
          JSON.stringify(item.customization) ===
            JSON.stringify(customization || {})
      );

      if (existingItemIndex !== -1) {
        // Merge quantities if item exists
        const newQuantity = user.cart[existingItemIndex].quantity + quantity;

        // Check stock availability
        if (newQuantity <= product.stock) {
          user.cart[existingItemIndex].quantity = newQuantity;
          merged = true;
        }
      } else {
        // Add new item if stock available
        if (quantity <= product.stock) {
          user.cart.push({
            product: productId,
            quantity,
            customization: customization || {},
          });
          merged = true;
        }
      }
    }

    if (merged) {
      await user.save();
      await user.populate("cart.product");
    }

    res.json({
      message: merged ? "Cart merged successfully" : "No items to merge",
      cart: user.cart,
      merged,
    });
  } catch (error) {
    console.error("Merge cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get cart total
router.get("/total", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("cart.product")
      .select("cart");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let total = 0;
    let itemCount = 0;
    const items = user.cart.map(item => {
      const itemTotal = item.product.price * item.quantity;
      const customizationTotal =
        (item.customization?.charms || []).reduce(
          (sum, charm) => sum + (charm.price || 0),
          0
        ) * item.quantity;

      total += itemTotal + customizationTotal;
      itemCount += item.quantity;

      return {
        ...item.toObject(),
        itemTotal,
        customizationTotal,
      };
    });

    res.json({
      total,
      itemCount,
      items,
      shippingCost: total >= 999 ? 0 : 99, // Free shipping for orders over ₹999
      freeShippingThreshold: 999,
    });
  } catch (error) {
    console.error("Get cart total error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
