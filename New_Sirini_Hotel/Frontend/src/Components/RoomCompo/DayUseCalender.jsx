import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, CalendarDays } from "lucide-react";
import axios from "axios";

const addDays = (dateStr, n) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + n));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`;
};

const DayUseCalender = ({
  selectedDate,
  selectedCheckOut,
  onDateSelect,
  onNext,
  onClose,
  onBack,
  roomNumber,
  pkg,
  timeSlot,
  numberOfDays,
  onDaysChange,
  dayBasePrice,
  totalPrice,
}) => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeBookings, setActiveBookings] = useState([]);

  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const res = await axios.get(
          `${VITE_URL}/api/rooms/unavailablerooms/dates/${roomNumber}`,
        );
        setActiveBookings(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchBlockedDates();
  }, [roomNumber, VITE_URL]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const toDateStr = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const buildRange = () => {
    if (!selectedDate || !selectedCheckOut || timeSlot !== "fullday")
      return new Set();
    const range = new Set();
    let cur = selectedDate;
    while (cur < selectedCheckOut) {
      range.add(cur);
      cur = addDays(cur, 1);
    }
    return range;
  };
  const selectedRange = buildRange();

  const parseBaseTime = (dateStr) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };

  const isConflict = (proposedStart, proposedEnd) => {
    return activeBookings.some((b) => {
      const bIn = parseBaseTime(b.checkInDate.split("T")[0]);
      const bOut = parseBaseTime(b.checkOutDate.split("T")[0]);
      const bStart =
        b.timeSlot === "day" ? bIn + 10 * 3600000 : bIn + 16 * 3600000;
      const bEnd =
        b.timeSlot === "day" ? bIn + 15 * 3600000 : bOut + 9 * 3600000;
      return proposedStart < bEnd && proposedEnd > bStart;
    });
  };

  const isFullDay = timeSlot === "fullday";

  const getDayStatus = (day) => {
    const dateStr = toDateStr(year, month, day);
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);

    if (d < today) return "past";

    const baseTime = Date.UTC(year, month, day);

    if (timeSlot === "day") {
      const start = baseTime + 10 * 3600000;
      const end = baseTime + 15 * 3600000;
      if (isConflict(start, end)) return "blocked";
    } else {
      if (!selectedDate) {
        const start = baseTime + 16 * 3600000;
        const end = baseTime + 24 * 3600000 + 9 * 3600000;
        if (isConflict(start, end)) return "blocked";
      } else {
        if (dateStr <= selectedDate) {
          const start = baseTime + 16 * 3600000;
          const end = baseTime + 24 * 3600000 + 9 * 3600000;
          if (isConflict(start, end)) return "blocked";
        } else {
          const start = parseBaseTime(selectedDate) + 16 * 3600000;
          const end = baseTime + 9 * 3600000;
          if (isConflict(start, end)) return "span-blocked";
        }
      }
    }

    if (dateStr === selectedDate || (isFullDay && selectedCheckOut && dateStr === selectedCheckOut)) return "selected";
    if (timeSlot === "fullday" && selectedRange.has(dateStr)) return "range";

    if (timeSlot === "fullday") {
      const hasDayBooking = activeBookings.some(
        (b) => b.timeSlot === "day" && b.checkInDate.split("T")[0] === dateStr,
      );
      if (hasDayBooking) return "has-day-booking";
    }

    return "available";
  };

  const isNextDisabled =
    !selectedDate || (timeSlot === "fullday" && !selectedCheckOut);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="relative w-full max-w-[420px] sm:max-w-[480px] bg-white rounded-3xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 pt-2 pb-2">
        {/* Top row: Back + Close */}
        <div className="flex items-center justify-between mb-1.5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-semibold uppercase tracking-widest transition-colors"
          >
            <ChevronLeft size={15} />
            Back
          </button>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Package Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-sm shrink-0">
            {pkg.icon}
          </div>
          <div>
            <p className="text-white/70 text-[9px] font-bold uppercase tracking-[0.2em]">
              {pkg.label} · Room {roomNumber}
            </p>
            <h2 className="text-white text-xs font-bold tracking-tight leading-tight">
              {isFullDay ? "Select the Dates" : "Select a Date"}
            </h2>
            <p className="text-white/80 text-[10px] font-medium mt-0.5">{pkg.timeRange}</p>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 pt-1 pb-3">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 transition-all duration-200"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-gray-800 text-sm font-bold uppercase tracking-widest">
            {monthName} <span className="text-gray-400 font-medium">{year}</span>
          </span>
          <button
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 transition-all duration-200"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-0.5 mb-0.5">
          {weekDays.map((d, i) => (
            <div
              key={`day-${i}`}
              className="text-center text-[8px] font-bold text-gray-400 uppercase tracking-wider"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0.5 mb-1.5">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const status = getDayStatus(day);
            const dateStr = toDateStr(year, month, day);
            return (
              <button
                key={day}
                disabled={
                  status === "past" ||
                  status === "blocked" ||
                  status === "span-blocked"
                }
                onClick={() => onDateSelect(dateStr)}
                title={
                  status === "blocked"
                    ? "Not available on this date"
                    : status === "span-blocked"
                      ? "Cannot span across a blocked date"
                      : undefined
                }
                className={`group relative aspect-square rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center justify-center overflow-hidden outline-none focus:ring-2 focus:ring-orange-400/30 focus:ring-offset-1 ${
                  status === "past"
                    ? "text-gray-200 opacity-30 cursor-not-allowed"
                    : status === "blocked" || status === "span-blocked"
                      ? "bg-red-50 text-red-300 cursor-not-allowed"
                      : status === "selected"
                        ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-400/40 scale-105 z-10"
                        : status === "range"
                          ? "bg-orange-100 text-orange-600"
                          : status === "has-day-booking"
                            ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                            : "bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <span className="relative z-10">{day}</span>
                {status === "has-day-booking" && (
                  <div className="absolute top-[3px] right-[3px] w-1 h-1 bg-blue-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-2.5 gap-y-0.5 mb-1.5 pb-1.5 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-300" />
            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Selected</span>
          </div>
          {isFullDay && (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-orange-200" />
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Range</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Day Booked</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-300" />
            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Unavailable</span>
          </div>
        </div>

        {/* Selected Dates Display - compact inline row */}
        {(selectedDate || selectedCheckOut) && (
          <div className="mb-1.5 flex items-center bg-gray-50 border border-gray-100 rounded-xl px-2 py-1.5 gap-2">
            {selectedDate && (
              <div className="flex-1 flex items-center gap-1.5">
                <CalendarDays size={10} className="text-orange-500 shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[8px] font-bold text-orange-500 uppercase tracking-wider leading-none">Check-In · {isFullDay ? "4 PM" : "10 AM"}</span>
                  <span className="block text-[9px] font-bold text-gray-900 leading-tight truncate">{formatDate(selectedDate)}</span>
                </div>
              </div>
            )}
            {(isFullDay ? selectedCheckOut : selectedDate) && (
              <>
                <div className="h-6 w-px bg-gray-200 shrink-0" />
                <div className="flex-1 flex items-center gap-1.5">
                  <CalendarDays size={10} className="text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider leading-none">Check-Out · {isFullDay ? "9 AM" : "3 PM"}</span>
                    <span className="block text-[9px] font-bold text-gray-900 leading-tight truncate">{formatDate(isFullDay ? selectedCheckOut : selectedDate)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Confirm Button */}
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          style={{ borderRadius: "14px" }}
          className="w-full py-2 px-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs tracking-wide shadow-md shadow-orange-400/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isFullDay ? "Confirm Dates" : "Pick the Date"}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default DayUseCalender;
