import React, { useState, useEffect } from "react";
import Logo from "../../assets/Logo.png";
import { Home, BottleWine, Utensils, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LiquorManage from "../../Components/OperationManager/Liquor/LiquorMngHome";
import RestaurantManager from "../../Components/OperationManager/Restraunt/RestrauntManagment";
import LiqourandRestruant from "../../Components/OperationManager/Dashboard_Anlyze/LiqourandRestruant";
import toast from "react-hot-toast";
import axios from "axios";

// --- Main Layout Component ---
const OperationManager = () => {
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
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "Liquor", label: "Liquor Items", icon: BottleWine },
    { id: "Food", label: "Restaurant Items", icon: Utensils },
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
      default:
        return "Dashboard Overview";
    }
  };

  return (
    <div className="flex h-screen bg-black font-sans">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-80 bg-[#000000] text-white transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } flex flex-col`}
      >
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <img
            src={Logo}
            alt="Hotel Logo"
            className="w-24 h-24 object-contain"
          />
          <div>
            <h2 className="font-serif italic text-xl text-white">
              New Sirini Hotel
            </h2>
            <p className="text-[10px] font-bold text-gray-400 -mt-1 tracking-wide uppercase">
              Operation Manager 1
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLogout = item.id === "Logout";

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "Logout") {
                    handleLogout();
                  } else {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-yellow-500 text-white font-bold"
                    : isLogout
                      ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
              >
                <Icon
                  size={20}
                  className={
                    isActive
                      ? "text-white"
                      : isLogout
                        ? "text-red-400"
                        : "text-white"
                  }
                />
                <span className="text-sm tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white m-4 mb-2 rounded-xl p-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {getPageTitle()}
            </h2>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-md overflow-hidden hover:scale-105 transition-transform cursor-pointer border-2 border-amber-500/20">
              <img
                src={userdata.image || Logo}
                alt="Profile"
                className="w-full h-full object-cover"
                onClick={() => usenavigate("/dashboard")}
              />
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-gray-800">
                {userdata.name || "User Name"}
              </p>
              <p className="text-xs text-gray-500">Operation Manager 1</p>
            </div>
          </div>
        </header>

        {/* Dynamic Middle Area */}
        <main className="flex-1 overflow-y-auto p-4 pt-2 bg-transparent">
          <div className="bg-gray-100 rounded-xl min-h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OperationManager;
