import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  ChevronDown,
  CheckCircle,
  ClipboardCheck,
  Trash2,
  AlertTriangle,
  Utensils,
  PieChart as PieIcon,
  Eye,
  EyeOff,
  Soup,
  Flame,
  FlameKindling,
  Pizza,
  Egg,
  Cake,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
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
        response.data.summary || {
          Accepted: 0,
          Completed: 0,
          Deleted: 0,
          Overdue: 0,
        },
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
    <div className="bg-white w-full h-full rounded-3xl p-4 shadow-xl border border-gray-100 flex flex-col gap-3 select-none">
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

const RestaurantOrderPieChart = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const currentYear = new Date().getFullYear();
  const currentMonthName = new Date().toLocaleString("en-US", {
    month: "long",
  });

  const [selectedMonth, setSelectedMonth] = useState(
    `${currentMonthName} ${currentYear}`,
  );
  const [selectedDate, setSelectedDate] = useState("Whole Month");

  const [monthlyData, setMonthlyData] = useState({ summary: {}, daily: [] });
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [monthName, year] = selectedMonth.split(" ");
        const monthNumber = monthsArray.indexOf(monthName) + 1;

        const response = await axios.post(
          `${VITE_URL}/api/restraunt/orders/stats`,
          {
            month: monthNumber,
            year: Number(year),
          },
        );

        setMonthlyData(response.data);
        setSelectedDate("Whole Month");
      } catch (error) {
        console.error("Error loading pie chart data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedMonth]);

  const getChartData = () => {
    let source = { Accepted: 0, Complete: 0, delete: 0, Overdue: 0 };

    if (selectedDate === "Whole Month") {
      source = monthlyData.summary || source;
    } else {
      const dayRecord = monthlyData.daily?.find((d) => d.date === selectedDate);
      if (dayRecord) source = dayRecord;
    }

    return [
      { name: "Accepted", value: source.Accepted || 0, color: "#3B82F6" }, // Blue
      { name: "Completed", value: source.Complete || 0, color: "#10B981" }, // Emerald
      { name: "Deleted", value: source.delete || 0, color: "#F87171" }, // Rose
      { name: "Overdue", value: source.Overdue || 0, color: "#EF4444" }, // Strong Red
    ].filter((item) => item.value > 0);
  };

  const activeChartData = getChartData();

  return (
    <div className="bg-white w-full h-full rounded-3xl p-4 shadow-xl border border-gray-100 flex flex-col gap-2">
      {/* Title Header Section */}
      <div className="flex items-center gap-2 border-b border-gray-50 pb-1">
        <div className="p-1.5 bg-amber-500 text-white rounded-lg">
          <PieIcon size={14} />
        </div>
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
         Daily Order Distribution
        </h3>
      </div>

      {/* Selector Options Layer: Side-by-Side Dual Dropdowns */}
      <div className="grid grid-cols-2 gap-2">
        {/* Month Selector Dropdown */}
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl pl-7 pr-6 py-1.5 text-[11px] font-bold text-gray-700 outline-none cursor-pointer truncate"
          >
            {monthsArray.map((m) => (
              <option key={m} value={`${m} ${currentYear}`}>
                {m}
              </option>
            ))}
          </select>
          <CalendarDays
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={12}
          />
          <ChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={12}
          />
        </div>

        {/* Date Selector Dropdown */}
        <div className="relative">
          <select
            value={selectedDate}
            disabled={loading}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl pl-3 pr-6 py-1.5 text-[11px] font-bold text-gray-700 outline-none cursor-pointer disabled:opacity-50"
          >
            <option value="Whole Month">Whole Month</option>
            {monthlyData.daily?.map((day) => (
              <option key={day.date} value={day.date}>
                Day {day.date.split("-")[2]}{" "}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={12}
          />
        </div>
      </div>

      {/* Pie Chart Display Layer */}
      <div className="flex-1 w-full min-h-[200px] flex items-center justify-center relative text-xs">
        {loading ? (
          <p className="font-bold text-gray-400 uppercase tracking-wider animate-pulse">
            Loading Chart...
          </p>
        ) : activeChartData.length === 0 ? (
          <p className="font-bold text-gray-400 uppercase tracking-wider">
            No Orders Data
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie
                data={activeChartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {activeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Orders`]} />
              <Legend
                iconSize={8}
                iconType="circle"
                wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
const Fooditemstatus = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;

  const [menuStats, setMenuStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenuOverview = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/restraunt/fooditems/status`,
      );
      setMenuStats(response.data || []);
    } catch (error) {
      console.error("Error loading restaurant menu summary metadata:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuOverview();
  }, []);

  const rowConfigs = [
    { icon: Flame, bg: "bg-amber-50 text-amber-500 border-amber-100/40" },
    {
      icon: Utensils,
      bg: "bg-emerald-50 text-emerald-500 border-emerald-100/40",
    },
    { icon: FlameKindling, bg: "bg-rose-50 text-rose-500 border-rose-100/40" },
    { icon: Soup, bg: "bg-indigo-50 text-indigo-500 border-indigo-100/40" },
    { icon: Pizza, bg: "bg-blue-50 text-blue-500 border-blue-100/40" },
    { icon: Egg, bg: "bg-purple-50 text-purple-500 border-purple-100/40" },
    { icon: Cake, bg: "bg-pink-50 text-pink-500 border-pink-100/40" },
  ];

  return (
    <div className="bg-white w-full h-full rounded-3xl p-4 shadow-xl border border-gray-100 flex flex-col gap-3 select-none">
      {/* Top Header Title */}
      <div className="flex flex-col gap-1 border-b border-gray-50 pb-1">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-wide font-sans">
          Menu Assets Overview
        </h3>
      </div>

      {/* Main Structural Content Segment Rows */}
      <div className="flex flex-col gap-2 max-h-105 overflow-y-auto pr-1 no-scrollbar">
        {loading ? (
          <p className="text-xs font-bold text-center text-gray-400 uppercase tracking-widest py-8 animate-pulse">
            Loading menu categories...
          </p>
        ) : menuStats.length === 0 ? (
          <p className="text-xs font-bold text-center text-gray-400 uppercase tracking-widest py-8">
            No categories or items found
          </p>
        ) : (
          menuStats.map((item, index) => {
            const config = rowConfigs[index % rowConfigs.length];
            const RowIcon = config.icon;

            return (
              <div
                key={item.category || index}
                className="flex items-center justify-between px-3 py-2 bg-gray-50/60 border border-gray-100 rounded-xl shadow-xs hover:scale-[1.01] transition-transform duration-200"
              >
                {/* Left Side: Category Icon and Name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg border ${config.bg} shrink-0 flex items-center justify-center`}
                  >
                    <RowIcon size={13} strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase truncate flex-1 pr-2">
                    {item.category}
                  </span>
                </div>

                {/* Right Side: Available vs Unavailable Counts Indicators */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-100/50 text-[10px] font-black uppercase tracking-wide">
                    <Eye size={12} /> {item.Available} Active
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide">
                    <EyeOff size={12} /> {item.Unavailable} Inactive
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const RestrauntAnlys = () => {
  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-2">
      <RestaurantOrderAnalysis />
      <RestaurantOrderPieChart />
      <Fooditemstatus />
    </div>
  );
};

export default RestrauntAnlys;
