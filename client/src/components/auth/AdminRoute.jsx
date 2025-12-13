import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const { user, isLoading } = useSelector(state => state.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-blush via-lavender-mist/30 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bubblegum mx-auto mb-4"></div>
          <div className="text-dark-slate/70 font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  // Strict Role Check
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
