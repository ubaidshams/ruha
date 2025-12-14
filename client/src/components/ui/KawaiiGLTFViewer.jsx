import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { motion } from "framer-motion";

const KawaiiGLTFViewer = ({ url, className = "", fallbackImage }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const [loadingState, setLoadingState] = useState("loading");
  const [error, setError] = useState(null);

  // Function to handle external URLs with proxy
  const getProxyUrl = originalUrl => {
    if (!originalUrl) return originalUrl;

    // Check if URL is from external domains that need proxying
    const externalDomains = [
      "meshy.ai",
      "spline.design",
      "poly.pizza",
      "sketchfab.com",
    ];
    try {
      const urlObj = new URL(originalUrl);
      const isExternal = externalDomains.some(domain =>
        urlObj.hostname.includes(domain)
      );

      if (isExternal) {
        // Use server proxy to avoid CORS issues - point to backend server
        const backendUrl =
          window.location.hostname === "localhost"
            ? "http://localhost:5001"
            : window.location.origin.replace(":5173", ":5001");
        const proxyUrl = new URL("/api/proxy/3d-model.gltf", backendUrl);
        proxyUrl.searchParams.set("url", originalUrl);
        return proxyUrl.toString();
      }
    } catch (error) {
      console.warn("Invalid URL provided to GLTF viewer:", originalUrl);
    }

    // Return original URL for local/internal resources
    return originalUrl;
  };

  useEffect(() => {
    if (!mountRef.current || !url) return;

    setLoadingState("loading");
    setError(null);

    try {
      // 1. Setup Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xfff0f5); // Soft Blush background

      // 2. Setup Camera
      const camera = new THREE.PerspectiveCamera(
        45,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 0, 5);

      // 3. Setup Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
      renderer.shadowMap.enabled = true;
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // 4. Lighting (Kawaii Style)
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.position.set(5, 5, 5);
      dirLight.castShadow = true;
      scene.add(dirLight);

      // 5. Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.autoRotate = true;

      // 6. Load GLTF Model
      const loader = new GLTFLoader();

      const loadModel = modelUrl => {
        console.log("Loading GLTF from:", modelUrl);

        loader.load(
          modelUrl,
          gltf => {
            try {
              const model = gltf.scene;

              // Auto-center and scale model
              const box = new THREE.Box3().setFromObject(model);
              const center = box.getCenter(new THREE.Vector3());
              const size = box.getSize(new THREE.Vector3());

              // Reset center
              model.position.x += model.position.x - center.x;
              model.position.y += model.position.y - center.y;
              model.position.z += model.position.z - center.z;

              // Scale to fit view
              const maxDim = Math.max(size.x, size.y, size.z);
              const scale = 3 / maxDim;
              model.scale.set(scale, scale, scale);

              // Enable shadows
              model.traverse(child => {
                if (child.isMesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
                }
              });

              scene.add(model);
              setLoadingState("loaded");
              console.log("GLTF model loaded successfully");
            } catch (error) {
              console.error("Error processing GLTF model:", error);
              setError("Failed to process 3D model");
              setLoadingState("error");
            }
          },
          progress => {
            console.log(
              "Loading progress:",
              (progress.loaded / progress.total) * 100 + "%"
            );
          },
          error => {
            console.error("GLTF loading error:", error);

            // Detect HTML response error (likely authentication required)
            if (
              error.message.includes("Unexpected token '<'") ||
              error.message.includes("Unexpected token '<'") ||
              (error.target &&
                error.target.response &&
                typeof error.target.response === "string" &&
                error.target.response.includes("<!DOCTYPE"))
            ) {
              console.warn(
                "Detected HTML response - this URL likely requires authentication or is a web page, not a direct model file"
              );
              setError(
                "This 3D model requires authentication or is not directly accessible. Please contact support."
              );
            } else if (modelUrl.includes("/api/proxy/")) {
              // If proxy fails, try direct URL (but this will likely fail due to CORS)
              console.log("Proxy failed, trying direct URL...");
              const directUrl = url.split("?")[0]; // Remove proxy parameters
              loadModel(directUrl);
            } else {
              setError(`Failed to load 3D model: ${error.message}`);
            }
            setLoadingState("error");
          }
        );
      };

      // Start loading with proxy URL
      loadModel(getProxyUrl(url));

      // 7. Animation Loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // 8. Handle window resize
      const handleResize = () => {
        if (mountRef.current) {
          camera.aspect =
            mountRef.current.clientWidth / mountRef.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(
            mountRef.current.clientWidth,
            mountRef.current.clientHeight
          );
        }
      };

      window.addEventListener("resize", handleResize);

      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize);

        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }

        // Dispose of Three.js objects
        scene.traverse(object => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });

        renderer.dispose();
      };
    } catch (error) {
      console.error("Error initializing GLTF viewer:", error);
      setError("Failed to initialize 3D viewer");
      setLoadingState("error");
    }
  }, [url]);

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
          But don't worry, the product is still cute!
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full rounded-kawaii overflow-hidden ${className}`}
    >
      {loadingState === "loading" && <LoadingSpinner />}
      {loadingState === "error" && <ErrorFallback />}

      {/* Kawaii decoration for loaded state */}
      {loadingState === "loaded" && (
        <div className="absolute top-2 right-2 z-10">
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

      {/* Controls hint */}
      {loadingState === "loaded" && (
        <div className="absolute bottom-2 left-2 z-10">
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

export default KawaiiGLTFViewer;
