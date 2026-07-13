import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart2,
  CalendarRange,
  TrendingUp,
  Loader2,
  AlertCircle,
  Utensils,
  BedDouble,
  ConciergeBell,
  Download,
  FileSpreadsheet,
} from "lucide-react";

const VITE_URL = import.meta.env.VITE_API_URL;

const MONTHS_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function getMonthsBetween(startDate, endDate) {
  const months = [];
  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  while (cursor <= end) {
    months.push({ month: cursor.getMonth() + 1, year: cursor.getFullYear() });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
}

const COLORS = {
  restaurant: "#f59e0b",
  rooms: "#6366f1",
  reception: "#10b981",
};

const CHART_DATA_KEYS = [
  { key: "restaurant", label: "Restaurant",    color: COLORS.restaurant, Icon: Utensils },
  { key: "rooms",      label: "Rooms",          color: COLORS.rooms,      Icon: BedDouble },
  { key: "reception",  label: "Reception Hall", color: COLORS.reception,  Icon: ConciergeBell },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 12, padding: "10px 14px" }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{name}</p>
        <p style={{ fontSize: 13, fontWeight: 900, color: "#ffffff" }}>LKR {Number(value).toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ data, total }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {data.map(({ key, label, color, value, Icon }) => {
      const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
      return (
        <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 12, border: `1px solid ${color}40`, background: `${color}0a` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
            <Icon size={13} style={{ color }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>{label}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 12, fontWeight: 900, color }}> LKR {Number(value).toLocaleString()}</span>
            <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, marginLeft: 8 }}>({pct}%)</span>
          </div>
        </div>
      );
    })}
  </div>
);

/* ══════════════════════════════════════════════════════
   Excel helper
══════════════════════════════════════════════════════ */
function styleHeader(ws, range) {
  for (let C = range.s.c; C <= range.e.c; C++) {
    const cell = ws[XLSX.utils.encode_cell({ r: 0, c: C })];
    if (cell) {
      cell.s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "1E293B" } },
        alignment: { horizontal: "center" },
        border: {
          bottom: { style: "thin", color: { rgb: "94A3B8" } },
        },
      };
    }
  }
}

function buildSummarySheet(startDate, endDate, incomeData) {
  const rows = [
    ["Sirini Hotel & Restaurant — Overall Income Report"],
    [`Period: ${startDate} to ${endDate}`],
    [],
    ["Department", "Revenue (LKR)", "Share (%)"],
    ["Restaurant",    incomeData.restaurant, incomeData.total > 0 ? +((incomeData.restaurant / incomeData.total) * 100).toFixed(2) : 0],
    ["Rooms",         incomeData.rooms,      incomeData.total > 0 ? +((incomeData.rooms      / incomeData.total) * 100).toFixed(2) : 0],
    ["Reception Hall",incomeData.reception,  incomeData.total > 0 ? +((incomeData.reception  / incomeData.total) * 100).toFixed(2) : 0],
    [],
    ["TOTAL", incomeData.total, 100],
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 22 }, { wch: 20 }, { wch: 14 }];
  return ws;
}

function buildRestaurantSheet(restaurantRows) {
  const header = ["Month", "Year", "Accepted Orders", "Completed Orders", "Deleted Orders", "Overdue Orders", "Revenue (LKR)"];
  const rows = [header, ...restaurantRows];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 14 }, { wch: 8 }, { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 18 }];
  return ws;
}

function buildRoomsSheet(roomsRows) {
  const header = ["Month", "Year", "Confirmed Bookings", "Completed Bookings", "Cancelled Bookings", "Overdue Bookings", "Pending Bookings", "Revenue (LKR)"];
  const rows = [header, ...roomsRows];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 14 }, { wch: 8 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 18 }];
  return ws;
}

function buildReceptionSheet(receptionRows) {
  const header = ["Month", "Year", "Day Confirmed", "Day Cancelled", "Night Confirmed", "Night Cancelled", "Income (LKR)"];
  const rows = [header, ...receptionRows];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 14 }, { wch: 8 }, { wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 18 }, { wch: 18 }];
  return ws;
}

/* ══════════════════════════════════════════════════════
   Main Component
══════════════════════════════════════════════════════ */
const OverallChart = () => {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
  const todayStr = today.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate]     = useState(todayStr);
  const [loading, setLoading]     = useState(false);
  const [dlLoading, setDlLoading] = useState(false);
  const [error, setError]         = useState("");
  const [incomeData, setIncomeData] = useState(null);

  // Detailed rows stored for Excel export
  const [restaurantRows, setRestaurantRows] = useState([]);
  const [roomsRows, setRoomsRows]           = useState([]);
  const [receptionRows, setReceptionRows]   = useState([]);

  const handleFetch = async () => {
    if (!startDate || !endDate) { setError("Please select both start and end dates."); return; }
    const sd = new Date(startDate);
    const ed = new Date(endDate);
    if (sd > ed) { setError("Start date must be before or equal to end date."); return; }
    setError("");
    setLoading(true);
    setIncomeData(null);
    setRestaurantRows([]);
    setRoomsRows([]);
    setReceptionRows([]);

    try {
      const months      = getMonthsBetween(sd, ed);
      const uniqueYears = [...new Set(months.map((m) => m.year))];

      /* ── Rooms: pre-fetch revenue per year ── */
      const roomsRevenueMap = {};
      await Promise.all(uniqueYears.map(async (year) => {
        try {
          const res = await axios.post(`${VITE_URL}/api/rooms/roomanlys/revenuemnothly`, { year });
          (res.data?.monthlyRevenue || []).forEach((e) => {
            roomsRevenueMap[`${e.monthNumber}-${year}`] = e.revenue || 0;
          });
        } catch { }
      }));

      /* ── Reception: pre-fetch income per year ── */
      const receptionIncomeMap = {};
      await Promise.all(uniqueYears.map(async (year) => {
        try {
          const res = await axios.get(`${VITE_URL}/api/receptionhall/income/yearly`);
          (res.data || []).forEach((e, idx) => {
            receptionIncomeMap[`${idx + 1}-${year}`] = e.income || 0;
          });
        } catch { }
      }));

      let restaurantTotal = 0, roomsTotal = 0, receptionTotal = 0;
      const newRestaurantRows = [];
      const newRoomsRows      = [];
      const newReceptionRows  = [];

      await Promise.all(months.map(async ({ month, year }) => {
        const monthName = MONTHS_NAMES[month - 1];

        /* Restaurant */
        try {
          const res = await axios.post(`${VITE_URL}/api/restraunt/orders/stats`, { month, year });
          const s = res.data?.summary || {};
          const rev = s.Revenue || 0;
          restaurantTotal += rev;
          newRestaurantRows.push([
            monthName, year,
            s.Accepted  || 0,
            s.Complete  || 0,
            s.delete    || 0,
            s.Overdue   || 0,
            rev,
          ]);
        } catch {
          newRestaurantRows.push([monthName, year, 0, 0, 0, 0, 0]);
        }

        /* Rooms */
        try {
          const res = await axios.post(`${VITE_URL}/api/rooms/roomanlys/bookingstats`, { month, year });
          const s = res.data?.summary || {};
          const rev = roomsRevenueMap[`${month}-${year}`] || 0;
          roomsTotal += rev;
          newRoomsRows.push([
            monthName, year,
            s.Confirmed  || 0,
            s.Completed  || 0,
            s.Cancelled  || 0,
            s.Overdue    || 0,
            s.Pending    || 0,
            rev,
          ]);
        } catch {
          const rev = roomsRevenueMap[`${month}-${year}`] || 0;
          roomsTotal += rev;
          newRoomsRows.push([monthName, year, 0, 0, 0, 0, 0, rev]);
        }

        /* Reception */
        try {
          const res = await axios.post(`${VITE_URL}/api/receptionhall/bookings/stats`, { month, year });
          const s = res.data || {};
          const inc = receptionIncomeMap[`${month}-${year}`] || 0;
          receptionTotal += inc;
          newReceptionRows.push([
            monthName, year,
            s.DayConfirmed   || 0,
            s.DayCancelled   || 0,
            s.NightConfirmed || 0,
            s.NightCancelled || 0,
            inc,
          ]);
        } catch {
          const inc = receptionIncomeMap[`${month}-${year}`] || 0;
          receptionTotal += inc;
          newReceptionRows.push([monthName, year, 0, 0, 0, 0, inc]);
        }
      }));

      // Sort rows by year then month index
      const sortRows = (rows) =>
        rows.sort((a, b) => a[1] - b[1] || MONTHS_NAMES.indexOf(a[0]) - MONTHS_NAMES.indexOf(b[0]));

      setRestaurantRows(sortRows(newRestaurantRows));
      setRoomsRows(sortRows(newRoomsRows));
      setReceptionRows(sortRows(newReceptionRows));

      setIncomeData({
        restaurant: restaurantTotal,
        rooms:      roomsTotal,
        reception:  receptionTotal,
        total:      restaurantTotal + roomsTotal + receptionTotal,
      });
    } catch (err) {
      setError("Failed to load income data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Download Excel ── */
  const handleDownload = () => {
    if (!incomeData) return;
    setDlLoading(true);
    try {
      const wb = XLSX.utils.book_new();

      const summaryWs   = buildSummarySheet(startDate, endDate, incomeData);
      const restaurantWs = buildRestaurantSheet(restaurantRows);
      const roomsWs      = buildRoomsSheet(roomsRows);
      const receptionWs  = buildReceptionSheet(receptionRows);

      XLSX.utils.book_append_sheet(wb, summaryWs,    "Summary");
      XLSX.utils.book_append_sheet(wb, restaurantWs, "Restaurant");
      XLSX.utils.book_append_sheet(wb, roomsWs,      "Rooms");
      XLSX.utils.book_append_sheet(wb, receptionWs,  "Reception Hall");

      const fileName = `Sirini_Income_${startDate}_to_${endDate}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (e) {
      console.error("Excel export error:", e);
    } finally {
      setDlLoading(false);
    }
  };

  const pieData = incomeData
    ? CHART_DATA_KEYS.map(({ key, label, color }) => ({ name: label, value: incomeData[key], color })).filter((d) => d.value > 0)
    : [];

  const legendData = incomeData
    ? CHART_DATA_KEYS.map(({ key, label, color, Icon }) => ({ key, label, color, Icon, value: incomeData[key] }))
    : [];

  const noData = incomeData && incomeData.total === 0;

  return (
    <div className="bg-white w-full min-h-full rounded-3xl p-5 shadow-xl border border-gray-100 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-2xl shadow-md shrink-0">
          <BarChart2 size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide leading-tight">Overall Income Chart</h2>
          <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Combined income — Restaurant · Rooms · Reception Hall</p>
        </div>
      </div>

      {/* Date Picker + Buttons */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarRange size={14} className="text-amber-500" />
          <span className="text-xs font-black text-slate-600 uppercase tracking-wider">Select Time Period</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Start Date</label>
            <input type="date" value={startDate} max={endDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">End Date</label>
            <input type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer" />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-xs font-bold mb-3">
            <AlertCircle size={13} /> {error}
          </div>
        )}

        {/* Generate button */}
        <button onClick={handleFetch} disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all duration-200 active:scale-95 shadow-md mb-2">
          {loading
            ? <><Loader2 size={14} className="animate-spin" /> Fetching Income Data...</>
            : <><TrendingUp size={14} /> Generate Overall Income Chart</>}
        </button>

        {/* Download button — shown only when data is ready */}
        {incomeData && !noData && (
          <button onClick={handleDownload} disabled={dlLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all duration-200 active:scale-95 shadow-md">
            {dlLoading
              ? <><Loader2 size={14} className="animate-spin" /> Preparing Excel...</>
              : <><FileSpreadsheet size={14} /> <Download size={13} /> Download Excel Report</>}
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12">
          <Loader2 size={40} className="animate-spin text-amber-500" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider animate-pulse">Calculating income across all departments...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && noData && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100"><BarChart2 size={36} className="text-gray-200" /></div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No Income Data Found</p>
          <p className="text-[11px] text-gray-300 font-medium">No revenue recorded for the selected period</p>
        </div>
      )}

      {/* Chart + Legend */}
      {!loading && incomeData && !noData && (
        <div className="flex flex-col gap-4">

          {/* Total banner */}
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl px-5 py-4 shadow-lg">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Income</p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                {" → "}
                {new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <p className="text-xl font-black text-amber-400">LKR {incomeData.total.toLocaleString()}</p>
          </div>

          {/* Pie chart */}
          <div className="w-full h-72 min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius="35%" outerRadius="65%"
                  paddingAngle={4} dataKey="value" animationBegin={0} animationDuration={900}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`} labelLine>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <CustomLegend data={legendData} total={incomeData.total} />

          {/* Excel info note */}
          <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
            <FileSpreadsheet size={15} className="text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-emerald-700 font-semibold leading-relaxed">
              The Excel report includes <strong>4 sheets</strong>: Summary, Restaurant (monthly orders &amp; revenue), Rooms (monthly bookings &amp; revenue), Reception Hall (monthly bookings &amp; income) — all filtered for the selected period.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverallChart;
