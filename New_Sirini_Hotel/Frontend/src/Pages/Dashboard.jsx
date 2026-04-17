import React, { useState } from "react";
import {
  User,
  Bed,
  UtensilsCrossed,
  CalendarDays,
  Megaphone,
  LogOut,
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

  // Mock Data for UI Demonstration
  const mockRooms = [
    {
      id: "RM-1024",
      type: "Deluxe Ocean View",
      checkIn: "Oct 15, 2024",
      checkOut: "Oct 18, 2024",
      status: "Confirmed",
      price: "$450",
    },
    {
      id: "RM-1025",
      type: "Standard Suite",
      checkIn: "Nov 02, 2024",
      checkOut: "Nov 05, 2024",
      status: "Pending",
      price: "$200",
    },
  ];

  const mockOrders = [
    {
      id: "ORD-992",
      items: "2x Grilled Salmon, 1x Red Wine",
      date: "Oct 15, 2024 - 19:30",
      status: "Preparing",
      total: "$85",
    },
    {
      id: "ORD-980",
      items: "1x Continental Breakfast",
      date: "Oct 14, 2024 - 08:00",
      status: "Delivered",
      total: "$25",
    },
  ];

  const handlelogout = () => {
    // Clear user session (e.g., remove token, clear local storage)
    localStorage.removeItem("token");
    // Redirect to login page or homepage
    navigate("/login");
    toast.success("logged out successfully.");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* RESTORED: Dashboard Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-500 mt-1">
              Manage your bookings, orders, and profile details.
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shadow-sm self-start sm:self-auto"
            onClick={handlelogout}
          >
            <LogOut size={18} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* RESTORED: Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex lg:flex-col overflow-x-auto lg:overflow-visible overflow-y-hidden hide-scrollbar">
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
                label="Restaurant Orders"
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
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 min-h-[600px]">
            {activeTab === "profile" && <ProfileSection />}
            {activeTab === "rooms" && <RoomsSection data={mockRooms} />}
            {activeTab === "restaurant" && (
              <RestrauntSection data={mockOrders} />
            )}
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
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap min-w-max lg:min-w-0 font-medium ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`}
  >
    <Icon
      size={20}
      className={isActive ? "text-indigo-700" : "text-gray-400"}
    />
    {label}
  </button>
);
export default UserDashboard;
