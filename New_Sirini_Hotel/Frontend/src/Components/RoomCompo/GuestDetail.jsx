import React from "react";
import {
  User,
  Mail,
  Phone,
  Users,
  ShieldCheck,
  ChevronLeftCircle,
  X,
  Sparkles,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

const GuestDetail = ({
  formData,
  setFormData,
  maxCapacity,
  totalPrice,
  onBack,
  onSubmit,
  loading,
  onClose,
  bookingMode,
  selectedPkg,
}) => {
  let calculatedDays = 1;
  if (
    bookingMode === "fullday" &&
    formData.checkInDate &&
    formData.checkOutDate
  ) {
    const [y1, m1, d1] = formData.checkInDate.split("-").map(Number);
    const [y2, m2, d2] = formData.checkOutDate.split("-").map(Number);
    calculatedDays = Math.round(
      (Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) /
        (1000 * 60 * 60 * 24),
    );
  }

  return (
    <div className="relative w-full max-w-[350px] sm:max-w-[380px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 sm:p-8 border border-gray-100 animate-in slide-in-from-right-8 duration-500 overflow-hidden mx-auto">
      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-50 rounded-full blur-3xl opacity-60" />

      {/* Action Buttons Row */}
      <div className="flex justify-between items-center mb-3 relative z-10">
        <button
          onClick={onBack}
          className="group flex items-center gap-1.5 text-gray-400 hover:text-orange-500 transition-colors"
        >
          <ChevronLeftCircle size={16} />
          <span className="text-[9px] font-black uppercase tracking-widest">
            Back
          </span>
        </button>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* Compact Header */}
      <div className="mb-3 relative">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles size={10} className="text-orange-400" />
          <span className="text-orange-500 text-[8px] font-black uppercase tracking-[0.2em]">
            Provide Your Contact Details
          </span>
        </div>
        <h2 className="text-gray-900 text-xl font-serif italic leading-tight">
          Guest Details
        </h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 relative">
        <div className="grid gap-3">
          {/* Name Input */}
          <div className="relative group">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors"
              size={14}
            />
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-2.5 text-[11px] focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500/30 outline-none transition-all"
            />
          </div>

          {/* Email & Phone Row (Compact) */}
          <div className="grid grid-cols-1 gap-3">
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors"
                size={14}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-2.5 text-[11px] outline-none transition-all"
              />
            </div>
            <div className="relative group">
              <Phone
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors"
                size={14}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-2.5 text-[11px] outline-none transition-all"
              />
            </div>
          </div>

          {/* Guest Selector */}
          <div className="relative group">
            <Users
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors"
              size={14}
            />
            <select
              value={formData.guests}
              onChange={(e) =>
                setFormData({ ...formData, guests: e.target.value })
              }
              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-10 py-2.5 text-[11px] appearance-none cursor-pointer outline-none transition-all"
            >
              {[...Array(maxCapacity)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 pointer-events-none transition-colors"
              size={14}
            />
          </div>
        </div>

        {/* Summary Card - Modern Glass Look */}
        <div className="bg-gray-900 rounded-[1.5rem] p-4 text-center relative overflow-hidden group">
          {selectedPkg && (
            <div className="mb-3 border-b border-white/5 pb-3">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <span className="text-xs">{selectedPkg.icon}</span>
                <span className="text-white text-[9px] font-black uppercase tracking-widest">
                  {selectedPkg.label}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-center gap-1.5 text-orange-400 text-[8px] font-bold">
                  <CalendarDays size={10} />
                  {bookingMode === "fullday"
                    ? `${formData.checkInDate} — ${formData.checkOutDate}`
                    : formData.checkInDate}
                </div>
                <div className="text-white/40 text-[8px] uppercase tracking-tighter">
                  {bookingMode === "fullday"
                    ? `${calculatedDays} Nights Stay`
                    : selectedPkg.timeRange}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center">
            <span className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-0.5">
              Your Total
            </span>
            <span className="text-2xl font-bold font-mono text-white tracking-tight">
              Rs.{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-orange-500 text-black font-black uppercase text-[9px] tracking-[0.2em] shadow-lg shadow-orange-500/20 hover:bg-orange-400 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />{" "}
              Processing
            </>
          ) : (
            "Confirm Reservation"
          )}
        </button>
      </form>
    </div>
  );
};

export default GuestDetail;
