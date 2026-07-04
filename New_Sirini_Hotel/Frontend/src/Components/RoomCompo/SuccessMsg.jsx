import React from "react";
import {
  CheckCircle2,
  Home,
  Users,
  Star,
  Wifi,
  Droplets,
  Monitor,
  Refrigerator,
  Bell,
  X,
  ArrowRight,
} from "lucide-react";

function BookingSuccess({
  selectedRoom,
  onClose,
  totalPrice,
  bookingMode,
  checkInDate,
  checkOutDate,
}) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-white/60 backdrop-blur-xl animate-in fade-in duration-300" />

      {/* Main Card Container */}
      <div className="relative w-full max-w-[420px] bg-white border border-gray-100 rounded-3xl shadow-2xl shadow-black/10 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-5 pt-3.5 pb-3.5 relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white text-orange-500 rounded-full flex items-center justify-center shadow-md shadow-black/5 animate-bounce-short shrink-0">
              <CheckCircle2 size={20} className="stroke-[2.5px]" />
            </div>
            <div>
              <div className="flex gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={8}
                    className="fill-white text-white opacity-80"
                  />
                ))}
              </div>
              <h2 className="text-white text-sm font-bold tracking-tight leading-none">
                Reservation Received
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Section */}
        <div className="px-4 sm:px-5 pt-3 pb-4">
          <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold mb-3">
            Thank you for choosing New Sirini
          </p>

          {/* Room details card */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 mb-3 hover:border-orange-200 transition-all duration-300">
            <div className="flex items-center gap-3 text-left">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                <img
                  src={selectedRoom.image}
                  alt={selectedRoom.roomType}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-gray-900 text-xs font-bold truncate leading-none mb-1">
                  {selectedRoom.roomType} Room
                </h4>
                <div className="flex flex-wrap gap-x-2.5 gap-y-0.5">
                  <div className="flex items-center gap-1 text-gray-500 text-[9px] font-semibold">
                    <Home size={10} className="text-orange-500" />
                    <span>No: {selectedRoom.roomNumber}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-[9px] font-semibold">
                    <Users size={10} className="text-orange-500" />
                    <span>Max {selectedRoom.capacity} Guests</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Dates display */}
            {(checkInDate || checkOutDate) && (
              <div className="mt-2.5 pt-2.5 border-t border-gray-200 flex justify-between items-center">
                <span className="text-[9px] font-bold uppercase text-gray-500 tracking-wider">
                  {bookingMode === "fullday" ? "Check-In / Out" : "Selected Date"}
                </span>
                <span className="text-orange-600 font-sans text-[10px] font-bold">
                  {bookingMode === "fullday"
                    ? `${formatDate(checkInDate)} - ${formatDate(checkOutDate)}`
                    : formatDate(checkInDate)}
                </span>
              </div>
            )}

            {/* Total Price display */}
            <div className="mt-2.5 pt-2.5 border-t border-gray-200 flex justify-between items-center">
              <span className="text-[9px] font-bold uppercase text-gray-500 tracking-wider">
                Total Amount
              </span>
              <span className="text-orange-600 font-mono text-sm font-bold">
                Rs.{totalPrice?.toLocaleString()}
              </span>
            </div>

            {/* Facilities */}
            {selectedRoom.facilities && selectedRoom.facilities.length > 0 && (
              <div className="mt-2.5 pt-2.5 border-t border-gray-200">
                <p className="text-[8px] font-bold uppercase text-gray-500 tracking-wider mb-1.5 text-left">
                  Included Facilities
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedRoom.facilities.includes("WiFi") && (
                    <div className="flex items-center gap-0.5 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-lg">
                      <Wifi size={10} className="text-blue-500" />
                      <span className="text-[8px] font-bold text-blue-600">WiFi</span>
                    </div>
                  )}
                  {selectedRoom.facilities.includes("Hot Water") && (
                    <div className="flex items-center gap-0.5 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-lg">
                      <Droplets size={10} className="text-red-500" />
                      <span className="text-[8px] font-bold text-red-600">H2O</span>
                    </div>
                  )}
                  {selectedRoom.facilities.includes("TV") && (
                    <div className="flex items-center gap-0.5 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded-lg">
                      <Monitor size={10} className="text-purple-500" />
                      <span className="text-[8px] font-bold text-purple-600">TV</span>
                    </div>
                  )}
                  {selectedRoom.facilities.includes("Mini Fridge") && (
                    <div className="flex items-center gap-0.5 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-lg">
                      <Refrigerator size={10} className="text-green-500" />
                      <span className="text-[8px] font-bold text-green-600">Fridge</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Under Review Banner */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 mb-3.5 flex gap-2.5 items-start text-left">
            <div className="p-1 bg-orange-100 rounded-lg text-orange-600 shrink-0">
              <Bell size={13} className="animate-pulse" />
            </div>
            <div>
              <p className="text-orange-800 text-[9px] font-bold uppercase tracking-wider mb-0.5">
                Reservation Under Review
              </p>
              <p className="text-orange-700/80 text-[10px] leading-snug">
                Our team is currently verifying your request. You will receive a confirmation message shortly.
              </p>
            </div>
          </div>

          {/* OK Close Button */}
          <button
            onClick={onClose}
            style={{ borderRadius: "14px" }}
            className="w-full max-w-[200px] mx-auto py-2 px-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs tracking-wide shadow-md shadow-orange-400/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Done</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce-short {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .animate-bounce-short {
          animation: bounce-short 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default BookingSuccess;
