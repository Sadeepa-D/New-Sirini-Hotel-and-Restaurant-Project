import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Clock,
  XCircle,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AppointmentCard from "../OperationManager/Reception/AppointmentCard";
import AppointForm from "../Receptionhall/receptionform";
import ConfrimDialog from "../ConfrimDialog";

const TABS = [
  { key: "Pending", label: "Pending", icon: Clock, color: "text-amber-500" },
  {
    key: "Cancelled",
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-500",
  },
  {
    key: "Completed",
    label: "Completed",
    icon: CheckCircle2,
    color: "text-green-500",
  },
];

const AppointmentsSection = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAppt, setEditingAppt] = useState(null);
  const [activeTab, setActiveTab] = useState("Pending");
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null,
    type: "delete",
    title: "",
    message: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const sliderRef = useRef(null);

  const scrollSection = (direction) => {
    if (!sliderRef.current) return;
    const cardWidth =
      sliderRef.current.querySelector("[data-slider-card]")?.offsetWidth || 300;
    sliderRef.current.scrollBy({
      left: direction * (cardWidth + 16),
      behavior: "smooth",
    });
  };

  const VITE_URL = import.meta.env.VITE_API_URL;

  const fetchappointments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to view appointments.");
        return;
      }
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/appointment/view/userspecific`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchappointments();
  }, []);

  const handlecancelconfrim = (id) => {
    setConfirmDialog({
      isOpen: true,
      id,
      type: "Cancel",
      title: "Cancel Appointment?",
      message: "Are you sure you want to cancel this appointment?",
    });
  };

  const handlecancel = async () => {
    const { id } = confirmDialog;
    setConfirmDialog({ isOpen: false, id: null });
    const loadingToast = toast.loading("Canceling appointment...");
    try {
      await axios.put(
        `${VITE_URL}/api/receptionhall/appointment/update/Canceled/${id}`,
      );
      toast.dismiss(loadingToast);
      toast.success("Appointment canceled successfully.");
      fetchappointments();
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error("Failed to cancel appointment. Please try again.");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm animate-pulse">
          Loading appointments…
        </p>
      </div>
    );
  }

  // Count per tab
  const counts = {
    Pending: appointments.filter((a) => a.status === "Pending").length,
    Cancelled: appointments.filter((a) => a.status === "Cancelled").length,
    Completed: appointments.filter((a) => a.status === "Completed").length,
  };

  // Filter to active tab
  const filtered = appointments.filter((a) => a.status === activeTab);

  const searchappoint = (searchTerm ? appointments : filtered).filter((app) => {
    const term = searchTerm.toLowerCase();
    return (
      app.receptionHall?.name.toLowerCase().includes(term) ||
      app.date.toString().toLowerCase().includes(term) ||
      app.appointcode?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 font-sans relative">
      {/* ── Header + Tabs ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            My Appointments
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            View and manage your reception hall bookings
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

        {/* Tab bar */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 gap-0.5 shadow-inner overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] uppercase tracking-wider transition-all whitespace-nowrap font-semibold ${
                activeTab === key
                  ? "bg-white shadow-sm ring-1 ring-black/5 text-gray-800"
                  : "text-gray-400 hover:text-gray-600 font-normal"
              }`}
            >
              <Icon size={12} className={activeTab === key ? color : ""} />
              {label}
              <span
                className={`text-[9px] font-mono ml-0.5 ${activeTab === key ? "text-amber-400" : "opacity-50"}`}
              >
                ({counts[key]})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Slider row ── */}
      {searchappoint.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <CalendarDays size={32} className="text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm font-medium">
            No {activeTab.toLowerCase()} appointments found.
          </p>
        </div>
      ) : (
        <div className="relative mt-4">
          {/* Left arrow */}
          <button
            onClick={() => scrollSection(-1)}
            aria-label="Scroll left"
            className={`hidden ${searchappoint.length > 2 ? "md:flex" : ""} absolute left-0 sm:-left-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md items-center justify-center hover:bg-gray-50 transition-all text-gray-600 active:scale-90`}
          >
            <ChevronLeft size={16} />
          </button>

          {/* Visible cards */}
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6"
          >
            {searchappoint.map((app) => (
              <div
                key={app._id}
                data-slider-card
                className="shrink-0 snap-start w-[90%] md:w-[calc(50%-8px)]"
              >
                <AppointmentCard
                  appointment={app}
                  onEdit={(d) => setEditingAppt(d)}
                  onCancel={handlecancelconfrim}
                />
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scrollSection(1)}
            aria-label="Scroll right"
            className={`hidden ${searchappoint.length > 2 ? "md:flex" : ""} absolute right-0 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md items-center justify-center hover:bg-gray-50 transition-all text-gray-600 active:scale-90`}
          >
            <ChevronRight size={16} />
          </button>

          {/* Swipe indicator for mobile */}
          <p className="mt-2 text-center text-[10px] text-gray-400 font-medium tracking-wider md:hidden">
            ← Swipe to browse →
          </p>
        </div>
      )}
      {/* ── Add Button ── */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/reception")}
          className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-full font-sans text-xs font-semibold uppercase tracking-wider hover:bg-amber-500 hover:text-black transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0"
        >
          + Add Appointment
        </button>
      </div>

      {/* ── Edit Modal ── */}
      {editingAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl relative my-auto shadow-2xl border border-gray-100">
            <button
              onClick={() => setEditingAppt(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-500 rounded-full transition-all duration-200"
            >
              <XCircle size={20} />
            </button>
            <div className="max-h-[90vh] overflow-y-auto rounded-2xl hide-scrollbar">
              <AppointForm
                editData={editingAppt}
                onSuccess={() => {
                  setEditingAppt(null);
                  fetchappointments();
                }}
              />
            </div>
          </div>
        </div>
      )}
      <ConfrimDialog
        isOpen={confirmDialog.isOpen}
        type={confirmDialog.type}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={handlecancel}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AppointmentsSection;
