import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import KawaiiCursor from "./components/ui/KawaiiCursor";

// Lazy load pages for better performance
const HomePage = React.lazy(() => import("./pages/HomePage"));
const ProductListingPage = React.lazy(() =>
  import("./pages/ProductListingPage")
);
const ProductDetailPage = React.lazy(() => import("./pages/ProductDetailPage"));
const BagBuilderPage = React.lazy(() => import("./pages/BagBuilderPage"));
const CartPage = React.lazy(() => import("./pages/CartPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const RegisterPage = React.lazy(() => import("./pages/RegisterPage"));
const CheckoutPage = React.lazy(() => import("./pages/CheckoutPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const WishlistPage = React.lazy(() => import("./pages/WishlistPage"));
const OrdersPage = React.lazy(() => import("./pages/OrdersPage"));
const SearchPage = React.lazy(() => import("./pages/SearchPage"));
const ModelTestPage = React.lazy(() => import("./pages/ModelTestPage"));

const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const ProductForm = React.lazy(() => import("./pages/ProductForm"));

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blush via-lavender/30 to-white">
        {/* Kawaii Cursor */}
        <KawaiiCursor />

        <Navbar />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListingPage />} />
                <Route
                  path="/products/:category"
                  element={<ProductListingPage />}
                />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/bag-builder" element={<BagBuilderPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/model-test" element={<ModelTestPage />} />

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/products/new"
                  element={
                    <AdminRoute>
                      <ProductForm />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/admin/products/:id"
                  element={
                    <AdminRoute>
                      <ProductForm />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/products/:id/edit"
                  element={
                    <AdminRoute>
                      <ProductForm />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <WishlistPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
