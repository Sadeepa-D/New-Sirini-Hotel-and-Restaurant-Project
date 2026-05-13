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
      <header className="bg-white mx-2 mt-3 mb-2 rounded-xl shadow-sm px-4 py-3">
        {/* MOBILE layout */}
        <div className="md:hidden">
          {/* Row 1: Logo + Profile */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <img
                src={Logo}
                alt="Hotel Logo"
                className="w-20 h-20 object-contain"
              />
              <div>
                <h2 className="font-serif italic text-sm text-gray-900 leading-tight">
                  New Sirini Hotel
                </h2>
                <p className="text-[8px] font-bold text-gray-400 tracking-widest uppercase">
                  Operation Manager 2
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => usenavigate("/")}
                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home size={20} />
              </button>
              <div className="w-13 h-13 bg-amber-500 rounded-full overflow-hidden hover:scale-105 transition-transform cursor-pointer shadow-md ring-2 ring-amber-200 ring-offset-1">
                <img
                  src={userdata.image || Logo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onClick={() => usenavigate("/dashboard")}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 shadow-inner">
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
                  className={`flex-1 flex items-center justify-center py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-amber-600 text-white shadow-lg ring-2 ring-amber-400 ring-offset-1"
                      : isLogout
                        ? "text-red-400 hover:bg-red-50"
                        : "text-gray-500 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <Icon size={18} />
                </button>
              );
            })}
          </div>
        </div>

        {/* DESKTOP layout */}
        <div className="hidden md:grid md:grid-cols-3 md:items-center">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <img
              src={Logo}
              alt="Hotel Logo"
              className="w-20 h-20 object-contain"
            />
            <div>
              <h2 className="font-serif italic text-base text-gray-900 leading-tight">
                New Sirini Hotel
              </h2>
            </div>
          </div>

          {/* Center: Floating pill tabs */}
          <div className="flex justify-center">
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 shadow-inner">
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-amber-600 text-white shadow-lg scale-105 ring-2 ring-amber-400 ring-offset-1"
                        : isLogout
                          ? "text-red-400 hover:bg-red-50 hover:text-red-500"
                          : "text-gray-500 hover:bg-white hover:text-gray-800 hover:shadow-sm"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Home + Avatar + Name */}
          <div className="flex items-center justify-end gap-3">
            {userdata.Role === "Admin" && (
              <button
                className="flex items-center gap-2 group transition-all"
                onClick={() => usenavigate("/admin")}
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
            <button
              onClick={() => usenavigate("/")}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home size={22} />
            </button>
            <div className="w-15 h-15 bg-amber-500 rounded-full overflow-hidden hover:scale-105 transition-transform cursor-pointer shadow-md ring-2 ring-amber-200 ring-offset-1">
              <img
                src={userdata.image || Logo}
                alt="Profile"
                className="w-full h-full object-cover"
                onClick={() => usenavigate("/dashboard")}
              />
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">
                {userdata.name || "User Name"}
              </p>
              <p className="text-xs text-gray-500">Operation Manager 2</p>
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
    </div>
  );
};

export default Manager;
