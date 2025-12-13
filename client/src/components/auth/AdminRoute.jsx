import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "../../store/slices/authSlice";

const AdminRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isLoading, isAuthenticated, token } = useSelector(
    state => state.auth
  );

  console.log("🚀 ~ AdminRoute ~ user:", user);
  console.log("🚀 ~ AdminRoute ~ isAuthenticated:", isAuthenticated);
  console.log("🚀 ~ AdminRoute ~ token:", token);

  // If we have a token but no user, try to fetch user data
  useEffect(() => {
    if (token && !user && !isLoading) {
      console.log(
        "🚀 AdminRoute: Token exists but no user, fetching user data..."
      );
      dispatch(getCurrentUser());
    }
  }, [token, user, isLoading, dispatch]);

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

  // Check if user exists and has admin role
  if (!user) {
    console.log("🚀 AdminRoute: No user data available");
    return <Navigate to="/" replace />;
  }

  if (user.role !== "admin") {
    console.log("🚀 AdminRoute: User is not admin, role:", user.role);
    return <Navigate to="/" replace />;
  }

  console.log("🚀 AdminRoute: Access granted for admin user");
  return children;
};

export default AdminRoute;
