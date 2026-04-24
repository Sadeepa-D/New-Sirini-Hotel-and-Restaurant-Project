import React, { useState, useEffect } from "react";
import logo from "../assets/Logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { User } from "lucide-react";
import axios from "axios";
import Footer from "./Footer";

function Header() {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [logging, setLogging] = useState(
    localStorage.getItem("token") ? true : false,
  );
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const handlelogout = () => {
    // Clear user session (e.g., remove token, clear local storage)
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
    toast.success("logged out successfully.");
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const fetchuserimg = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const response = await axios.get(`${VITE_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data;
      if (userData.image) {
        setUserImage(userData.image);
      } else {
        setUserImage(null);
      }
      return userData.image;
    } catch (error) {
      console.error("Error fetching user image:", error);
      return null;
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      fetchuserimg();
    }
  }, [isLoggedIn]);
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/#services" },
    { label: "Gallery", path: "/#gallery" },
    { label: "About Us", path: "/#about" },
    { label: "Contact Us", path: "/#contact" },
  ];

  const isActive = (path) => location.pathname === path;

  const getLinkStyle = (path, id) => ({
    textDecoration: "none",
    color: hoveredLink === id || isActive(path) ? "#facc15" : "#ffffff",
    borderBottom: isActive(path)
      ? "2px solid #facc15"
      : "2px solid transparent",
    paddingBottom: "2px",
    transition: "color 0.2s ease, transform 0.2s ease",
    transform: hoveredLink === id ? "scale(1.1)" : "scale(1)",
    display: "inline-block",
    fontSize: "1rem",
  });

  const getMobileLinkStyle = (path, id) => ({
    textDecoration: "none",
    color: hoveredLink === id || isActive(path) ? "#facc15" : "#ffffff",
    transition: "color 0.2s ease",
    fontSize: "1.25rem",
  });

  const handleNavClick = (e, path) => {
    if (path.includes("#")) {
      e.preventDefault();
      const sectionId = path.split("#")[1];

      if (location.pathname !== "/") {
        // Navigate to home first, then scroll
        navigate("/");
        setTimeout(() => {
          document
            .getElementById(sectionId)
            ?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      } else {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      }
      closeMenu();
    }
  };

  return (
    <header className="bg-black h-30 relative z-50">
      <div className="w-full px-4 h-full flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="New Sirini Hotel Logo"
            className="h-22 md:h-29 object-contain"
          />

          <div className="text-white font-serif text-[19px] italic">
            New Sirini Hotel
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-10 ml-auto">
          {navLinks.map((link) => {
            const id = `desktop-${link.path}`;
            return (
              <Link
                key={id}
                to={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
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
        <div className="hidden md:flex items-center gap-2 ml-11">
          {isLoggedIn ? (
            <div className="flex flex-col items-center gap-2">
              {/* Profile Picture / Dashboard Link */}
              <button
                onClick={() => navigate("/dashboard")}
                className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center shrink-0 border-2 border-white bg-amber-500 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                title="Go to Dashboard"
              >
                {userImage ? (
                  <img
                    src={userImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={28} className="text-black" />
                )}
              </button>

              {/* Log Out Button */}
              <button
                onClick={handlelogout}
                className="w-28 py-1.5 border border-white text-white rounded font-bold transition-all duration-300 hover:bg-red-600 hover:border-red-600 hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-red-600/50"
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")} // Adjust to your actual sign in route
                className="w-28 py-1.5 border border-white text-white rounded
                         hover:bg-yellow-500 hover:!text-black font-bold hover:border-yellow-500
                         transition-colors duration-600"
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  closeMenu();
                }}
                className="w-28 py-1.5 border border-white text-white rounded
                             hover:bg-yellow-500 hover:text-black hover:border-yellow-500
                             transition-colors duration-300"
              >
                Sign up
              </button>
            </>
          )}
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
                onClick={(e) => handleNavClick(e, link.path)}
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
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                {/* Profile Picture / Dashboard Link */}
                <button
                  onClick={() => navigate("/dashboard")} // Change "/dashboard" to your actual route!
                  className="w-10 h-10 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold text-lg border-2 border-white hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/30 hover:-translate-y-1 transition-all duration-300"
                  title="Go to Dashboard"
                >
                  {/* You can replace "U" with an <img> tag if you fetch the user's photo later */}
                  {userImage ? (
                    <img
                      src={userImage}
                      alt="User"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User className="w-full h-full object-cover rounded-full" />
                  )}
                </button>

                {/* Log Out Button */}
                <button
                  onClick={handlelogout}
                  className="w-28 py-1.5 border border-white text-white rounded font-bold transition-all duration-300 hover:bg-red-600 hover:border-red-600 hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-red-600/50"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login"); // Adjust to your actual sign in route
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
