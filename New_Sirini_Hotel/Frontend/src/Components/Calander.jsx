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

  const toLocalDateString = (y, m, d) => {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
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

  const getBookingStatus = (day) => {
    const dateStr = toLocalDateString(year, month, day);

    const dayBookings = BookedDates.filter((b) => b.dateStr === dateStr);

    if (dayBookings.length === 0) return null;

    const hasDaySlot = dayBookings.some((b) => b.time?.toLowerCase().includes("day"));
    const hasNightSlot = dayBookings.some((b) => b.time?.toLowerCase().includes("night"));

    if (hasDaySlot && hasNightSlot) return "Full";
    if (hasDaySlot) return "DayOnly";
    if (hasNightSlot) return "NightOnly";

    return null;
  };

  const getDayClass = (day) => {
    const status = getBookingStatus(day);

    if (isPast(day)) return "text-gray-300 cursor-not-allowed";

    if (isToday(day))
      return "bg-green-100 text-green-700 border-2 border-green-500 font-bold cursor-pointer";

    if (status === "Full")
      return "bg-red-500 text-white font-bold cursor-not-allowed shadow-inner";
    if (status === "DayOnly")
      return "bg-blue-500 text-white font-bold cursor-pointer hover:opacity-80";
    if (status === "NightOnly")
      return "bg-purple-500 text-white font-bold cursor-pointer hover:opacity-80";

    if (isSelected(day))
      return "bg-amber-500 text-white font-bold shadow-md cursor-pointer";

    return "text-gray-700 hover:bg-amber-50 hover:text-amber-700 cursor-pointer";
  };

  const handleDayClick = (day) => {
    const status = getBookingStatus(day);

    if (isPast(day) || status === "Full") return;

    setSelectedDate(new Date(year, month, day));
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-4 w-[340px] max-w-[95vw]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
          <CalendarDays size={16} className="text-amber-600" />
        </div>
        <h2 className="text-xs font-bold text-gray-900">Select Date</h2>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-24">
          <p className="text-xs text-gray-400 animate-pulse uppercase tracking-tight">
            Loading...
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={prevMonth}
              className="p-1 hover:bg-amber-100 rounded-md"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-bold text-gray-900">
              {monthName} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-amber-100 rounded-md"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {weekDays.map((d) => (
              <div
                key={d}
                className="text-center text-[9px] font-bold text-gray-500 uppercase py-0.5"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`aspect-square rounded-md text-[10px] font-bold flex items-center justify-center transition-all duration-150 ${getDayClass(day)}`}
              >
                {day}
              </button>
            ))}
          </div>
        </>
      )}
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-gray-100 text-[9px]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
          <span className="text-gray-600">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
          <span className="text-gray-600">Day Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
          <span className="text-gray-600">Night Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />
          <span className="text-gray-600">Fully Booked</span>
        </div>
      </div>
    </div>
  );
};

export default Calander;
