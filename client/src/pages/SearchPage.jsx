import React from "react";
import { motion } from "framer-motion";

const SearchPage = () => {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-heading text-center mb-8 text-gradient"
        >
          🔍 Search Kawaii Treasures
        </motion.h1>

        <div className="card-kawaii text-center">
          <div className="text-6xl mb-4">🔍✨</div>
          <h3 className="text-2xl font-heading mb-4">
            Advanced Search Coming Soon!
          </h3>
          <p className="text-dark-slate/70">
            Find the perfect kawaii items with our magical search feature.
            Filter by mood, category, price, and even kawaii level!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
