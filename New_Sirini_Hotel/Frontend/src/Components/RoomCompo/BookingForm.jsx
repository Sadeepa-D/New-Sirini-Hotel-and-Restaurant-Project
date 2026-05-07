import React, { useState, useEffect } from "react";
import axios from "axios";
import BookingSuccess from "../RoomCompo/SuccessMsg";

function BookingForm({ selectedRoom, onClose, onConfirmed }) {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(selectedRoom.price);
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: 1,
    checkInDate: "",
    checkOutDate: "",
  });

  // Parse date string (YYYY-MM-DD) and create UTC date, not local timezone
  const parseUTCDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  };

  // change the price according to num of dates selected
  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = parseUTCDate(formData.checkInDate);
      const checkOut = parseUTCDate(formData.checkOutDate);
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (nights > 0) {
        setTotalPrice(nights * selectedRoom.price);
      } else {
        setTotalPrice(selectedRoom.price);
      }
    }
  }, [formData.checkInDate, formData.checkOutDate, selectedRoom.price]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const checkIn = parseUTCDate(formData.checkInDate);
    const checkOut = parseUTCDate(formData.checkOutDate);

    if (checkOut <= checkIn) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${VITE_URL}/api/rooms/book`,
        {
          ...formData,
          room: selectedRoom._id,
          roomNumber: selectedRoom.roomNumber,
          numberOfGuests: formData.guests,
          totalAmount: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      onConfirmed(selectedRoom._id);
      setShowSuccess(true);
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Booking failed. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <BookingSuccess
        selectedRoom={selectedRoom}
        onClose={onClose}
        totalPrice={totalPrice}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center z-50 px-0 sm:px-4 transition-all duration-500"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Custom style for date input to invert calendar icon color */}
      <style>
        {`
    input[type="date"]::-webkit-calendar-picker-indicator {
      filter: invert(1);
      cursor: pointer;
    }
  `}
      </style>

      <div className="bg-[#0c0c0c] border border-white/10 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg shadow-[0_0_50px_rgba(249,115,22,0.1)] overflow-hidden max-h-[95vh] flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-400 px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-black text-xl sm:text-2xl font-serif font-black uppercase italic tracking-tighter">
              Reserve Your Stay
            </h2>
            <p className="text-black/70 text-[10px] font-bold uppercase tracking-widest">
              {selectedRoom.roomType} Room
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-black/60 hover:text-black text-4xl font-thin transition-transform hover:rotate-90"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-4 space-y-6">
          {/* Pricing Card - Interactive Summary */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center group hover:border-orange-500/50 transition-all">
            <div className="flex items-center gap-4">
              <img
                src={selectedRoom.image}
                className="w-16 h-16 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                alt="Room"
              />
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                  Room No
                </p>
                <p className="text-white font-mono text-lg font-bold">
                  {selectedRoom.roomNumber}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                Room Price
              </p>
              <p className="text-orange-500 text-2xl font-black font-mono">
                Rs.{totalPrice.toLocaleString()}
              </p>
            </div>
          </div>

          <form
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            onSubmit={handleSubmit}
          >
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-1">
              <label className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-2 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="email@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              />
            </div>

            {/* Phone */}
            <div className="sm:col-span-1">
              <label className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-2 block">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="07xxxxxxxx"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              />
            </div>

            {/* Guests */}
            <div className="sm:col-span-2">
              <label className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-2 block">
                Guests (Max: {selectedRoom.capacity})
              </label>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none transition-all"
              >
                {[...Array(selectedRoom.capacity)].map((_, i) => (
                  <option
                    key={i + 1}
                    value={i + 1}
                    className="bg-neutral-900 text-white"
                  >
                    {i + 1} Guest{i > 0 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Check In */}
            <div>
              <label className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-2 block">
                Check In
              </label>
              <input
                type="date"
                name="checkInDate"
                min={today}
                value={formData.checkInDate}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              />
            </div>

            {/* Check Out */}
            <div>
              <label className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-2 block">
                Check Out
              </label>
              <input
                type="date"
                name="checkOutDate"
                min={formData.checkInDate || today}
                value={formData.checkOutDate}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              />
            </div>
            
               <div className="sm:col-span-2">
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3.5 mt-2 flex items-start gap-3">
                <span className="text-orange-500 text-sm">🔔</span>
                <p className="text-orange-100/70 text-[11px] leading-relaxed font-sans">
                  <span className="text-orange-400 font-bold uppercase tracking-wider mr-1">Note:</span> 
                  After you book the room, you cannot change the room number. Please review your selection.
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="sm:col-span-2 flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-xl border border-white/10 text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-white/5 transition-all"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-4 rounded-xl bg-orange-500 text-black font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-orange-500/20 hover:bg-orange-400 hover:shadow-orange-500/40 active:scale-95 disabled:opacity-50 transition-all"
              >
                {loading ? "Processing..." : "Confirm Reservation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
