const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String,
        required: true,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isBlindBox: {
      type: Boolean,
      default: false,
    },
    blindBoxContents: [
      {
        name: String,
        image: String,
        probability: Number, // Weight for random selection
      },
    ],
    model3dUrl: String, // URL for Spline 3D model
    variants: [
      {
        name: String, // e.g., "Color", "Size"
        options: [
          {
            name: String, // e.g., "Pink", "Blue"
            price: Number,
            stock: Number,
            image: String,
          },
        ],
      },
    ],
    specifications: {
      material: String,
      dimensions: String,
      weight: String,
      warranty: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },
    isViral: {
      type: Boolean,
      default: false,
    },

    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          required: true,
          maxlength: 1000,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        isApproved: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
productSchema.index({ category: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ isViral: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ name: "text", description: "text" }); // For text search

module.exports = mongoose.model("Product", productSchema);
