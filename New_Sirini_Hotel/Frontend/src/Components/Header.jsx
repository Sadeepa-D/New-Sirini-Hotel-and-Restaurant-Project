import React, { useState, useEffect } from "react";
import logo from "../assets/Logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  LogIn,
  UserPlus,
  ExternalLink,
  Bell,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Footer from "./Footer";
import NotifiCenter from "./NotifiCenter";

function Header() {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [notifiOpen, setNotifiOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [logging, setLogging] = useState(
    localStorage.getItem("token") ? true : false,
  );
  const [userData, setUserData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const handlelogout = () => {
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      try {
        const user = JSON.parse(userDataStr);
        localStorage.removeItem(`cart_items_${user._id}`);
      } catch (e) {
        console.error("Error clearing cart on logout:", e);
      }
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
      if (!token) return;
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
      setUserData(userData);
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

  const isActive = (path) => {
    if (path.includes("#")) {
      return location.pathname === "/" && location.hash === path.substring(1);
    }
    return location.pathname === path && !location.hash;
  };

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
  });

  const getMobileLinkStyle = (path, id) => ({
    textDecoration: "none",
    color: hoveredLink === id || isActive(path) ? "#facc15" : "#ffffff",
    transition: "color 0.2s ease",
    fontSize: "1.1rem",
  });

  const handleNavClick = (e, path) => {
    if (path.includes("#")) {
      const sectionId = path.split("#")[1];
      if (location.pathname !== "/") {
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
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      closeMenu();
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(`${VITE_URL}/api/users/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${VITE_URL}/api/users/notifications/markasread/`,
        { notificationId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.put(
        `${VITE_URL}/api/users/notifications/markallasread`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.delete(
        `${VITE_URL}/api/users/notifications/clearall`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing all notifications:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (isLoggedIn) {
      fetchuserimg();
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".notifi-container-wrapper")) {
        setNotifiOpen(false);
      }
    };

    if (notifiOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [notifiOpen]);

  return (
    <header className="bg-black/95 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
      <div className="w-full px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* ── Logo ── */}
        <button
          onClick={() => {
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
            closeMenu();
          }}
          className="flex items-center gap-3 shrink-0 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
          title="Go to homepage"
        >
          <img
            src={logo}
            alt="New Sirini Hotel Logo"
            className="w-18 h-18 object-contain"
          />
          <span className="text-white font-serif text-lg italic hidden sm:block md:hidden lg:block tracking-wide">
            New Sirini Hotel
          </span>
        </button>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
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
                className={`px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-base font-medium transition-all duration-200 ${
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
        <div className="hidden md:flex items-center gap-3 relative z-40 overflow-visible notifi-container-wrapper">
          {isLoggedIn ? (
            <>
              {userData.Role !== "User" && (
                <div className="flex items-center gap-3">
                  {userData.Role === "Admin" && (
                    <button
                      className="flex items-center gap-2 group transition-all cursor-pointer"
                      onClick={() => navigate("/admin")}
                    >
                      <ExternalLink
                        className="text-amber-500 font-bold hover:scale-105"
                        size={25}
                      />
                      <span className="text-amber-500 font-bold hover:scale-105">
                        Admin Portal
                      </span>
                    </button>
                  )}
                  {userData.Role ===
                    "Operation Manager 1 (Restraunt,Liquor)" && (
                    <button
                      className="flex items-center gap-2 group transition-all cursor-pointer"
                      onClick={() => navigate("/operationmanager")}
                    >
                      <ExternalLink
                        className="text-amber-500 font-bold hover:scale-105"
                        size={25}
                      />
                      <span className="text-amber-500 font-bold hover:scale-105">
                        Manager Portal
                      </span>
                    </button>
                  )}
                  {userData.Role ===
                    "Operation Manager 2 (Reception, Room)" && (
                    <button
                      className="flex items-center gap-2 group transition-all cursor-pointer"
                      onClick={() => navigate("/manager")}
                    >
                      <ExternalLink
                        className="text-amber-500 font-bold hover:scale-105"
                        size={25}
                      />
                      <span className="text-amber-500 font-bold hover:scale-105">
                        Manager Portal
                      </span>
                    </button>
                  )}
                </div>
              )}

              <div className="relative">
                <button
                  onClick={() => setNotifiOpen(!notifiOpen)}
                  className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition-all relative cursor-pointer"
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-yellow-500 text-black font-bold text-[10px] flex items-center justify-center rounded-full animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

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

              {/* Dropdown Card */}
              {notifiOpen && (
                <NotifiCenter
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onClearAll={handleClearAll}
                  onClose={() => setNotifiOpen(false)}
                />
              )}
            </>
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

        
        <div className="md:hidden flex items-center gap-2 sm:gap-3">
          {isLoggedIn && (
            <div className="flex items-center gap-2">
              <div className="relative z-40 overflow-visible notifi-container-wrapper">
                <button
                  onClick={() => setNotifiOpen(!notifiOpen)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition-all relative cursor-pointer"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-yellow-500 text-black font-bold text-[9px] flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Mobile Screen Pop-up style drop */}
                {notifiOpen && (
                  <NotifiCenter
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAllAsRead={handleMarkAllAsRead}
                    onClearAll={handleClearAll}
                    onClose={() => setNotifiOpen(false)}
                  />
                )}
              </div>
              {userData.Role !== "User" && (
                <div className="flex items-center">
                  {userData.Role === "Admin" && (
                    <button
                      className="p-1.5 sm:p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all hover:scale-105"
                      onClick={() => navigate("/admin")}
                      title="Admin Portal"
                    >
                      <ExternalLink size={20} />
                    </button>
                  )}
                  {userData.Role ===
                    "Operation Manager 1 (Restraunt,Liquor)" && (
                    <button
                      className="p-1.5 sm:p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all hover:scale-105"
                      onClick={() => navigate("/operationmanager")}
                      title="Manager Portal"
                    >
                      <ExternalLink size={20} />
                    </button>
                  )}
                  {userData.Role ===
                    "Operation Manager 2 (Reception, Room)" && (
                    <button
                      className="p-1.5 sm:p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all hover:scale-105"
                      onClick={() => navigate("/manager")}
                      title="Manager Portal"
                    >
                      <ExternalLink size={20} />
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={() => navigate("/dashboard")}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden hover:scale-105 transition-transform ring-2 ring-yellow-500/40"
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
                    <User size={14} className="text-white" />
                  </div>
                )}
              </button>
            </div>
          )}
          <button
            onClick={toggleMenu}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors ml-auto"
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
