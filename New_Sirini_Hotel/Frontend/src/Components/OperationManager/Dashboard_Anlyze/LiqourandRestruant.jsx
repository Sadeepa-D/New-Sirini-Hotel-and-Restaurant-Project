import React, { useState, useEffect } from "react";
import {
  BadgeDollarSign,
  BottleWine,
  Utensils,
  ShoppingBag,
  CheckCircle,
  Clock,
  XCircle,
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
    <div className="p-4 md:p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Revenue */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <BadgeDollarSign size={24} className="text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
              Total Revenue
            </p>
            <p className="text-xl font-black text-gray-800 mt-0.5">
              Rs. {monthlyrevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Active Liquor */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
            <BottleWine size={24} className="text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
              Active Liquor
            </p>
            <p className="text-xl font-black text-gray-800 mt-0.5">
              {activeliquoritems}
            </p>
          </div>
        </div>

        {/* Active Restaurant */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <Utensils size={24} className="text-orange-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
              Active Food
            </p>
            <p className="text-xl font-black text-gray-800 mt-0.5">
              {activeRestaurantItems}
            </p>
          </div>
        </div>
      </div>
      {/* ── Order stats section ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-5">
          <ShoppingBag size={18} className="text-gray-500" />
          <h3 className="text-sm font-black text-gray-700 uppercase tracking-widest">
            Order Overview
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Completed */}
          <div className="relative overflow-hidden rounded-xl bg-green-50 border border-green-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2.5 py-1 rounded-full">
                Completed
              </span>
            </div>
            <p className="text-3xl font-black text-green-700">
              {orderStats.completed}
            </p>
            <p className="text-xs text-green-500 mt-1">orders fulfilled</p>
            <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-green-100 opacity-50" />
          </div>

          {/* Pending */}
          <div className="relative overflow-hidden rounded-xl bg-amber-50 border border-amber-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock size={20} className="text-amber-600" />
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full">
                Pending
              </span>
            </div>
            <p className="text-3xl font-black text-amber-700">
              {orderStats.pending}
            </p>
            <p className="text-xs text-amber-500 mt-1">awaiting processing</p>
            <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-amber-100 opacity-50" />
          </div>

          {/* Cancelled */}
          <div className="relative overflow-hidden rounded-xl bg-red-50 border border-red-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle size={20} className="text-red-500" />
              </div>
              <span className="text-xs font-bold text-red-500 bg-red-100 px-2.5 py-1 rounded-full">
                Cancelled
              </span>
            </div>
            <p className="text-3xl font-black text-red-600">
              {orderStats.cancelled}
            </p>
            <p className="text-xs text-red-400 mt-1">orders cancelled</p>
            <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-red-100 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default LiqourandRestruant;
