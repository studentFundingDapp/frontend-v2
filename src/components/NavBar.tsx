// src/components/NavBar.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import { FaBook, FaHome, FaInfoCircle, FaUser, FaUsers } from "react-icons/fa"; // Import icons
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <motion.header
      className="bg-gray-900 text-white p-5 shadow-md w-full fixed top-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Branding */}
        <div className="flex items-center space-x-3">
        <Link to="/" className="font-extrabold text-3xl text-blue-500">
          DSFS
        </Link>
        <div className="h-8 w-1 bg-yellow-500"></div>
        <div className="text-sm text-gray-400 leading-tight">
          Decentralised Student <br /> Funding System
        </div>
      </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="flex items-center text-gray-300 hover:text-blue-500 transition duration-300"
          >
            <FaHome className="mr-2" /> Home
          </Link>
          <Link
            to="/posts"
            className="flex items-center text-gray-300 hover:text-blue-500 transition duration-300"
          >
            <FaBook className="mr-2" /> Posts
          </Link>
          <Link
            to="/funders"
            className="flex items-center text-gray-300 hover:text-blue-500 transition duration-300"
          >
            <FaUsers className="mr-2" /> Funders
          </Link>
          <Link
            to="/about"
            className="flex items-center text-gray-300 hover:text-blue-500 transition duration-300"
          >
            <FaInfoCircle className="mr-2" /> About
          </Link>
          <Link
            to="/profile"
            className="flex items-center text-gray-300 hover:text-blue-500 transition duration-300"
          >
            <FaUser className="mr-2" /> Profile
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-300">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden bg-gray-800 p-5 absolute top-full left-0 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/"
            className="flex items-center text-gray-300 hover:text-blue-500 py-2"
            onClick={toggleMobileMenu}
          >
            <FaHome className="mr-2" /> Home
          </Link>
          <Link
            to="/posts"
            className="flex items-center text-gray-300 hover:text-blue-500 py-2"
            onClick={toggleMobileMenu}
          >
            <FaBook className="mr-2" /> Posts
          </Link>
          <Link
            to="/funders"
            className="flex items-center text-gray-300 hover:text-blue-500 py-2"
            onClick={toggleMobileMenu}
          >
            <FaUsers className="mr-2" /> Funders
          </Link>
          <Link
            to="/about"
            className="flex items-center text-gray-300 hover:text-blue-500 py-2"
            onClick={toggleMobileMenu}
          >
            <FaInfoCircle className="mr-2" /> About
          </Link>
          <Link
            to="/profile"
            className="flex items-center text-gray-300 hover:text-blue-500 py-2"
            onClick={toggleMobileMenu}
          >
            <FaUser className="mr-2" /> Profile
          </Link>
        </motion.div>
      )}
    </motion.header>
  );
};

export default NavBar;
