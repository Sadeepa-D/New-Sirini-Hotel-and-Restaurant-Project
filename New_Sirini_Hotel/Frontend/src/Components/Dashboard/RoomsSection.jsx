import React, { useEffect, useState, useCallback, useRef } from "react";
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
  Flag,
  MoveLeft,
  MoveRight,
  MessageCircle,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import ConfrimDialog from "../ConfrimDialog";
import FeedbackModal from "../FeedbackModal";

const RoomsSection = () => {
  const [allRooms, setAllRooms] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [cancellationLoading, setCancellationLoading] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(0);
  const scrollRef = useRef(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null,
    type: "delete",
    title: "",
    message: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedBookingForFeedback, setSelectedBookingForFeedback] =
    useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const fetchUserSpecificRooms = useCallback(async () => {
    try {
      setLoading(true);
      // First update overdue bookings
      await axios.put(`${VITE_API_URL}/api/rooms/updateoverduebookings`);

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

  useEffect(() => {
    // Fetch user profile for feedback modal
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${VITE_API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchProfile();
  }, [VITE_API_URL]);

  useEffect(() => {
    setSliderPosition(0);
  }, [activeTab]);

  const handleSliderScroll = (e) => {
    setSliderPosition(e.target.scrollLeft);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handlecancelconfrim = (id) => {
    setConfirmDialog({
      isOpen: true,
      id,
      type: "Cancel",
      title: "Cancel Booking?",
      message:
        "Are you sure you want to cancel this booking? The dates will become available again.",
    });
  };

  const handleCancelBooking = async () => {
    const { id } = confirmDialog;
    setConfirmDialog({ isOpen: false, id: null });
    setCancellationLoading(id);
    const toastId = toast.loading("Cancelling booking...");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${VITE_API_URL}/api/rooms/cancelbooking/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
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

  const handleOpenFeedbackModal = (booking) => {
    setSelectedBookingForFeedback(booking);
    setFeedbackModalOpen(true);
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
    overdue: allRooms.filter((r) => r.status?.toLowerCase() === "overdue")
      .length,
  };

  const filteredRooms = allRooms.filter((room) => {
    const s = room.status?.toLowerCase();
    if (activeTab === "Pending") return s === "pending";
    if (activeTab === "Approved") return s === "confirmed" || s === "approved";
    if (activeTab === "Completed") return s === "completed";
    if (activeTab === "Cancelled") return s === "cancelled" || s === "canceled";
    if (activeTab === "Overdue") return s === "overdue";
    return true;
  });

  const searchrooms = (searchTerm ? allRooms : filteredRooms).filter((room) => {
    const term = searchTerm.toLowerCase();
    return (
      room.roomNumber?.toString().includes(term) ||
      room.bookingCode?.toLowerCase().includes(term) ||
      new Date(room.checkInDate).toLocaleDateString("en-GB").includes(term) ||
      new Date(room.checkOutDate).toLocaleDateString("en-GB").includes(term)
    );
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
          <h2 className="text-xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
            My Room Bookings
          </h2>

          <p className="text-gray-400 text-xs mt-0.5">
            Track all your room reservation statuses
          </p>
          <div>
            <input
              type="text"
              placeholder="Search by booking ref..."
              className="mt-2 w-full sm:w-64 px-4 py-2 bg-gray-100 placeholder:text-gray-400 text-gray-700 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] gap-1 sm:gap-0.5 shadow-inner">
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
          <TabBtn
            active={activeTab === "Overdue"}
            onClick={() => setActiveTab("Overdue")}
            label="Overdue"
            count={counts.overdue}
            icon={<Flag size={13} />}
          />
        </div>
      </div>

      {/* ── Cards / Empty ── */}
      {searchrooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Bed size={36} className="text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm font-medium">
            {searchTerm
              ? `No bookings found for "${searchTerm}"`
              : `No ${activeTab.toLowerCase()} bookings found.`}
          </p>
        </div>
      ) : (
        <div className="relative group">
          {/* Slider Container */}
          <div
            ref={scrollRef}
            onScroll={handleSliderScroll}
            className="flex overflow-x-auto gap-5 pb-14 sm:pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory px-2 scroll-smooth"
          >
            {searchrooms.map((room) => {
              const status = room.status?.toLowerCase();

              // Use inline styles for dynamic colors — avoids Tailwind JIT purge issues
              const t = (() => {
                if (status === "confirmed" || status === "approved")
                  return { barFrom: "#10b981", barTo: "#14b8a6", icon: "#10b981", refBg: "#f0fdf4", refBorder: "#bbf7d0", refLabel: "#059669", codeBg: "#ffffff", codeBorder: "#a7f3d0", codeText: "#065f46", calColor: "#10b981", priceColor: "#059669", btnBg: "#f0fdf4", btnBorder: "#86efac", btnText: "#15803d" };
                if (status === "completed")
                  return { barFrom: "#3b82f6", barTo: "#6366f1", icon: "#3b82f6", refBg: "#eff6ff", refBorder: "#bfdbfe", refLabel: "#1d4ed8", codeBg: "#ffffff", codeBorder: "#93c5fd", codeText: "#1e3a8a", calColor: "#3b82f6", priceColor: "#1d4ed8", btnBg: "#fffbeb", btnBorder: "#fde68a", btnText: "#b45309" };
                if (status === "cancelled" || status === "canceled")
                  return { barFrom: "#ef4444", barTo: "#f43f5e", icon: "#ef4444", refBg: "#fef2f2", refBorder: "#fecaca", refLabel: "#dc2626", codeBg: "#ffffff", codeBorder: "#fca5a5", codeText: "#991b1b", calColor: "#ef4444", priceColor: "#dc2626", btnBg: "#fef2f2", btnBorder: "#fca5a5", btnText: "#dc2626" };
                if (status === "overdue")
                  return { barFrom: "#f97316", barTo: "#ef4444", icon: "#f97316", refBg: "#fff7ed", refBorder: "#fed7aa", refLabel: "#c2410c", codeBg: "#ffffff", codeBorder: "#fdba74", codeText: "#9a3412", calColor: "#f97316", priceColor: "#c2410c", btnBg: "#fef2f2", btnBorder: "#fca5a5", btnText: "#dc2626" };
                // pending
                return { barFrom: "#f59e0b", barTo: "#f97316", icon: "#f59e0b", refBg: "#fffbeb", refBorder: "#fde68a", refLabel: "#b45309", codeBg: "#ffffff", codeBorder: "#fcd34d", codeText: "#78350f", calColor: "#f59e0b", priceColor: "#d97706", btnBg: "#fef2f2", btnBorder: "#fca5a5", btnText: "#dc2626" };
              })();

              return (
                <div
                  key={room.id || room._id}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shrink-0 w-[80vw] sm:w-[320px] snap-center flex flex-col"
                >
                  {/* Gradient top bar */}
                  <div style={{ height: "6px", background: `linear-gradient(to right, ${t.barFrom}, ${t.barTo})` }} className="w-full shrink-0" />

                  <div className="p-4 flex flex-col gap-2 flex-1">

                    {/* ── Header row: icon + room no + status badge ── */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 mt-0.5">
                        {/* Colored square icon */}
                        <div
                          style={{ background: `linear-gradient(135deg, ${t.barFrom}, ${t.barTo})` }}
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                        >
                          <Bed size={18} className="text-white" />
                        </div>
                        <div className="pt-0.5">
                          <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest leading-none mb-0">
                            Room No.
                          </p>
                          <p className="text-[1.6rem] font-black text-gray-900 leading-none">
                            {room.roomNumber}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={room.status} />
                    </div>

                    {/* ── Package badge ── */}
                    {room.timeSlot && (
                      <div>
                        <span
                          className="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                          style={
                            room.timeSlot === "day"
                              ? { background: "#dbeafe", color: "#1d4ed8" }
                              : { background: "#f3e8ff", color: "#7c3aed" }
                          }
                        >
                          {room.timeSlot === "day" ? "Day package" : "Night package"}
                        </span>
                      </div>
                    )}

                    {/* ── Booking Reference ── */}
                    {room.bookingCode && (
                      <div
                        className="flex items-center justify-between px-3 py-2 rounded-xl"
                        style={{ background: t.refBg, border: `1px solid ${t.refBorder}` }}
                      >
                        <p
                          className="text-[9px] uppercase font-black tracking-widest"
                          style={{ color: t.refLabel }}
                        >
                          Booking Ref
                        </p>
                        <span
                          className="font-mono font-black text-xs px-3 py-1 rounded-lg"
                          style={{ background: t.codeBg, border: `1px solid ${t.codeBorder}`, color: t.codeText }}
                        >
                          {room.bookingCode}
                        </span>
                      </div>
                    )}

                    {/* ── Check-in / Check-out ── */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Check In
                        </p>
                        <div className="flex items-center gap-1.5">
                          <CalendarDays size={13} style={{ color: t.calColor }} />
                          <p className="text-xs font-black text-gray-800">
                            {new Date(room.checkInDate).toLocaleDateString("en-GB")}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Check Out
                        </p>
                        <div className="flex items-center gap-1.5">
                          <CalendarDays size={13} style={{ color: t.calColor }} />
                          <p className="text-xs font-black text-gray-800">
                            {room.timeSlot === "day"
                              ? new Date(room.checkInDate).toLocaleDateString("en-GB")
                              : new Date(room.checkOutDate).toLocaleDateString("en-GB")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ── Price row ── */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                      <div>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                          Total Paid
                        </p>
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <span className="flex items-center">
                            <BadgeDollarSign size={18} style={{ color: t.priceColor }} className="shrink-0" />
                          </span>
                          <span className="text-lg font-black leading-none" style={{ color: t.priceColor }}>
                            Rs.{room.totalAmount?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-[9px] text-gray-300 italic font-medium">
                        New Sirini Hotel
                      </p>
                    </div>

                    {/* ── Buttons ── */}
                    {room.status?.toLowerCase() === "pending" && (
                      <button
                        onClick={() => handlecancelconfrim(room._id)}
                        disabled={cancellationLoading === room._id}
                        style={{ borderRadius: "10px", background: t.btnBg, border: `1px solid ${t.btnBorder}`, color: t.btnText }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-sm transition-all duration-200 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={15} />
                        <span>{cancellationLoading === room._id ? "Cancelling..." : "Cancel Booking"}</span>
                      </button>
                    )}

                    {room.status?.toLowerCase() === "completed" && (
                      <button
                        onClick={() => handleOpenFeedbackModal(room)}
                        style={{ borderRadius: "10px", background: t.btnBg, border: `1px solid ${t.btnBorder}`, color: t.btnText }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-sm transition-all duration-200 hover:opacity-80"
                      >
                        <MessageCircle size={15} />
                        <span>Leave Feedback</span>
                      </button>
                    )}

                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Dots */}
          <div className="absolute bottom-1 sm:bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1.5 sm:py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-gray-200">
            {filteredRooms.map((_, index) => {
              const cardWidth = 320; // sm:w-[320px]
              const gapWidth = 20; // gap-5 = 20px
              const itemWidth = cardWidth + gapWidth;
              const isActive =
                sliderPosition >= index * itemWidth - 50 &&
                sliderPosition <= (index + 1) * itemWidth - 50;

              return (
                <button
                  key={index}
                  onClick={() => {
                    if (scrollRef.current) {
                      scrollRef.current.scrollTo({
                        left: index * itemWidth,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className={`transition-all ${
                    isActive
                      ? "w-5 sm:w-6 h-1.5 sm:h-2 bg-amber-500 rounded-full"
                      : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-300 rounded-full hover:bg-gray-400"
                  }`}
                  aria-label={`Go to booking ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
      )}
      <ConfrimDialog
        isOpen={confirmDialog.isOpen}
        type={confirmDialog.type}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={handleCancelBooking}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false);
          setSelectedBookingForFeedback(null);
        }}
        booking={selectedBookingForFeedback}
        userName={userProfile?.name || "Guest"}
      />
    </div>
  );
};

const TabBtn = ({ active, onClick, label, icon, count }) => (
  <button
    onClick={onClick}
    style={{ borderRadius: "10px" }}
    className={`flex items-center gap-1.5 px-3 py-2 text-[10px] uppercase tracking-wider transition-all whitespace-nowrap font-sans font-semibold ${
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
