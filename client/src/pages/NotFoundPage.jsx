import React, { useState } from "react";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = e => {
    setMousePosition({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      onMouseMove={handleMouseMove}
    >
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-9xl font-heading text-bubblegum mb-4">404</h1>
          <div className="text-6xl mb-6">🥺</div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-heading text-dark-slate mb-4"
        >
          Oopsie! Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-dark-slate/70 mb-8"
        >
          The page you're looking for seems to have wandered off to the kawaii
          realm. Don't worry, we'll help you find your way back!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="/" className="btn-kawaii text-center">
            🏠 Go Home
          </a>
          <button
            onClick={() => window.history.back()}
            className="btn-kawaii-secondary"
          >
            ← Go Back
          </button>
        </motion.div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {["✨", "🌟", "💫", "⭐", "🌈", "🎀"][i]}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
