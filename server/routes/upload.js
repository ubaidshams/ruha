const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { auth, adminAuth } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      file.originalname.toLowerCase().split(".").pop()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, GIF, WebP) are allowed"));
    }
  },
});

// Upload single image (admin only)
router.post(
  "/single",
  [auth, adminAuth, upload.single("image")],
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

      if (!req.file) {
        return res.status(400).json({
          message: "No image file provided",
        });
      }

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "auto",
              folder: "ruha-ecommerce/products",
              quality: "auto:good",
              fetch_format: "auto",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(req.file.buffer);
      });

      res.json({
        message: "Image uploaded successfully",
        imageUrl: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({
        message: "Failed to upload image",
        error: error.message,
      });
    }
  }
);

// Upload multiple images (admin only)
router.post(
  "/multiple",
  [
    auth,
    adminAuth,
    upload.array("images", 10), // Maximum 10 images
    body("count")
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage("Count must be between 1 and 10"),
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

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: "No image files provided",
        });
      }

      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "auto",
                folder: "ruha-ecommerce/products",
                quality: "auto:good",
                fetch_format: "auto",
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(file.buffer);
        });
      });

      const results = await Promise.all(uploadPromises);

      const uploadedImages = results.map(result => ({
        imageUrl: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      }));

      res.json({
        message: `${uploadedImages.length} images uploaded successfully`,
        images: uploadedImages,
      });
    } catch (error) {
      console.error("Multiple image upload error:", error);
      res.status(500).json({
        message: "Failed to upload images",
        error: error.message,
      });
    }
  }
);

// Delete image from Cloudinary (admin only)
router.delete("/image/:publicId", [auth, adminAuth], async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        message: "Public ID is required",
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      res.json({
        message: "Image deleted successfully",
        publicId,
      });
    } else {
      res.status(404).json({
        message: "Image not found or already deleted",
        publicId,
      });
    }
  } catch (error) {
    console.error("Image deletion error:", error);
    res.status(500).json({
      message: "Failed to delete image",
      error: error.message,
    });
  }
});

module.exports = router;
