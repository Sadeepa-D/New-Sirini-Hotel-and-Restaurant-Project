import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-black py-5 relative z-50">
      <div className="w-full px-4 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          {/* <img
            src={logo}
            alt="New Sirini Hotel Logo"
            className="h-16 md:h-20 object-contain"
          /> */}
          <h1 className="text-white font-serif text-xl md:text-2xl italic">
            New Sirini Hotel
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12 ml-auto">
          <Link
            to="/main"
            className="text-white hover:text-yellow-500 transition-all duration-300 text-base inline-block hover:scale-110"
          >
            Home
          </Link>
          <a
            href="/main#services"
            className="text-white hover:text-yellow-500 transition-all duration-300 text-base inline-block hover:scale-110"
          >
            Services
          </a>
          <Link
            to="/gallery"
            className="text-white hover:text-yellow-500 transition-all duration-300 text-base inline-block hover:scale-110"
          >
            Gallery
          </Link>
          <Link
            to="/about"
            className="text-white hover:text-yellow-500 transition-all duration-300 text-base inline-block hover:scale-110"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-white hover:text-yellow-500 transition-all duration-300 text-base inline-block hover:scale-110"
          >
            Contact Us
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-5 ml-8 lg:ml-20">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-1.5 border border-white text-white rounded hover:bg-orange-400 hover:text-black transition-colors hover:border-orange-400"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-1.5 border border-white text-white rounded hover:bg-orange-400 hover:text-black transition-colors hover:border-orange-400"
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
              <FaTimes className="w-8 h-8" />
            ) : (
              <FaBars className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-black/95 flex flex-col items-center py-8 gap-6 shadow-xl border-t border-gray-800 md:hidden">
            <Link
              to="/main"
              onClick={closeMenu}
              className="text-white text-xl hover:text-yellow-500 transition-colors"
            >
              Home
            </Link>
            <a
              href="/main#services"
              onClick={closeMenu}
              className="text-white text-xl hover:text-yellow-600 transition-colors"
            >
              Services
            </a>
            <Link
              to="/gallery"
              onClick={closeMenu}
              className="text-white text-xl hover:text-yellow-600 transition-colors"
            >
              Gallery
            </Link>
            <Link
              to="/about"
              onClick={closeMenu}
              className="text-white text-xl hover:text-yellow-600 transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={closeMenu}
              className="text-white text-xl hover:text-yellow-600 transition-colors"
            >
              Contact Us
            </Link>

            <div className="flex flex-col gap-4 mt-4 w-full px-8">
              <button
                onClick={() => {
                  navigate("/");
                  closeMenu();
                }}
                className="w-full px-6 py-3 border border-white text-white rounded hover:bg-orange-400 hover:text-black transition-colors hover:border-orange-400"
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  closeMenu();
                }}
                className="w-full px-6 py-3 border border-white text-white rounded hover:bg-orange-400 hover:text-black transition-colors hover:border-orange-400"
              >
                Sign up
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
