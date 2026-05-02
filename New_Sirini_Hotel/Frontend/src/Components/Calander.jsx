import React, { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const Calander = ({ BookedDates = [], loading = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // ✅ Local date string — no UTC shift for calendar display
  const toLocalDateString = (y, m, d) => {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };

  const isBooked = (day) => {
    const dateStr = toLocalDateString(year, month, day);
    return BookedDates.includes(dateStr);
  };

  const isToday = (day) => {
    const dateStr = toLocalDateString(year, month, day);
    const todayStr = toLocalDateString(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    return dateStr === todayStr;
  };

  const isPast = (day) => {
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const dateStr = toLocalDateString(year, month, day);
    const selectedStr = toLocalDateString(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
    );
    return dateStr === selectedStr;
  };

  const handleDayClick = (day) => {
    if (isPast(day) || isBooked(day)) return;
    setSelectedDate(new Date(year, month, day));
  };

  const getDayClass = (day) => {
    if (isBooked(day))
      return "bg-red-100 text-red-500 border-2 border-red-300 cursor-not-allowed font-bold";
    if (isPast(day)) return "text-gray-300 cursor-not-allowed";
    if (isSelected(day))
      return "bg-amber-500 text-white font-bold shadow-md cursor-pointer";
    if (isToday(day))
      return "bg-amber-50 text-amber-600 border-2 border-amber-400 font-bold cursor-pointer";
    return "text-gray-700 hover:bg-amber-50 hover:text-amber-700 cursor-pointer";
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-2.5 max-w-xs w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
          <CalendarDays size={16} className="text-amber-600" />
        </div>
        <div>
          <h2 className="text-xs font-bold text-gray-900">Select Date</h2>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-24">
          <p className="text-xs text-gray-400 animate-pulse uppercase tracking-tight">
            Loading...
          </p>
        </div>
      ) : (
        <>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={prevMonth}
              className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-amber-100 text-gray-600 hover:text-amber-600 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-bold text-gray-900 tracking-tight">
              {monthName} {year}
            </span>
            <button
              onClick={nextMonth}
              className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-amber-100 text-gray-600 hover:text-amber-600 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {weekDays.map((d) => (
              <div
                key={d}
                className="text-center text-[9px] font-bold text-gray-500 uppercase tracking-tight py-0.5"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                disabled={isPast(day) || isBooked(day)}
                className={`aspect-square rounded-md text-[10px] font-bold flex items-center justify-center transition-all duration-150 ${getDayClass(day)}`}
              >
                {day}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-gray-200 text-[9px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-gray-600 font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-red-100 border border-red-300" />
          <span className="text-gray-600 font-medium">Booked</span>
        </div>
      </div>
    </div>
  );
};

export default Calander;
