import React, { useState, useEffect } from "react";
import { Users, CalendarDays, ChevronDown } from "lucide-react";
import axios from "axios";

const AppointmentAnalysis = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [selectedMonth, setSelectedMonth] = useState("May 2026");
  const [currentStats, setCurrentStats] = useState({
    Pending: 0,
    Completed: 0,
    Cancelled: 0,
    Overdue: 0,
  });

  const MonthAndYearMap = {
    "December 2026": { month: 12, year: 2026 },
    "November 2026": { month: 11, year: 2026 },
    "October 2026": { month: 10, year: 2026 },
    "September 2026": { month: 9, year: 2026 },
    "August 2026": { month: 8, year: 2026 },
    "July 2026": { month: 7, year: 2026 },
    "June 2026": { month: 6, year: 2026 },
    "May 2026": { month: 5, year: 2026 },
    "April 2026": { month: 4, year: 2026 },
    "March 2026": { month: 3, year: 2026 },
    "February 2026": { month: 2, year: 2026 },
    "January 2026": { month: 1, year: 2026 },
  };

  const fetchAppointmentData = async () => {
    try {
      const config = MonthAndYearMap[selectedMonth];
      if (!config.month || !config.year) {
        console.error("Invalid month or year selected");
        return;
      }
      const response = await axios.post(
        `${VITE_URL}/api/receptionhall/appointments/stats`,
        {
          month: config.month,
          year: config.year,
        },
      );
      setCurrentStats(response.data);
    } catch (error) {
      console.error("Error fetching appointment data:", error);
    }
  };

  useEffect(() => {
    fetchAppointmentData();
  }, [selectedMonth]);

  return (
    <div className="bg-white w-full max-w-md rounded-4xl p-6 shadow-xl border border-gray-100 flex flex-col gap-5">
      {/* Top Header Layer: Compact Icon & Month Dropdown Select */}
      <div className="flex items-center justify-between">
        {/* Left Side: Soft Pinkish Rounded Icon Box */}
        <div className="w-12 h-12 bg-rose-50/70 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-100/40">
          <Users size={22} strokeWidth={2.5} />
        </div>

        {/* Right Side: High-End Minimalist Custom Dropdown */}
        <div className="relative inline-block group">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="appearance-none bg-gray-50 hover:bg-gray-100/70 border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-xs font-bold text-gray-700 outline-none cursor-pointer transition-all shadow-xs"
          >
            <option value="December 2026">December 2026</option>
            <option value="November 2026">November 2026</option>
            <option value="October 2026">October 2026</option>
            <option value="September 2026">September 2026</option>
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
            <option value="June 2026">June 2026</option>
            <option value="May 2026">May 2026</option>
            <option value="April 2026">April 2026</option>
            <option value="March 2026">March 2026</option>
            <option value="February 2026">February 2026</option>
            <option value="January 2026">January 2026</option>
          </select>
          <CalendarDays
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors"
            size={14}
          />
          <ChevronDown
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={14}
          />
        </div>
      </div>

      {/* Main Rows Area Container */}
      <div className="flex flex-col gap-3">
        {/* ROW 1: PENDING APPOINTMENTS */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-gray-50/60 border border-gray-100 rounded-2xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs animate-pulse" />
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Pending Appointments
            </span>
          </div>
          <span className="text-base font-black text-neutral-900">
            {currentStats.Pending}
          </span>
        </div>

        {/* ROW 2: COMPLETED */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-gray-50/60 border border-gray-100 rounded-2xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Completed
            </span>
          </div>
          <span className="text-base font-black text-neutral-900">
            {currentStats.Completed}
          </span>
        </div>

        {/* ROW 3: CANCELLED */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-gray-50/60 border border-gray-100 rounded-2xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs" />
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Cancelled
            </span>
          </div>
          <span className="text-base font-black text-neutral-900">
            {currentStats.Cancelled}
          </span>
        </div>

        {/* ROW 4: OVERDUE */}
        <div
          className={`flex items-center justify-between px-4 py-3.5 border rounded-2xl transition-all duration-300 ${
            currentStats.Overdue > 0
              ? "bg-red-50/50 border-red-200/60 shadow-sm"
              : "bg-gray-50/60 border-gray-100 shadow-xs"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-2.5 h-2.5 rounded-full ${currentStats.Overdue > 0 ? "bg-red-600 shadow-sm animate-ping" : "bg-gray-400"}`}
            />
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase flex items-center gap-2">
              Overdue / Flagged
              {currentStats.Overdue > 0 && (
                <span className="text-[9px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded-md uppercase tracking-tight scale-90">
                  Alert
                </span>
              )}
            </span>
          </div>
          <span
            className={`text-base font-black ${currentStats.Overdue > 0 ? "text-red-600" : "text-neutral-900"}`}
          >
            {currentStats.Overdue}
          </span>
        </div>
      </div>
    </div>
  );
};

const ReceptionHallAnlys = () => {
  return (
    <div>
      <div className="p-3">
        <AppointmentAnalysis />
      </div>
    </div>
  );
};

export default ReceptionHallAnlys;
