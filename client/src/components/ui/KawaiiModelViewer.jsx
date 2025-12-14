import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";
import { useDispatch, useSelector } from "react-redux";

import {
  setModelLoadingState,
  setModelLoaded,
  setModelError,
} from "../../store/slices/uiSlice";
import KawaiiGLTFViewer from "./KawaiiGLTFViewer"; // Import the new component

const KawaiiModelViewer = ({
  url,
  productId,
  className = "",
  autoRotate = true,
  showControls = true,
  scale = 1,
  onLoad,
  onError,
  fallbackImage,
  loadOnDemand = null, // null = auto-detect mobile, true = always demand load, false = immediate load
}) => {
  const dispatch = useDispatch();
  const { modelLoadingStates } = useSelector(state => state.ui);

  const [isInView, setIsInView] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoadRequested, setIsLoadRequested] = useState(false);

  const loadingState = modelLoadingStates[productId] || "loading";

  // Auto-detect mobile device or use explicit loadOnDemand setting
  const isMobile =
    loadOnDemand !== null
      ? loadOnDemand
      : /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
  const shouldDemandLoad = isMobile || loadOnDemand === true;

  // Check if URL is for Spline
  const isSplineUrl =
    url?.includes("spline.design") || url?.endsWith(".splinecode");

  // Function to handle external URLs with proxy
  const getProxyUrl = originalUrl => {
    if (!originalUrl) return originalUrl;

    // Check if URL is from external domains that need proxying
    const externalDomains = ["meshy.ai", "spline.design", "poly.pizza"];
    const urlObj = new URL(originalUrl);
    const isExternal = externalDomains.some(domain =>
      urlObj.hostname.includes(domain)
    );

    if (isExternal) {
      // Use server proxy to avoid CORS issues
      const proxyUrl = new URL(
        "/api/proxy/3d-model.splinecode",
        window.location.origin
      );
      proxyUrl.searchParams.set("url", originalUrl);
      return proxyUrl.toString();
    }

    // Return original URL for local/internal resources
    return originalUrl;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!url) return;

    // For demand-loaded content, only set up intersection observer
    if (shouldDemandLoad) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasStarted) {
            setIsInView(true);
            setHasStarted(true);
          }
        },
        { threshold: 0.1 }
      );

      const element = document.getElementById(`viewer-${productId}`);
      if (element) observer.observe(element);

      return () => observer.disconnect();
    }

    // For immediate loading, just set states
    if (!hasStarted) {
      setIsInView(true);
      setHasStarted(true);
    }
  }, [url, productId, hasStarted, shouldDemandLoad]);

  const handleLoad = spline => {
    if (!spline) return;

    dispatch(setModelLoaded(productId));
    dispatch(setModelLoadingState({ productId, status: "loaded" }));

    // Model loaded successfully - no API calls needed
    // Let Spline handle rotation with default settings

    if (onLoad) onLoad(spline);
  };

  const handleError = error => {
    console.warn("3D Model Loading Error:", error);

    // Check if it's a CORS error (most common with external 3D models)
    const isCORSError =
      error?.message?.includes("CORS") ||
      error?.message?.includes("Failed to fetch") ||
      error?.message?.includes("No Access-Control-Allow-Origin");

    if (isCORSError) {
      console.warn(`CORS error loading 3D model from external source: ${url}`);
      // Still mark as error but with more graceful handling
      dispatch(setModelError(productId));
      dispatch(setModelLoadingState({ productId, status: "error" }));
    } else {
      dispatch(setModelError(productId));
      dispatch(setModelLoadingState({ productId, status: "error" }));
    }

    if (onError) onError(error);
  };

  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bubblegum/5 to-lavender-mist/20 rounded-kawaii">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-bubblegum/20 border-t-bubblegum mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🌸</span>
          </div>
        </div>
        <div className="text-dark-slate/70 font-medium text-sm">
          Loading 3D Magic...
        </div>
      </motion.div>
    </div>
  );

  const ErrorFallback = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 rounded-kawaii border border-red-200">
      <div className="text-center p-4">
        <div className="text-4xl mb-2">😢</div>
        <div className="text-dark-slate/70 font-medium text-sm mb-2">
          Oops! 3D model couldn't load
        </div>
        <div className="text-dark-slate/50 text-xs">
          But don't worry, the product is still cute!
        </div>
      </div>
    </div>
  );

  const ClickToLoadOverlay = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bubblegum/10 to-lavender-mist/20 rounded-kawaii border-2 border-dashed border-bubblegum/30">
      <div className="text-center p-6">
        <div className="text-4xl mb-4">✨</div>
        <div className="text-dark-slate font-medium text-lg mb-2">
          View in 3D
        </div>
        <div className="text-dark-slate/70 text-sm mb-4">
          Tap to load 3D model and save battery
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsLoadRequested(true)}
          className="bg-bubblegum text-white px-6 py-3 rounded-kawaii font-medium shadow-kawaii-soft hover:shadow-kawaii-glow transition-all duration-300"
        >
          Load 3D Model
        </motion.button>
      </div>
    </div>
  );

  if (!url) {
    return (
      <div className={`relative ${className}`}>
        {fallbackImage ? (
          <img
            src={fallbackImage}
            alt="Product"
            className="w-full h-full object-cover rounded-kawaii"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-soft-blush/20 to-lavender-mist/10 rounded-kawaii flex items-center justify-center">
            <div className="text-2xl">🎀</div>
          </div>
        )}
      </div>
    );
  }

  // If it's not a Spline URL, render the GLTF viewer
  if (!isSplineUrl) {
    return <KawaiiGLTFViewer url={url} className={className} />;
  }

  return (
    <div
      id={`viewer-${productId}`}
      className={`relative overflow-hidden rounded-kawaii shadow-kawaii-glow ${className}`}
      style={{ transform: `scale(${scale})` }}
    >
      {/* Loading State */}
      {loadingState === "loading" && <LoadingSpinner />}

      {/* Error State */}
      {loadingState === "error" && <ErrorFallback />}

      {/* 3D Model - Only render when conditions are met */}
      {shouldDemandLoad ? (
        // For demand loading: show overlay until explicitly requested
        !isLoadRequested ? (
          <ClickToLoadOverlay />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <Spline
              scene={getProxyUrl(url)}
              className="w-full h-full"
              onLoad={handleLoad}
              onError={handleError}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "12px",
              }}
            />
          </motion.div>
        )
      ) : (
        // For immediate loading: render when in view and not error
        isInView &&
        loadingState !== "error" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <Spline
              scene={getProxyUrl(url)}
              className="w-full h-full"
              onLoad={handleLoad}
              onError={handleError}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "12px",
              }}
            />
          </motion.div>
        )
      )}

      {/* Kawaii Decoration */}
      {loadingState === "loaded" && (
        <div className="absolute top-2 right-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg"
          >
            <span className="text-lg">✨</span>
          </motion.div>
        </div>
      )}

      {/* Controls Hint */}
      {showControls && loadingState === "loaded" && (
        <div className="absolute bottom-2 left-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full"
          >
            Drag to rotate • Scroll to zoom
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default KawaiiModelViewer;
