import React, { useState, useEffect } from "react";
import Logo from "../../assets/Logo.png";
import {
  Home,
  BadgeDollarSign,
  BottleWine,
  Utensils,
  LogOut,
  Menu,
  ShoppingBag,
  XCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LiquorManage from "../../Components/OperationManager/Liquor/LiquorMngHome";
import RestaurantManager from "../../Components/OperationManager/Restraunt/RestrauntManagment";
import toast from "react-hot-toast";
import axios from "axios";

// --- Dashboard Overview Component (Matches your Figma design) ---
const DashboardOverview = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [liquorItems, setLiquorItems] = useState([]);
  const [restraurantItems, setRestaurantItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchliquoritems = async () => {
    try {
      const response = await axios.get(`${VITE_URL}/api/liquor/get`);
      setLiquorItems(response.data);
    } catch (error) {
      console.error("Error fetching liquor items:", error);
    }
  };

  const fetchRestaurantItems = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/restraunt/viewfooditems`,
      );
      setRestaurantItems(response.data);
    } catch (error) {
      console.error("Error fetching restaurant items:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${VITE_URL}/api/restraunt/vieworders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchliquoritems();
    fetchRestaurantItems();
    fetchOrders();
  }, []);

  const activeliquoritems = liquorItems.filter(
    (item) => item.isAvailable === true,
  ).length;
  const activeRestaurantItems = restraurantItems.filter(
    (item) => item.availability === true,
  ).length;
  const totalRevenue = orders.reduce((total, order) => {
    if (order.status === "Completed") {
      if (order.Price) {
        return total + order.Price;
      }
    }
    return total;
  }, 0);

  const orderStats = {
    completed: orders.filter((order) => order.status === "Completed").length,
    pending: orders.filter((order) => order.status === "In Progress").length,
    cancelled: orders.filter((order) => order.status === "Cancelled").length,
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Revenue */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <BadgeDollarSign size={24} className="text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
              Total Revenue
            </p>
            <p className="text-xl font-black text-gray-800 mt-0.5">
              Rs. {totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Active Liquor */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
            <BottleWine size={24} className="text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
              Active Liquor
            </p>
            <p className="text-xl font-black text-gray-800 mt-0.5">
              {activeliquoritems}
            </p>
          </div>
        </div>

        {/* Active Restaurant */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <Utensils size={24} className="text-orange-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
              Active Food
            </p>
            <p className="text-xl font-black text-gray-800 mt-0.5">
              {activeRestaurantItems}
            </p>
          </div>
        </div>
      </div>
      {/* ── Order stats section ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-5">
          <ShoppingBag size={18} className="text-gray-500" />
          <h3 className="text-sm font-black text-gray-700 uppercase tracking-widest">
            Order Overview
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Completed */}
          <div className="relative overflow-hidden rounded-xl bg-green-50 border border-green-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2.5 py-1 rounded-full">
                Completed
              </span>
            </div>
            <p className="text-3xl font-black text-green-700">
              {orderStats.completed}
            </p>
            <p className="text-xs text-green-500 mt-1">orders fulfilled</p>
            <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-green-100 opacity-50" />
          </div>

          {/* Pending */}
          <div className="relative overflow-hidden rounded-xl bg-amber-50 border border-amber-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock size={20} className="text-amber-600" />
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full">
                Pending
              </span>
            </div>
            <p className="text-3xl font-black text-amber-700">
              {orderStats.pending}
            </p>
            <p className="text-xs text-amber-500 mt-1">awaiting processing</p>
            <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-amber-100 opacity-50" />
          </div>

          {/* Cancelled */}
          <div className="relative overflow-hidden rounded-xl bg-red-50 border border-red-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle size={20} className="text-red-500" />
              </div>
              <span className="text-xs font-bold text-red-500 bg-red-100 px-2.5 py-1 rounded-full">
                Cancelled
              </span>
            </div>
            <p className="text-3xl font-black text-red-600">
              {orderStats.cancelled}
            </p>
            <p className="text-xs text-red-400 mt-1">orders cancelled</p>
            <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-red-100 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Layout Component ---
const OperationManager = () => {
  const usenavigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        return <DashboardOverview />;
      case "Liquor":
        return <LiquorManage />;
      case "Food":
        return <RestaurantManager />;
      default:
        return <DashboardOverview />;
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
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

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
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-white" : "text-white"}
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
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white shadow-sm">
              {/* Dummy Avatar Graphic - Empty or Icon */}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-gray-800">Admin Name</p>
              <p className="text-xs text-gray-500">Operational Manager</p>
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
