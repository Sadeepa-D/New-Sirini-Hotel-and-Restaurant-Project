import React, { useState } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UserManagement from "../../Components/Admin/UserManagement";

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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Admin Logged out");
    navigate("/login");
  };

  const menuItems = [
    { id: "dashboard", label: "Admin Overview", icon: LayoutDashboard },
    { id: "users", label: "User Accounts", icon: Users },
    { id: "restaurant", label: "Restaurant Analysis", icon: Utensils },
    { id: "reception", label: "Reception Hall", icon: Palmtree },
    { id: "rooms", label: "Room Analytics", icon: Hotel },
    { id: "liquor", label: "Liquor Store", icon: Store },
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
    <div className="flex h-screen bg-[#0f0f0f] font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-50 
        w-72 bg-black border-r border-gray-900 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        flex flex-col
      `}
      >
        {/* Admin Header */}
        <div className="p-6 flex items-center gap-4 border-b border-gray-900">
          <div className="relative">
            <img src={Logo} alt="Logo" className="w-12 h-12 object-contain" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 border-2 border-black rounded-full"></div>
          </div>
          <div>
            <h1 className="text-white font-serif italic text-lg leading-tight">
              Sirini Admin
            </h1>
            <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[2px]">
              Super Control
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200
                ${
                  activeTab === item.id
                    ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.2)] font-bold"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }
              `}
            >
              <item.icon size={20} />
              <span className="text-sm tracking-wide">{item.label}</span>
              {activeTab === item.id && (
                <ArrowUpRight size={14} className="ml-auto" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 mt-auto border-t border-gray-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-semibold text-sm"
          >
            <LogOut size={20} />
            Logout System
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa]">
        {/* Desktop/Mobile Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-black text-gray-800 capitalize tracking-tight">
              {activeTab.replace(/([A-Z])/g, " $1").trim()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">
                System Administrator
              </p>
              <p className="text-[10px] text-yellow-600 font-bold">
                Authenticated Session
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-yellow-500 font-black border-2 border-yellow-500 shadow-sm">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-2 sm:p-4">
          <div className="bg-white/40 backdrop-blur-md rounded-3xl min-h-full border border-gray-100 shadow-inner">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
