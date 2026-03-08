import React, { useState } from "react";
import Logo from "../../assets/Logo.png";
import RoomOperation from "../../Components/Manager_/RoomOperation";
import {
  Home,
  BedDouble,
  ConciergeBell,
  LogOut,
  Menu,
  Users,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";


const dashboardData = {
  monthly: [
    { title: "Total Bookings", value: "24", sub: "This month" },
    { title: "Rooms Available", value: "02", sub: "Out of 04 rooms" },
    { title: "Guests Today", value: "16", sub: "Check-ins & stay" },
    { title: "Total Revenue", value: "Rs.128,000", sub: "This month" },
  ],
  yearly: [
    { title: "Total Bookings", value: "286", sub: "This year" },
    { title: "Rooms Available", value: "02", sub: "Out of 04 rooms" },
    { title: "Guests Today", value: "192", sub: "Total guests" },
    { title: "Total Revenue", value: "Rs.1,540,000", sub: "This year" },
  ],
};


const Dashboard = () => {

  const [filter, setFilter] = useState("monthly");
  const icons = [
    <CalendarCheck size={28} className="text-gray-700" />,
    <BedDouble size={28} className="text-gray-700" />,
    <Users size={28} className="text-gray-700" />,
    <TrendingUp size={28} className="text-gray-700" />,
  ];

  const stats = dashboardData[filter];

  return(
    <>
     <div className="p-4 md:p-8">

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("monthly")}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
            filter === "monthly"
              ? "bg-yellow-500 text-black"
              : "bg-white text-gray-500 hover:bg-gray-100"
          }`}
        >
          Monthly
        </button>

        <button
          onClick={() => setFilter("yearly")}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
            filter === "yearly"
              ? "bg-yellow-500 text-black"
              : "bg-white text-gray-500 hover:bg-gray-100"
          }`}
        >
          Yearly
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-5 sm:p-6 rounded-xl shadow-sm flex flex-col justify-between min-h-[130px] sm:min-h-[150px] hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>{icons[index]}</div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                {stat.sub}
              </span>
            </div>
            <div className="flex justify-between items-end mt-4">
              <span className="text-gray-600 font-bold text-sm sm:text-lg">
                {stat.title}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-gray-800">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>

     </div>
    </>
  )

};

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
        return <DashboardOverview />;
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
        return "Dashboard Overview";
    }
  };

  return (
    <>
      <div className="flex h-screen bg-black font-sans">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed md:static inset-y-0 left-0 z-30 w-80 bg-[#000000] text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} flex flex-col`}
        >
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
                Manager Panel
              </p>
            </div>
          </div>

          <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
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

          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 bg-yellow-500 rounded-lg flex items-center justify-center text-black font-bold text-sm">
                M
              </div>
              <div>
                <p className="text-white text-xs font-bold">Manager</p>
                <p className="text-gray-500 text-[10px]">New Sirini Hotel</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white m-4 mb-2 rounded-xl p-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-3">
              {/* Name box */}
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                M
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-gray-800">Manager</p>
                <p className="text-xs text-gray-500">Hotel Manager</p>
              </div>
            </div>
          </header>

          {/*load the render content*/}
          <main className="flex-1 overflow-y-auto p-4 pt-2 bg-transparent">
            <div className="bg-gray-100 rounded-xl min-h-full">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Manager;
