import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function BookingForm({ editData = null, onSuccess }) {
  const VITE_URL = import.meta.env.VITE_API_URL;

  const inputClass =
    "w-full border border-gray-300 px-4 py-3 text-lg text-gray-700 focus:border-amber-400 outline-none transition-colors";

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
    const userDataStr = localStorage.getItem("userData");
    let currentuser = null;
    if (userDataStr) {
      try {
        currentuser = JSON.parse(userDataStr);
      } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
      }
      if (!currentuser?.phone) {
        toast.error(
          "Please add a phone number to your profile before submitting an Appointment.",
        );
        return;
      }
    }
    const loadingtoast = toast.loading(
      editData ? "Updating booking..." : "Submitting booking...",
    );
    const token = localStorage.getItem("token");

    if (!token) {
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
      // Handle the 401 specifically to help the user
      if (error.response && error.response.status === 401) {
        toast.error(
          "Your session has expired. Please log out and log back in.",
        );
      } else {
        toast.error("Failed to process booking request. Please try again.");
      }
    }
  };
  const today = new Date().toISOString().split("T")[0];
  return (
    <section className="bg-white py-16 px-4 sm:px-8 border-t border-gray-100">
      <div className="text-center mb-10">
        <h2 className="font-cormorant italic text-3xl sm:text-5xl text-amber-500 font-semibold mb-2">
          {editData ? "Update Your Request" : "Place Your Reception Hall Visit"}
        </h2>
        <p className="text-gray-400 text-sm uppercase tracking-widest">
          {editData ? "Edit Details" : "plan your visit"}
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Name :
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Event Type :
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g., Wedding, Birthday"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Mobile No :
              </label>
              <input
                type="tel"
                className={inputClass}
                placeholder="077 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Email Address:
              </label>
              <input
                type="email"
                className={inputClass}
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Pre Visit Date :
              </label>
              <input
                type="date"
                className={inputClass}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                No of Expected Guests :
              </label>
              <input
                type="number"
                min="40"
                max="200"
                className={inputClass}
                placeholder="40"
                value={noOfGuests}
                onChange={(e) => setNoOfGuests(e.target.value)}
              />
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-black text-lg font-bold px-16 py-3.5 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {editData ? "Save Changes" : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
