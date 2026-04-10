import React, { useState } from "react";
import Logo from "../../assets/Logo.png";
import RoomOperation from "../../Components/OperationManager/Rooms/RoomOperation";
import {
  Home,
  BedDouble,
  ConciergeBell,
  LogOut,
  Menu,
  Users,
  CalendarCheck,
  TrendingUp,
  X,
} from "lucide-react";

//Placeholder Components 
const ReceptionComponent = () => (
  <div className="p-6 text-gray-600">
    Reception Component (Mount your reception data here)
  </div>
);

const LogoutComponent = () => (
  <div className="p-6 text-gray-600">
    Logout Component (Mount your logout logic here)
  </div>
);

// Dashboard Data 
const dashboardData = {
  monthly: [
    { title: "Total Room Bookings", value: "24", sub: "This month" },
    { title: "Rooms Available", value: "02", sub: "Out of 04 rooms" },
    { title: "Guests Today", value: "16", sub: "Check-ins & stay" },
    { title: "Total Revenue", value: "Rs.128,000", sub: "This month" },
  ],
  yearly: [
    { title: "Total Room Bookings", value: "286", sub: "This year" },
    { title: "Rooms Available", value: "02", sub: "Out of 04 rooms" },
    { title: "Guests Today", value: "192", sub: "Total guests" },
    { title: "Total Revenue", value: "Rs.1,540,000", sub: "This year" },
  ],
};

// Dashboard Component
const Dashboard = () => {
  const [filter, setFilter] = useState("monthly");

  const icons = [
    <CalendarCheck size={24} className="text-gray-700" />,
    <BedDouble size={24} className="text-gray-700" />,
    <Users size={24} className="text-gray-700" />,
    <TrendingUp size={24} className="text-gray-700" />,
  ];

  const stats = dashboardData[filter];

  return (
    <div className="p-3 sm:p-4 md:p-8">
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 sm:mb-6">
        <button
          onClick={() => setFilter("monthly")}
          className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            filter === "monthly"
              ? "bg-yellow-500 text-black"
              : "bg-white text-gray-500 hover:bg-gray-100"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setFilter("yearly")}
          className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            filter === "yearly"
              ? "bg-yellow-500 text-black"
              : "bg-white text-gray-500 hover:bg-gray-100"
          }`}
        >
          Yearly
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-3 sm:p-5 md:p-6 rounded-xl shadow-sm flex flex-col justify-between min-h-[100px] sm:min-h-[130px] md:min-h-[150px] hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>{icons[index]}</div>
              <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider font-semibold text-right leading-tight">
                {stat.sub}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mt-3 gap-1">
              <span className="text-gray-600 font-bold text-xs sm:text-sm md:text-base leading-tight">
                {stat.title}
              </span>
              <span className="text-sm sm:text-xl md:text-2xl font-bold text-gray-800 break-all">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Manager Layout 
const Manager = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "rooms", label: "Rooms", icon: BedDouble },
    { id: "reception", label: "Reception", icon: ConciergeBell },
    { id: "logout", label: "Logout", icon: LogOut },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "rooms":
        return <RoomOperation />;
      case "reception":
        return <ReceptionComponent />;
      case "logout":
        return <LogoutComponent />;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Manager Dashboard Overview";
      case "rooms":
        return "Rooms";
      case "reception":
        return "Reception";
      case "logout":
        return "Logout";
      default:
        return "Manager Dashboard Overview";
    }
  };

  return (
    <div className="flex h-screen bg-black font-sans overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 sm:w-72 md:w-80 bg-black text-white transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 sm:p-6 border-b border-gray-800 flex items-center gap-3">
          <img
            src={Logo}
            alt="Hotel Logo"
            className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain flex-shrink-0"
          />
          <div className="min-w-0">
            <h2 className="font-serif italic text-base sm:text-lg md:text-xl text-white truncate">
              New Sirini Hotel
            </h2>
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 tracking-wide uppercase">
              Manager Panel
            </p>
          </div>
          {/* Close button - mobile only */}
          <button
            className="ml-auto md:hidden text-gray-400 hover:text-white flex-shrink-0"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 sm:py-6 px-3 sm:px-4 space-y-1 sm:space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLogout = item.id === "logout";
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-yellow-500 text-white font-bold"
                    : isLogout
                      ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
              >
                <Icon
                  size={18}
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

        {/* Manager Badge */}
        <div className="p-3 sm:p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-yellow-500 rounded-lg flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
              M
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-bold truncate">Manager</p>
              <p className="text-gray-500 text-[10px] truncate">
                New Sirini Hotel
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white m-2 sm:m-3 md:m-4 mb-2 rounded-xl p-3 sm:p-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-1.5 sm:p-2 text-gray-600 hover:bg-gray-200 rounded-lg flex-shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
              {getPageTitle()}
            </h2>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm text-sm">
              M
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-gray-800">Manager</p>
              <p className="text-xs text-gray-500">Hotel Manager</p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 pt-0 bg-transparent">
          <div className="bg-gray-100 rounded-xl min-h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Manager;
