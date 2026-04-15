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
  }, [activeTab]);

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

      {/* Grid Section */}
      {loading ? (
        <div className="py-20 text-center animate-pulse text-gray-400 uppercase tracking-widest text-sm font-bold">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {appointments.map((app) => (
            <AppointmentCard
              key={app._id}
              appointment={app}
              onUpdate={handlestatuseChange}
            />
          ))}

          {/* Empty State */}
          {appointments.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <Filter size={40} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 text-sm tracking-widest uppercase font-bold">
                No {activeTab} requests found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentMng;
