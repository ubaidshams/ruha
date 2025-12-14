const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const rateLimit = require("express-rate-limit");
const { Readable } = require("stream");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/ruha-ecommerce"
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Proxy route for external 3D models (solves CORS issues)
// For Spline models
app.get("/api/proxy/3d-model.splinecode", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "URL parameter is required" });
    }

    // Validate that URL is from allowed domains
    const allowedDomains = ["meshy.ai", "spline.design", "poly.pizza"];
    const urlObj = new URL(url);
    const isAllowed = allowedDomains.some(domain =>
      urlObj.hostname.includes(domain)
    );

    if (!isAllowed) {
      return res.status(403).json({ error: "Domain not allowed" });
    }

    // Fetch the 3D model file
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    // Set appropriate headers for 3D models
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    };

    // Forward Content-Type if present, otherwise default to octet-stream
    const contentType = response.headers.get("content-type");
    headers["Content-Type"] = contentType || "application/octet-stream";

    // specific fix for Spline: Ensure it looks like a binary stream
    if (!contentType) {
      headers["Content-Type"] = "application/octet-stream";
    }

    res.set(headers);

    // Pipe the response
    if (response.body) {
      Readable.fromWeb(response.body).pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    console.error("3D Model proxy error:", error);
    res.status(500).json({
      error: "Failed to proxy 3D model",
      details: error.message,
    });
  }
});

// For GLTF/GLB models
app.get("/api/proxy/3d-model.gltf", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "URL parameter is required" });
    }

    // Validate that URL is from allowed domains
    const allowedDomains = [
      "meshy.ai",
      "spline.design",
      "poly.pizza",
      "sketchfab.com",
    ];
    const urlObj = new URL(url);
    const isAllowed = allowedDomains.some(domain =>
      urlObj.hostname.includes(domain)
    );

    if (!isAllowed) {
      return res.status(403).json({ error: "Domain not allowed" });
    }

    // Fetch the 3D model file
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/octet-stream, model/gltf+json, */*",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      );
    }

    // Check if response is HTML (error pages)
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      const text = await response.text();
      console.error(
        "Received HTML instead of 3D model:",
        text.substring(0, 200)
      );
      throw new Error("Received HTML instead of 3D model data");
    }

    // Set appropriate headers for GLTF models
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    };

    // Forward Content-Type if present, otherwise detect from URL
    if (contentType) {
      headers["Content-Type"] = contentType;
    } else {
      // Detect content type from URL extension
      const pathname = urlObj.pathname.toLowerCase();
      if (pathname.endsWith(".gltf")) {
        headers["Content-Type"] = "model/gltf+json";
      } else if (pathname.endsWith(".glb")) {
        headers["Content-Type"] = "model/gltf-binary";
      } else {
        headers["Content-Type"] = "application/octet-stream";
      }
    }

    res.set(headers);

    // Pipe the response
    if (response.body) {
      Readable.fromWeb(response.body).pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    console.error("GLTF Model proxy error:", error);
    res.status(500).json({
      error: "Failed to proxy GLTF model",
      details: error.message,
    });
  }
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/users", require("./routes/users"));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
