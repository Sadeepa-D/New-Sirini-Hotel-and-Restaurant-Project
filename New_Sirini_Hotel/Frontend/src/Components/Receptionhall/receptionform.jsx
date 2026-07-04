import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  Users,
  Tag,
} from "lucide-react";

export default function BookingForm({ editData = null, onSuccess }) {
  const VITE_URL = import.meta.env.VITE_API_URL;

  const inputClass =
    "w-full text-sm text-gray-700 outline-none placeholder-gray-400 bg-transparent transition-colors focus:text-amber-600";
  const wrapClass =
    "flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/10 hover:border-amber-400/80 hover:scale-[1.01] transition-all duration-300 ease-in-out bg-white shadow-sm";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [noOfGuests, setNoOfGuests] = useState("");
  const [eventType, setEventType] = useState("");

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setEmail(editData.email || "");
      setPhone(editData.phone || "");
      setDate(editData.date ? editData.date.split("T")[0] : ""); // Format date for input
      setNoOfGuests(editData.noOfGuests || "");
      setEventType(editData.eventType || "");
    } else {
      // Auto-fill logged-in user details for new appointments
      const fetchUserProfile = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
          const response = await axios.get(`${VITE_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const user = response.data;
          if (user) {
            setName((prev) => prev || user.username || user.name || "");
            setEmail((prev) => prev || user.email || "");
            setPhone((prev) => prev || user.Phone || "");
          }
        } catch (error) {
          console.error("Error fetching user profile for auto-fill:", error);
        }
      };
      fetchUserProfile();
    }
  }, [editData, VITE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingtoast = toast.loading(
      editData ? "Updating booking..." : "Submitting booking...",
    );
    const token = localStorage.getItem("token");

    if (!token) {
      toast.dismiss(loadingtoast);
      toast.error("You must be logged in to submit a booking request.");
      return;
    }

    const bookingdata = {
      name,
      email,
      phone,
      date,
      noOfGuests,
      eventType,
    };

    try {
      if (editData) {
        // ================= EDIT EXISTING APPOINTMENT =================
        await axios.put(
          `${VITE_URL}/api/receptionhall/appointment/update/${editData._id}`,
          bookingdata,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        toast.dismiss(loadingtoast);
        toast.success("Booking updated successfully!");
        if (onSuccess) onSuccess(); // Closes the modal in the dashboard
      } else {
        // ================= ADD NEW APPOINTMENT =================
        const response = await axios.post(
          `${VITE_URL}/api/receptionhall/appointment/add`,
          bookingdata,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.status === 201) {
          toast.dismiss(loadingtoast);
          toast.success(
            "Booking request submitted successfully! We will contact you soon.",
          );
          // Clear form after successful new addition
          setName("");
          setEmail("");
          setPhone("");
          setDate("");
          setNoOfGuests("");
          setEventType("");
        }
      }
    } catch (error) {
      toast.dismiss(loadingtoast);
      console.error("Error submitting booking:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);

        if (error.response.status === 401) {
          toast.error(
            "Your session has expired. Please log out and log back in.",
          );
        } else {
          const errorMessage =
            error.response.data?.message ||
            "Failed to process booking request. Please try again.";
          toast.error(errorMessage);
        }
      } else if (error.request) {
        toast.error("No response from server. Check your connection.");
      } else {
        toast.error(
          error.message ||
            "Failed to process booking request. Please try again.",
        );
      }
    }
  };
  const today = new Date().toISOString().split("T")[0];
  return (
    <div
      style={{ borderRadius: "24px" }}
      className="bg-white p-6 sm:p-10 shadow-xl border border-gray-100/50 max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="font-cormorant italic text-3xl sm:text-5xl text-amber-500 font-semibold mb-2">
          {editData ? "Update Your Request" : "Place Your Reception Hall Visit"}
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-widest font-medium">
          {editData ? "Edit Details" : "plan your visit"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Name
            </label>
            <div className={wrapClass}>
              <User size={16} className="text-amber-500 shrink-0" />
              <input
                type="text"
                className={inputClass}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Event Type
            </label>
            <div className={wrapClass}>
              <Tag size={16} className="text-amber-500 shrink-0" />
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. Wedding, Birthday"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Mobile No */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Mobile No
            </label>
            <div className={wrapClass}>
              <Phone size={16} className="text-amber-500 shrink-0" />
              <input
                type="tel"
                className={inputClass}
                placeholder="e.g. 077 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Email Address
            </label>
            <div className={wrapClass}>
              <Mail size={16} className="text-amber-500 shrink-0" />
              <input
                type="email"
                className={inputClass}
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Pre Visit Date */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Pre Visit Date
            </label>
            <div className={wrapClass}>
              <CalendarDays size={16} className="text-amber-500 shrink-0" />
              <input
                type="date"
                className={inputClass}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                required
              />
            </div>
          </div>

          {/* Expected Guests */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Expected Guests (Min 40 - Max 200)
            </label>
            <div className={wrapClass}>
              <Users size={16} className="text-amber-500 shrink-0" />
              <input
                type="number"
                min="40"
                max="250"
                className={inputClass}
                placeholder="40"
                value={noOfGuests}
                onChange={(e) => setNoOfGuests(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            style={{ borderRadius: "12px" }}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold uppercase tracking-widest px-16 py-3.5 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            {editData ? "Save Changes" : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
