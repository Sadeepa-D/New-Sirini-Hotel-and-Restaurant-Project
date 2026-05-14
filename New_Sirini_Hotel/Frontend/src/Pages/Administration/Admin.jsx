import React, { useState, useEffect } from "react";
import Logo from "../../assets/Logo.png";
import {
  LayoutDashboard,
  Users,
  Utensils,
  Store,
  Hotel,
  Palmtree,
  LogOut,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  UserPlus,
  ArrowUpRight,
  Home,
  User,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import UserManagement from "../../Components/Admin/UserManagement";
import GalleryManagementHub from "../../Components/Admin/GalleryManagementHub";

// --- PLACEHOLDER COMPONENTS FOR TABS ---
const AdminDashboard = () => (
  <div className="p-4 md:p-8 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        {
          label: "Total Revenue",
          val: "Rs. 2.4M",
          icon: DollarSign,
          color: "text-green-500",
        },
        {
          label: "New Users",
          val: "+12",
          icon: UserPlus,
          color: "text-blue-500",
        },
        {
          label: "Overall Growth",
          val: "+18%",
          icon: TrendingUp,
          color: "text-yellow-500",
        },
      ].map((card, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
        >
          <div>
            <p className="text-gray-500 text-sm font-medium">{card.label}</p>
            <h3 className="text-2xl font-black mt-1 text-gray-900">
              {card.val}
            </h3>
          </div>
          <div className={`p-3 bg-gray-50 rounded-xl ${card.color}`}>
            <card.icon size={24} />
          </div>
        </div>
      ))}
    </div>
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px] flex items-center justify-center text-gray-400 italic">
      System Performance & Activity Chart Placeholder
    </div>
  </div>
);
const RestaurantAnalysis = () => (
  <div className="p-8 text-center text-gray-500">
    Restaurant Sales & Inventory Analysis
  </div>
);
const ReceptionHallAnalysis = () => (
  <div className="p-8 text-center text-gray-500">
    Hall Bookings & Event Trends
  </div>
);
const RoomAnalysis = () => (
  <div className="p-8 text-center text-gray-500">
    Occupancy Rates & Room Category Performance
  </div>
);
const LiquorAnalysis = () => (
  <div className="p-8 text-center text-gray-500">
    Stock Levels & Top Selling Spirits
  </div>
);

// --- MAIN ADMIN COMPONENT ---
const Admin = () => {
  const token = localStorage.getItem("token");
  const VITE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminData, setAdminData] = useState([]);
  const [managerpagesselection, setManagerpagesselection] = useState(false);
  const [galleryselection, setGalleryselection] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Admin Logged out");
    navigate("/login");
  };

  const fetchAdminDetails = async () => {
    try {
      const response = await axios.get(`${VITE_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdminData(response.data);
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };
  useEffect(() => {
    fetchAdminDetails();
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "restaurant", label: "Restaurant", icon: Utensils },
    { id: "reception", label: "Reception", icon: Palmtree },
    { id: "rooms", label: "Rooms", icon: Hotel },
    { id: "liquor", label: "Liquor", icon: Store },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "users":
        return <UserManagement />;
      case "restaurant":
        return <RestaurantAnalysis />;
      case "reception":
        return <ReceptionHallAnalysis />;
      case "rooms":
        return <RoomAnalysis />;
      case "liquor":
        return <LiquorAnalysis />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black font-sans">
      {/* Top Header */}
      <header className="bg-white mx-2 mt-3 mb-2 rounded-2xl shadow-md px-3 sm:px-4 py-2 sm:py-3 shrink-0">
        {/* ── MOBILE layout (< lg): two rows ── */}
        <div className="lg:hidden">
          {/* Row 1: Logo + Profile */}
          <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={Logo}
                alt="Hotel Logo"
                className="w-10 sm:w-12 h-10 sm:h-12 object-contain shrink-0"
              />
              <div className="text-left min-w-0">
                <h3 className="font-serif italic text-xs sm:text-sm text-gray-900 leading-tight truncate">
                  Sirini Admin
                </h3>
                <h4 className="text-[8px] sm:text-[9px] text-gray-500 uppercase font-bold tracking-[0.15em] mt-0.5">
                  Admin Portal
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                onClick={() => navigate("/")}
                className="p-1.5 sm:p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors active:scale-95"
                title="Home"
              >
                <Home size={16} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setGalleryselection(!galleryselection)}
                className="p-1.5 sm:p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
                title="Gallery"
              >
                <Camera size={16} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setManagerpagesselection(!managerpagesselection)}
                title="Manager Portals"
                className={`p-1.5 sm:p-2 rounded-lg transition-colors active:scale-95 ${managerpagesselection ? "bg-amber-100 text-amber-600" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <User size={16} className="sm:w-5 sm:h-5" />
              </button>
              {managerpagesselection && (
                <>
                  {/* Backdrop for click-away */}
                  <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setManagerpagesselection(false)}
                  />
                  <div className="absolute right-3 top-14 sm:right-4 sm:top-16 w-52 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in duration-200">
                    <button
                      onClick={() => {
                        setManagerpagesselection(false);
                        navigate("/operationmanager");
                      }}
                      className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors font-medium flex items-center gap-2 group"
                    >
                      <Store
                        size={13}
                        className="sm:w-4 sm:h-4 text-gray-400 group-hover:text-amber-500 shrink-0"
                      />
                      <div>
                        <div className="font-semibold">Manager 1</div>
                        <span className="text-[8px] sm:text-[9px] text-gray-400 group-hover:text-amber-500/70">
                          Restaurant, Liquor
                        </span>
                      </div>
                    </button>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setManagerpagesselection(false);
                        navigate("/manager");
                      }}
                      className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors font-medium flex items-center gap-2 group"
                    >
                      <Hotel
                        size={13}
                        className="sm:w-4 sm:h-4 text-gray-400 group-hover:text-amber-500 shrink-0"
                      />
                      <div>
                        <div className="font-semibold">Manager 2</div>
                        <span className="text-[8px] sm:text-[9px] text-gray-400 group-hover:text-amber-500/70">
                          Reception, Rooms
                        </span>
                      </div>
                    </button>
                  </div>
                </>
              )}
              <button
                onClick={handleLogout}
                className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
                title="Logout"
              >
                <LogOut size={16} className="sm:w-5 sm:h-5" />
              </button>
              <div
                className="w-9 sm:w-10 h-9 sm:h-10 bg-black rounded-full overflow-hidden flex items-center justify-center shadow-sm border-2 border-amber-500 cursor-pointer hover:scale-105 transition-transform active:scale-95 shrink-0"
                onClick={() => navigate("/dashboard")}
                title="Profile"
              >
                {adminData?.image ? (
                  <img
                    src={adminData.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={14} className="sm:w-4 sm:h-4 text-white" />
                )}
              </div>
            </div>
          </div>
          {/* Row 2: Icon-only tabs (scrollable) */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 shadow-inner overflow-x-auto no-scrollbar border border-gray-100">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  title={item.label}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex-1 min-w-0 flex items-center justify-center h-9 sm:h-10 rounded-lg transition-all duration-200 active:scale-95 ${
                    isActive
                      ? "bg-amber-600 text-white shadow-lg ring-2 ring-amber-400 ring-offset-1"
                      : "text-gray-500 hover:bg-white hover:shadow-sm hover:text-gray-700"
                  }`}
                >
                  <Icon size={17} className="sm:w-5 sm:h-5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── DESKTOP layout (≥ lg): single row, flex space-between ── */}
        <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-4">
          {/* Left: Logo + Admin Info */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src={Logo}
              alt="Hotel Logo"
              className="w-16 h-16 object-contain"
            />
            <div className="text-left border-r border-gray-200 pr-4">
              <h3 className="text-xs text-gray-500 font-bold tracking-widest uppercase">
                Admin Portal
              </h3>
              <h4 className="text-sm font-bold text-gray-800 mt-0.5">
                {adminData.name || "Admin"}
              </h4>
            </div>
          </div>

          {/* Center: Floating pill tabs */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl p-1.5 shadow-inner border border-gray-200">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 ${
                      isActive
                        ? "bg-amber-600 text-white shadow-lg scale-105 ring-2 ring-amber-400 ring-offset-1"
                        : "text-gray-600 hover:bg-white hover:text-gray-800 hover:shadow-sm"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Action Buttons + Profile */}
          <div className="flex items-center justify-end gap-1 w-1/4">
            {/* Action Button Group */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1.5 border border-gray-100">
              <button
                onClick={() => setGalleryselection(!galleryselection)}
                className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 active:scale-95"
                title="Gallery"
              >
                <Camera size={20} />
              </button>
              <div className="w-px h-6 bg-gray-200"></div>
              <button
                onClick={() => setManagerpagesselection(!managerpagesselection)}
                title="Manager Portals"
                className={`p-2 rounded-lg transition-all duration-200 active:scale-95 ${managerpagesselection ? "bg-amber-100 text-amber-600" : "text-gray-500 hover:bg-amber-50 hover:text-amber-600"}`}
              >
                <User size={20} />
              </button>

              {/* Dropdown Menu */}
              {managerpagesselection && (
                <>
                  {/* Backdrop for click-away */}
                  <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setManagerpagesselection(false)}
                  />
                  <div className="absolute right-20 top-20 w-56 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={() => {
                        setManagerpagesselection(false);
                        navigate("/operationmanager");
                      }}
                      className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors font-medium flex items-center gap-3 group"
                    >
                      <Store
                        size={18}
                        className="text-gray-400 group-hover:text-amber-500 transition-colors shrink-0"
                      />
                      <div>
                        <div className="font-semibold">Manager 1</div>
                        <span className="text-xs text-gray-400 group-hover:text-amber-500/70">
                          Restaurant, Liquor
                        </span>
                      </div>
                    </button>
                    <div className="h-px bg-gray-100 my-1.5"></div>
                    <button
                      onClick={() => {
                        setManagerpagesselection(false);
                        navigate("/manager");
                      }}
                      className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors font-medium flex items-center gap-3 group"
                    >
                      <Hotel
                        size={18}
                        className="text-gray-400 group-hover:text-amber-500 transition-colors shrink-0"
                      />
                      <div>
                        <div className="font-semibold">Manager 2</div>
                        <span className="text-xs text-gray-400 group-hover:text-amber-500/70">
                          Reception, Rooms
                        </span>
                      </div>
                    </button>
                  </div>
                </>
              )}

              <div className="w-px h-6 bg-gray-200"></div>
              <button
                onClick={() => navigate("/")}
                title="Home"
                className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-all duration-200 active:scale-95"
              >
                <Home size={20} />
              </button>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-95"
              >
                <LogOut size={20} />
              </button>
            </div>

            {/* Profile Avatar - Standalone */}
            <div
              className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full overflow-hidden hover:scale-110 transition-transform cursor-pointer flex items-center justify-center shadow-lg border-2 border-amber-600 ml-2"
              onClick={() => navigate("/dashboard")}
              title={adminData.name}
            >
              {adminData?.image ? (
                <img
                  src={adminData.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={22} className="text-white" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Dynamic Content Area */}
      <main className="flex-1 overflow-y-auto px-4 pb-4 bg-transparent">
        <div className="bg-gray-100 rounded-xl min-h-full overflow-hidden">
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
      {galleryselection && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setGalleryselection(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <GalleryManagementHub onClose={() => setGalleryselection(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
