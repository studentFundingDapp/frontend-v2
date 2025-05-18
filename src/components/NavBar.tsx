import { motion } from "framer-motion";
import { FileText, Home, Info, Menu, User, Users, X } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ThemeToggle } from "../context/ThemeProvider";
import { useIsMobile } from "../hooks/use-mobile";

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    if (isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.header
      className="sticky top-0 z-30 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Tagline */}
          <div className="flex items-center space-x-3">
            <NavLink
              to="/"
              className="flex-shrink-0 font-bold text-xl text-blue-700 dark:text-blue-400"
              onClick={closeMobileMenu}
            >
              DSFS
            </NavLink>
            <div className="hidden md:block h-8 w-1 bg-yellow-500"></div>
            <div className="hidden md:block text-sm text-gray-400 leading-tight">
              Decentralised Student <br /> Funding System
            </div>
          </div>

          {/* Mobile Logo and Tagline Centered */}
          <div className="md:hidden flex flex-col items-center">
            <NavLink
              to="/"
              className="font-bold text-xs text-blue-700 dark:text-blue-400"
              onClick={closeMobileMenu}
            >
              Decentralized Student
            </NavLink>
            <p className="text-xs text-gray-400">Funding System</p>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `relative flex items-center text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive ? "text-blue-600 dark:text-blue-400 underline" : ""
                }`
              }
              onClick={closeMobileMenu}
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `relative flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive ? "text-blue-600 dark:text-blue-400 underline" : ""
                }`
              }
              onClick={closeMobileMenu}
            >
              <FileText className="h-4 w-4 mr-2" />
              Projects
            </NavLink>
            <NavLink
              to="/donations"
              className={({ isActive }) =>
                `relative flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive ? "text-blue-600 dark:text-blue-400 underline" : ""
                }`
              }
              onClick={closeMobileMenu}
            >
              <Users className="h-4 w-4 mr-2" />
              Donations
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `relative flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive ? "text-blue-600 dark:text-blue-400 underline" : ""
                }`
              }
              onClick={closeMobileMenu}
            >
              <Info className="h-4 w-4 mr-2" />
              About
            </NavLink>
            {/* Profile Icon */}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `relative flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive ? "text-blue-600 dark:text-blue-400 underline" : ""
                }`
              }
              onClick={closeMobileMenu}
            >
              <User className="h-6 w-6 mr-2" />
              Profile
            </NavLink>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
            {/* Profile Icon */}
            <NavLink
              to="/profile"
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              onClick={closeMobileMenu}
            >
              <User className="h-6 w-6" />
            </NavLink>

            <button
              onClick={toggleMobileMenu}
              className="text-gray-500 dark:text-gray-400"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-2 space-y-2 bg-white dark:bg-gray-900 rounded-lg shadow-md p-4"
          >
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive ? "text-blue-600 dark:text-blue-400 underline" : ""
                }`
              }
              onClick={closeMobileMenu}
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive ? "text-blue-600 dark:text-blue-400 underline" : ""
                }`
              }
              onClick={closeMobileMenu}
            >
              <FileText className="h-4 w-4 mr-2" />
              Projects
            </NavLink>
            <NavLink
              to="/donations"
              className={({ isActive }) =>
                `flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive ? "text-blue-600 dark:text-blue-400 underline" : ""
                }`
              }
              onClick={closeMobileMenu}
            >
              <Users className="h-4 w-4 mr-2" />
              Donations
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive ? "text-blue-600 dark:text-blue-400 underline" : ""
                }`
              }
              onClick={closeMobileMenu}
            >
              <Info className="h-4 w-4 mr-2" />
              About
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive ? "text-blue-600 dark:text-blue-400 underline" : ""
                }`
              }
              onClick={closeMobileMenu}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </NavLink>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default NavBar;
