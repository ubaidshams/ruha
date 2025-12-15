const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("mongo-sanitize");
const xss = require("xss-clean");

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
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "http://localhost:4173",
      "http://localhost:5175",
    ],
    credentials: true,
  })
);

// Security middleware
app.use((req, res, next) => {
  // Sanitize MongoDB queries
  req.body = mongoSanitize(req.body);
  req.query = mongoSanitize(req.query);
  req.params = mongoSanitize(req.params);
  next();
});

app.use(xss()); // Clean user input from XSS attacks

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

    // Validate that URL is from allowed domains (expanded list)
    const allowedDomains = [
      "meshy.ai",
      "spline.design",
      "poly.pizza",
      "github.com",
      "raw.githubusercontent.com",
      "sketchfab.com",
      "threejs.org",
    ];
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

// For GLTF/GLB models - Enhanced with better error handling
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

    // Enhanced fetch with authentication handling
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/octet-stream, model/gltf+json, */*",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      );
    }

    // Check if response is HTML (authentication required)
    const contentType = response.headers.get("content-type") || "";
    const contentLength = response.headers.get("content-length");

    if (contentType.includes("text/html")) {
      const text = await response.text();
      console.warn(
        "Received HTML instead of 3D model - likely authentication required:",
        text.substring(0, 200)
      );

      // Return a helpful error response instead of throwing
      return res.status(401).json({
        error: "Authentication Required",
        message:
          "This 3D model requires authentication or login to access. Please use a direct .gltf/.glb file URL or ensure the model is publicly accessible.",
        originalUrl: url,
        suggestion:
          "Try downloading the model and hosting it directly, or use a different model URL.",
      });
    }

    // For small responses that might still be HTML error pages
    if (contentLength && parseInt(contentLength) < 1000) {
      const text = await response.text();
      if (text.includes("<html") || text.includes("<!DOCTYPE")) {
        return res.status(401).json({
          error: "Authentication Required",
          message:
            "This 3D model requires authentication. Please use a direct file URL.",
          originalUrl: url,
        });
      }
      // If it's not HTML, re-parse as buffer
      const buffer = Buffer.from(text, "utf-8");
      return sendBufferResponse(buffer, urlObj, res);
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

// Helper function to send buffer responses
function sendBufferResponse(buffer, urlObj, res) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=3600",
  };

  // Detect content type from URL extension
  const pathname = urlObj.pathname.toLowerCase();
  if (pathname.endsWith(".gltf")) {
    headers["Content-Type"] = "model/gltf+json";
  } else if (pathname.endsWith(".glb")) {
    headers["Content-Type"] = "model/gltf-binary";
  } else {
    headers["Content-Type"] = "application/octet-stream";
  }

  res.set(headers);
  res.end(buffer);
}

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/users", require("./routes/users"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/admin", require("./routes/admin"));

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
