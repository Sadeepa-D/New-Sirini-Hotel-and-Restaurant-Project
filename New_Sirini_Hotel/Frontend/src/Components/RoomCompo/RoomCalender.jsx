import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const RoomCalender = ({
  bookedDates,
  checkIn,
  checkOut,
  onDateSelect,
  onNext,
  onClose,
  roomNumber,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const toLocalDateString = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const getDayStatus = (day) => {
    const dateStr = toLocalDateString(year, month, day);
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);

    if (bookedDates.includes(dateStr)) return "booked";
    if (d < today) return "past";
    if (dateStr === checkIn || dateStr === checkOut) return "selected";
    if (checkIn && checkOut && dateStr > checkIn && dateStr < checkOut)
      return "range";
    return "available";
  };

  return (
    <div className="relative w-full max-w-[380px] bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-100 animate-in fade-in zoom-in duration-300">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-gray-300 hover:text-gray-900 transition-colors"
      >
        <X size={20} />
      </button>

      <div className="mb-6">
        <h2 className="text-gray-900 text-xl font-serif italic tracking-tight">
          Select Dates
        </h2>
        <p className="text-gray-400 text-[8px] font-black uppercase tracking-[0.2em]">
          New Sirini Hotel Room Number {roomNumber}
        </p>
      </div>

      {/* Month Navigation */}
      <div className="flex gap-4 items-center bg-gray-50 p-1 px-4 rounded-full border border-gray-100 mb-6">
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          className="text-gray-400 hover:text-orange-500 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-gray-900 text-[10px] font-black uppercase tracking-widest flex-1 text-center">
          {monthName} {year}
        </span>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          className="text-gray-400 hover:text-orange-500 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 mb-6">
        {weekDays.map((d) => (
          <div
            key={d}
            className="text-center text-[9px] font-black text-gray-300 uppercase"
          >
            {d}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`e-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const status = getDayStatus(day);
          return (
            <button
              key={day}
              disabled={status === "booked" || status === "past"}
              onClick={() => onDateSelect(toLocalDateString(year, month, day))}
              className={`aspect-square rounded-xl text-[10px] font-bold transition-all flex items-center justify-center border ${
                status === "booked"
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50" // Not Available (Grey)
                  : status === "past"
                    ? "text-gray-200 border-transparent opacity-30 cursor-not-allowed"
                    : status === "selected"
                      ? "bg-orange-500 text-white border-orange-600 shadow-lg scale-105 z-10"
                      : status === "range"
                        ? "bg-orange-50 text-orange-600 border-orange-100"
                        : "bg-green-50 text-green-700 border-green-100 hover:border-green-400" // Available (Green)
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mb-6 pt-2 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-[8px] font-black text-gray-400 uppercase">
            Available
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <span className="text-[8px] font-black text-gray-400 uppercase">
            Booked
          </span>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!checkOut}
        className="group relative w-full py-4 px-6 rounded-[2rem] bg-gray-900 text-white font-black uppercase text-[10px] tracking-[0.25em] shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_rgba(249,115,22,0.3)] disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed transition-all duration-500 overflow-hidden active:scale-95 flex items-center justify-center gap-3"
      >
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform"></div>

        <span className="relative z-10 flex items-center gap-2 group-hover:tracking-[0.3em] transition-all duration-500">
          Confirm Dates
          <div className="p-1 bg-white/10 rounded-full group-hover:bg-orange-500 transition-colors duration-500">
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </div>
        </span>

        <div className="absolute inset-0 bg-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0"></div>
      </button>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default RoomCalender;
