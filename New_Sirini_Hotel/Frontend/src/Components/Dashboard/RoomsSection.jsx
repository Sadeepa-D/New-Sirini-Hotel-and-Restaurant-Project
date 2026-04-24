import React, { useState, useEffect } from "react";
import { CalendarDays, XCircle } from "lucide-react";
import { StatusBadge } from "./SharedUI";
import axios from "axios";

const RoomsSection = () => {
  const [usersepecificRooms, setuserSpecificRooms] = useState([]);
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const fetchUserSpecificRooms = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${VITE_API_URL}/api/rooms/viewspecificuserbookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setuserSpecificRooms(response.data);
    } catch (error) {
      console.error("Error fetching user-specific rooms:", error);
    }
  };

  useEffect(() => {
    fetchUserSpecificRooms();
  }, []);
  return (
    <div className="max-w-6xl mx-auto p-6 bg-black min-h-screen text-white font-sans">
      {/* Page Title */}
      <div className="border-l-4 border-orange-500 pl-4 mb-12">
        <h2 className="text-4xl font-serif font-black uppercase tracking-tight">
          Your Room Registry
        </h2>
        <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mt-1">
          Exclusive Access - New Sirini Hotel
        </p>
      </div>

      {usersepecificRooms.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-20 text-center backdrop-blur-sm">
          <p className="text-gray-400 text-lg italic font-light tracking-wide">
            No active room bookings found in your history.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {usersepecificRooms.map((room) => (
            <div
              key={room.id}
              className="bg-[#0f0f0f] border border-white/10 rounded-[2rem] p-7 hover:border-orange-500/40 transition-all duration-500 group shadow-2xl relative overflow-hidden"
            >
              {/* Status & Room Badge */}
              <div className="flex justify-between items-start mb-8">
                <div
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                    room.status === "Confirmed"
                      ? "bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                      : room.status === "Cancelled"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                  }`}
                >
                  {room.status === "Confirmed" ? (
                    <CheckCircle size={14} />
                  ) : room.status === "Cancelled" ? (
                    <XCircle size={14} />
                  ) : (
                    <Clock size={14} />
                  )}
                  {room.status}
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-[10px] uppercase font-black tracking-widest mb-1">
                    Room No
                  </p>
                  <p className="text-3xl font-mono font-black italic text-white group-hover:text-orange-500 transition-colors duration-500">
                    #{room.roomNumber}
                  </p>
                </div>
              </div>

              {/* Guest Details */}
              <div className="space-y-5 mb-8">
                <div className="flex items-center gap-4 group/item">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 group-hover/item:text-orange-500 transition-colors">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-[9px] uppercase font-black tracking-[0.2em] leading-none mb-1">
                      Reserved For
                    </p>
                    <p className="text-white text-base font-bold tracking-tight">
                      {room.guestName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group/item">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 group-hover/item:text-orange-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-500 text-[9px] uppercase font-black tracking-[0.2em] leading-none mb-1">
                      Contact Email
                    </p>
                    <p className="text-white text-sm font-medium truncate">
                      {room.guestEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Dates Container */}
              <div className="grid grid-cols-2 gap-4 bg-white/[0.03] p-5 rounded-[1.5rem] border border-white/5 mb-8">
                <div>
                  <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 leading-none">
                    <Calendar size={12} /> Check-In
                  </p>
                  <p className="text-sm font-mono font-bold text-gray-200">
                    {new Date(room.checkInDate).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <div className="border-l border-white/10 pl-5">
                  <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 leading-none">
                    <Calendar size={12} /> Check-Out
                  </p>
                  <p className="text-sm font-mono font-bold text-gray-200">
                    {new Date(room.checkOutDate).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>

              {/* Price Footer */}
              <div className="pt-5 border-t border-white/5 flex justify-between items-center">
                <div>
                  <p className="text-gray-600 text-[9px] uppercase font-black tracking-widest mb-1">
                    Total Stay Value
                  </p>
                  <p className="text-orange-500 text-2xl font-black italic tracking-tighter">
                    Rs.{room.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-orange-500/10 p-3 rounded-2xl border border-orange-500/10 group-hover:bg-orange-500/20 transition-all duration-500">
                  <Hash size={20} className="text-orange-500" />
                </div>
              </div>

              {/* Decorative Background Accent */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/10 transition-all duration-700"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default RoomsSection;
