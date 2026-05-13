import React, { useState } from "react";
import {
  User,
  Bed,
  UtensilsCrossed,
  CalendarDays,
  Megaphone,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import ProfileSection from "../Components/Dashboard/ProfileSection";
import RoomsSection from "../Components/Dashboard/RoomsSection";
import RestrauntSection from "../Components/Dashboard/RestrauntSection";
import AppointmentsSection from "../Components/Dashboard/AppointmentSection";
import AdsSection from "../Components/Dashboard/AdsSection";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile Details", icon: User },
    { id: "rooms", label: "Room Bookings", icon: Bed },
    { id: "restaurant", label: "Restaurant Orders", icon: UtensilsCrossed },
    { id: "appointments", label: "Appointments", icon: CalendarDays },
    { id: "ads", label: "Advertisements", icon: Megaphone },
  ];

  const handlelogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("logged out successfully.");
  };

  return (
    <div className="min-h-screen bg-neutral-950 font-serif">
      {/* ── Top Header Bar ── */}
      <div className="w-full px-4 sm:px-8 py-4 border-b border-white/8 flex items-center justify-between gap-4 bg-black/60 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all duration-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-white text-base sm:text-lg font-bold tracking-wide leading-none">
              My Account
            </h1>
            <p className="text-gray-500 text-[10px] sm:text-xs italic mt-1 hidden sm:block">
              Manage your bookings, orders, and profile details.
            </p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 text-sm font-semibold"
          onClick={handlelogout}
        >
          <LogOut size={16} />
          <span className="hidden sm:inline tracking-wider uppercase text-xs">Sign Out</span>
        </button>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Dropdown Navigation */}
        <div className="lg:hidden mb-6">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
            Navigate Section
          </label>
          <div className="relative">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-amber-400 font-sans font-semibold appearance-none outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Sidebar Navigation (Desktop) ── */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-neutral-900 border border-white/8 rounded-2xl p-2 flex flex-col gap-1 sticky top-28">
              {tabs.map((tab) => (
                <NavButton
                  key={tab.id}
                  icon={tab.icon}
                  label={tab.label}
                  isActive={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </div>
          </div>

          {/* ── Main Content Area ── */}
          <div className="flex-1 min-w-0 bg-white border border-gray-100 rounded-3xl shadow-sm p-4 sm:p-6 lg:p-8 min-h-[500px] sm:min-h-[600px]">
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {activeTab === "profile" && <ProfileSection />}
              {activeTab === "rooms" && <RoomsSection />}
              {activeTab === "restaurant" && <RestrauntSection />}
              {activeTab === "appointments" && <AppointmentsSection />}
              {activeTab === "ads" && <AdsSection />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Navigation Button
const NavButton = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap min-w-max lg:min-w-0 font-sans text-left w-full ${
      isActive
        ? "bg-amber-500/15 text-amber-400 border border-amber-500/25 font-semibold"
        : "text-gray-500 hover:bg-white/5 hover:text-gray-300 border border-transparent font-medium"
    }`}
  >
    <div
      className={`p-1.5 rounded-lg shrink-0 ${
        isActive ? "bg-amber-500/20" : "bg-white/5"
      }`}
    >
      <Icon
        size={18}
        strokeWidth={isActive ? 2.5 : 2}
        className={isActive ? "text-amber-400" : "text-gray-500"}
      />
    </div>
    <span className="tracking-wide text-sm">{label}</span>
    {isActive && (
      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
    )}
  </button>
);

export default UserDashboard;
