import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  ChevronDown,
  CheckCircle,
  ClipboardCheck,
  Trash2,
  AlertTriangle,
  Utensils,
} from "lucide-react";
import axios from "axios";

const RestaurantOrderAnalysis = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const currentYear = new Date().getFullYear();
  const currentMonthName = new Date().toLocaleString("en-US", {
    month: "long",
  });
  const [selectedMonth, setSelectedMonth] = useState(
    `${currentMonthName} ${currentYear}`,
  );

  const [orderStats, setOrderStats] = useState({
    Accepted: 0,
    Complete: 0,
    delete: 0,
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

  const fetchRestaurantOrderData = async () => {
    try {
      const [monthName, year] = selectedMonth.split(" ");
      const monthNumber = monthsArray.indexOf(monthName) + 1;
      const yearNumber = Number(year);

      if (!monthNumber || !yearNumber) return;

      const response = await axios.post(
        `${VITE_URL}/api/restraunt/orders/stats`,
        {
          month: monthNumber,
          year: yearNumber,
        },
      );

      setOrderStats(
        response.data || { Accepted: 0, Completed: 0, Deleted: 0, Overdue: 0 },
      );
    } catch (error) {
      console.error(
        "Error loading restaurant order analytical metrics:",
        error,
      );
    }
  };

  useEffect(() => {
    fetchRestaurantOrderData();
  }, [selectedMonth]);

  return (
    <div className="bg-white w-full max-w-sm rounded-3xl p-4 shadow-xl border border-gray-100 flex flex-col gap-3 select-none">
      {/* Top Header Layer: Section Title, Icon & Month Dropdown Select */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs shrink-0">
            <Utensils size={16} strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-wide font-sans">
            Restaurant Orders
          </h3>
        </div>

        {/* Right Aligned High-End Minimalist Custom Dropdown */}
        <div className="relative inline-block self-end group">
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
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors pointer-events-none"
            size={14}
          />
          <ChevronDown
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={14}
          />
        </div>
      </div>

      {/* Main Status Category Content Rows (Matches your sketch 100%) */}
      <div className="flex flex-col gap-2">
        {/* ROW 1: ACCEPTED ORDERS */}
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50/60 border border-gray-100 rounded-xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg border border-blue-100/50">
              <CheckCircle size={13} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Accepted Orders
            </span>
          </div>
          <span className="text-sm font-black text-neutral-900 pr-1">
            {orderStats.Accepted}
          </span>
        </div>

        {/* ROW 2: COMPLETED ORDERS */}
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50/60 border border-gray-100 rounded-xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-emerald-50 text-emerald-500 rounded-lg border border-emerald-100/50">
              <ClipboardCheck size={13} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Completed Orders
            </span>
          </div>
          <span className="text-sm font-black text-neutral-900 pr-1">
            {orderStats.Complete}
          </span>
        </div>

        {/* ROW 3: DELETED / CANCELLED ORDERS */}
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50/60 border border-gray-100 rounded-xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-rose-50 text-rose-400 rounded-lg border border-rose-100/50">
              <Trash2 size={13} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Deleted Orders
            </span>
          </div>
          <span className="text-sm font-black text-gray-400 pr-1">
            {orderStats.delete}
          </span>
        </div>

        {/* ROW 4: OVERDUE ORDERS */}
        <div
          className={`flex items-center justify-between px-3 py-2 border rounded-xl transition-all duration-300 ${
            orderStats.Overdue > 0
              ? "bg-red-50/50 border-red-200/60 shadow-xs"
              : "bg-gray-50/60 border-gray-100 shadow-xs"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-1.5 rounded-lg border ${
                orderStats.Overdue > 0
                  ? "bg-red-100 text-red-600 border-red-200"
                  : "bg-gray-100 text-gray-400 border-gray-200"
              }`}
            >
              <AlertTriangle
                size={13}
                strokeWidth={2.5}
                className={orderStats.Overdue > 0 ? "animate-pulse" : ""}
              />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase flex items-center gap-2">
              Overdue Orders
              {orderStats.Overdue > 0 && (
                <span className="text-[8px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded-md uppercase tracking-tight animate-bounce">
                  Alert
                </span>
              )}
            </span>
          </div>
          <span
            className={`text-sm font-black pr-1 ${
              orderStats.Overdue > 0 ? "text-red-600" : "text-neutral-900"
            }`}
          >
            {orderStats.Overdue}
          </span>
        </div>
      </div>
    </div>
  );
};

const RestrauntAnlys = () => {
  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <RestaurantOrderAnalysis />
    </div>
  );
};

export default RestrauntAnlys;
