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
      <div className="py-10 text-center text-gray-500 animate-pulse">
        Loading appointments...
      </div>
    );
  }
  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      <h2 className="text-xl font-bold text-gray-900 mb-6">My Appointments</h2>

      {/* 3. Render the Cards */}
      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
          You have no appointments yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((app) => (
            <AppointmentCard
              key={app._id}
              appointment={app}
              onEdit={(data) => setEditingAppt(data)} // Opens the modal with this appointment's data
              onCancel={handlecancel}
            />
          ))}
        </div>
      )}

      {/* 4. Edit Modal Overlay (Only shows when editingAppt has data) */}
      {editingAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl relative my-auto shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setEditingAppt(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 z-10 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm font-bold transition-colors"
            >
              ✕ Close
            </button>

            {/* Reuse Booking Form in Edit Mode */}
            <div className="max-h-[90vh] overflow-y-auto rounded-2xl hide-scrollbar">
              <AppointForm
                editData={editingAppt}
                onSuccess={() => {
                  setEditingAppt(null); // Close modal on success
                  fetchappointments(); // Refresh the list with new data
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
