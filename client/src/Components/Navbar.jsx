import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaInfoCircle,
  FaBell,
  FaChevronDown,
  FaChevronUp,
  FaUserGraduate,
  FaUserPlus,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";
import Logo from '../assets/Logo.avif'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, logoutUser, user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Debug user and role
  useEffect(() => {
    console.log("Navbar user:", user);
    console.log("Navbar role:", role);
  }, [user, role]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu and dropdown when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Navigation links
  const navLinks = [
    { to: "/", text: "Home", icon: <FaHome className="text-lg" /> },
    { to: "/about", text: "About", icon: <FaInfoCircle className="text-lg" /> },
    { to: "/contact", text: "Contact", icon: <FaBell className="text-lg" /> },
  ];

  // Safely determine dashboard and profile links
  const dashboardLink = role === "teacher" ? "/teacher-dashboard" : role === "student" ? "/student-dashboard" : "/admin-dashboard";
  const profileLink = role === "teacher" ? "/teacher-profile" : role === "student" ? "/student-profile" : "/admin-profile";

  // Safely handle user display
  const displayName = user && typeof user.email === "string" ? user.email.split("@")[0] : "User";
  const displayEmail = user && typeof user.email === "string" ? user.email : "user@example.com";

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg py-2" : "bg-white/90 backdrop-blur-sm py-3"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <motion.span className="text-2xl font-bold text-gray-800">
              <img src={Logo} className="h-16 w-36 text-white" ></img>
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div key={link.to} className="relative group">
                <Link
                  to={link.to}
                  className={`px-4 py-2.5 rounded-md font-medium flex items-center transition-all ${
                    location.pathname === link.to
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.text}
                </Link>
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative hidden lg:block" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-700">{displayName}</span>
                  {isDropdownOpen ? (
                    <FaChevronUp className="text-gray-500 text-xs" />
                  ) : (
                    <FaChevronDown className="text-gray-500 text-xs" />
                  )}
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-700">{displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
                      </div>
                      <Link
                        to={profileLink}
                        className="px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center"
                      >
                        <FaUser className="mr-3 text-gray-500" /> Profile
                      </Link>
                      <Link
                        to={dashboardLink}
                        className="px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center"
                      >
                        <FaHome className="mr-3 text-gray-500" /> Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center border-t border-gray-100"
                      >
                        <FaSignOutAlt className="mr-3 text-gray-500" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/student-register"
                  className="hidden lg:flex items-center px-4 py-2 rounded-md font-medium bg-blue-700 text-white hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <FaUserPlus className="mr-2" /> Student Register
                </Link>
                <Link
                  to="/student-login"
                  className="hidden lg:flex items-center px-4 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <FaUserGraduate className="mr-2" /> Student Login
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Menu"
            >
              {isOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden bg-white shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-3 rounded-md font-medium flex items-center ${
                      location.pathname === link.to
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.text}
                  </Link>
                ))}

                {isLoggedIn ? (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link
                      to={profileLink}
                      className="px-4 py-3 rounded-md font-medium flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUser className="mr-3 text-gray-500" /> Profile
                    </Link>
                    <Link
                      to={dashboardLink}
                      className="px-4 py-3 rounded-md font-medium flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaHome className="mr-3 text-gray-500" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-3 rounded-md font-medium flex items-center text-gray-700 hover:bg-red-50 hover:text-red-600 text-left"
                    >
                      <FaSignOutAlt className="mr-3 text-gray-500" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link
                      to="/student-register"
                      className="px-4 py-3 rounded-md font-medium flex items-center justify-center bg-blue-800 text-white hover:bg-blue-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUserPlus className="mr-2" /> Student Register
                    </Link>
                    <Link
                      to="/student-login"
                      className="px-4 py-3 rounded-md font-medium flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUserGraduate className="mr-2" /> Student Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;