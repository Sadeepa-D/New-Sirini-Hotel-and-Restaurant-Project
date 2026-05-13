import React, { useState, useEffect } from "react";
import axios from "axios";
import GuestDetail from "./GuestDetail";
import BookingSuccess from "../RoomCompo/SuccessMsg";
import DayUseCalender from "./DayUseCalender";

const PACKAGES = [
  {
    id: "day",
    label: "Day Package",
    timeRange: "12:00 PM – 3:00 PM",
    icon: "☀️",
    description: "3-hour daytime access. Cannot be booked on Full Day dates.",
    priceMultiplier: 0.3,
  },
  {
    id: "fullday",
    label: "Full Day",
    timeRange: "4:00 PM – 10:00 AM",
    icon: "🏨",
    description:
      "Check in at 4 PM, check out at 10 AM. Select your date range.",
    priceMultiplier: 0.7,
  },
];

// Add N calendar days using pure UTC math (no timezone issues)
const addDays = (dateStr, n) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + n));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`;
};

function BookingForm({ selectedRoom, onClose, onConfirmed }) {
  const VITE_URL = import.meta.env.VITE_API_URL;

  const [step, setStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingMode, setBookingMode] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: 1,
    checkInDate: "",
    checkOutDate: "",
  });

  // Recalculate price whenever mode or dates change
  useEffect(() => {
    if (!bookingMode) return;
    const pkg = PACKAGES.find((p) => p.id === bookingMode);
    if (!pkg) return;
    const basePrice = Math.round(selectedRoom.price * pkg.priceMultiplier);
    if (
      bookingMode === "fullday" &&
      formData.checkInDate &&
      formData.checkOutDate
    ) {
      const [y1, m1, d1] = formData.checkInDate.split("-").map(Number);
      const [y2, m2, d2] = formData.checkOutDate.split("-").map(Number);
      const days = Math.round(
        (Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) /
          (1000 * 60 * 60 * 24),
      );
      setTotalPrice(days > 0 ? basePrice * days : 0);
    } else {
      setTotalPrice(basePrice);
    }
  }, [
    bookingMode,
    formData.checkInDate,
    formData.checkOutDate,
    selectedRoom.price,
  ]);

  // ----- Handlers -----
  const handleSelectMode = (mode) => {
    setBookingMode(mode);
    setFormData({
      name: "",
      email: "",
      phone: "",
      guests: 1,
      checkInDate: "",
      checkOutDate: "",
    });
    setStep(1);
  };

  const handleDateSelect = (dateStr) => {
    if (bookingMode === "fullday") {
      // Range picker: 1st click = check-in, 2nd click = check-out
      if (
        !formData.checkInDate ||
        (formData.checkInDate && formData.checkOutDate)
      ) {
        setFormData({ ...formData, checkInDate: dateStr, checkOutDate: "" });
      } else {
        if (dateStr > formData.checkInDate) {
          setFormData({ ...formData, checkOutDate: dateStr });
        } else {
          // Clicked before check-in — restart
          setFormData({ ...formData, checkInDate: dateStr, checkOutDate: "" });
        }
      }
    } else {
      // Day Package: checkout = checkin + 1 day
      setFormData({
        ...formData,
        checkInDate: dateStr,
        checkOutDate: addDays(dateStr, 1),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${VITE_URL}/api/rooms/book`,
        {
          ...formData,
          room: selectedRoom._id,
          roomNumber: selectedRoom.roomNumber,
          totalAmount: totalPrice,
          numberOfGuests: formData.guests,
          bookingType: "day-use",
          timeSlot: bookingMode,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      onConfirmed(selectedRoom._id);
      setShowSuccess(true);
    } catch (error) {
      alert(error.response?.data?.error || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  // ----- Render -----
  if (showSuccess)
    return (
      <BookingSuccess
        selectedRoom={selectedRoom}
        onClose={onClose}
        totalPrice={totalPrice}
        bookingMode={bookingMode}
      />
    );

  const selectedPkg = PACKAGES.find((p) => p.id === bookingMode);
  const nightBasePrice = Math.round(selectedRoom.price * 0.7);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-white/60 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* ─── Step 0: Package Selector ─── */}
      {step === 0 && (
        <div className="relative w-full max-w-[380px] bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] shadow-orange-500/5 p-6 border border-white/50 animate-in fade-in zoom-in duration-300">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-300 hover:text-gray-900 transition-colors text-xl leading-none"
          >
            ✕
          </button>

          <div className="mb-5 text-center">
            <p className="text-orange-500 text-[8px] font-black uppercase tracking-[0.3em] mb-1">
              Step 01
            </p>
            <h2 className="text-gray-900 text-2xl font-serif italic font-medium tracking-tight">
              Choose a Package
            </h2>
            <p className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-1.5">
              Room {selectedRoom.roomNumber} · {selectedRoom.roomType}
            </p>
          </div>

          <div className="space-y-3">
            {PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handleSelectMode(pkg.id)}
                className="w-full flex items-center gap-4 p-4 rounded-[1.25rem] border border-gray-100/80 bg-gray-50/50 hover:border-orange-200 hover:bg-white hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5 transition-all duration-300 text-left group"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 group-hover:bg-gradient-to-br group-hover:from-orange-50 group-hover:to-orange-100 group-hover:border-orange-200 rounded-xl transition-all duration-300 shrink-0 shadow-sm shadow-gray-200/50">
                  <span className="text-2xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {pkg.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {pkg.label}
                  </p>
                  <p className="text-[9px] text-orange-500 font-bold uppercase tracking-widest mt-0.5">
                    {pkg.timeRange}
                  </p>
                  <p className="text-[9px] text-gray-400 mt-1 line-clamp-1">
                    {pkg.description}
                  </p>
                  <p className="text-[10px] font-black text-gray-800 mt-1.5">
                    Rs.
                    {Math.round(
                      selectedRoom.price * pkg.priceMultiplier,
                    ).toLocaleString()}
                    {pkg.id === "fullday" && " / day"}
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-orange-500 transition-colors shrink-0">
                  <span className="text-gray-400 group-hover:text-white text-xs font-bold transition-colors">
                    ›
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Step 1: Date Picker ─── */}
      {step === 1 && selectedPkg && (
        <DayUseCalender
          selectedDate={formData.checkInDate}
          selectedCheckOut={formData.checkOutDate}
          onDateSelect={handleDateSelect}
          onNext={() => setStep(2)}
          onClose={onClose}
          onBack={() => setStep(0)}
          roomNumber={selectedRoom.roomNumber}
          pkg={selectedPkg}
          timeSlot={bookingMode}
          totalPrice={totalPrice}
        />
      )}

      {/* ─── Step 2: Guest Details ─── */}
      {step === 2 && (
        <GuestDetail
          formData={formData}
          setFormData={setFormData}
          maxCapacity={selectedRoom.capacity}
          totalPrice={totalPrice}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
          loading={loading}
          onClose={onClose}
          bookingMode={bookingMode}
          selectedPkg={selectedPkg}
        />
      )}
    </div>
  );
}

export default BookingForm;
