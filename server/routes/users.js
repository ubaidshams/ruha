const express = require("express");
const { body, validationResult } = require("express-validator");
const { auth } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-passwordHash")
      .populate("wishlist", "name price images category")
      .populate("orderHistory", "total status createdAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put(
  "/profile",
  [
    auth,
    body("firstName")
      .optional()
      .isLength({ max: 50 })
      .withMessage("First name too long"),
    body("lastName")
      .optional()
      .isLength({ max: 50 })
      .withMessage("Last name too long"),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid phone number"),
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

      const { firstName, lastName, phone } = req.body;

      await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            "profile.firstName": firstName,
            "profile.lastName": lastName,
            "profile.phone": phone,
          },
        },
        { new: true }
      );

      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Server error during profile update" });
    }
  }
);

// Add to wishlist
router.post("/wishlist/:productId", auth, async (req, res) => {
  try {
    const { productId } = req.params;

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { wishlist: productId },
    });

    res.json({ message: "Added to wishlist successfully" });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove from wishlist
router.delete("/wishlist/:productId", auth, async (req, res) => {
  try {
    const { productId } = req.params;

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { wishlist: productId },
    });

    res.json({ message: "Removed from wishlist successfully" });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get wishlist
router.get("/wishlist", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add address
router.post(
  "/addresses",
  [
    auth,
    body("name").notEmpty().withMessage("Address name is required"),
    body("street").notEmpty().withMessage("Street is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("state").notEmpty().withMessage("State is required"),
    body("zipCode").notEmpty().withMessage("Zip code is required"),
    body("country").notEmpty().withMessage("Country is required"),
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

      const address = {
        ...req.body,
        isDefault: req.body.isDefault || false,
      };

      await User.findByIdAndUpdate(req.user._id, {
        $push: { addresses: address },
      });

      res.json({ message: "Address added successfully" });
    } catch (error) {
      console.error("Add address error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update address
router.put("/addresses/:addressId", auth, async (req, res) => {
  try {
    const { addressId } = req.params;

    await User.findOneAndUpdate(
      {
        _id: req.user._id,
        "addresses._id": addressId,
      },
      {
        $set: Object.keys(req.body).reduce((acc, key) => {
          acc[`addresses.$.${key}`] = req.body[key];
          return acc;
        }, {}),
      }
    );

    res.json({ message: "Address updated successfully" });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete address
router.delete("/addresses/:addressId", auth, async (req, res) => {
  try {
    const { addressId } = req.params;

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { addresses: { _id: addressId } },
    });

    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
