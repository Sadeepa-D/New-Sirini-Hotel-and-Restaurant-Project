import React, { useEffect, useState, useCallback } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Archive,
  Check,
  Bed,
  CalendarDays,
  BadgeDollarSign,
  Trash2,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const RoomsSection = () => {
  const [allRooms, setAllRooms] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [cancellationLoading, setCancellationLoading] = useState(null);
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
        },
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

  const handleCancelBooking = async (bookingId, roomNumber) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this booking? The dates will become available again.",
      )
    ) {
      return;
    }

    setCancellationLoading(bookingId);
    const toastId = toast.loading("Cancelling booking...");

    try {
      await axios.put(`${VITE_API_URL}/api/rooms/cancelbooking/${bookingId}`);
      toast.success(
        "Booking cancelled successfully. Dates are now available.",
        { id: toastId },
      );
      fetchUserSpecificRooms();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error.response?.data?.error || "Failed to cancel booking", {
        id: toastId,
      });
    } finally {
      setCancellationLoading(null);
    }
  };

  const counts = {
    pending: allRooms.filter((r) => r.status?.toLowerCase() === "pending")
      .length,
    approved: allRooms.filter(
      (r) =>
        r.status?.toLowerCase() === "confirmed" ||
        r.status?.toLowerCase() === "approved",
    ).length,
    completed: allRooms.filter((r) => r.status?.toLowerCase() === "completed")
      .length,
    cancelled: allRooms.filter(
      (r) =>
        r.status?.toLowerCase() === "cancelled" ||
        r.status?.toLowerCase() === "canceled",
    ).length,
  };

  const filteredRooms = allRooms.filter((room) => {
    const s = room.status?.toLowerCase();
    if (activeTab === "Pending") return s === "pending";
    if (activeTab === "Approved") return s === "confirmed" || s === "approved";
    if (activeTab === "Completed") return s === "completed";
    if (activeTab === "Cancelled") return s === "cancelled" || s === "canceled";
    return true;
  });

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm animate-pulse">Loading bookings…</p>
      </div>
    );

  return (
    <div className="space-y-6 font-sans">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            My Room Bookings
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Track all your room reservation statuses
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 max-w-full gap-0.5 shadow-inner">
          <TabBtn
            active={activeTab === "Pending"}
            onClick={() => setActiveTab("Pending")}
            label="Pending"
            count={counts.pending}
            icon={<Clock size={13} />}
          />
          <TabBtn
            active={activeTab === "Approved"}
            onClick={() => setActiveTab("Approved")}
            label="Approved"
            count={counts.approved}
            icon={<Check size={13} />}
          />
          <TabBtn
            active={activeTab === "Completed"}
            onClick={() => setActiveTab("Completed")}
            label="Completed"
            count={counts.completed}
            icon={<Archive size={13} />}
          />
          <TabBtn
            active={activeTab === "Cancelled"}
            onClick={() => setActiveTab("Cancelled")}
            label="Cancelled"
            count={counts.cancelled}
            icon={<XCircle size={13} />}
          />
        </div>
      </div>

      {/* ── Cards / Empty ── */}
      {filteredRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Bed size={36} className="text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm font-medium">
            No {activeTab.toLowerCase()} bookings found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRooms.map((room) => (
            <div
              key={room.id || room._id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
            >
              {/* Card top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-amber-300" />

              <div className="p-5">
                {/* Header: Room & Status */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center group-hover:bg-amber-500 transition-colors duration-300">
                      <Bed
                        size={20}
                        className="text-amber-500 group-hover:text-white transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest leading-none mb-1">
                        Room No.
                      </p>
                      <p className="text-xl font-black text-gray-900 leading-none">
                        {room.roomNumber}
                      </p>
                      {room.timeSlot && (
                        <span className={`inline-block mt-1.5 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md ${
                          room.timeSlot === "day" 
                            ? "bg-blue-50 text-blue-500 border border-blue-100" 
                            : "bg-purple-50 text-purple-500 border border-purple-100"
                        }`}>
                          {room.timeSlot === "day" ? "Mid Day Stay" : "Overnight Stay"}
                        </span>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={room.status} />
                </div>

                {/* Check-in / Check-out */}
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between mb-4 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <CalendarDays
                      size={14}
                      className="text-amber-500 shrink-0"
                    />
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        Check In
                      </p>
                      <p className="text-xs font-bold text-gray-800">
                        {new Date(room.checkInDate).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <div className="flex items-center gap-2 text-right">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        Check Out
                      </p>
                      <p className="text-xs font-bold text-gray-800">
                         {room.timeSlot === "day" 
                          ? new Date(room.checkInDate).toLocaleDateString("en-GB")
                          : new Date(room.checkOutDate).toLocaleDateString("en-GB")
                        }
                      </p>
                    </div>
                    <CalendarDays
                      size={14}
                      className="text-amber-500 shrink-0"
                    />
                  </div>
                </div>

                {/* Footer: Price & Action Button */}
                <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BadgeDollarSign size={16} className="text-amber-500" />
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                          Total Paid
                        </p>
                        <p className="text-lg font-black text-amber-600 leading-none">
                          Rs.{room.totalAmount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest italic">
                      New Sirini Hotel
                    </p>
                  </div>

                  {/* Cancel Button for Pending Bookings Only */}
                  {room.status?.toLowerCase() === "pending" && (
                    <button
                      onClick={() =>
                        handleCancelBooking(room._id, room.roomNumber)
                      }
                      disabled={cancellationLoading === room._id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-red-200 hover:border-red-300"
                    >
                      <Trash2 size={16} />
                      <span className="tracking-wider uppercase text-xs">
                        {cancellationLoading === room._id
                          ? "Cancelling..."
                          : "Cancel Booking"}
                      </span>
                    </button>
                  )}
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
    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] uppercase tracking-wider transition-all whitespace-nowrap font-sans font-semibold ${
      active
        ? "bg-white text-amber-600 shadow-sm ring-1 ring-black/5"
        : "text-gray-400 hover:text-gray-600 font-normal"
    }`}
  >
    {React.cloneElement(icon, { size: 12 })}
    <span>{label}</span>
    <span
      className={`ml-0.5 text-[9px] font-mono ${active ? "text-amber-400" : "opacity-50"}`}
    >
      ({count})
    </span>
  </button>
);

const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase();

  let label = status;
  let style = "bg-amber-50 text-amber-600 border-amber-200";

  if (s === "confirmed" || s === "approved") {
    style = "bg-green-50 text-green-600 border-green-200";
    label = "Approved";
  } else if (s === "cancelled" || s === "canceled") {
    style = "bg-red-50 text-red-500 border-red-200";
    label = "Cancelled";
  } else if (s === "completed") {
    style = "bg-blue-50 text-blue-600 border-blue-200";
    label = "Completed";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${style} font-sans`}
    >
      {label}
    </span>
  );
};

export default RoomsSection;
