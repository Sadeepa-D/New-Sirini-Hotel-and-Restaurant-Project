import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  ChevronDown,
  CheckCircle,
  XCircle,
  Users,
  Sun,
  Moon,
} from "lucide-react";
import axios from "axios";

const AppointmentAnalysis = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const currentYear = new Date().getFullYear();

  const currentmonthname = new Date().toLocaleString("en-US", {
    month: "long",
  });
  const [selectedMonth, setSelectedMonth] = useState(
    `${currentmonthname} ${currentYear}`,
  );
  const [currentStats, setCurrentStats] = useState({
    Pending: 0,
    Completed: 0,
    Cancelled: 0,
    Overdue: 0,
  });
  const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const fetchAppointmentData = async () => {
    try {
      const [monthName, year] = selectedMonth.split(" ");
      const MonthNumber = monthsArray.indexOf(monthName) + 1;
      const Year = Number(year);
      if (!MonthNumber || !Year) {
        console.error("Invalid month or year format");
        return;
      }
      const response = await axios.post(
        `${VITE_URL}/api/receptionhall/appointments/stats`,
        {
          month: MonthNumber,
          year: Year,
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
            className="appearance-none bg-gray-50 hover:bg-gray-100/70 border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-xs font-bold text-gray-700 outline-none cursor-pointer transition-all shadow-xs overflow-y-auto max-h-40"
          >
            {monthsArray.map((month) => (
              <option
                className="bg-white text-neutral-800 font-medium py-2"
                key={month}
                value={`${month} ${currentYear}`}
              >
                {month} {currentYear}
              </option>
            ))}
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

const ReceptionHallBookingAnalysis = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const currentYear = new Date().getFullYear();
  const currentMonthName = new Date().toLocaleString("en-US", {
    month: "long",
  });

  const [selectedMonth, setSelectedMonth] = useState(
    `${currentMonthName} ${currentYear}`,
  );
  const [bookingStats, setBookingStats] = useState({
    DayConfirmed: 0,
    DayCancelled: 0,
    NightConfirmed: 0,
    NightCancelled: 0,
  });

  const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const fetchReceptionHallBookingStats = async () => {
    try {
      const [monthName, year] = selectedMonth.split(" ");
      const monthNumber = monthsArray.indexOf(monthName) + 1;
      const yearNumber = Number(year);

      if (!monthNumber || !yearNumber) return;

      const response = await axios.post(
        `${VITE_URL}/api/receptionhall/bookings/stats`,
        { month: monthNumber, year: yearNumber },
      );

      setBookingStats(response.data);
    } catch (error) {
      console.error("Error fetching booking stats:", error);
    }
  };

  useEffect(() => {
    fetchReceptionHallBookingStats();
  }, [selectedMonth]);

  return (
    <div className="bg-white w-full max-w-md rounded-4xl p-6 shadow-xl border border-gray-100 flex flex-col gap-5">
      {/* Top Header Layer */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
          Reception Hall Bookings
        </h3>

        {/* Scrollable Month Selector */}
        <div className="relative inline-block text-left w-40">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="appearance-none bg-gray-50 hover:bg-gray-100/70 border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-xs font-bold text-gray-700 outline-none cursor-pointer transition-all shadow-xs overflow-y-auto max-h-40"
          >
            {monthsArray.map((month) => (
              <option
                className="bg-white text-neutral-800 font-medium py-2"
                key={month}
                value={`${month} ${currentYear}`}
              >
                {month} {currentYear}
              </option>
            ))}
          </select>
          <CalendarDays
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={14}
          />
          <ChevronDown
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={14}
          />
        </div>
      </div>

      {/* Main Status Category Content Rows */}
      <div className="flex flex-col gap-3">
        {/* ROW 1: DAY - CONFIRMED */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50/60 border border-gray-100 rounded-2xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl border border-amber-100/50">
              <Sun size={16} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Day Functions (Confirmed)
            </span>
          </div>
          <span className="text-base font-black text-neutral-900">
            {bookingStats.DayConfirmed}
          </span>
        </div>

        {/* ROW 2: DAY - CANCELLED */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50/60 border border-gray-100 rounded-2xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-rose-400 rounded-xl border border-rose-100/50">
              <XCircle size={16} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Day Functions (Cancelled)
            </span>
          </div>
          <span className="text-base font-black text-gray-400">
            {bookingStats.DayCancelled}
          </span>
        </div>

        {/* ROW 3: NIGHT - CONFIRMED */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50/60 border border-gray-100 rounded-2xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl border border-indigo-100/50">
              <Moon size={16} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Night Functions (Confirmed)
            </span>
          </div>
          <span className="text-base font-black text-neutral-900">
            {bookingStats.NightConfirmed}
          </span>
        </div>

        {/* ROW 4: NIGHT - CANCELLED */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50/60 border border-gray-100 rounded-2xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-rose-400 rounded-xl border border-rose-100/50">
              <XCircle size={16} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Night Functions (Cancelled)
            </span>
          </div>
          <span className="text-base font-black text-gray-400">
            {bookingStats.NightCancelled}
          </span>
        </div>
      </div>
    </div>
  );
};

const ReceptionHallAnlys = () => {
  return (
    <div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AppointmentAnalysis />
        <ReceptionHallBookingAnalysis />
      </div>
    </div>
  );
};

export default ReceptionHallAnlys;
