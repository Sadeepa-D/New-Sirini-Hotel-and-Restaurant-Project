import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  X,
  CalendarDays,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import ReceptionHallBookingCard from "./ReceptionHallBookingCard";
import ReceptionHallBookForm from "./ReceptionHallBookForm";
import ConfirmDialog from "../../ConfrimDialog";
import Calander from "../../Calander";

const ReceptionHallBookMng = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [bookings, setbookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(
    typeof window !== "undefined"
      ? window.innerWidth < 640
        ? 1
        : window.innerWidth < 1024
          ? 2
          : 4
      : 4,
  );

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null,
    type: "",
    title: "",
    message: "",
  });
  const [showcalander, setShowCalander] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchBookedDates = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/booking/dates`,
      );

      const rawData = response.data;

      const normalized = rawData.map((item) => {
        const date = new Date(item.eventDate);
        const y = date.getUTCFullYear();
        const m = String(date.getUTCMonth() + 1).padStart(2, "0");
        const d = String(date.getUTCDate()).padStart(2, "0");
        return { dateStr: `${y}-${m}-${d}`, time: item.eventTime };
      });
      setBookedDates(normalized);
    } catch (error) {
      console.error("Error fetching booked dates:", error);
    } finally {
      setLoadingDates(false);
    }
  };
  useEffect(() => {
    fetchBookedDates();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/booking/view`,
      );
      setbookings(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchBookedDates();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      b.eventType?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setIndex((prev) =>
      Math.min(prev, Math.max(0, filtered.length - itemsPerView)),
    );
  }, [filtered.length, itemsPerView]);

  const handleEdit = (booking) => {
    setEditData(booking);
    setShowForm(true);
  };

  const handleconfirmCancel = (id) => {
    setConfirmDialog({
      isOpen: true,
      id,
      type: "cancel",
      title: "Cancel Booking",
      message: "Are you sure you want to cancel this booking?",
      status: "Cancelled",
    });
  };

  const handleconfirmConfrim = (id) => {
    setConfirmDialog({
      isOpen: true,
      id,
      type: "Confirm",
      title: "Confirm Booking",
      message: "Are you sure you want to confirm this booking?",
      status: "Confirmed",
    });
  };

  const handlebookingstatus = async () => {
    const { id, status } = confirmDialog;
    setConfirmDialog({ isOpen: false, id: null });
    try {
      const response = await axios.put(
        `${VITE_URL}/api/receptionhall/booking/update/status/${id}/${status}`,
      );
      if (response.status === 200) {
        toast.success(`Booking ${status.toLowerCase()} successfully`);
        fetchBookings();
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status");
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-amber-500 uppercase tracking-widest font-medium mb-0.5">
            Manage
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarDays size={22} className="text-amber-500" />
            Bookings
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-amber-400 transition-colors bg-white">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm text-gray-600 outline-none w-44 placeholder-gray-300"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={13} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          {/* Add button */}
          <button
            onClick={() => {
              setEditData(null);
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus size={16} /> Add Bookings
          </button>
          <button
            onClick={() => setShowCalander(!showcalander)}
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            {showcalander ? <X size={16} /> : <Calendar size={16} />}
            {showcalander ? "Hide Calendar" : "Show Calendar"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {["All", "Confirmed", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setIndex(0); // Reset carousel to the first page when changing filters
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm border ${
                statusFilter === status
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-500 border-gray-100 hover:bg-gray-50"
              }`}
            >
              {status} (
              {status === "All"
                ? bookings.length
                : bookings.filter((b) => b.status === status).length}
              )
            </button>
          ))}
        </div>
      </div>

      {/* Cards Carousel */}
      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            No bookings found
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Left arrow */}
          {index > 0 && (
            <button
              onClick={() => setIndex((i) => Math.max(0, i - itemsPerView))}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
          )}

          {/* Visible cards — slice-based carousel */}
          <div
            key={index}
            className="flex items-stretch gap-6"
            style={{ animation: "fadeIn 0.25s ease" }}
          >
            {filtered.slice(index, index + itemsPerView).map((booking) => (
              <div
                key={booking._id}
                className="shrink-0"
                style={{
                  width: `calc((100% - ${16 * (itemsPerView - 1)}px) / ${itemsPerView})`,
                }}
              >
                <ReceptionHallBookingCard
                  booking={booking}
                  onEdit={handleEdit}
                  onCancel={handleconfirmCancel}
                  onConfirm={handleconfirmConfrim}
                />
              </div>
            ))}
          </div>

          {/* Right arrow */}
          {index + itemsPerView < filtered.length && (
            <button
              onClick={() =>
                setIndex((i) =>
                  Math.min(filtered.length - itemsPerView, i + itemsPerView),
                )
              }
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          )}

          {/* Page dots */}
          {filtered.length > itemsPerView && (
            <div className="flex justify-center gap-1.5 mt-6">
              {Array.from({
                length: Math.ceil(filtered.length / itemsPerView),
              }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i * itemsPerView)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    Math.floor(index / itemsPerView) === i
                      ? "bg-amber-500"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <ReceptionHallBookForm
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          editData={editData}
          fetchBookings={fetchBookings}
          AllBookings={bookings}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        type={confirmDialog.type}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={handlebookingstatus}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
      {showcalander && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Dark Background */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCalander(false)}
          />

          {/* Popup Calendar */}
          <div className="relative z-[101] animate-in fade-in zoom-in-95 duration-300">
            <Calander BookedDates={bookedDates} loading={loadingDates} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionHallBookMng;
