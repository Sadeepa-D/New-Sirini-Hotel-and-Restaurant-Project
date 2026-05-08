import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CalendarDays, Edit2, XCircle } from "lucide-react";
import AppointmentCard from "../OperationManager/Reception/AppointmentCard";
import AppointForm from "../Receptionhall/receptionform";

const AppointmentsSection = ({ data }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAppt, setEditingAppt] = useState(null);

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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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

  const handlecancel = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?",
    );
    if (!confirmCancel) return;
    const loadingToast = toast.loading("Canceling appointment...");
    try {
      await axios.put(
        `${VITE_URL}/api/receptionhall/appointment/update/Canceled/${id}`,
      );
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
        <p className="text-gray-400 text-sm animate-pulse">Loading appointments…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans relative">
      {/* ── Header ── */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">My Appointments</h2>
        <p className="text-gray-400 text-xs mt-0.5">View and manage your reception hall bookings</p>
      </div>

      {/* ── Cards / Empty ── */}
      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <CalendarDays size={36} className="text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm font-medium">You have no appointments yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {appointments.map((app) => (
            <AppointmentCard
              key={app._id}
              appointment={app}
              onEdit={(data) => setEditingAppt(data)}
              onCancel={handlecancel}
            />
          ))}
        </div>
      )}

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
    </div>
  );
};

export default AppointmentsSection;
