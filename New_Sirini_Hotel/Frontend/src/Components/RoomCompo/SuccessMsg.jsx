import React from "react";

// get totalPrice as props
function BookingSuccess({ selectedRoom, onClose, totalPrice }) {
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-0 sm:px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0f0f0f] border border-white/10 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-4 sm:px-8 py-3 sm:py-5 flex justify-between items-center">
          <div>
            <p className="text-black/60 text-[9px] sm:text-xs uppercase tracking-widest font-semibold">
              Confirmation
            </p>
            <h2 className="text-black text-lg sm:text-2xl font-serif font-bold leading-tight">
              Booking Received
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-black/60 hover:text-black text-3xl font-light w-8 h-8 flex items-center justify-center flex-shrink-0"
          >
            ×
          </button>
        </div>

        {/* ── Success Content ── */}
        <div className="px-5 sm:px-8 py-6 sm:py-10 text-center">
          <div className="flex justify-center mb-4 sm:mb-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="sm:w-[40px] sm:h-[40px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-white text-xl sm:text-2xl font-serif mb-2">
            Thank You!
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed px-2 sm:px-0">
            Your booking request for{" "}
            <span className="text-orange-400 font-semibold">
              {selectedRoom.roomType}
            </span>{" "}
            (Room No:{" "}
            <span className="text-white font-bold">
              {selectedRoom.roomNumber}
            </span>
            ) has been successfully received.
          </p>

          {/* Room Summary Box */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4 text-left">
            <img
              src={selectedRoom.image}
              alt={selectedRoom.roomType}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-white text-xs sm:text-sm font-medium truncate">
                {selectedRoom.roomType} Suite
              </p>
              <p className="text-gray-400 text-[9px] sm:text-xs mt-0.5">
                Room No:{" "}
                <span className="text-white font-bold">
                  {selectedRoom.roomNumber}
                </span>{" "}
                👤 {selectedRoom.capacity} Guests
              </p>

            
              <p className="text-orange-400 text-[9px] sm:text-xs font-bold mt-0.5 uppercase tracking-widest">
                Total Amount: Rs.{totalPrice?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Info note */}
          <div className="bg-orange-500/5 border border-orange-500/10 rounded-lg p-3 mb-6">
            <p className="text-orange-200/70 text-[10px] sm:text-[11px] leading-relaxed">
              🔔{" "}
              <span className="text-orange-400 font-bold uppercase">Note:</span>{" "}
              Your booking is currently under review. Admin will confirm it
              shortly.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-orange-500 text-black py-2.5 sm:py-3 rounded-full text-[10px] sm:text-xs uppercase tracking-widest font-black hover:bg-orange-400 active:scale-95 transition-all mb-1 shadow-[0_10px_20px_rgba(249,115,22,0.2)]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;
