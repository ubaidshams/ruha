const express = require("express");
const { body, validationResult } = require("express-validator");
const { auth } = require("../middleware/auth");

const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const emailService = require("../services/emailService");

const router = express.Router();

// Create new order
router.post(
  "/",
  [
    auth,
    [
      body("items")
        .isArray({ min: 1 })
        .withMessage("Order must contain at least one item"),
      body("shipping.method")
        .isIn(["standard", "express", "same-day"])
        .withMessage("Invalid shipping method"),
      body("payment.method")
        .isIn(["card", "upi", "netbanking", "wallet"])
        .withMessage("Invalid payment method"),
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

      const { items, shipping, payment, isGift, giftMessage } = req.body;

      // Calculate total and validate products
      let total = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product || !product.isActive) {
          return res
            .status(404)
            .json({ message: `Product ${item.product} not found` });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for ${product.name}. Only ${product.stock} left.`,
          });
        }

        const itemTotal = product.price * item.quantity;
        const customizationTotal =
          (item.customization?.charms || []).reduce(
            (sum, charm) => sum + (charm.price || 0),
            0
          ) * item.quantity;

        total += itemTotal + customizationTotal;

        orderItems.push({
          product: item.product,
          quantity: item.quantity,
          price: product.price,
          customization: item.customization || {},
        });

        // Reduce stock
        product.stock -= item.quantity;
        await product.save();
      }

      // Add shipping cost
      const shippingCosts = { standard: 99, express: 199, "same-day": 299 };
      const shippingCost = total >= 999 ? 0 : shippingCosts[shipping.method];
      total += shippingCost;

      // Create order
      const order = new Order({
        user: req.user._id,
        items: orderItems,
        total,
        shipping: {
          ...shipping,
          cost: shippingCost,
        },
        payment: {
          ...payment,
          status: "pending",
        },
        isGift: isGift || false,
        giftMessage,
      });

      await order.save();

      // Add to user's order history
      await User.findByIdAndUpdate(req.user._id, {
        $push: { orderHistory: order._id },
      });

      // Clear user's cart
      await User.findByIdAndUpdate(req.user._id, {
        $set: { cart: [] },
      });

      await order.populate("items.product");

      // Send order confirmation email
      try {
        const user = await User.findById(req.user._id);
        await emailService.sendOrderConfirmation(order, user);
        console.log(`Order confirmation email sent for order ${order._id}`);
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);
        // Don't fail the order creation if email fails
      }

      res.status(201).json({
        message: "Order created successfully",
        order,
      });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get user's orders
router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single order
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel order
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Order cannot be cancelled at this stage" });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Blind box unboxing endpoint
router.post(
  "/blind-box/:productId/open",
  [
    auth,
    [
      body("quantity")
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage("Invalid quantity"),
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

      const { productId } = req.params;
      const { quantity = 1 } = req.body;

      const product = await Product.findOne({
        _id: productId,
        isBlindBox: true,
        isActive: true,
      });

      if (!product) {
        return res.status(404).json({ message: "Blind box product not found" });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Only ${product.stock} blind boxes left in stock`,
        });
      }

      // Random selection based on probabilities
      const randomItems = [];
      for (let i = 0; i < quantity; i++) {
        const random = Math.random();
        let cumulativeProbability = 0;

        for (const item of product.blindBoxContents) {
          cumulativeProbability += item.probability;
          if (random <= cumulativeProbability) {
            randomItems.push(item);
            break;
          }
        }
      }

      res.json({
        message: "Blind box opened successfully",
        items: randomItems,
        product: {
          id: product._id,
          name: product.name,
        },
      });
    } catch (error) {
      console.error("Blind box opening error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Admin: Get all orders
router.get("/admin/all", auth, async (req, res) => {
  try {
    // Check if user is admin (you might want to add role checking)
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: Update order status
router.put(
  "/:id/status",
  [
    auth,
    [
      body("status")
        .isIn(["pending", "processing", "shipped", "delivered", "cancelled"])
        .withMessage("Invalid status"),
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

      const { status } = req.body;

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).populate("items.product");

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Send email notification for status changes
      try {
        const user = await User.findById(order.user);
        if (status === "shipped") {
          await emailService.sendOrderShipped(order, user);
          console.log(`Order shipped email sent for order ${order._id}`);
        } else if (status === "delivered") {
          await emailService.sendOrderDelivered(order, user);
          console.log(`Order delivered email sent for order ${order._id}`);
        }
      } catch (emailError) {
        console.error("Failed to send status update email:", emailError);
        // Don't fail the status update if email fails
      }

      res.json({
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Admin: Get sales analytics
router.get("/admin/sales", auth, async (req, res) => {
  try {
    const { range = "7d" } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;

    switch (range) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Aggregate sales data by date
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $nin: ["cancelled"] }, // Exclude cancelled orders
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          totalSales: { $sum: "$total" },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: "$total" },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date ascending
      },
    ]);

    // Get top selling products
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $nin: ["cancelled"] },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productName: "$product.name",
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ]);

    // Get order status distribution
    const statusDistribution = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      salesData,
      topProducts,
      statusDistribution,
      summary: {
        totalRevenue: salesData.reduce((sum, day) => sum + day.totalSales, 0),
        totalOrders: salesData.reduce((sum, day) => sum + day.orderCount, 0),
        averageOrderValue:
          salesData.length > 0
            ? salesData.reduce((sum, day) => sum + day.averageOrderValue, 0) /
              salesData.length
            : 0,
      },
    });
  } catch (error) {
    console.error("Get sales analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
