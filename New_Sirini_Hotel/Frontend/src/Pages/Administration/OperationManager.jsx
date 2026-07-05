import React, { useState, useEffect } from "react";
import Logo from "../../assets/Logo.png";
import {
  Home,
  BottleWine,
  Utensils,
  LogOut,
  LayoutDashboard,
  ExternalLink,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LiquorManage from "../../Components/OperationManager/Liquor/LiquorMngHome";
import RestaurantManager from "../../Components/OperationManager/Restraunt/RestrauntManagment";
import LiqourandRestruant from "../../Components/OperationManager/Dashboard_Anlyze/LiqourandRestruant";
import toast from "react-hot-toast";
import axios from "axios";
import NotifiCenter from "../../Components/NotifiCenter";

// --- Main Layout Component ---
const OperationManager = () => {
  const usenavigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [userdata, setUserdata] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const VITE_URL = import.meta.env.VITE_API_URL;

  const token = localStorage.getItem("token");

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${VITE_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserdata(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    }
  };

  const fetchNotifications = async () => {
    try {
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
      if (!token) return;
      await axios.put(
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
      if (!token) return;
      await axios.put(
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
      if (!token) return;
      await axios.delete(`${VITE_URL}/api/users/notifications/clearall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing all notifications:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".notifi-container-wrapper")) {
        setNotificationOpen(false);
      }
    };

    if (notificationOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [notificationOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    usenavigate("/login");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "Liquor", label: "Liquor", icon: BottleWine },
    { id: "Food", label: "Restaurant", icon: Utensils },
    { id: "Logout", label: "Logout", icon: LogOut },
  ];

  // Function to render the correct component in the middle
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <LiqourandRestruant />;
      case "Liquor":
        return <LiquorManage />;
      case "Food":
        return <RestaurantManager />;
      default:
        return <LiqourandRestruant />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard Overview";
      case "Liquor":
        return "Liquor Management";
      case "Food":
        return "Restaurant Management";
      default:
        return "Dashboard Overview";
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex flex-col h-screen bg-black font-sans">
      {/* Top Header */}
      <header className="bg-white mx-2 mt-3 mb-2 rounded-2xl shadow-md px-3 sm:px-4 py-2 sm:py-3 shrink-0">
        {/* ── MOBILE layout (< md): two rows ── */}
        <div className="md:hidden">
          {/* Row 1: Logo + Action Buttons + Profile */}
          <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={Logo}
                alt="Hotel Logo"
                className="w-10 sm:w-12 h-10 sm:h-12 object-contain flex-shrink-0"
              />
              <div className="min-w-0">
                <h2 className="font-serif italic text-xs sm:text-sm text-gray-900 leading-tight truncate">
                  New Sirini Hotel
                </h2>
                <p className="text-[7px] sm:text-[8px] font-bold text-gray-500 tracking-wider uppercase">
                  Manager 1
                </p>
              </div>
            </div>
            <div className="relative z-40 overflow-visible notifi-container-wrapper flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-1.5 sm:p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                title="Notifications"
              >
                <div className="relative">
                  <Bell size={16} className="sm:w-5 sm:h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-yellow-500 text-black font-bold text-[9px] flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </button>
              {userdata.Role === "Admin" && (
                <button
                  className="p-1.5 sm:p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                  onClick={() => usenavigate("/admin")}
                  title="Admin Portal"
                >
                  <ExternalLink size={16} className="sm:w-5 sm:h-5" />
                </button>
              )}
              <button
                onClick={() => usenavigate("/")}
                className="p-1.5 sm:p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                title="Home"
              >
                <Home size={16} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => usenavigate("/login")}
                className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={16} className="sm:w-5 sm:h-5" />
              </button>
              <div
                className="w-9 sm:w-10 h-9 sm:h-10 bg-amber-500 rounded-full overflow-hidden flex-shrink-0 hover:scale-105 transition-transform cursor-pointer shadow-md border-2 border-amber-600"
                onClick={() => usenavigate("/dashboard")}
                title="Profile"
              >
                <img
                  src={userdata.image || Logo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {notificationOpen && (
                <NotifiCenter
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onClearAll={handleClearAll}
                  onClose={() => setNotificationOpen(false)}
                />
              )}
            </div>
          </div>
          {/* Row 2: Navigation Tabs - Full Width Distribution */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 overflow-x-auto no-scrollbar border border-gray-100 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isLogout = item.id === "Logout";
              return (
                <button
                  key={item.id}
                  title={item.label}
                  onClick={() => {
                    if (isLogout) handleLogout();
                    else setActiveTab(item.id);
                  }}
                  className={`flex-1 min-w-0 flex items-center justify-center h-9 sm:h-10 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-amber-600 text-white shadow-lg ring-2 ring-amber-400 ring-offset-1"
                      : isLogout
                        ? "text-red-500 hover:bg-red-50 hover:text-red-600"
                        : "text-gray-500 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <Icon size={17} className="sm:w-5 sm:h-5" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="hidden md:flex lg:hidden flex-col gap-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo & Brand */}
            <div className="flex items-center gap-3">
              <img
                src={Logo}
                alt="Hotel Logo"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h2 className="font-serif italic text-sm text-gray-900 leading-tight">
                  New Sirini Hotel
                </h2>
                <p className="text-[9px] font-bold text-gray-500 tracking-[0.1em] uppercase">
                  Manager 1
                </p>
              </div>
            </div>

            {/* Right: Actions + Profile */}
            <div className="relative z-40 overflow-visible notifi-container-wrapper flex items-center gap-3">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                title="Notifications"
              >
                <div className="relative">
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-500 text-black font-bold text-[10px] flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </button>
              {userdata.Role === "Admin" && (
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors group"
                  onClick={() => usenavigate("/admin")}
                  title="Go to Admin Portal"
                >
                  <ExternalLink
                    className="text-amber-600 group-hover:text-amber-700"
                    size={16}
                  />
                  <span className="text-xs text-amber-600 group-hover:text-amber-700 font-semibold whitespace-nowrap">
                    Admin
                  </span>
                </button>
              )}
              <button
                onClick={() => usenavigate("/")}
                className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                title="Home"
              >
                <Home size={20} />
              </button>
              <div
                className="w-10 h-10 bg-amber-500 rounded-full overflow-hidden flex items-center justify-center shadow-md border-2 border-amber-600 cursor-pointer hover:scale-105 transition-transform shrink-0"
                onClick={() => usenavigate("/dashboard")}
                title="Profile"
              >
                <img
                  src={userdata.image || Logo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-800 line-clamp-1 max-w-[120px]">
                  {userdata.name || "User Name"}
                </p>
                <p className="text-[10px] text-gray-500 font-medium">
                  Manager 1
                </p>
              </div>
              {notificationOpen && (
                <NotifiCenter
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onClearAll={handleClearAll}
                  onClose={() => setNotificationOpen(false)}
                />
              )}
            </div>
          </div>

          {/* Row 2: Tabs (centered) */}
          <div className="flex justify-center border-t border-gray-100 pt-2">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1.5 shadow-inner w-full md:w-auto md:justify-center">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isLogout = item.id === "Logout";
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (isLogout) handleLogout();
                      else setActiveTab(item.id);
                    }}
                    className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isActive && !isLogout
                        ? "bg-amber-600 text-white shadow-lg scale-105 ring-2 ring-amber-400 ring-offset-1"
                        : isLogout
                          ? "text-red-500 hover:bg-red-50 hover:text-red-600"
                          : "text-gray-500 hover:bg-white hover:text-gray-800 hover:shadow-sm"
                    }`}
                  >
                    <Icon size={15} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="hidden lg:grid lg:grid-cols-3 lg:items-center lg:gap-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <img
              src={Logo}
              alt="Hotel Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
            <div className="text-left">
              <h2 className="font-serif italic text-sm sm:text-base text-gray-900 leading-tight">
                New Sirini Hotel
              </h2>
              <p className="text-[9px] sm:text-xs font-bold text-gray-500 tracking-[0.1em] uppercase mt-1">
                Manager 1
              </p>
            </div>
          </div>

          {/* Center: Floating pill tabs */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1.5 shadow-inner">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isLogout = item.id === "Logout";
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (isLogout) handleLogout();
                      else setActiveTab(item.id);
                    }}
                    className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive && !isLogout
                        ? "bg-amber-600 text-white shadow-lg scale-105 ring-2 ring-amber-400 ring-offset-1"
                        : isLogout
                          ? "text-red-500 hover:bg-red-50 hover:text-red-600"
                          : "text-gray-500 hover:bg-white hover:text-gray-800 hover:shadow-sm"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Admin Portal + Home + Avatar + Name */}
          <div className="relative z-40 overflow-visible notifi-container-wrapper flex items-center justify-end gap-3">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              title="Notifications"
            >
              <div className="relative">
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-500 text-black font-bold text-[10px] flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            </button>
            {userdata.Role === "Admin" && (
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors group"
                onClick={() => usenavigate("/admin")}
                title="Go to Admin Portal"
              >
                <ExternalLink
                  className="text-amber-600 group-hover:text-amber-700"
                  size={18}
                />
                <span className="text-xs sm:text-sm text-amber-600 group-hover:text-amber-700 font-semibold whitespace-nowrap">
                  Admin
                </span>
              </button>
            )}
            <button
              onClick={() => usenavigate("/")}
              className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
              title="Home"
            >
              <Home size={22} />
            </button>
            <div
              className="w-12 h-12 bg-amber-500 rounded-full overflow-hidden flex items-center justify-center shadow-md border-2 border-amber-600 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => usenavigate("/dashboard")}
              title="Profile"
            >
              <img
                src={userdata.image || Logo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">
                {userdata.name || "User Name"}
              </p>
              <p className="text-xs text-gray-500 font-medium">Manager 1</p>
            </div>
            {notificationOpen && (
              <NotifiCenter
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onClearAll={handleClearAll}
                onClose={() => setNotificationOpen(false)}
              />
            )}
          </div>
        </div>
      </header>

      {/* Dynamic Content Area */}
      <main className="flex-1 overflow-y-auto px-4 pb-4 bg-transparent">
        <div className="bg-gray-100 rounded-xl min-h-full">
          {renderContent()}
        </div>
      </main>

      {/* Global Style for hiding scrollbars on mobile horizontal list */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default OperationManager;
