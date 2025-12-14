import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Heart,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
} from "lucide-react";
import RuhaLogo from "../ui/RuhaLogo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Story", href: "/story" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Returns", href: "/returns" },
      { name: "Size Guide", href: "/size-guide" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Accessibility", href: "/accessibility" },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/ruha", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com/ruha", label: "Twitter" },
    { icon: Facebook, href: "https://facebook.com/ruha", label: "Facebook" },
    { icon: Youtube, href: "https://youtube.com/ruha", label: "YouTube" },
  ];

  return (
    <footer className="bg-gradient-to-br from-dark-slate to-slate-700 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-bubblegum/20 to-electric-teal/20 rounded-kawaii p-8 mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-heading text-white mb-4">
              Stay in the Kawaii Loop
            </h3>
            <p className="text-white/80 mb-6">
              Get the latest drops, exclusive offers, and kawaii content
              delivered to your inbox!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-kawaii bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-bubblegum"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-kawaii whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <RuhaLogo />
              {/* <div className="w-10 h-10 bg-gradient-to-br from-bubblegum to-electric-teal rounded-kawaii flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading text-2xl text-gradient bg-gradient-to-r from-bubblegum to-electric-teal bg-clip-text text-transparent">
                Ruha
              </span> */}
            </Link>
            <p className="text-white/70 mb-6 leading-relaxed">
              Your ultimate destination for kawaii products that bring joy to
              everyday life. Where 3D magic meets shopping delight!
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/10 rounded-kawaii flex items-center justify-center text-white/70 hover:text-bubblegum hover:bg-bubblegum/20 transition-all duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-bubblegum transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map(link => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-bubblegum transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              Get in Touch
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/70">
                <Mail className="w-4 h-4 text-bubblegum" />
                <span className="text-sm">hello@ruha.com</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Phone className="w-4 h-4 text-bubblegum" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-3 text-white/70">
                <MapPin className="w-4 h-4 text-bubblegum mt-0.5" />
                <span className="text-sm">
                  123 Kawaii Street,
                  <br />
                  Bangalore, KA 560001
                </span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-xs text-white/60">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Secure payments</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Free shipping over ₹999</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>30-day returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="border-t border-white/20 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span>© {currentYear} Ruha. Made with</span>
              <Heart className="w-4 h-4 text-bubblegum" />
              <span>in India</span>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {footerLinks.legal.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-white/60 hover:text-bubblegum text-sm transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
