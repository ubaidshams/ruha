import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, ExternalLink, AlertCircle } from "lucide-react";
import KawaiiGLTFViewer from "../components/ui/KawaiiGLTFViewer";
import KawaiiModelViewer from "../components/ui/KawaiiModelViewer";

const ModelTestPage = () => {
  const [testUrl, setTestUrl] = useState(
    "https://www.meshy.ai/3d-models/Goth-Tumbler-v2-019b18a9-9693-7abf-b9a8-8ba823861c32"
  );
  const [testType, setTestType] = useState("gltf");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const testCases = [
    {
      name: "Meshy.ai Model (Auth Required)",
      url: "https://www.meshy.ai/3d-models/Goth-Tumbler-v2-019b18a9-9693-7abf-b9a8-8ba823861c32",
      type: "gltf",
      expectedResult: "Should show authentication error",
    },
    {
      name: "Spline Model (Working)",
      url: "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode",
      type: "spline",
      expectedResult: "Should load successfully",
    },
    {
      name: "Local GLTF File",
      url: "/models/sample.gltf",
      type: "gltf",
      expectedResult: "Should work if file exists",
    },
  ];

  const handleUrlTest = () => {
    setTestUrl(testUrl);
  };

  const renderViewer = () => {
    if (testType === "spline") {
      return (
        <KawaiiModelViewer
          url={testUrl}
          productId="test-spline"
          className="w-full h-96"
          fallbackImage="https://via.placeholder.com/400x400/FFB6C1/FFFFFF?text=3D+Model"
        />
      );
    } else {
      return (
        <KawaiiGLTFViewer
          url={testUrl}
          className="w-full h-96"
          fallbackImage="https://via.placeholder.com/400x400/FFB6C1/FFFFFF?text=3D+Model"
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-blush via-lavender-mist/30 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-heading text-dark-slate mb-2">
            3D Model Test Page
          </h1>
          <p className="text-dark-slate/70">
            Debug and test 3D model loading functionality
          </p>
        </motion.div>

        {/* Test Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-kawaii rounded-kawaii p-6 shadow-kawaii-soft border border-white/50 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-dark-slate mb-2">
                Test URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={testUrl}
                  onChange={e => setTestUrl(e.target.value)}
                  className="flex-1 input-kawaii"
                  placeholder="Enter 3D model URL"
                />
                <button
                  onClick={handleUrlTest}
                  className="btn-kawaii px-4 py-2"
                >
                  Test
                </button>
              </div>
            </div>

            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-dark-slate mb-2">
                Model Type
              </label>
              <select
                value={testType}
                onChange={e => setTestType(e.target.value)}
                className="input-kawaii"
              >
                <option value="gltf">GLTF/GLB</option>
                <option value="spline">Spline</option>
              </select>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="mt-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-bubblegum hover:text-electric-teal flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              Advanced Debug Options
            </button>
          </div>

          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-4 bg-bubblegum/5 rounded-kawaii border border-bubblegum/20"
            >
              <h4 className="font-medium text-dark-slate mb-2">
                Debug Information
              </h4>
              <div className="text-sm text-dark-slate/70 space-y-1">
                <p>
                  <strong>Current URL:</strong> {testUrl}
                </p>
                <p>
                  <strong>Model Type:</strong> {testType}
                </p>
                <p>
                  <strong>Expected Proxy:</strong>{" "}
                  {testUrl.includes("meshy.ai") ||
                  testUrl.includes("spline.design")
                    ? "Yes"
                    : "No"}
                </p>
                <p>
                  <strong>Backend Proxy URL:</strong>{" "}
                  http://localhost:5001/api/proxy/3d-model.
                  {testType === "spline" ? "splinecode" : "gltf"}?url=
                  {encodeURIComponent(testUrl)}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Test Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-kawaii rounded-kawaii p-6 shadow-kawaii-soft border border-white/50 mb-6"
        >
          <h3 className="text-lg font-medium text-dark-slate mb-4">
            Quick Test Cases
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testCases.map((testCase, index) => (
              <div
                key={index}
                className="p-4 border border-white/50 rounded-kawaii hover:shadow-kawaii transition-all cursor-pointer"
                onClick={() => {
                  setTestUrl(testCase.url);
                  setTestType(testCase.type);
                }}
              >
                <h4 className="font-medium text-dark-slate mb-2">
                  {testCase.name}
                </h4>
                <p className="text-sm text-dark-slate/70 mb-2">
                  {testCase.expectedResult}
                </p>
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-bubblegum" />
                  <span className="text-xs text-dark-slate/50 truncate">
                    {testCase.url}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 3D Viewer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-kawaii rounded-kawaii p-6 shadow-kawaii-soft border border-white/50"
        >
          <h3 className="text-lg font-medium text-dark-slate mb-4">
            3D Model Viewer ({testType.toUpperCase()})
          </h3>

          <div className="relative">{renderViewer()}</div>

          {/* Console Output Simulation */}
          <div className="mt-4 p-4 bg-dark-slate/5 rounded-kawaii border border-dark-slate/20">
            <h4 className="font-medium text-dark-slate mb-2 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Console Debug Output
            </h4>
            <div className="text-xs font-mono text-dark-slate/70 space-y-1">
              <p>Loading 3D model from: {testUrl}</p>
              <p>Model type: {testType}</p>
              {testUrl.includes("meshy.ai") ||
              testUrl.includes("spline.design") ? (
                <p>
                  Using proxy: http://localhost:5001/api/proxy/3d-model.
                  {testType === "spline" ? "splinecode" : "gltf"}?url=
                  {encodeURIComponent(testUrl)}
                </p>
              ) : (
                <p>Using direct URL (no proxy needed)</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModelTestPage;
