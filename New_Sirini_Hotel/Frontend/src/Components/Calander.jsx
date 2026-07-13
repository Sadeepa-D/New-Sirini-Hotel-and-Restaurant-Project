import React, { useState, useEffect } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const parseLocalDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const [, year, month, day] = match;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Calander = ({
  BookedDates = [],
  loading = false,
  selectedDateValue = null,
  onDateSelect = null,
  title = "Select Date",
  subtitle = "Choose a date",
}) => {
  const [currentDate, setCurrentDate] = useState(() => {
    const parsed = parseLocalDate(selectedDateValue);
    return parsed || new Date();
  });
  const [selectedDate, setSelectedDate] = useState(() => parseLocalDate(selectedDateValue));

  useEffect(() => {
    const parsed = parseLocalDate(selectedDateValue);
    if (parsed) {
      parsed.setHours(0, 0, 0, 0);
      setSelectedDate(parsed);
      setCurrentDate(parsed);
    } else {
      setSelectedDate(null);
    }
  }, [selectedDateValue]);

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

    if (isSelected(day))
      return "bg-amber-500 text-white font-bold shadow-md cursor-pointer";

    if (isToday(day))
      return "bg-green-100 text-green-700 border-2 border-green-500 font-bold cursor-pointer";

    if (status === "Full")
      return "bg-red-500 text-white font-bold cursor-pointer shadow-inner";
    if (status === "DayOnly")
      return "bg-blue-500 text-white font-bold cursor-pointer hover:opacity-80";
    if (status === "NightOnly")
      return "bg-purple-500 text-white font-bold cursor-pointer hover:opacity-80";

    return "text-gray-700 hover:bg-amber-50 hover:text-amber-700 cursor-pointer";
  };

  const handleDayClick = (day) => {
    if (isPast(day)) return;

    const nextDate = new Date(year, month, day);
    nextDate.setHours(0, 0, 0, 0);

    setSelectedDate(nextDate);
    setCurrentDate(new Date(year, month, day));

    if (onDateSelect) onDateSelect(nextDate);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-4 w-[340px] max-w-[95vw]">
      <div className="flex items-center gap-2 mb-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 text-white">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          <CalendarDays size={16} className="text-white" />
        </div>
        <div>
          <h2 className="text-xs font-bold">{title}</h2>
          <p className="text-[10px] text-white/80">{subtitle}</p>
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
      {selectedDate && (
        <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-amber-600">
            Selected Date
          </p>
          <p className="text-xs font-bold text-gray-900">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
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
