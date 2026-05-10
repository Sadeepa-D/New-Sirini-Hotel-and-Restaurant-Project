import React from "react";
import { CheckCircle2, Home, Users, Wallet, Bell, X, ArrowRight, Star } from "lucide-react";

function BookingSuccess({ selectedRoom, onClose, totalPrice }) {
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Heavy Blur Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500" />

      {/* Main Success Container */}
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
        
        {/* Top Decorative Header */}
        <div className="relative h-32 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-transparent" />
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />
          
          <div className="relative flex flex-col items-center">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.4)] animate-bounce-short">
              <CheckCircle2 size={32} className="text-black stroke-[2.5px]" />
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-full transition-all border border-white/5"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-8 pb-10 text-center">
          <div className="mb-6">
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} className="fill-orange-500 text-orange-500" />
              ))}
            </div>
            <h2 className="text-white text-3xl font-serif italic tracking-tight mb-2">Reservation Received</h2>
            <p className="text-gray-500 text-xs uppercase tracking-[0.2em] font-medium">Thank you for choosing New Sirini</p>
          </div>

          {/* Luxury Room Card */}
          <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 mb-6 group hover:border-orange-500/20 transition-all duration-500">
            <div className="flex items-center gap-4 text-left">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                <img
                  src={selectedRoom.image}
                  alt={selectedRoom.roomType}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-white text-sm font-semibold truncate leading-none mb-2">{selectedRoom.roomType} Suite</h4>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                    <Home size={12} className="text-orange-500" /> No: {selectedRoom.roomNumber}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                    <Users size={12} className="text-orange-500" /> {selectedRoom.capacity} Guests
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Total Amount</span>
              <span className="text-orange-500 font-mono text-xl font-black italic">
                Rs.{totalPrice?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Admin Review Note */}
          <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-4 mb-8 flex gap-4 items-start text-left">
            <div className="p-2 bg-orange-500/10 rounded-xl">
              <Bell size={16} className="text-orange-500 animate-pulse" />
            </div>
            <div>
              <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest mb-1">Status: Under Review</p>
              <p className="text-orange-100/40 text-[11px] leading-relaxed italic">
                Our team is verifying your request. You will receive a confirmation shortly.
              </p>
            </div>
          </div>

          {/* Final Button */}
          <button
            onClick={onClose}
            className="group relative w-full bg-orange-500 hover:bg-orange-400 text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 overflow-hidden"
          >
            <span className="relative z-10">Return to Portal</span>
            <ArrowRight size={14} className="relative z-10 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-short {
          animation: bounce-short 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default BookingSuccess;