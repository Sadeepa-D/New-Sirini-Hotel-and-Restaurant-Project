import React, { useState } from "react";
import Logo from "../../assets/Logo.png";
import {
  Home,
  CalendarCheck,
  BedDouble,
  LogOut,
  Menu,
  Clock,
  UserCheck
} from "lucide-react";

// --- Placeholder Components for specific data ---
const ReceptionBookings = () => (
  <div className="p-6 text-gray-600">
    <h3 className="text-lg font-bold mb-4">Reception Hall Bookings</h3>
    <p>Manage venue reservations and event schedules here.</p>
  </div>
);

const RoomStatus = () => (
  <div className="p-6 text-gray-600">
    <h3 className="text-lg font-bold mb-4">Room Inventory</h3>
    <p>Track room availability, cleaning status, and guest check-ins.</p>
  </div>
);

const Logout = () => (
  <div className="p-6 text-gray-600">Redirecting to login...</div>
);

// --- Dashboard Overview for Reception & Rooms ---
const DashboardOverview = () => {
  const stats = [
    {
      title: "Pending Hall Bookings",
      value: "05",
      icon: <CalendarCheck size={28} className="text-gray-700" />,
    },
    {
      title: "Available Rooms",
      value: "12",
      icon: <BedDouble size={28} className="text-gray-700" />,
    },
    {
      title: "Check-ins Today",
      value: "08",
      icon: <UserCheck size={28} className="text-gray-700" />,
    },
    {
      title: "Active Events",
      value: "02",
      icon: <Clock size={28} className="text-gray-700" />,
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm flex flex-col justify-between min-h-[140px] border-l-4 border-yellow-500"
          >
            <div>{stat.icon}</div>
            <div className="flex justify-between items-end mt-4">
              <span className="text-gray-600 font-bold text-sm lg:text-base">
                {stat.title}
              </span>
              <span className="text-2xl font-bold text-gray-800">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Layout Component ---
const OperationManager2 = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Overview", icon: Home },
    { id: "Reception", label: "Hall Bookings", icon: CalendarCheck },
    { id: "Rooms", label: "Room Management", icon: BedDouble },
    { id: "Logout", label: "Logout", icon: LogOut },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "Reception":
        return <ReceptionBookings />;
      case "Rooms":
        return <RoomStatus />;
      case "Logout":
        return <Logout />;
      default:
        return <DashboardOverview />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard": return "General Overview";
      case "Reception": return "Reception Hall Management";
      case "Rooms": return "Rooms & Lodging";
      default: return "Management Panel";
    }
  };

  return (
    <div className="flex h-screen bg-black font-sans">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-black text-white transform transition-transform duration-300 ease-in-out border-r border-gray-900 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } flex flex-col`}
      >
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-900 flex items-center gap-3">
          <img
            src={Logo}
            alt="Hotel Logo"
            className="w-16 h-16 object-contain"
          />
          <div>
            <h2 className="font-serif italic text-lg text-white leading-tight">
              New Sirini Hotel
            </h2>
            <p className="text-[10px] font-bold text-yellow-500 tracking-widest uppercase mt-1">
              Ops Manager II
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-4 space-y-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/20"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white m-4 mb-2 rounded-2xl p-5 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {getPageTitle()}
            </h2>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-gray-800">Operational Manager</p>
              <p className="text-[10px] text-yellow-600 font-bold uppercase">Front Office & Venue</p>
            </div>
            <div className="w-11 h-11 bg-gray-900 rounded-xl flex items-center justify-center text-yellow-500 border border-gray-800 shadow-inner">
              <UserCheck size={20} />
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto p-4 pt-2">
          <div className="bg-gray-50 rounded-2xl min-h-full shadow-inner border border-gray-200">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OperationManager2;