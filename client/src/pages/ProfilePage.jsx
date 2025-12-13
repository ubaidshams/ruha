import React from "react";
import { motion } from "framer-motion";

const ProfilePage = () => {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-heading text-center mb-8 text-gradient"
        >
          👤 Your Kawaii Profile
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-kawaii">
            <h3 className="text-xl font-heading mb-4">
              👤 Profile Information
            </h3>
            <p className="text-dark-slate/70">
              Personal details and preferences coming soon!
            </p>
          </div>

          <div className="card-kawaii">
            <h3 className="text-xl font-heading mb-4">⚙️ Account Settings</h3>
            <p className="text-dark-slate/70">
              Manage your kawaii preferences and notifications!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
