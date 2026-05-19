import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Wine,
  TrendingUp,
  AlertTriangle,
  PieChart as PieIcon,
  DollarSign,
  Layers,
  Activity,
  CheckCircle,
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

const LiquorStockValue = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState({ totalValue: 0, items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${VITE_URL}/api/liquor/stats/stockvalue`,
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching stock value:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white w-full h-full rounded-3xl p-4 shadow-xl border border-gray-100 flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-50 pb-3 gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-500 rounded-xl border border-blue-100/40 shrink-0">
            <DollarSign size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
              Stock Value
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Total Inventory Value
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-base font-black text-blue-600">
            LKR {data.totalValue.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[220px] custom-scrollbar">
        {loading ? (
          <p className="text-xs text-gray-400 text-center py-4 font-bold animate-pulse">
            Loading...
          </p>
        ) : data.items.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4 font-bold">
            No items found
          </p>
        ) : (
          data.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2.5 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-700 truncate max-w-[140px] sm:max-w-[180px]">
                  {item.name}
                </span>
                <span className="text-[10px] text-gray-400 font-bold">
                  {item.stock} Bottles
                </span>
              </div>
              <span className="text-xs font-black text-emerald-600">
                LKR {item.value.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const LiquorStockLevels = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${VITE_URL}/api/liquor/stats/stocklevels`,
        );
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching stock levels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white w-full h-full rounded-3xl p-4 shadow-xl border border-gray-100 flex flex-col gap-3">
      <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
        <div className="p-2 bg-rose-50 text-rose-500 rounded-xl border border-rose-100/40 shrink-0">
          <Activity size={18} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
            Stock Levels
          </h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Current vs Minimum
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[220px] custom-scrollbar">
        {loading ? (
          <p className="text-xs text-gray-400 text-center py-4 font-bold animate-pulse">
            Loading...
          </p>
        ) : items.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4 font-bold">
            No items found
          </p>
        ) : (
          items.map((item, index) => {
            const isLow = item.stock <= item.minStock;
            return (
              <div
                key={index}
                className={`flex items-center justify-between p-2.5 rounded-xl border ${isLow ? "border-rose-100 bg-rose-50/30" : "border-gray-50 hover:bg-gray-50"} transition-colors`}
              >
                <div className="flex flex-col">
                  <span
                    className={`text-xs font-bold truncate max-w-[140px] sm:max-w-[180px] ${isLow ? "text-rose-700" : "text-slate-700"}`}
                  >
                    {item.name}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {isLow ? (
                      <AlertTriangle size={10} className="text-rose-500" />
                    ) : (
                      <CheckCircle size={10} className="text-emerald-500" />
                    )}
                    <span className="text-[10px] text-gray-400 font-bold">
                      Min: {item.minStock}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`text-xs font-black ${isLow ? "text-rose-600" : "text-emerald-600"}`}
                  >
                    {item.stock}
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase">
                    Left
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const LiquorCategoryPieChart = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = [
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#8B5CF6",
    "#EF4444",
    "#64748B",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${VITE_URL}/api/liquor/stats/categorystock`,
        );
        const formattedData = response.data.map((item, idx) => ({
          ...item,
          color: COLORS[idx % COLORS.length],
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching category stock:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white w-full h-full rounded-3xl p-4 shadow-xl border border-gray-100 flex flex-col gap-2">
      <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
        <div className="p-2 bg-amber-50 text-amber-500 rounded-xl border border-amber-100/40 shrink-0">
          <PieIcon size={18} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
            Category Distribution
          </h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Stock Volume by Type
          </p>
        </div>
      </div>
      <div className="flex-1 w-full min-h-[220px] flex items-center justify-center relative text-xs mt-2">
        {loading ? (
          <p className="font-bold text-gray-400 uppercase tracking-wider animate-pulse">
            Loading Chart...
          </p>
        ) : data.length === 0 ? (
          <p className="font-bold text-gray-400 uppercase tracking-wider">
            No Data
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Bottles`]} />
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

const LiquorBrandProfitChart = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState({ totalProfit: 0, items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${VITE_URL}/api/liquor/stats/brandprofit`,
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching brand profit:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-2xl text-white">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {payload[0].payload.name} Projected Profit
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
    <div className="bg-white w-full h-full rounded-3xl p-5 shadow-xl border border-gray-100 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-50 pb-4 gap-4 sm:gap-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-2xl border border-emerald-100/40 shrink-0">
            <TrendingUp size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-sm font-black text-neutral-800 uppercase tracking-wide">
              Projected Profit
            </h3>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              Based on current stock inventory
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
            Total Projected
          </span>
          <span className="text-base font-black text-emerald-600">
            LKR {data.totalProfit.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="w-full h-64 min-h-[250px] text-xs font-bold text-gray-400">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="animate-pulse tracking-wider">Loading Chart...</p>
          </div>
        ) : data.items.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="tracking-wider">No Data Available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              data={data.items}
              margin={{ top: 10, right: 5, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="name"
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
                dataKey="profit"
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

const LiquorManagment = () => {
  return (
    <div>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-2">
        <LiquorStockValue />
        <LiquorCategoryPieChart />
        <LiquorStockLevels />
      </div>
      <div className="p-4 pt-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LiquorBrandProfitChart />
      </div>
    </div>
  );
};

export default LiquorManagment;
