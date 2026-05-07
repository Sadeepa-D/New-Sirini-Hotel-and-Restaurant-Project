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

  const handlelogout = () => {
    // Clear user session (e.g., remove token, clear local storage)
    localStorage.removeItem("token");
    // Redirect to login page or homepage
    navigate("/login");
    toast.success("logged out successfully.");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-serif py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-2">
              <ArrowLeft
                size={28}
                className="inline-block mr-2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-300"
                onClick={() => navigate(-1)}
              />
              My Account
            </h1>
            <p className="text-gray-500 italic tracking-wide text-lg">
              Manage your bookings, orders, and profile details.
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-full hover:bg-red-500 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-red-500/40 hover:-translate-y-0.5 active:translate-y-0 self-start sm:self-auto"
            onClick={handlelogout}
          >
            <LogOut size={18} />
            <span className="font-sans font-semibold tracking-wider uppercase text-xs">
              Sign Out
            </span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-3 flex lg:flex-col overflow-x-auto lg:overflow-visible overflow-y-hidden hide-scrollbar gap-1.5">
              <NavButton
                icon={User}
                label="Profile Details"
                isActive={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
              />
              <NavButton
                icon={Bed}
                label="Room Bookings"
                isActive={activeTab === "rooms"}
                onClick={() => setActiveTab("rooms")}
              />
              <NavButton
                icon={UtensilsCrossed}
                label="Restaurant"
                isActive={activeTab === "restaurant"}
                onClick={() => setActiveTab("restaurant")}
              />
              <NavButton
                icon={CalendarDays}
                label="Appointments"
                isActive={activeTab === "appointments"}
                onClick={() => setActiveTab("appointments")}
              />
              <NavButton
                icon={Megaphone}
                label="Advertisements"
                isActive={activeTab === "ads"}
                onClick={() => setActiveTab("ads")}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10 min-h-150">
            {activeTab === "profile" && <ProfileSection />}
            {activeTab === "rooms" && <RoomsSection />}
            {activeTab === "restaurant" && <RestrauntSection />}
            {activeTab === "appointments" && <AppointmentsSection />}
            {activeTab === "ads" && <AdsSection />}
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
    className={`shrink-0 flex items-center gap-3.5 px-5 py-3.5 rounded-xl transition-all duration-300 whitespace-nowrap min-w-max lg:min-w-0 font-sans text-left ${
      isActive
        ? "bg-amber-50 text-amber-900 font-semibold shadow-sm ring-1 ring-amber-100"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"
    }`}
  >
    <Icon
      size={24}
      strokeWidth={isActive ? 2.5 : 2}
      className={isActive ? "text-amber-500" : "text-gray-400"}
    />
    <span className="tracking-wide">{label}</span>
  </button>
);
export default UserDashboard;
