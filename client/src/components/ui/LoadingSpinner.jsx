import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-blush via-lavender-mist/30 to-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Kawaii Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-bubblegum to-electric-teal rounded-kawaii flex items-center justify-center shadow-kawaii-soft"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-heading text-dark-slate mb-4"
        >
          Loading Kawaii Magic
        </motion.h2>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 bg-bubblegum rounded-full"
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-dark-slate/70 mt-4"
        >
          Please wait while we prepare your shopping experience...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
