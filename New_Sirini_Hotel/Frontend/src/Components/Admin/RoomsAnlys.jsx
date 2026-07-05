import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  ChevronDown,
  CheckCircle,
  ClipboardCheck,
  Trash2,
  AlertTriangle,
  BedDouble,
  PieChart as PieIcon,
  Eye,
  EyeOff,
  Wrench,
  Wallet,
  BarChart3,
  Key,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import axios from "axios";

const RoomBookingAnalysis = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const currentYear = new Date().getFullYear();
  const currentMonthName = new Date().toLocaleString("en-US", {
    month: "long",
  });

  const [selectedMonth, setSelectedMonth] = useState(
    `${currentMonthName} ${currentYear}`,
  );
  const [orderStats, setOrderStats] = useState({
    Confirmed: 0,
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

  const fetchRoomBookingData = async () => {
    try {
      const [monthName, year] = selectedMonth.split(" ");
      const monthNumber = monthsArray.indexOf(monthName) + 1;
      const yearNumber = Number(year);

      if (!monthNumber || !yearNumber) return;

      const response = await axios.post(
        `${VITE_URL}/api/rooms/roomanlys/bookingstats`,
        {
          month: monthNumber,
          year: yearNumber,
        },
      );

      setOrderStats(
        response.data.summary || {
          Confirmed: 0,
          Completed: 0,
          Cancelled: 0,
          Overdue: 0,
        },
      );
    } catch (error) {
      console.error("Error loading room booking analytical metrics:", error);
    }
  };

  useEffect(() => {
    fetchRoomBookingData();
  }, [selectedMonth]);

  return (
    <div className="bg-white w-full h-full rounded-3xl p-4 shadow-xl border border-gray-100 flex flex-col gap-3 select-none">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500 text-white rounded-xl shadow-xs shrink-0">
            <BedDouble size={16} strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-wide font-sans">
            Room Bookings
          </h3>
        </div>

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
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors pointer-events-none"
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
            <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg border border-blue-100/50">
              <CheckCircle size={13} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Confirmed Bookings
            </span>
          </div>
          <span className="text-sm font-black text-neutral-900 pr-1">
            {orderStats.Confirmed}
          </span>
        </div>

        <div className="flex items-center justify-between px-3 py-2 bg-gray-50/60 border border-gray-100 rounded-xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-emerald-50 text-emerald-500 rounded-lg border border-emerald-100/50">
              <ClipboardCheck size={13} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Completed Bookings
            </span>
          </div>
          <span className="text-sm font-black text-neutral-900 pr-1">
            {orderStats.Completed}
          </span>
        </div>

        <div className="flex items-center justify-between px-3 py-2 bg-gray-50/60 border border-gray-100 rounded-xl shadow-xs hover:scale-[1.01] transition-transform duration-200">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-rose-50 text-rose-400 rounded-lg border border-rose-100/50">
              <Trash2 size={13} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase">
              Cancelled Bookings
            </span>
          </div>
          <span className="text-sm font-black text-gray-400 pr-1">
            {orderStats.Cancelled}
          </span>
        </div>

        <div
          className={`flex items-center justify-between px-3 py-2 border rounded-xl transition-all duration-300 ${orderStats.Overdue > 0 ? "bg-red-50/50 border-red-200/60 shadow-xs" : "bg-gray-50/60 border-gray-100 shadow-xs"}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-1.5 rounded-lg border ${orderStats.Overdue > 0 ? "bg-red-100 text-red-600 border-red-200" : "bg-gray-100 text-gray-400 border-gray-200"}`}
            >
              <AlertTriangle
                size={13}
                strokeWidth={2.5}
                className={orderStats.Overdue > 0 ? "animate-pulse" : ""}
              />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#2D3748] tracking-wider uppercase flex items-center gap-2">
              Overdue Bookings
              {orderStats.Overdue > 0 && (
                <span className="text-[8px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded-md uppercase tracking-tight animate-bounce">
                  Alert
                </span>
              )}
            </span>
          </div>
          <span
            className={`text-sm font-black pr-1 ${orderStats.Overdue > 0 ? "text-red-600" : "text-neutral-900"}`}
          >
            {orderStats.Overdue}
          </span>
        </div>
      </div>
    </div>
  );
};

const RoomBookingPieChart = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const currentYear = new Date().getFullYear();
  const currentMonthName = new Date().toLocaleString("en-US", {
    month: "long",
  });

  const [selectedMonth, setSelectedMonth] = useState(
    `${currentMonthName} ${currentYear}`,
  );
  const [chartData, setChartData] = useState([]);
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

  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#F43F5E",
    "#8B5CF6",
  ];

  useEffect(() => {
    const fetchFrequency = async () => {
      try {
        setLoading(true);
        const [monthName, year] = selectedMonth.split(" ");
        const monthNumber = monthsArray.indexOf(monthName) + 1;

        const response = await axios.post(
          `${VITE_URL}/api/rooms/roomanlys/roomfrequency`,
          {
            month: monthNumber,
            year: Number(year),
          },
        );

        const data = response.data.frequency || [];
        const formatted = data.map((item, index) => ({
          name: `Room ${item.roomNumber}`,
          value: item.count,
          color: colors[index % colors.length],
        }));
        setChartData(formatted);
      } catch (error) {
        console.error("Error loading pie chart data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFrequency();
  }, [selectedMonth]);

  return (
    <div className="bg-white w-full h-full rounded-3xl p-4 shadow-xl border border-gray-100 flex flex-col gap-2">
      <div className="flex items-center justify-between border-b border-gray-50 pb-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500 text-white rounded-lg">
            <PieIcon size={14} />
          </div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
            Room Booking Frequency
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 mt-1">
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl pl-7 pr-6 py-1.5 text-[11px] font-bold text-gray-700 outline-none cursor-pointer truncate"
          >
            {monthsArray.map((m) => (
              <option key={m} value={`${m} ${currentYear}`}>
                {m} {currentYear}
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
      </div>

      <div className="flex-1 w-full min-h-[250px] flex items-center justify-center relative text-xs mt-2">
        {loading ? (
          <p className="font-bold text-gray-400 uppercase tracking-wider animate-pulse">
            Loading Chart...
          </p>
        ) : chartData.length === 0 ? (
          <p className="font-bold text-gray-400 uppercase tracking-wider">
            No Bookings Data
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Bookings`]} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconSize={8}
                iconType="circle"
                wrapperStyle={{
                  fontSize: "10px",
                  fontWeight: "bold",
                  paddingTop: "10px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

const RoomStatusOverview = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [statusCounts, setStatusCounts] = useState({
    available: 0,
    reserved: 0,
    maintenance: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStatusOverview = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/rooms/roomanlys/statusoverview`,
      );
      setStatusCounts(
        response.data.statusOverview || {
          available: 0,
          reserved: 0,
          maintenance: 0,
        },
      );
    } catch (error) {
      console.error("Error loading room status summary:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusOverview();
  }, []);

  return (
    <div className="bg-white w-full h-full rounded-3xl p-4 shadow-xl border border-gray-100 flex flex-col gap-3 select-none">
      <div className="flex flex-col gap-1 border-b border-gray-50 pb-1">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-wide font-sans">
          System Rooms Status
        </h3>
        <p className="text-xs text-gray-400 font-bold">
          Current live room availability
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {loading ? (
          <p className="text-xs font-bold text-center text-gray-400 uppercase tracking-widest py-8 animate-pulse">
            Loading statuses...
          </p>
        ) : (
          <>
            <div className="flex items-center justify-between px-4 py-3 bg-emerald-50/50 border border-emerald-100 rounded-xl shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                  <Eye size={18} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-black text-emerald-800 tracking-wider uppercase">
                  Available Rooms
                </span>
              </div>
              <span className="text-lg font-black text-emerald-600 pr-1">
                {statusCounts.available}
              </span>
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-orange-50/50 border border-orange-100 rounded-xl shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg shrink-0">
                  <Key size={18} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-black text-orange-800 tracking-wider uppercase">
                  Reserved / Booked
                </span>
              </div>
              <span className="text-lg font-black text-orange-600 pr-1">
                {statusCounts.reserved}
              </span>
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-200 text-slate-600 rounded-lg shrink-0">
                  <Wrench size={18} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-black text-slate-700 tracking-wider uppercase">
                  Maintenance
                </span>
              </div>
              <span className="text-lg font-black text-slate-600 pr-1">
                {statusCounts.maintenance}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const RoomMonthlyRevenueChart = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const currentYear = new Date().getFullYear();
  const [chartData, setChartData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${VITE_URL}/api/rooms/roomanlys/revenuemnothly`,
        { year: currentYear },
      );

      const data = response.data.monthlyRevenue || [];
      setChartData(data);
      setTotalRevenue(data.reduce((sum, item) => sum + item.revenue, 0));
    } catch (error) {
      console.error("Error loading monthly revenue chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-2xl text-white">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {payload[0].payload.month} Revenue
          </p>
          <p className="text-sm font-black text-emerald-400 mt-0.5">
            LKR {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white w-full rounded-3xl p-5 shadow-xl border border-gray-100 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-50 pb-4 gap-4 sm:gap-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-2xl border border-emerald-100/40 shrink-0">
            <Wallet size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-neutral-800 uppercase tracking-wide">
                Monthly Revenue ({currentYear})
              </h3>
            </div>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              Revenue from completed/confirmed bookings
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
            Total Yearly
          </span>
          <span className="text-base font-black text-emerald-600">
            LKR {totalRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="w-full h-64 min-h-[250px] text-xs font-bold text-gray-400">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="animate-pulse tracking-wider">Loading Chart...</p>
          </div>
        ) : chartData.length === 0 || totalRevenue === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="tracking-wider">No Revenue Data for {currentYear}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 10 }}
                tickFormatter={(value) =>
                  value >= 1000 ? `${value / 1000}k` : value
                }
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#F8FAFC", radius: 8 }}
              />
              <Bar
                dataKey="revenue"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
                className="hover:fill-emerald-400 transition-colors duration-200"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

const RoomRevenueByRoomChart = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const currentYear = new Date().getFullYear();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRevenueByRoomData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${VITE_URL}/api/rooms/roomanlys/revenuebyroom`,
        { year: currentYear },
      );
      const data = response.data.revenueByRoom || [];
      const formatted = data.map((item) => ({
        room: `Room ${item.roomNumber}`,
        revenue: item.revenue,
      }));
      setChartData(formatted);
    } catch (error) {
      console.error("Error loading revenue by room chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueByRoomData();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-2xl text-white">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {payload[0].payload.room}
          </p>
          <p className="text-sm font-black text-indigo-400 mt-0.5">
            LKR {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white w-full rounded-3xl p-5 shadow-xl border border-gray-100 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-50 pb-4 gap-4 sm:gap-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-2xl border border-indigo-100/40 shrink-0">
            <BarChart3 size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-neutral-800 uppercase tracking-wide">
                Revenue By Room ({currentYear})
              </h3>
            </div>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              Yearly revenue generated per room
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-64 min-h-[250px] text-xs font-bold text-gray-400">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="animate-pulse tracking-wider">Loading Chart...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="tracking-wider">No Revenue Data for {currentYear}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="room"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 10 }}
                tickFormatter={(value) =>
                  value >= 1000 ? `${value / 1000}k` : value
                }
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#F8FAFC", radius: 8 }}
              />
              <Bar
                dataKey="revenue"
                fill="#6366F1"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
                className="hover:fill-indigo-400 transition-colors duration-200"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

const RoomsAnlys = () => {
  return (
    <div>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-2">
        <RoomBookingAnalysis />
        <RoomBookingPieChart />
        <RoomStatusOverview />
      </div>
      <div className="p-4 pt-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RoomMonthlyRevenueChart />
        <RoomRevenueByRoomChart />
      </div>
    </div>
  );
};

export default RoomsAnlys;
