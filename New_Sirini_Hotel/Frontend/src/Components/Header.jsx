import React, { useState } from "react";
import logo from "../assets/Logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { label: "Home", path: "/main" },
    { label: "Services", path: "/services" },
    { label: "Gallery", path: "/gallery" },
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  const getLinkStyle = (path, id) => ({
    textDecoration: "none",
    color:
      hoveredLink === id || isActive(path) ? "#facc15" : "#ffffff",
    borderBottom:
      isActive(path) ? "2px solid #facc15" : "2px solid transparent",
    paddingBottom: "2px",
    transition: "color 0.2s ease, transform 0.2s ease",
    transform: hoveredLink === id ? "scale(1.1)" : "scale(1)",
    display: "inline-block",
    fontSize: "1rem",
  });

  const getMobileLinkStyle = (path, id) => ({
    textDecoration: "none",
    color:
      hoveredLink === id || isActive(path) ? "#facc15" : "#ffffff",
    transition: "color 0.2s ease",
    fontSize: "1.25rem",
  });

  return (
    <header className="bg-black py-4 relative z-50">
      <div className="w-full px-4 flex items-center justify-between">
        
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="New Sirini Hotel Logo"
            className="h-14 md:h-18 object-contain"
          />
          <h1 className="text-white font-serif text-lg md:text-2xl italic">
            New Sirini Hotel
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-10 ml-auto">
          {navLinks.map((link) => {
            const id = `desktop-${link.path}`;
            return (
              <Link
                key={id}
                to={link.path}
                style={getLinkStyle(link.path, id)}
                onMouseEnter={() => setHoveredLink(id)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2 ml-6">
          <button
            onClick={() => navigate("/")}
            className="w-28 py-1.5 border border-white text-white rounded
                       hover:bg-yellow-500 hover:text-black hover:border-yellow-500
                       transition-colors duration-300"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-28 py-1.5 border border-white text-white rounded
                       hover:bg-yellow-500 hover:text-black hover:border-yellow-500
                       transition-colors duration-300"
          >
            Sign up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaTimes className="w-7 h-7" />
            ) : (
              <FaBars className="w-7 h-7" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 flex flex-col items-center py-8 gap-6 shadow-xl border-t border-gray-800 md:hidden">
          
          {/* Mobile Navigation Links */}
          {navLinks.map((link) => {
            const id = `mobile-${link.path}`;
            return (
              <Link
                key={id}
                to={link.path}
                onClick={closeMenu}
                style={getMobileLinkStyle(link.path, id)}
                onMouseEnter={() => setHoveredLink(id)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Mobile Auth Buttons (Same Style as Desktop) */}
          <div className="flex flex-col items-center gap-3 mt-4 w-full px-8">
            <button
              onClick={() => {
                navigate("/");
                closeMenu();
              }}
              className="w-40 py-2 border border-white text-white rounded
                         hover:bg-yellow-500 hover:text-black hover:border-yellow-500
                         transition-colors duration-300"
            >
              Sign in
            </button>

            <button
              onClick={() => {
                navigate("/register");
                closeMenu();
              }}
              className="w-40 py-2 border border-white text-white rounded
                         hover:bg-yellow-500 hover:text-black hover:border-yellow-500
                         transition-colors duration-300"
            >
              Sign up
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
