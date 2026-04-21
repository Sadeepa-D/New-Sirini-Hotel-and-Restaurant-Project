import React, { useState } from "react";
import axios from "axios";
import BookingSuccess from "../RoomCompo/SuccessMsg";

function BookingForm({ selectedRoom, onClose, onConfirmed }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: 1,
    checkInDate: "",
    checkOutDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //date validation
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);

    if (checkOut <= checkIn) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    //Mobile Number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/rooms/book", {
        ...formData,
        room: selectedRoom._id,
        roomNumber: selectedRoom.roomNumber,
        numberOfGuests: formData.guests,
      });
      
      onConfirmed(selectedRoom._id);
      setShowSuccess(true);
    } catch (error) {
      alert(error.response?.data?.error || "Booking failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return <BookingSuccess selectedRoom={selectedRoom} onClose={onClose} />;
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-0 sm:px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0f0f0f] border border-white/10 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-4 sm:px-8 py-3 sm:py-5 flex justify-between items-center">
          <div>
            <p className="text-black/60 text-[9px] sm:text-xs uppercase tracking-widest font-semibold">
              Booking
            </p>
            <h2 className="text-black text-lg sm:text-2xl font-serif font-bold leading-tight">
              {selectedRoom.type}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-black/60 hover:text-black text-3xl font-light w-8 h-8 flex items-center justify-center flex-shrink-0"
          >
            ×
          </button>
        </div>

        {/* Room Summary */}
        <div className="px-4 sm:px-8 py-3 sm:py-4 border-b border-white/5 flex gap-3 items-center">
          <img
            src={selectedRoom.image}
            alt={selectedRoom.type}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-white text-xs sm:text-sm font-medium truncate">
              Room No: {selectedRoom.roomNumber}
            </p>

            <p className="text-orange-400 text-[9px] sm:text-xs font-bold mt-0.5 sm:mt-1">
              Rs.{selectedRoom.price} / night
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          className="px-4 sm:px-8 py-4 sm:py-6 space-y-2.5 sm:space-y-4"
          onSubmit={handleSubmit}
        >
          {/* Full Name */}
          <div>
            <label className="text-gray-400 text-[9px] sm:text-xs uppercase tracking-widest block mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Silva"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-xs sm:text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-400 text-[9px] sm:text-xs uppercase tracking-widest block mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-xs sm:text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-gray-400 text-[9px] sm:text-xs uppercase tracking-widests block mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+94 77 123 4567"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-xs sm:text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Number of Guests Dropdown */}
          <div>
            <label className="text-gray-400 text-[9px] sm:text-xs uppercase tracking-widest block mb-1">
              Number of Guests (Max: {selectedRoom.capacity})
            </label>
            <select
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
            >
              {/* කාමරයේ capacity එක අනුව options සාදනු ලබයි */}
              {[...Array(selectedRoom.capacity)].map((_, i) => (
                <option
                  key={i + 1}
                  value={i + 1}
                  className="bg-gray-900 text-white"
                >
                  {i + 1} {i + 1 === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
          </div>

          {/* Check In & Check Out */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="text-gray-400 text-[9px] sm:text-xs uppercase tracking-widest block mb-1">
                Check In
              </label>
              <input
                type="date"
                name="checkInDate"
                min={today}
                value={formData.checkInDate}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 sm:px-4 py-2 sm:py-3 text-white text-[10px] sm:text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-gray-400 text-[9px] sm:text-xs uppercase tracking-widest block mb-1">
                Check Out
              </label>
              <input
                type="date"
                name="checkOutDate"
                min={formData.checkInDate || today}
                value={formData.checkOutDate}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 sm:px-4 py-2 sm:py-3 text-white text-[10px] sm:text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-white/10 text-gray-400 py-2 sm:py-3 rounded-full text-[9px] sm:text-xs uppercase tracking-widest font-bold hover:border-white/30 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 text-black py-2 sm:py-3 rounded-full text-[9px] sm:text-xs uppercase tracking-widest font-bold hover:bg-orange-400 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
