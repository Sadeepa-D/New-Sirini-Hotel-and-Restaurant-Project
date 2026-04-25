import React, { useState, useEffect } from "react";
import {
  BadgeDollarSign,
  BottleWine,
  Utensils,
  ShoppingBag,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import axios from "axios";

const LiqourandRestruant = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [liquorItems, setLiquorItems] = useState([]);
  const [restraurantItems, setRestaurantItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchliquoritems = async () => {
    try {
      const response = await axios.get(`${VITE_URL}/api/liquor/get`);
      setLiquorItems(response.data);
    } catch (error) {
      console.error("Error fetching liquor items:", error);
    }
  };

  const fetchRestaurantItems = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/restraunt/viewfooditems`,
      );
      setRestaurantItems(response.data);
    } catch (error) {
      console.error("Error fetching restaurant items:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${VITE_URL}/api/restraunt/vieworders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchliquoritems();
    fetchRestaurantItems();
    fetchOrders();
  }, []);

  const activeliquoritems = liquorItems.filter(
    (item) => item.isAvailable === true,
  ).length;
  const activeRestaurantItems = restraurantItems.filter(
    (item) => item.availability === true,
  ).length;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyrevenue = orders.reduce((total, order) => {
    const orderDate = new Date(order.createdAt);
    const iscompleted = order.status === "Completed";
    const isthismonth =
      orderDate.getMonth() === currentMonth &&
      orderDate.getFullYear() === currentYear;
    if (iscompleted && isthismonth && order.Price) {
      return total + order.Price;
    }
    return total;
  }, 0);

  const currentmonthorders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return (
      orderDate.getMonth() === currentMonth &&
      orderDate.getFullYear() === currentYear
    );
  });

  const orderStats = {
    completed: currentmonthorders.filter(
      (order) => order.status === "Completed",
    ).length,
    pending: currentmonthorders.filter(
      (order) => order.status === "In Progress",
    ).length,
    cancelled: currentmonthorders.filter(
      (order) => order.status === "Cancelled",
    ).length,
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-transparent min-h-screen">
      {/* ── Top Header Analysis Section ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue Card - Premium Dark Theme */}
        <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-7 shadow-2xl group hover:-translate-y-1 transition-all duration-300">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-amber-400/10 rounded-2xl border border-amber-400/20">
                <BadgeDollarSign size={28} className="text-amber-400" />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full text-[10px] font-bold">
                <TrendingUp size={12} />
                MONTHLY
              </div>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">
              Estimated Revenue
            </p>
            <h2 className="text-3xl font-black text-white italic tracking-tighter">
              Rs. {monthlyrevenue.toLocaleString()}
            </h2>
          </div>
          {/* Background Decorative Element */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-400 opacity-[0.03] rounded-full blur-3xl group-hover:opacity-[0.08] transition-opacity" />
        </div>

        {/* Liquor Inventory Card */}
        <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-center mb-8">
            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <BottleWine size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Bar Inventory
            </span>
          </div>
          <div>
            <h3 className="text-slate-900 font-serif italic text-xl mb-1">
              Active Spirits
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-800">
                {activeliquoritems}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase">
                Labels
              </span>
            </div>
          </div>
        </div>

        {/* Restaurant Inventory Card */}
        <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-center mb-8">
            <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300">
              <Utensils size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Kitchen Menu
            </span>
          </div>
          <div>
            <h3 className="text-slate-900 font-serif italic text-xl mb-1">
              Available Food
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-800">
                {activeRestaurantItems}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase">
                Items
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Order Lifecycle Section ── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-amber-500 rounded-full" />
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter italic">
              {currentMonth + 1}/{currentYear} Order Analysis
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Completed - Success Card */}
          <div className="group bg-gradient-to-br from-emerald-50 to-white rounded-[2rem] p-6 border border-emerald-100/50 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500">
                <CheckCircle size={24} />
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                Fulfilled
              </span>
            </div>
            <p className="text-4xl font-black text-slate-800 mb-1">
              {orderStats.completed}
            </p>
            <p className="text-xs font-medium text-slate-500">
              Completed without issues
            </p>
          </div>

          {/* Pending - Progress Card */}
          <div className="group bg-gradient-to-br from-amber-50 to-white rounded-[2rem] p-6 border border-amber-100/50 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-amber-500">
                <Clock size={24} className="animate-spin-slow" />
              </div>
              <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                In Kitchen
              </span>
            </div>
            <p className="text-4xl font-black text-slate-800 mb-1">
              {orderStats.pending}
            </p>
            <p className="text-xs font-medium text-slate-500">
              Awaiting service completion
            </p>
          </div>

          {/* Cancelled - Alert Card */}
          <div className="group bg-gradient-to-br from-rose-50 to-white rounded-[2rem] p-6 border border-rose-100/50 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-rose-500">
                <XCircle size={24} />
              </div>
              <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                Cancelled
              </span>
            </div>
            <p className="text-4xl font-black text-slate-800 mb-1">
              {orderStats.cancelled}
            </p>
            <p className="text-xs font-medium text-slate-500">
              Rejected or voided transactions
            </p>
          </div>
        </div>
      </section>

      {/* Progress Footer Insight */}
      <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 border border-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <ShoppingBag size={14} />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Month-to-Date:
            <span className="text-slate-800">
              {currentmonthorders.length} Total Orders
            </span>
          </p>
        </div>
        <div className="h-1.5 flex-1 max-w-md bg-slate-100 rounded-full overflow-hidden hidden md:block">
          <div
            className="h-full bg-amber-500 transition-all duration-1000"
            style={{
              width: `${(orderStats.completed / (currentmonthorders.length || 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default LiqourandRestruant;
