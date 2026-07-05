import React, { useState, useEffect } from "react";
import Logo from "../../assets/Logo.png";
import RoomOperation from "../../Components/OperationManager/Rooms/RoomOperation";
import ReceptionMngHome from "../../Components/OperationManager/Reception/ReceptionMngHome";
import RoomandReception from "../../Components/OperationManager/Dashboard_Anlyze/RoomandReception";
import {
  Home,
  BedDouble,
  ConciergeBell,
  LogOut,
  Menu,
  LayoutDashboard,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Main Manager Layout
const Manager = () => {
  const usenavigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [userdata, setUserdata] = useState([]);

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

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    usenavigate("/login");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "rooms", label: "Rooms", icon: BedDouble },
    { id: "reception", label: "Reception", icon: ConciergeBell },
    { id: "logout", label: "Logout", icon: LogOut },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <RoomandReception />;
      case "rooms":
        return <RoomOperation />;
      case "reception":
        return <ReceptionMngHome />;
      default:
        return <RoomandReception />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black font-sans">
      {/* Top Header */}
      <header className="bg-white mx-2 mt-3 mb-2 rounded-2xl shadow-md px-3 sm:px-4 py-2 sm:py-3 shrink-0">
        {/* MOBILE layout */}
        <div className="md:hidden">
          {/*Logo + Profile */}
          <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={Logo}
                alt="Hotel Logo"
                className="w-10 sm:w-12 h-10 sm:h-12 object-contain shrink-0"
              />
              <div className="text-left min-w-0">
                <h2 className="font-serif italic text-xs sm:text-sm text-gray-900 leading-tight truncate">
                  New Sirini Hotel
                </h2>
                <p className="text-[8px] font-bold text-gray-500 tracking-[0.15em] uppercase mt-0.5">
                  Manager 2
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                onClick={() => usenavigate("/")}
                className="p-1.5 sm:p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors active:scale-95"
                title="Home"
              >
                <Home size={16} className="sm:w-5 sm:h-5" />
              </button>
              {userdata.Role === "Admin" && (
                <button
                  onClick={() => usenavigate("/admin")}
                  className="p-1.5 sm:p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors active:scale-95"
                  title="Admin Portal"
                >
                  <ExternalLink size={16} className="sm:w-5 sm:h-5" />
                </button>
              )}
              <button
                onClick={handleLogout}
                className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
                title="Logout"
              >
                <LogOut size={16} className="sm:w-5 sm:h-5" />
              </button>
              <div
                className="w-9 sm:w-10 h-9 sm:h-10 bg-amber-500 rounded-full overflow-hidden flex items-center justify-center shadow-sm border-2 border-amber-600 cursor-pointer hover:scale-105 transition-transform active:scale-95 shrink-0"
                onClick={() => usenavigate("/dashboard")}
                title="Profile"
              >
                <img
                  src={userdata.image || Logo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 shadow-inner overflow-x-auto no-scrollbar border border-gray-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isLogout = item.id === "logout";
              return (
                <button
                  key={item.id}
                  title={item.label}
                  onClick={() => {
                    if (item.id === "logout") handleLogout();
                    else {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`flex-1 min-w-0 flex items-center justify-center h-9 sm:h-10 rounded-lg transition-all duration-200 active:scale-95 ${
                    isActive && !isLogout
                      ? "bg-amber-600 text-white shadow-lg ring-2 ring-amber-400 ring-offset-1"
                      : isLogout
                        ? "text-red-500 hover:bg-red-50 hover:text-red-600"
                        : "text-gray-500 hover:bg-white hover:shadow-sm hover:text-gray-700"
                  }`}
                >
                  <Icon size={17} className="sm:w-5 sm:h-5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* DESKTOP layout */}
        <div className="hidden md:grid md:grid-cols-3 md:items-center md:gap-4">
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
                Manager 2
              </p>
            </div>
          </div>

          {/* Center: Floating pill tabs */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1.5 shadow-inner">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isLogout = item.id === "logout";
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === "logout") handleLogout();
                      else {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }
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

          <div className="flex items-center justify-end gap-3">
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
              <p className="text-xs text-gray-500 font-medium">Manager 2</p>
            </div>
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

export default Manager;
