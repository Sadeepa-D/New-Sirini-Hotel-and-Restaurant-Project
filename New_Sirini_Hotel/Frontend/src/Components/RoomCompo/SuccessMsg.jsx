import React from "react";
import {
  CheckCircle2,
  Home,
  Users,
  Wallet,
  Bell,
  X,
  ArrowRight,
  Star,
  Wifi,
  Droplets,
  Monitor,
  Refrigerator,
} from "lucide-react";

function BookingSuccess({ selectedRoom, onClose, totalPrice }) {
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500" />

      
      <div className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
        
        <div className="relative h-24 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-transparent" />
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col items-center">
            <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.4)] animate-bounce-short">
              <CheckCircle2 size={28} className="text-black stroke-[2.5px]" />
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-full transition-all border border-white/5"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-6 text-center">
          <div className="mb-4">
            <div className="flex justify-center gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={8}
                  className="fill-orange-500 text-orange-500"
                />
              ))}
            </div>
            <h2 className="text-white text-xl font-serif italic tracking-tight mb-1">
              Reservation Received
            </h2>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.15em] font-medium">
              Thank you for choosing New Sirini
            </p>
          </div>

          {/*Room Card */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3.5 mb-4 group hover:border-orange-500/20 transition-all duration-500">
            <div className="flex items-center gap-3 text-left">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0">
                <img
                  src={selectedRoom.image}
                  alt={selectedRoom.roomType}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-white text-xs font-semibold truncate leading-none mb-1.5">
                  {selectedRoom.roomType} Room
                </h4>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <div className="flex items-center gap-1 text-gray-500 text-[9px] font-bold uppercase tracking-wider">
                    <Home size={10} className="text-orange-500" /> No:{" "}
                    {selectedRoom.roomNumber}
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-[9px] font-bold uppercase tracking-wider">
                    <Users size={10} className="text-orange-500" />{" "}
                    {selectedRoom.capacity} Guests
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
              <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest">
                Total Amount
              </span>
              <span className="text-orange-500 font-mono text-sm font-black italic">
                Rs.{totalPrice?.toLocaleString()}
              </span>
            </div>

            {/* Facilities */}
            {selectedRoom.facilities && selectedRoom.facilities.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-[8px] font-black uppercase text-gray-600 tracking-widest mb-1.5 text-left">
                  Facilities
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedRoom.facilities.includes("WiFi") && (
                    <div className="flex items-center gap-0.5 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded">
                      <Wifi size={10} className="text-blue-400" />
                      <span className="text-[8px] font-bold text-blue-300">WiFi</span>
                    </div>
                  )}
                  {selectedRoom.facilities.includes("Hot Water") && (
                    <div className="flex items-center gap-0.5 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded">
                      <Droplets size={10} className="text-red-400" />
                      <span className="text-[8px] font-bold text-red-300">H2O</span>
                    </div>
                  )}
                  {selectedRoom.facilities.includes("TV") && (
                    <div className="flex items-center gap-0.5 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded">
                      <Monitor size={10} className="text-purple-400" />
                      <span className="text-[8px] font-bold text-purple-300">TV</span>
                    </div>
                  )}
                  {selectedRoom.facilities.includes("Mini Fridge") && (
                    <div className="flex items-center gap-0.5 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded">
                      <Refrigerator size={10} className="text-green-400" />
                      <span className="text-[8px] font-bold text-green-300">Fridge</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          
          <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-3 mb-4 flex gap-3 items-start text-left">
            <div className="p-1.5 bg-orange-500/10 rounded-lg shrink-0">
              <Bell size={14} className="text-orange-500 animate-pulse" />
            </div>
            <div>
              <p className="text-orange-400 text-[9px] font-black uppercase tracking-widest mb-0.5">
                Status: Under Review
              </p>
              <p className="text-orange-100/40 text-[10px] leading-snug italic">
                Our team is verifying your request. You will receive a
                confirmation shortly.
              </p>
            </div>
          </div>

          
          <button
            onClick={onClose}
            className="group relative w-auto mx-auto bg-orange-500 hover:bg-orange-400 text-black py-2 px-6 rounded-xl font-black text-[8px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-1"
          >
            <span className="relative z-10">OK</span>
            <ArrowRight
              size={10}
              className="relative z-10 transition-transform group-hover:translate-x-1"
            />
            <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300 rounded-xl" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce-short {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
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
