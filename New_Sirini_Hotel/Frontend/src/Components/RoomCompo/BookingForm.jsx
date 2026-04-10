import React, { useState } from "react";
import BookingSuccess from "../RoomCompo/SuccessMsg";

function BookingForm({ selectedRoom, onClose, onConfirmed }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkInDate: "",
    checkOutDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/rooms/book", {
        ...formData,
        room: selectedRoom._id,  // ← room id backend එකට යවනවා
      });
      onConfirmed(selectedRoom._id); // ← _id use කරනවා
      setShowSuccess(true);
    } catch (error) {
      alert(error.response?.data?.error || "Booking failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── After submit: show BookingSuccess ──
  if (showSuccess) {
    return (
      <BookingSuccess
        selectedRoom={selectedRoom}
        onClose={onClose}
      />
    );
  }

  // ── Before submit: show Booking Form ──
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
              Room No: {selectedRoom.roomNo}
            </p>
            <p className="text-gray-400 text-[9px] sm:text-xs mt-0.5 sm:mt-1">
              🛏 {selectedRoom.bed} &nbsp;|&nbsp; 👤 {selectedRoom.guests}{" "}
              {selectedRoom.guests === 1 ? "Guest" : "Guests"}
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
              required
              placeholder="john@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-xs sm:text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-gray-400 text-[9px] sm:text-xs uppercase tracking-widest block mb-1">
              Phone
            </label>
            <input
              type="tel"
              required
              placeholder="+94 77 123 4567"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-xs sm:text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Check In & Check Out */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="text-gray-400 text-[9px] sm:text-xs uppercase tracking-widest block mb-1">
                Check In
              </label>
              <input
                type="date"
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
              className="flex-1 bg-orange-500 text-black py-2 sm:py-3 rounded-full text-[9px] sm:text-xs uppercase tracking-widest font-bold hover:bg-orange-400 active:scale-95 transition-all"
            >
              Confirm Booking
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default BookingForm;