import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  User,
  Heart,
  Search,
  Menu,
  X,
  Sparkles,
  Package,
  LogOut,
} from "lucide-react";
import { logout } from "../../store/slices/authSlice";
import { toggleFilterOpen } from "../../store/slices/filterSlice";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { itemCount } = useSelector(state => state.cart);
  const { activeFiltersCount } = useSelector(state => state.filters);
  const { wishlist } = useSelector(state => state.user);

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: "Home", path: "/", icon: Sparkles },
    { name: "Sip", path: "/products/Sip", icon: null },
    { name: "Carry", path: "/products/Carry", icon: null },
    { name: "Play", path: "/products/Play", icon: null },
    { name: "Tech", path: "/products/Tech", icon: null },
    { name: "Glam", path: "/products/Glam", icon: null },
    { name: "Decor", path: "/products/Decor", icon: null },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-kawaii border-b border-white/20 shadow-kawaii-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-bubblegum to-electric-teal rounded-kawaii flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading text-2xl text-gradient hidden sm:block">
              Ruha
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-1 text-dark-slate hover:text-bubblegum transition-colors duration-200 font-medium"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center max-w-md mx-4 flex-1"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search kawaii products..."
                className="input-kawaii pr-12"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bubblegum hover:text-electric-teal transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Bag Builder Button */}
            <Link
              to="/bag-builder"
              className="hidden sm:flex items-center space-x-1 px-3 py-2 text-sm font-medium text-dark-slate hover:text-bubblegum transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>Build</span>
            </Link>

            {/* Filters Button */}
            <button
              onClick={() => dispatch(toggleFilterOpen())}
              className="relative hidden sm:flex items-center space-x-1 px-3 py-2 text-sm font-medium text-dark-slate hover:text-bubblegum transition-colors"
            >
              <Menu className="w-4 h-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-bubblegum text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="relative p-2 text-dark-slate hover:text-bubblegum transition-colors"
              >
                <Heart className="w-6 h-6" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-sunshine text-dark-slate text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-dark-slate hover:text-bubblegum transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-bubblegum text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/profile"
                    className="hidden sm:flex items-center space-x-2 p-2 rounded-kawaii hover:bg-white/50 transition-colors"
                  >
                    <User className="w-5 h-5 text-dark-slate" />
                    <span className="text-sm font-medium text-dark-slate">
                      {user?.username}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-dark-slate hover:text-bubblegum transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="hidden sm:block px-4 py-2 text-sm font-medium text-dark-slate hover:text-bubblegum transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:block btn-kawaii text-sm px-4 py-2"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-dark-slate hover:text-bubblegum transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search kawaii products..."
              className="input-kawaii pr-12"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bubblegum hover:text-electric-teal transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-kawaii border-t border-white/20"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 text-dark-slate hover:text-bubblegum transition-colors font-medium py-2"
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {!isAuthenticated && (
                <div className="pt-4 border-t border-white/20 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center py-2 text-dark-slate hover:text-bubblegum transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full btn-kawaii text-center py-2"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
