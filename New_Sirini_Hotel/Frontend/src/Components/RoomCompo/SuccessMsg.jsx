import React from "react";

function BookingSuccess({ selectedRoom, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-0 sm:px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0f0f0f] border border-white/10 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 sm:px-8 py-4 sm:py-5 flex justify-between items-center">
          <div>
            <p className="text-black/60 text-[10px] sm:text-xs uppercase tracking-widest font-semibold">
              Confirmation
            </p>
            <h2 className="text-black text-xl sm:text-2xl font-serif font-bold">
              Booking Confirmed
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-black/60 hover:text-black text-3xl font-light w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* ── Success Content ── */}
        <div className="px-8 py-10 text-center">

          {/* Green checkmark circle */}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <svg width="40" height="40" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h3 className="text-white text-2xl font-serif mb-2">
            Thank You!
          </h3>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Your booking for{" "}
            <span className="text-orange-400 font-semibold">{selectedRoom.type}</span>{" "}
            (Room No: {selectedRoom.roomNo}) has been successfully received.
          </p>

          {/* Room Summary Box */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 mb-6 flex items-center gap-4 text-left">
            <img
              src={selectedRoom.image}
              alt={selectedRoom.type}
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
            />
            <div>
              <p className="text-white text-sm font-medium">{selectedRoom.type}</p>
              <p className="text-gray-400 text-xs mt-0.5">
                🛏 {selectedRoom.bed} &nbsp;|&nbsp; 👤 {selectedRoom.guests}{" "}
                {selectedRoom.guests === 1 ? "Guest" : "Guests"}
              </p>
              <p className="text-orange-400 text-xs font-bold mt-0.5">
                Rs.{selectedRoom.price} / night
              </p>
            </div>
          </div>

          {/* Info note */}
          <p className="text-gray-600 text-[11px] mb-6">
            We will contact you shortly to confirm your reservation details.
          </p>

          {/* Done Button */}
          <button
            onClick={onClose}
            className="w-full bg-orange-500 text-black py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-orange-400 active:scale-95 transition-all"
          >
            Done
          </button>

        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;