import React from "react";

export const PACKAGES = [
  {
    id: "day",
    label: "Day Package",
    timeRange: "10:00 AM – 3:00 PM",
    icon: "☀️",
    description: "5-hour daytime access. Cannot be booked on Full Day dates.",
  },
  {
    id: "fullday",
    label: "Night Package",
    timeRange: "4:00 PM – 9:00 AM",
    icon: "🏨",
    description:
      "Check in at 4 PM, check out at 9 AM. Select your date range.",
  },
];

function ChoosePackage({ selectedRoom, onSelectMode, onClose }) {
  return (
    <div className="relative w-full max-w-[380px] sm:max-w-[520px] bg-white/95 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] shadow-orange-500/5 p-6 sm:p-9 border border-white/50 animate-in fade-in zoom-in duration-300">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 sm:top-6 sm:right-6 text-gray-300 hover:text-gray-900 transition-colors text-xl sm:text-2xl leading-none"
      >
        ✕
      </button>

      <div className="mb-5 sm:mb-7 text-center">
        <h2 className="text-gray-900 text-2xl sm:text-3xl font-serif italic font-medium tracking-tight">
          Choose a Package
        </h2>
        <p className="text-gray-400 text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mt-1.5 sm:mt-2">
          Room {selectedRoom.roomNumber} · {selectedRoom.roomType} Room
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {PACKAGES.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => onSelectMode(pkg.id)}
            className="w-full flex items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-[1.25rem] sm:rounded-[1.5rem] border border-gray-100/80 bg-gray-50/50 hover:border-orange-200 hover:bg-white hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5 transition-all duration-300 text-left group"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-white border border-gray-100 group-hover:bg-gradient-to-br group-hover:from-orange-50 group-hover:to-orange-100 group-hover:border-orange-200 rounded-xl sm:rounded-2xl transition-all duration-300 shrink-0 shadow-sm shadow-gray-200/50">
              <span className="text-2xl sm:text-3xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                {pkg.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] sm:text-[15px] font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                {pkg.label}
              </p>
              <p className="text-[9px] sm:text-[11px] text-orange-500 font-bold uppercase tracking-widest mt-0.5">
                {pkg.timeRange}
              </p>
              <p className="text-[9px] sm:text-[11px] text-gray-400 mt-1 line-clamp-1">
                {pkg.description}
              </p>
              <p className="text-[10px] sm:text-xs font-black text-gray-800 mt-1.5 sm:mt-2">
                Rs.{" "}
                {(pkg.id === "day"
                  ? selectedRoom.shortStayPrice || 1500
                  : selectedRoom.price
                ).toLocaleString()}
                {pkg.id === "fullday" && " / Per Night"}
              </p>
            </div>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-orange-500 transition-colors shrink-0">
              <span className="text-gray-400 group-hover:text-white text-xs sm:text-sm font-bold transition-colors">
                ›
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ChoosePackage;
