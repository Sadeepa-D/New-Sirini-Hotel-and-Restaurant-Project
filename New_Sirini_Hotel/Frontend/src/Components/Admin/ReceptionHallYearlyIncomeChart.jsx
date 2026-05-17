import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Wallet } from "lucide-react";
import axios from "axios";

const ReceptionHallYearlyIncomeChart = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const currentYear = new Date().getFullYear();
  const [chartData, setChartData] = useState([]);
  const [totalYearlyIncome, setTotalYearlyIncome] = useState(0);

  const fetchChartData = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/income/yearly`,
      );
      setChartData(response.data);

      const total = response.data.reduce((sum, item) => sum + item.income, 0);
      setTotalYearlyIncome(total);
    } catch (error) {
      console.error("Error loading income chart data:", error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  // Custom tooltips popup modifier logic mapping clean Sri Lankan currency units
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-2xl text-white">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {payload[0].payload.month} Revenue
          </p>
          <p className="text-sm font-black text-amber-400 mt-0.5">
            LKR {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white w-full max-w-xl rounded-4xl p-6 shadow-xl border border-gray-100 flex flex-col gap-6">
      {/* Header Info Layer */}
      <div className="flex items-center justify-between border-b border-gray-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-2xl border border-emerald-100/40">
            <Wallet size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-sm font-black text-neutral-800 uppercase tracking-wide">
              {currentYear} Revenue Overview
            </h3>
            <p className="text-[11px] text-gray-400 font-medium">
              Total reception hall income generated this ongoing year
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-black text-gray-400 uppercase tracking-wider block">
            Total
          </span>
          <span className="text-base font-black text-emerald-600">
            LKR {totalYearlyIncome.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Chart Layout Layer */}
      <div className="w-full h-64 min-h-[260px] text-xs font-bold text-gray-400">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 5, left: -15, bottom: 0 }}
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
              tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 700 }}
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
              dataKey="income"
              fill="#F59E0B" // Rich Amber Base Color
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
              className="hover:fill-amber-500 transition-colors duration-200"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReceptionHallYearlyIncomeChart;
