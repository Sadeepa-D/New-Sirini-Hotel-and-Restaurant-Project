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

const Dashboard = () => {
  const stats = [
    {
      title: "Total Bookings",
      value: "24",
      icon: <CalendarCheck size={28} className="text-gray-700" />,
      sub: "This month",
    },
    {
      title: "Rooms Available",
      value: "08",
      icon: <BedDouble size={28} className="text-gray-700" />,
      sub: "Out of 12 rooms",
    },
    {
      title: "Guests Today",
      value: "16",
      icon: <Users size={28} className="text-gray-700" />,
      sub: "Check-ins & stay",
    },
    {
      title: "Total Revenue",
      value: "Rs.128,000",
      icon: <TrendingUp size={28} className="text-gray-700" />,
      sub: "This month",
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-5 sm:p-6 rounded-xl shadow-sm flex flex-col justify-between min-h-[130px] sm:min-h-[150px] hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>{stat.icon}</div>
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
  );
};

export default Dashboard;
