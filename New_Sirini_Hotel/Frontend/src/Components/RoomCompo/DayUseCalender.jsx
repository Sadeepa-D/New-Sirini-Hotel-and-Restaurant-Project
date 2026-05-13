import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Minus, Plus } from "lucide-react";
import axios from "axios";

// Add N days (pure UTC, no timezone issues)
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
  timeSlot, // "day" | "fullday"
  numberOfDays,
  onDaysChange,
  dayBasePrice,
  totalPrice,
}) => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeBookings, setActiveBookings] = useState([]); // store full bookings

  // Fetch ALL bookings for this room
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

  // Build the range of dates currently highlighted (for fullday range display)
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
        b.timeSlot === "day" ? bIn + 12 * 3600000 : bIn + 16 * 3600000;
      const bEnd =
        b.timeSlot === "day" ? bIn + 15 * 3600000 : bOut + 10 * 3600000;
      return proposedStart < bEnd && proposedEnd > bStart;
    });
  };

  const getDayStatus = (day) => {
    const dateStr = toDateStr(year, month, day);
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);

    if (d < today) return "past";

    const baseTime = Date.UTC(year, month, day);

    if (timeSlot === "day") {
      // Proposed day booking: 12 PM - 3 PM
      const start = baseTime + 12 * 3600000;
      const end = baseTime + 15 * 3600000;
      if (isConflict(start, end)) return "blocked";
    } else {
      if (!selectedDate) {
        // Checking if we can check-in on this date.
        // Minimum stay is 1 night: [check-in 4 PM, next day 10 AM]
        const start = baseTime + 16 * 3600000;
        const end = baseTime + 24 * 3600000 + 10 * 3600000; // next day 10 AM
        if (isConflict(start, end)) return "blocked";
      } else {
        if (dateStr <= selectedDate) {
          // Evaluated as a potential new check-in date
          const start = baseTime + 16 * 3600000;
          const end = baseTime + 24 * 3600000 + 10 * 3600000;
          if (isConflict(start, end)) return "blocked";
        } else {
          // dateStr is a future date. Can it be a check-out date?
          // Proposed range: [selectedDate 4 PM, dateStr 10 AM]
          const start = parseBaseTime(selectedDate) + 16 * 3600000;
          const end = baseTime + 10 * 3600000;
          if (isConflict(start, end)) return "span-blocked";
        }
      }
    }

    if (dateStr === selectedDate) return "selected";
    if (timeSlot === "fullday" && selectedRange.has(dateStr)) return "range";

    // Show day bookings on full day calendar as a special available state
    if (timeSlot === "fullday") {
      const hasDayBooking = activeBookings.some(
        (b) => b.timeSlot === "day" && b.checkInDate.split("T")[0] === dateStr,
      );
      if (hasDayBooking) return "has-day-booking";
    }

    // Show full day check-in/check-out dates on day calendar as a special available state
    if (timeSlot === "day") {
      const hasFullDayEdge = activeBookings.some(
        (b) =>
          b.timeSlot === "fullday" &&
          (b.checkInDate.split("T")[0] === dateStr ||
            b.checkOutDate.split("T")[0] === dateStr),
      );
      if (hasFullDayEdge) return "has-fullday-edge";
    }

    return "available";
  };

  const isNextDisabled =
    !selectedDate || (timeSlot === "fullday" && !selectedCheckOut);

  const isFullDay = timeSlot === "fullday";

  return (
    <div className="relative w-full max-w-[360px] bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] shadow-orange-500/5 p-5 border border-white/50 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-gray-300 hover:text-gray-900 transition-colors"
      >
        <X size={18} />
      </button>

      {/* Back */}
      <button
        onClick={onBack}
        className="group text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:text-orange-500 transition-colors mb-3"
      >
        <ChevronLeft
          size={14}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
        Back
      </button>

      {/* Package Badge */}
      <div className="mb-3 relative">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100/50 rounded-xl px-3 py-1.5 mb-2 shadow-sm shadow-orange-500/5">
          <span className="text-base">{pkg.icon}</span>
          <span className="text-orange-600 text-[9px] font-black uppercase tracking-[0.2em]">
            {pkg.label}
          </span>
        </div>
        <h2 className="text-gray-900 text-xl font-serif italic tracking-tight font-medium">
          {isFullDay ? "Select Dates" : "Select a Date"}
        </h2>
        <p className="text-gray-400 text-[8px] font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 opacity-70"></span>
          {pkg.timeRange} · Room {roomNumber}
        </p>
      </div>

      {/* Month Navigation */}
      <div className="flex gap-4 items-center bg-gray-50/50 border border-gray-100/80 p-1 px-4 rounded-2xl mb-3">
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          className="text-gray-400 hover:text-orange-500 hover:bg-white p-1 rounded-lg transition-all shadow-sm shadow-transparent hover:shadow-gray-200/50"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-gray-900 text-[11px] font-black uppercase tracking-[0.25em] flex-1 text-center">
          {monthName}{" "}
          <span className="text-gray-400 font-medium ml-1">{year}</span>
        </span>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          className="text-gray-400 hover:text-orange-500 hover:bg-white p-1 rounded-lg transition-all shadow-sm shadow-transparent hover:shadow-gray-200/50"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {weekDays.map((d, i) => (
          <div
            key={`day-${i}`}
            className="text-center text-[7px] font-black text-gray-400 uppercase tracking-widest mb-0.5"
          >
            {d}
          </div>
        ))}
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
              className={`group relative aspect-square rounded-[10px] text-[10px] font-bold transition-all duration-300 flex items-center justify-center border overflow-hidden outline-none focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-1 ${
                status === "past"
                  ? "text-gray-200 border-transparent opacity-30 cursor-not-allowed"
                  : status === "blocked" || status === "span-blocked"
                    ? "bg-red-50/50 text-red-300 border-red-50 cursor-not-allowed"
                    : status === "selected"
                      ? "bg-gradient-to-tr from-orange-600 to-orange-400 text-white shadow-lg shadow-orange-500/30 scale-105 z-10 border-transparent"
                      : status === "range"
                        ? "bg-orange-50/50 text-orange-600 border-orange-100/50 backdrop-blur-sm"
                        : status === "has-day-booking"
                          ? "bg-gradient-to-br from-blue-50/80 to-white text-blue-700 border-blue-100/50 hover:border-blue-300 hover:-translate-y-0.5"
                          : status === "has-fullday-edge"
                            ? "bg-gradient-to-br from-purple-50/80 to-white text-purple-700 border-purple-100/50 hover:border-purple-300 hover:-translate-y-0.5"
                            : "bg-green-50 text-green-700 border-green-100 hover:border-green-400"
              }`}
            >
              <span className="relative z-10">{day}</span>
              {status === "has-day-booking" && (
                <div className="absolute top-[3px] right-[3px] w-1.5 h-1.5 bg-blue-400 rounded-full ring-1 ring-white" />
              )}
              {status === "has-fullday-edge" && (
                <div className="absolute top-[3px] right-[3px] w-1.5 h-1.5 bg-purple-400 rounded-full ring-1 ring-white" />
              )}
              {/* Hover effect background */}
              {status === "available" && (
                <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-x-3 gap-y-1 mb-3 pt-2 border-t border-gray-50 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">
            Available
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">
            Selected
          </span>
        </div>
        {isFullDay && (
          <>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-200 border border-orange-300" />
              <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">
                Stay Range
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">
                Day Booked
              </span>
            </div>
          </>
        )}
        {!isFullDay && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">
              Check-in/out
            </span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-300" />
          <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">
            Not Available
          </span>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className="group relative w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed disabled:scale-100 transition-all duration-300 overflow-hidden active:scale-[0.98] flex items-center justify-center gap-2 h-12 border border-orange-400/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
          {isFullDay ? "Confirm Dates" : "Pick the Date"}
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </span>
      </button>
    </div>
  );
};

export default DayUseCalender;
