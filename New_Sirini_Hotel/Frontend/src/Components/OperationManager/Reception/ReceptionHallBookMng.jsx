import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  X,
  CalendarDays,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
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
  const [packages, setPackages] = useState([]);

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
    fetchpackages();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/booking/view`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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

  const sliderRef = useRef(null);
  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;
    const cardWidth =
      sliderRef.current.querySelector("[data-slider-card]")?.offsetWidth || 320;
    sliderRef.current.scrollBy({
      left: direction * (cardWidth + 16),
      behavior: "smooth",
    });
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      b.eventType?.toLowerCase().includes(search.toLowerCase()) ||
      b.refnumber?.toLowerCase().includes(search.toLowerCase()) ||
      b._id?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const handlebookingstatus = async () => {
    const { id, status } = confirmDialog;
    setConfirmDialog({ isOpen: false, id: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${VITE_URL}/api/receptionhall/booking/update/status/${id}/${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
  const fetchpackages = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/package/view`,
      );
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setPackages([]);
    }
  };

  return (
    <div className="p-2 sm:p-6 space-y-6">
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
      <div className="flex items-center overflow-x-auto sm:flex-wrap gap-2 no-scrollbar pb-1 sm:pb-0">
        {["All", "Confirmed", "Booked", "Cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm border whitespace-nowrap ${
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

      {/* Cards Carousel */}
      {filtered.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm max-w-6xl mx-auto">
          <Filter size={32} className="text-gray-300 mb-3 stroke-[1.5]" />
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] text-center px-4">
            {search
              ? `No bookings match "${search}"`
              : `No ${statusFilter.toLowerCase()} requests recorded yet`}
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scrollSlider(-1)}
            aria-label="Scroll left"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg text-gray-600 hover:text-amber-500 hover:border-amber-400 transition-all active:scale-90"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>

          {/* Scroll container */}
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1"
          >
            {filtered.map((booking) => (
              <div
                key={booking._id}
                data-slider-card
                className="w-full shrink-0 snap-start md:w-[calc(25%-12px)]"
              >
                <ReceptionHallBookingCard
                  booking={booking}
                  onEdit={handleEdit}
                  onCancel={handleconfirmCancel}
                />
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scrollSlider(1)}
            aria-label="Scroll right"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg text-gray-600 hover:text-amber-500 hover:border-amber-400 transition-all active:scale-90"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>

          {/* Mobile swipe hint */}
          <p className="mt-2 text-center text-[10px] text-gray-400 font-medium tracking-wider md:hidden">
            ← Swipe to browse →
          </p>
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
          packages={packages}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        type={confirmDialog.type}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={handlebookingstatus}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
      {showcalander && (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
          {/* Dark Background */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCalander(false)}
          />

          {/* Popup Calendar */}
          <div className="relative z-101 animate-in fade-in zoom-in-95 duration-300">
            <Calander BookedDates={bookedDates} loading={loadingDates} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionHallBookMng;
