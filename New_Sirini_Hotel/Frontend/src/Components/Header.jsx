import React, { useState, useEffect } from "react";
import logo from "../assets/Logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, LogIn, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
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
    fontSize: "1.1rem",
  });

  const handleNavClick = (e, path) => {
    if (path.includes("#")) {
      e.preventDefault();
      const sectionId = path.split("#")[1];
      if (location.pathname !== "/") {
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
    <header className="bg-black/95 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
      <div className="w-full px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* ── Logo ── */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src={logo}
            alt="New Sirini Hotel Logo"
            className="w-18 h-18 object-contain"
          />
          <span className="text-white font-serif text-lg italic hidden sm:block tracking-wide">
            New Sirini Hotel
          </span>
        </div>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const id = `desktop-${link.path}`;
            const active = isActive(link.path);
            return (
              <Link
                key={id}
                to={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                onMouseEnter={() => setHoveredLink(id)}
                onMouseLeave={() => setHoveredLink(null)}
                style={getLinkStyle(link.path, id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-yellow-500/10"
                    : hoveredLink === id
                      ? "bg-white/5"
                      : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Desktop Auth ── */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-amber-500 rounded-full overflow-hidden hover:scale-105 transition-transform cursor-pointer shadow-md ring-2 ring-amber-200 ring-offset-1">
                {userImage ? (
                  <img
                    src={userImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onClick={() => navigate("/dashboard")}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    onClick={() => navigate("/dashboard")}
                  >
                    <User size={20} className="text-white" />
                  </div>
                )}
              </div>
              <button
                onClick={handlelogout}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
              >
                <LogOut size={15} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-1.5 px-4 py-2 text-white/80 border border-white/20 rounded-lg text-sm font-medium hover:bg-white/10 hover:text-white hover:border-white/40 transition-all duration-200"
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  closeMenu();
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-yellow-500 text-black rounded-lg text-sm font-bold hover:bg-yellow-400 transition-all duration-200 shadow-md shadow-yellow-500/20"
              >
                <UserPlus size={15} />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>

        {/* ── Mobile: avatar (if logged in) + hamburger ── */}
        <div className="md:hidden flex items-center gap-3">
          {isLoggedIn && (
            <button
              onClick={() => navigate("/dashboard")}
              className="w-9 h-9 rounded-full overflow-hidden hover:scale-105 transition-transform ring-2 ring-yellow-500/40"
              title="Go to Dashboard"
            >
              {userImage ? (
                <img
                  src={userImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-amber-500 flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              )}
            </button>
          )}
          <button
            onClick={toggleMenu}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/98 backdrop-blur-md border-t border-white/10 shadow-2xl">
          {/* Nav Links */}
          <nav className="flex flex-col px-6 pt-4 pb-2 gap-1">
            {navLinks.map((link) => {
              const id = `mobile-${link.path}`;
              const active = isActive(link.path);
              return (
                <Link
                  key={id}
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  onMouseEnter={() => setHoveredLink(id)}
                  onMouseLeave={() => setHoveredLink(null)}
                  style={getMobileLinkStyle(link.path, id)}
                  className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    active ? "bg-yellow-500/10" : "hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth section */}
          <div className="px-6 pb-6 pt-2 border-t border-white/10 mt-2">
            {isLoggedIn ? (
              <button
                onClick={handlelogout}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    navigate("/login");
                    closeMenu();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/10 hover:border-white/40 transition-all duration-200"
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    closeMenu();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-yellow-500 text-black rounded-xl text-sm font-bold hover:bg-yellow-400 transition-all duration-200 shadow-md shadow-yellow-500/20"
                >
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
