import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ZoomIn, ZoomOut, Eye, EyeOff } from "lucide-react";

// Import Google Model Viewer (web component)
import "@google/model-viewer";

const KawaiiGLTFViewer = ({
  url,
  className = "",
  fallbackImage,
  autoRotate = true,
  interactionPromptThreshold = 30000, // 30 seconds
  cameraControls = true,
  environmentImage = "neutral",
}) => {
  const modelViewerRef = useRef(null);
  const [loadingState, setLoadingState] = useState("loading");
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Handle model load events
  const handleLoad = () => {
    setLoadingState("loaded");
    setIsLoaded(true);
    setError(null);
  };

  const handleError = event => {
    console.error("Model Viewer Error:", event);
    setLoadingState("error");
    setError("Failed to load 3D model");
    setIsLoaded(false);
  };

  const handleLoadStart = () => {
    setLoadingState("loading");
  };

  // Handle AR button click (optional enhancement)
  const handleARClick = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.activateAR();
    }
  };

  // Reset camera to default position
  const resetCamera = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.cameraOrbit = "auto auto auto";
      modelViewerRef.current.cameraTarget = "auto auto auto";
    }
  };

  // Auto-show controls after load
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setShowControls(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

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
          Loading 3D Model...
        </div>
        <div className="text-dark-slate/50 text-xs mt-1">
          Please wait while we prepare your kawaii experience ✨
        </div>
      </motion.div>
    </div>
  );

  const ErrorFallback = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 rounded-kawaii border border-red-200">
      <div className="text-center p-4">
        <div className="text-4xl mb-2">😢</div>
        <div className="text-dark-slate/70 font-medium text-sm mb-2">
          3D Model Loading Failed
        </div>
        <div className="text-dark-slate/50 text-xs mb-3">
          {error || "Unable to load the 3D model"}
        </div>
        {fallbackImage && (
          <div className="mt-3">
            <img
              src={fallbackImage}
              alt="Product"
              className="w-32 h-32 object-cover rounded-kawaii mx-auto"
            />
          </div>
        )}
        <div className="text-dark-slate/40 text-xs mt-2">
          But don't worry, the product is still cute! 🥺
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 btn-outline-kawaii text-xs px-3 py-1"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const MobileClickToLoad = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bubblegum/5 to-lavender-mist/20 rounded-kawaii">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-6"
      >
        <div className="text-4xl mb-4">📱</div>
        <div className="text-dark-slate/70 font-medium text-sm mb-4">
          Tap to load 3D model
        </div>
        <div className="text-dark-slate/50 text-xs mb-4">
          Save your data and battery! ⚡
        </div>
        <button onClick={handleLoadStart} className="btn-kawaii px-6 py-2">
          Load 3D Model
        </button>
      </motion.div>
    </div>
  );

  return (
    <div
      className={`relative w-full h-full rounded-kawaii overflow-hidden ${className}`}
    >
      {/* Mobile Click-to-Load Button */}
      {loadingState === "initial" && <MobileClickToLoad />}

      {/* Loading State */}
      {loadingState === "loading" && <LoadingSpinner />}

      {/* Error State */}
      {loadingState === "error" && <ErrorFallback />}

      {/* Google Model Viewer Component */}
      <AnimatePresence>
        {(loadingState === "loaded" || loadingState === "loading") && url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <model-viewer
              ref={modelViewerRef}
              src={url}
              alt="3D Product Model"
              loading="eager"
              reveal="auto"
              camera-controls={cameraControls}
              auto-rotate={autoRotate}
              auto-rotate-delay={1000}
              rotation-per-second="30deg"
              interaction-prompt={loadingState === "loaded" ? "auto" : "none"}
              interaction-prompt-threshold={interactionPromptThreshold}
              shadow-intensity="1"
              shadow-softness="0.25"
              environment-image={environmentImage}
              exposure="1"
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
                borderRadius: "12px",
              }}
              onLoad={handleLoad}
              onError={handleError}
              onLoadStart={handleLoadStart}
            >
              {/* AR Button */}
              <button
                slot="ar-button"
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  border: "none",
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#ec4899",
                  position: "absolute",
                  bottom: "12px",
                  left: "12px",
                  zIndex: "10",
                  cursor: "pointer",
                  display: loadingState === "loaded" ? "block" : "none",
                }}
                onClick={handleARClick}
              >
                View in AR 📱
              </button>

              {/* Loading Progress Indicator */}
              <div
                slot="progress-bar"
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "4px",
                  backgroundColor: "#f3f4f6",
                  zIndex: "1",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    backgroundColor: "#ec4899",
                    transition: "width 0.3s",
                    width: "0%",
                  }}
                  className="progress-bar"
                ></div>
              </div>
            </model-viewer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kawaii decoration for loaded state */}
      {loadingState === "loaded" && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="absolute top-3 right-3 z-20"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <span className="text-lg">✨</span>
          </div>
        </motion.div>
      )}

      {/* Enhanced Controls */}
      <AnimatePresence>
        {showControls && loadingState === "loaded" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-3 left-3 z-20"
          >
            <div className="bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full flex items-center gap-2">
              <Eye className="w-3 h-3" />
              <span>Drag to rotate • Scroll to zoom</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Buttons */}
      <AnimatePresence>
        {showControls && loadingState === "loaded" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-3 left-3 z-20 flex gap-2"
          >
            <button
              onClick={resetCamera}
              className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg hover:bg-white transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4 text-dark-slate" />
            </button>
            <button
              onClick={() => setShowControls(false)}
              className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg hover:bg-white transition-colors"
              title="Hide Controls"
            >
              <EyeOff className="w-4 h-4 text-dark-slate" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for progress bar animation */}
      <style jsx>{`
        model-viewer:not([src]) .progress-bar {
          display: none;
        }
        model-viewer[src] .progress-bar {
          display: block;
        }
      `}</style>
    </div>
  );
};

export default KawaiiGLTFViewer;
