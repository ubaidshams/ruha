const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  customization: {
    charms: [
      {
        name: String,
        image: String,
        price: Number,
      },
    ],
    giftMessage: String,
    giftWrapping: {
      type: Boolean,
      default: false,
    },
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    shipping: {
      address: {
        name: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
      method: {
        type: String,
        enum: ["standard", "express", "same-day"],
        default: "standard",
      },
      cost: {
        type: Number,
        default: 0,
      },
      estimatedDays: {
        type: Number,
        default: 5,
      },
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    payment: {
      method: {
        type: String,
        enum: ["card", "upi", "netbanking", "wallet"],
        required: true,
      },
      transactionId: String,
      status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
      paidAt: Date,
    },
    isGift: {
      type: Boolean,
      default: false,
    },
    giftMessage: String,
    tracking: {
      number: String,
      carrier: String,
      url: String,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
