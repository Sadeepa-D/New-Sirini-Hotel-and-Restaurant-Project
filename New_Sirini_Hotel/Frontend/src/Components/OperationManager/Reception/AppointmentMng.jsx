import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Calendar,
  Mail,
  Phone,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AppointmentCard = ({ appointment, onUpdate }) => {
  // Define status styles
  const statusStyles = {
    Completed: {
      bg: "bg-green-50",
      text: "text-green-700",
      icon: <CheckCircle2 size={16} />,
    },
    Pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      icon: <Clock size={16} />,
    },
    Canceled: {
      bg: "bg-red-50",
      text: "text-red-700",
      icon: <XCircle size={16} />,
    },
    Overdue: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      icon: <AlertCircle size={16} />,
    },
  };

  const style = statusStyles[appointment.status] || statusStyles.Pending;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-gray-50"
          style={{
            backgroundColor: style.bg.replace("bg-", ""),
            color: style.text.replace("text-", ""),
          }}
        >
          <span className={style.text}>{style.icon}</span>
          <span className={style.text}>{appointment.status}</span>
        </div>
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest flex items-center gap-1">
          <Calendar size={12} />
          {new Date(appointment.date).toLocaleDateString()}
        </p>
      </div>

      <h3 className="text-gray-800 font-bold text-lg mb-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
          <User size={16} />
        </div>
        {appointment.name}
      </h3>

      <div className="space-y-2 border-t border-gray-50 pt-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Mail size={14} className="text-amber-400" />
          <span className="truncate">{appointment.email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Phone size={14} className="text-amber-400" />
          <span>{appointment.phone}</span>
        </div>
      </div>

      {(appointment.status === "Pending" ||
        appointment.status === "Overdue") && (
        <div className="mt-4 pt-3 flex gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
            onClick={() => onUpdate(appointment._id, "completed")}
          >
            Complete
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
            onClick={() => onUpdate(appointment._id, "canceled")}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const AppointmentMng = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(
    typeof window !== "undefined"
      ? window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3
      : 3,
  );

  const VITE_URL = import.meta.env.VITE_API_URL;

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/appointment/view/${activeTab.toLowerCase()}`,
      );
      setAppointments(response.data);
    } catch (err) {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    setIndex(0);
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(
        window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3,
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlestatuseChange = async (id, newStatus) => {
    const loadingtoast = toast.loading("Updating status to ${newStatus}...");
    try {
      const response = await axios.put(
        `${VITE_URL}/api/receptionhall/appointment/update/${newStatus}/${id}`,
      );
      if (response.status === 200) {
        toast.success("Status updated successfully");
        fetchAppointments();
      }
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      toast.dismiss(loadingtoast);
    }
  };

  const tabs = ["Pending", "Completed", "Canceled", "Overdue"];

  const GAP = 24;
  const cardWidth = `calc((100% - ${GAP * (itemsPerView - 1)}px) / ${itemsPerView})`;
  const visibleAppointments = appointments.slice(index, index + itemsPerView);
  const canGoBack = index > 0;
  const canGoNext = index + itemsPerView < appointments.length;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <p className="text-amber-500 text-xs uppercase tracking-[0.3em] font-medium mb-1">
            Reception Hall
          </p>
          <h2 className="font-cinzel text-2xl sm:text-3xl text-gray-800 font-semibold">
            Booking Requests
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-white text-amber-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel Section */}
      {loading ? (
        <div className="py-20 text-center animate-pulse text-gray-400 uppercase tracking-widest text-sm font-bold">
          Loading...
        </div>
      ) : appointments.length === 0 ? (
        <div className="py-20 text-center">
          <Filter size={40} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 text-sm tracking-widest uppercase font-bold">
            No {activeTab} requests found
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Left arrow */}
          {canGoBack && (
            <button
              onClick={() => setIndex((i) => Math.max(0, i - itemsPerView))}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
          )}

          {/* Visible cards — slice-based, no translateX */}
          <div
            key={index}
            className="flex gap-6"
            style={{ animation: "fadeIn 0.25s ease" }}
          >
            {visibleAppointments.map((app) => (
              <div key={app._id} className="shrink-0" style={{ width: cardWidth }}>
                <AppointmentCard appointment={app} onUpdate={handlestatuseChange} />
              </div>
            ))}
          </div>

          {/* Right arrow */}
          {canGoNext && (
            <button
              onClick={() =>
                setIndex((i) =>
                  Math.min(appointments.length - itemsPerView, i + itemsPerView),
                )
              }
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          )}

          {/* Page dots */}
          {appointments.length > itemsPerView && (
            <div className="flex justify-center gap-1.5 mt-6">
              {Array.from({
                length: Math.ceil(appointments.length / itemsPerView),
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AppointmentMng;
