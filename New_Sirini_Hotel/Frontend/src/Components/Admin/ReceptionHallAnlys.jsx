import React, { useState, useEffect } from "react";
import {
  XCircle,
  Sun,
  Moon,
  CalendarDays,
  ChevronDown,
  Layers,
  UtensilsCrossed,
  Megaphone,
  Eye,
  EyeOff,
  Clock,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import ReceptionHallYearlyIncomeChart from "./ReceptionHallYearlyIncomeChart";

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
    <div className="bg-white w-full h-full rounded-3xl p-4 shadow-xl border border-gray-100 flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
          Appointments
        </h3>
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
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors"
            size={14}
          />
          <ChevronDown
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={14}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50/60 border border-gray-100 rounded-xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs animate-pulse" />
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Pending Appointments
            </span>
          </div>
          <span className="text-sm font-black text-neutral-900">
            {currentStats.Pending}
          </span>
        </div>

        <div className="flex items-center justify-between px-3 py-2 bg-gray-50/60 border border-gray-100 rounded-xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Completed
            </span>
          </div>
          <span className="text-sm font-black text-neutral-900">
            {currentStats.Completed}
          </span>
        </div>

        <div className="flex items-center justify-between px-3 py-2 bg-gray-50/60 border border-gray-100 rounded-xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs" />
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Cancelled
            </span>
          </div>
          <span className="text-sm font-black text-neutral-900">
            {currentStats.Cancelled}
          </span>
        </div>

        <div
          className={`flex items-center justify-between px-3 py-2 border rounded-xl transition-all duration-300 ${
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
            className={`text-sm font-black ${currentStats.Overdue > 0 ? "text-red-600" : "text-neutral-900"}`}
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
    <div className="bg-white w-full h-full rounded-3xl p-4 shadow-xl border border-gray-100 flex flex-col gap-3">
      {/* Top Header Layer */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
          Hall Bookings
        </h3>

        <div className="relative inline-block self-end">
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

      <div className="flex flex-col gap-2">
      
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50/60 border border-gray-100 rounded-xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-amber-50 text-amber-500 rounded-lg border border-amber-100/50">
              <Sun size={13} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Day Functions (Confirmed)
            </span>
          </div>
          <span className="text-sm font-black text-neutral-900">
            {bookingStats.DayConfirmed}
          </span>
        </div>

      
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50/60 border border-gray-100 rounded-xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-rose-50 text-rose-400 rounded-lg border border-rose-100/50">
              <XCircle size={13} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Day Functions (Cancelled)
            </span>
          </div>
          <span className="text-sm font-black text-gray-400">
            {bookingStats.DayCancelled}
          </span>
        </div>

      
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50/60 border border-gray-100 rounded-xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-indigo-50 text-indigo-500 rounded-lg border border-indigo-100/50">
              <Moon size={13} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Night Functions (Confirmed)
            </span>
          </div>
          <span className="text-sm font-black text-neutral-900">
            {bookingStats.NightConfirmed}
          </span>
        </div>

      
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50/60 border border-gray-100 rounded-xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-rose-50 text-rose-400 rounded-lg border border-rose-100/50">
              <XCircle size={13} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Night Functions (Cancelled)
            </span>
          </div>
          <span className="text-sm font-black text-gray-400">
            {bookingStats.NightCancelled}
          </span>
        </div>
      </div>
    </div>
  );
};

const Receptionhallcommonalysis = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;

  const [commonStats, setCommonStats] = useState({
    activePackages: 0,
    inactivePackages: 0,
    activeCateringItems: 0,
    inactiveCateringItems: 0,
    activeAdvertisments: 0,
    pendingAdvertisments: 0,
    rejectedAdvertisments: 0,
  });

  const fetchCommonAnalysisData = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/common/details`,
      );
      setCommonStats(response.data);
    } catch (error) {
      console.error("Error loading common asset summary metadata:", error);
    }
  };

  useEffect(() => {
    fetchCommonAnalysisData();
  }, []);
  return (
    <div className="bg-white w-full h-full rounded-3xl p-4 shadow-xl border border-gray-100 flex flex-col gap-3">
      {/* Top Header Layer */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
          System Assets Overview
        </h3>
      </div>

      
      <div className="flex flex-col gap-3.5">
       
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2 px-3 py-2 bg-gray-50/60 border border-gray-100 rounded-xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl border border-amber-100/40 shrink-0">
              <Layers size={15} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Hotel Packages
            </span>
          </div>
        
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-100/50 text-[10px] font-black uppercase">
              <Eye size={12} /> {commonStats.activePackages} Active
            </div>
            <div className="flex items-center gap-1.5 bg-gray-100 text-gray-500 px-2 py-1 rounded-lg text-[10px] font-black uppercase">
              <EyeOff size={12} /> {commonStats.inactivePackages} Inactive
            </div>
          </div>
        </div>

        
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2 px-3 py-2 bg-gray-50/60 border border-gray-100 rounded-xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-50 text-rose-500 rounded-xl border border-rose-100/40 shrink-0">
              <UtensilsCrossed size={15} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Catering Items
            </span>
          </div>
          <div className="flex items-center gap-2 App selection self-end sm:self-auto">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-100/50 text-[10px] font-black uppercase">
              <Eye size={12} /> {commonStats.activeCateringItems} Active
            </div>
            <div className="flex items-center gap-1.5 bg-gray-100 text-gray-500 px-2 py-1 rounded-lg text-[10px] font-black uppercase">
              <EyeOff size={12} /> {commonStats.inactiveCateringItems} Inactive
            </div>
          </div>
        </div>

        
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2 px-3 py-2 bg-gray-50/60 border border-gray-100 rounded-xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl border border-indigo-100/40 shrink-0">
              <Megaphone size={15} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Advertisements
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-1.5 self-end sm:self-auto justify-end">
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-1.5 py-1 rounded-lg border border-emerald-100/50 text-[9px] font-black uppercase">
              <Eye size={11} /> {commonStats.activeAdvertisments} Act
            </div>
            <div className="flex items-center gap-1 bg-gray-100 text-gray-500 px-1.5 py-1 rounded-lg text-[9px] font-black uppercase">
              <EyeOff size={11} /> {commonStats.inactiveAdvertisments} Inact
            </div>
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-1.5 py-1 rounded-lg border border-amber-200/60 text-[9px] font-black uppercase animate-pulse">
              <Clock size={11} /> {commonStats.pendingAdvertisments} Pend
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PackageBookedCount = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const currentYear = new Date().getFullYear();

  const [packageStats, setPackageStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPackageBookingCounts = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/packages/booked/count`,
      );
      setPackageStats(response.data || []);
    } catch (error) {
      console.error("Error loading package analysis statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackageBookingCounts();
  }, []);

  const badgeStyles = [
    { bg: "bg-amber-50 text-amber-500 border-amber-100/50" },
    { bg: "bg-emerald-50 text-emerald-500 border-emerald-100/50" },
    { bg: "bg-indigo-50 text-indigo-500 border-indigo-100/50" },
    { bg: "bg-rose-50 text-rose-500 border-rose-100/50" },
  ];

  return (
    <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-xl border border-gray-100 flex flex-col gap-4">
      
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-wide font-sans">
          Package Bookings
        </h3>

       
        <div className="relative inline-block self-end">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl pl-3 pr-6 py-2 text-xs font-bold text-gray-700 select-none">
            <CalendarDays size={14} className="text-gray-400" />
            <span>Year {currentYear}</span>
            <ChevronDown
              size={14}
              className="absolute right-2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

    
      <div className="flex flex-col gap-2">
        {loading ? (
         
          <p className="text-xs font-bold text-center text-gray-400 uppercase tracking-widest py-6 animate-pulse">
            Loading packages...
          </p>
        ) : packageStats.length === 0 ? (
          <p className="text-xs font-bold text-center text-gray-400 uppercase tracking-widest py-6">
            No active packages found
          </p>
        ) : (
          
          packageStats.map((item, index) => {
           
            const currentStyle = badgeStyles[index % badgeStyles.length];

            return (
              <div
                key={item.packageName || index}
                className="flex items-center justify-between px-3 py-2 bg-gray-50/60 border border-gray-100 rounded-xl shadow-xs hover:scale-[1.01] transition-transform duration-200"
              >
                
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg border ${currentStyle.bg} shrink-0 flex items-center justify-center`}
                  >
                    <Layers size={13} strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase truncate max-w-[180px]">
                    {item.packageName}
                  </span>
                </div>

                
                <span className="text-sm font-black text-neutral-900 pr-1">
                  {item.count}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const ReceptionHallAnlys = () => {
  return (
    <div>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-2">
        <AppointmentAnalysis />
        <ReceptionHallBookingAnalysis />
        <Receptionhallcommonalysis />
      </div>
      <div className="p-4 pt-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReceptionHallYearlyIncomeChart />
        <PackageBookedCount />
      </div>
    </div>
  );
};

export default ReceptionHallAnlys;
