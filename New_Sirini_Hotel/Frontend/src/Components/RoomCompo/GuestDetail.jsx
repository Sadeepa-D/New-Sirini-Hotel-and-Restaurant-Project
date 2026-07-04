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
  CheckCircle,
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

  // Format date helper for the summary
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="relative w-full max-w-[420px] sm:max-w-[480px] bg-white rounded-3xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header with Back + Close */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 pt-2 pb-2">
        <div className="flex items-center justify-between mb-1.5">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-white/80 hover:text-white text-xs font-semibold uppercase tracking-widest transition-colors"
          >
            <ChevronLeftCircle size={15} />
            Back
          </button>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Title details */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs shrink-0">
            👤
          </div>
          <div>
            <h2 className="text-white text-xs font-bold tracking-tight leading-tight">
              Guest Details & Confirmation
            </h2>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-5 pt-2 pb-4">
        <p className="text-[10px] text-gray-500 mb-2.5">
          Pre-filled from your profile. You can edit if needed.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2.5">
            {/* Name Input */}
            <div className="relative group">
              <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
                  size={12}
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className={`w-full border rounded-lg pl-8 pr-3 py-2 text-xs focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500/30 outline-none transition-all ${
                    formData.name
                      ? "bg-green-50/30 border-green-200"
                      : "bg-gray-50 border-gray-100"
                  }`}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="relative group">
              <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
                  size={12}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className={`w-full border rounded-lg pl-8 pr-3 py-2 text-xs focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500/30 outline-none transition-all ${
                    formData.email
                      ? "bg-green-50/30 border-green-200"
                      : "bg-gray-50 border-gray-100"
                  }`}
                />
              </div>
            </div>

            {/* Phone & Guests side-by-side */}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative group">
                <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
                    size={12}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className={`w-full border rounded-lg pl-8 pr-3 py-2 text-xs focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500/30 outline-none transition-all ${
                      formData.phone
                        ? "bg-green-50/30 border-green-200"
                        : "bg-gray-50 border-gray-100"
                    }`}
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Guests
                </label>
                <div className="relative">
                  <Users
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
                    size={12}
                  />
                  <select
                    value={formData.guests}
                    onChange={(e) =>
                      setFormData({ ...formData, guests: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-100 rounded-lg pl-8 pr-8 py-2 text-xs appearance-none cursor-pointer outline-none transition-all focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500/30"
                  >
                    {[...Array(maxCapacity)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 pointer-events-none transition-colors"
                    size={12}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary Panel */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mt-3 flex flex-col gap-2">
            {selectedPkg && (
              <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs shrink-0">{selectedPkg.icon}</span>
                  <div className="min-w-0">
                    <span className="block text-[9px] font-bold text-gray-900 uppercase tracking-wider leading-none">
                      {selectedPkg.label}
                    </span>
                    <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">
                      {bookingMode === "fullday"
                        ? `${calculatedDays} Nights`
                        : selectedPkg.timeRange}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[8px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-lg border border-orange-100">
                  <CalendarDays size={9} />
                  <span>
                    {bookingMode === "fullday"
                      ? `${formatDate(formData.checkInDate)} - ${formatDate(formData.checkOutDate)}`
                      : formatDate(formData.checkInDate)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-0.5">
              <span className="text-gray-500 text-[8px] font-bold uppercase tracking-widest">
                Total Price
              </span>
              <span className="text-base font-bold font-mono text-gray-900 tracking-tight">
                Rs.{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>


          {/* Submit Reservation Button */}
          <button
            type="submit"
            disabled={loading}
            style={{ borderRadius: "14px" }}
            className="w-full max-w-[260px] mx-auto py-2 px-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs tracking-wide shadow-md shadow-orange-400/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-300 flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Reservation"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GuestDetail;
