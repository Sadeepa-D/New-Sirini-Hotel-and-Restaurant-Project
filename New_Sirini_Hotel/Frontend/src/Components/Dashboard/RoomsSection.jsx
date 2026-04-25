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
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      <h2 className="text-xl font-bold text-gray-900 mb-6">My Room Bookings</h2>

      {usersepecificRooms.length === 0 ? (
        <p className="text-gray-500 text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
          No active room bookings found in your history.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {usersepecificRooms.map((room) => (
            <div
              key={room.id || room._id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 relative"
            >
              {/* Header: Room Number & Status */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Room Number</p>
                  <p className="text-2xl font-bold text-gray-900">#{room.roomNumber}</p>
                </div>
                <span 
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    room.status === "Confirmed" 
                      ? "bg-green-50 text-green-600 border border-green-100" 
                      : room.status === "Cancelled" || room.status === "Canceled"
                      ? "bg-red-50 text-red-600 border border-red-100"
                      : "bg-orange-50 text-orange-600 border border-orange-100"
                  }`}
                >
                  {room.status}
                </span>
              </div>

              {/* Booking Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600 gap-3">
                  <CalendarDays size={18} className="text-gray-400" />
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900">
                      {new Date(room.checkInDate).toLocaleDateString("en-GB")}
                    </span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(room.checkOutDate).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <span className="text-gray-400">Reserved for: </span>
                  <span className="font-medium text-gray-800">{room.guestName || room.name}</span>
                </div>
              </div>

              {/* Footer: Price */}
              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <p className="text-lg font-bold text-orange-600">
                  Rs.{room.totalAmount?.toLocaleString()}
                </p>
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
                  New Sirini Hotel
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default RoomsSection;