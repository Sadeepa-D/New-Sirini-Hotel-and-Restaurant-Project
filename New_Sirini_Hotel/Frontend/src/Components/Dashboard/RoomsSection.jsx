import React, { useEffect, useState, useCallback } from "react";
import { Clock, CheckCircle2, XCircle, Archive, Check } from "lucide-react";
import axios from "axios";

const RoomsSection = () => {
  const [allRooms, setAllRooms] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const fetchUserSpecificRooms = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${VITE_API_URL}/api/rooms/viewspecificuserbookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllRooms(response.data);
    } catch (error) {
      console.error("Error fetching user-specific rooms:", error);
    } finally {
      setLoading(false);
    }
  }, [VITE_API_URL]);

  useEffect(() => {
    fetchUserSpecificRooms();
  }, [fetchUserSpecificRooms]);

  
  const counts = {
    pending: allRooms.filter(r => r.status?.toLowerCase() === "pending").length,
    approved: allRooms.filter(r => r.status?.toLowerCase() === "confirmed" || r.status?.toLowerCase() === "approved").length,
    completed: allRooms.filter(r => r.status?.toLowerCase() === "completed").length,
    cancelled: allRooms.filter(r => r.status?.toLowerCase() === "cancelled" || r.status?.toLowerCase() === "canceled").length,
  };

  const filteredRooms = allRooms.filter((room) => {
    const s = room.status?.toLowerCase();
    if (activeTab === "Pending") return s === "pending";
    if (activeTab === "Approved") return s === "confirmed" || s === "approved";
    if (activeTab === "Completed") return s === "completed";
    if (activeTab === "Cancelled") return s === "cancelled" || s === "canceled";
    return true;
  });

  if (loading) return <div className="text-center py-20 text-gray-400 italic font-sans tracking-widest uppercase text-xs">Loading Bookings...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight font-sans">My Bookings</h2>
        
        {/* Tab Navigation with Counts */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 overflow-x-auto max-w-full scrollbar-hide shadow-inner">
          <TabBtn 
            active={activeTab === "Pending"} 
            onClick={() => setActiveTab("Pending")} 
            label="Pending" 
            count={counts.pending} 
            icon={<Clock size={14}/>} 
          />
          <TabBtn 
            active={activeTab === "Approved"} 
            onClick={() => setActiveTab("Approved")} 
            label="Approved" 
            count={counts.approved} 
            icon={<Check size={14}/>} 
          />
          <TabBtn 
            active={activeTab === "Completed"} 
            onClick={() => setActiveTab("Completed")} 
            label="Completed" 
            count={counts.completed} 
            icon={<Archive size={14}/>} 
          />
          <TabBtn 
            active={activeTab === "Cancelled"} 
            onClick={() => setActiveTab("Cancelled")} 
            label="Cancelled" 
            count={counts.cancelled} 
            icon={<XCircle size={14}/>} 
          />
        </div>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-gray-200 shadow-sm">
          <p className="text-gray-400 font-medium italic font-sans uppercase tracking-widest text-[10px]">
            No {activeTab.toLowerCase()} bookings found in your history.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredRooms.map((room) => (
            <div
              key={room.id || room._id}
              className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Header: Room & Status */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 font-black text-xl border border-orange-100 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                        {room.roomNumber}
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em] leading-none mb-1">Room No</p>
                        <p className="text-xl font-bold text-gray-900 italic font-sans italic">{room.roomNumber}</p>
                    </div>
                </div>
                <StatusBadge status={room.status} />
              </div>

              {/* Booking Info Box */}
              <div className="bg-gray-50 rounded-[1.5rem] p-5 flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Check In</p>
                    <p className="text-xs font-bold text-gray-800 font-sans">
                        {new Date(room.checkInDate).toLocaleDateString("en-GB")}
                    </p>
                </div>
                <div className="h-10 w-[1px] bg-gray-200"></div>
                <div className="text-right space-y-1">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Check Out</p>
                    <p className="text-xs font-bold text-gray-800 font-sans">
                        {new Date(room.checkOutDate).toLocaleDateString("en-GB")}
                    </p>
                </div>
              </div>

              {/* Footer: Pricing */}
              <div className="flex justify-between items-end pt-2 border-t border-gray-50">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Paid Amount</p>
                  <p className="text-2xl font-black text-orange-600 font-mono tracking-tighter">
                    Rs.{room.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <div className="text-[10px] text-gray-300 font-bold uppercase tracking-tighter italic">
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


const TabBtn = ({ active, onClick, label, icon, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all whitespace-nowrap font-sans
    ${active 
        ? "bg-white text-orange-600 shadow-sm ring-1 ring-black/5 font-semibold" 
        : "text-gray-400 hover:text-gray-600 font-normal"
    }`}
  >
    
    {React.cloneElement(icon, { size: 12 })} 
    <span>{label}</span>
    <span className={`ml-0.5 text-[9px] opacity-60 font-mono italic`}>
      ({count})
    </span>
  </button>
);

const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase();
  
  let label = status;
  let style = "bg-orange-50 text-orange-600 border-orange-100"; 

  if (s === "confirmed" || s === "approved") {
    style = "bg-green-50 text-green-600 border-green-100";
    label = "Approved";
  } else if (s === "cancelled" || s === "canceled") {
    style = "bg-red-50 text-red-600 border-red-100";
    label = "Cancelled";
  } else if (s === "completed") {
    style = "bg-blue-50 text-blue-600 border-blue-100";
    label = "Completed";
  }

  return (
    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest border-2 shadow-sm ${style} font-sans`}>
      {label}
    </span>
  );
};

export default RoomsSection;