const express = require("express");

const { auth, adminAuth } = require("../middleware/auth");
const Order = require("../models/Order");
const Product = require("../models/Product");

const router = express.Router();

// Get sales analytics data
router.get("/sales", auth, adminAuth, async (req, res) => {
  try {
    const { range = "7d" } = req.query;

    let startDate;
    const now = new Date();

    // Calculate start date based on range
    switch (range) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "12m":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get orders within the date range
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: now },
      status: { $in: ["pending", "confirmed", "shipped", "delivered"] },
    }).populate("items.product");

    // Process data for chart
    const salesData = [];
    const dataMap = new Map();

    // Initialize data for each day in the range
    const currentDate = new Date(startDate);
    while (currentDate <= now) {
      const dateKey = currentDate.toISOString().split("T")[0];
      dataMap.set(dateKey, {
        date: dateKey,
        totalSales: 0,
        orderCount: 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Aggregate order data
    orders.forEach(order => {
      const dateKey = order.createdAt.toISOString().split("T")[0];
      const dayData = dataMap.get(dateKey);

      if (dayData) {
        dayData.totalSales += order.totalAmount || 0;
        dayData.orderCount += 1;
      }
    });

    // Convert map to array and sort by date
    const result = Array.from(dataMap.values()).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Calculate additional metrics
    const totalSales = result.reduce((sum, day) => sum + day.totalSales, 0);
    const totalOrders = result.reduce((sum, day) => sum + day.orderCount, 0);
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const conversionRate =
      totalOrders > 0 ? (totalOrders / Math.max(orders.length, 1)) * 100 : 0;

    res.json({
      data: result,
      summary: {
        totalSales,
        totalOrders,
        avgOrderValue,
        conversionRate: Math.round(conversionRate * 100) / 100,
      },
    });
  } catch (error) {
    console.error("Sales analytics error:", error);
    res.status(500).json({ message: "Failed to fetch sales data" });
  }
});

// Get product performance analytics
router.get("/products/performance", auth, adminAuth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
          orderCount: { $sum: 1 },
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
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit) },
    ]);

    res.json({
      topProducts: topProducts.map(item => ({
        productId: item._id,
        productName: item.product.name,
        totalQuantity: item.totalQuantity,
        totalRevenue: item.totalRevenue,
        orderCount: item.orderCount,
        avgPrice: item.totalRevenue / item.totalQuantity,
      })),
    });
  } catch (error) {
    console.error("Product performance error:", error);
    res.status(500).json({ message: "Failed to fetch product performance" });
  }
});

// Get inventory analytics
router.get("/inventory", auth, adminAuth, async (req, res) => {
  try {
    const inventoryStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          lowStockProducts: {
            $sum: { $cond: [{ $lte: ["$stock", 10] }, 1, 0] },
          },
          outOfStockProducts: {
            $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] },
          },
          totalInventoryValue: {
            $sum: { $multiply: ["$stock", "$price"] },
          },
          avgProductPrice: { $avg: "$price" },
        },
      },
    ]);

    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          productCount: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          avgPrice: { $avg: "$price" },
          totalValue: { $sum: { $multiply: ["$stock", "$price"] } },
        },
      },
      { $sort: { productCount: -1 } },
    ]);

    res.json({
      inventory: inventoryStats[0] || {
        totalProducts: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        totalInventoryValue: 0,
        avgProductPrice: 0,
      },
      categories: categoryStats,
    });
  } catch (error) {
    console.error("Inventory analytics error:", error);
    res.status(500).json({ message: "Failed to fetch inventory data" });
  }
});

module.exports = router;
