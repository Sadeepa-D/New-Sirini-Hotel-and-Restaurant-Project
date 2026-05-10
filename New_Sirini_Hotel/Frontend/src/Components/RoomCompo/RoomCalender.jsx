import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const RoomCalender = ({ bookedDates, checkIn, checkOut, onDateSelect, onNext, onClose, roomNumber }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const toLocalDateString = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const getDayStatus = (day) => {
    const dateStr = toLocalDateString(year, month, day);
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);
    if (bookedDates.includes(dateStr)) return "booked";
    if (d < today) return "past";
    if (dateStr === checkIn || dateStr === checkOut) return "selected";
    if (checkIn && checkOut && dateStr > checkIn && dateStr < checkOut) return "range";
    return "available";
  };

  return (
    <div className="relative w-full max-w-[380px] bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-100 animate-in fade-in zoom-in duration-300">
      <button onClick={onClose} className="absolute top-6 right-6 text-gray-300 hover:text-gray-900"><X size={20} /></button>
      
      <div className="mb-6">
        <h2 className="text-gray-900 text-xl font-serif italic">Select Dates</h2>
        <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest">Suite #{roomNumber}</p>
      </div>

      <div className="flex gap-4 items-center bg-gray-50 p-1 px-4 rounded-full border border-gray-100 mb-6">
        <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="text-gray-400 hover:text-orange-500"><ChevronLeft size={18}/></button>
        <span className="text-gray-900 text-xs font-black uppercase tracking-widest flex-1 text-center">{monthName} {year}</span>
        <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="text-gray-400 hover:text-orange-500"><ChevronRight size={18}/></button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-6">
        {weekDays.map(d => <div key={d} className="text-center text-[10px] font-black text-gray-300">{d}</div>)}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const status = getDayStatus(day);
          return (
            <button
              key={day}
              disabled={status === "booked" || status === "past"}
              onClick={() => onDateSelect(toLocalDateString(year, month, day))}
              className={`aspect-square rounded-xl text-[11px] font-bold transition-all flex items-center justify-center ${
                status === "booked" ? "text-red-200 cursor-not-allowed line-through" :
                status === "selected" ? "bg-orange-500 text-white shadow-lg" :
                status === "range" ? "bg-orange-50 text-orange-600" :
                status === "past" ? "text-gray-200 opacity-40 cursor-not-allowed" : "text-gray-600 hover:bg-orange-50"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <button 
        onClick={onNext} disabled={!checkOut}
        className="w-full py-4 rounded-[2rem] bg-gray-900 text-white font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 disabled:opacity-20 transition-all"
      >
        Confirm Dates
      </button>
    </div>
  );
};

export default RoomCalender;