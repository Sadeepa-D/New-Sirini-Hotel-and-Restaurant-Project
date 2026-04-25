import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, Search, User, Clock, Check, X } from "lucide-react";

const OrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Completed");
  const [searchTerm, setSearchTerm] = useState("");

  const VITE_URL = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${VITE_URL}/api/restraunt/vieworders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // fallback to empty if 404
      if (error.response && error.response.status === 404) {
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const endpoint = status === "Completed" ? "complete" : "cancelled";
      await axios.put(`${VITE_URL}/api/restraunt/updateorderstatus/${endpoint}/${id}`);
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const pendingOrders = orders.filter((o) => o.status === "In Progress");
  const completedOrders = orders.filter((o) => o.status === "Completed");
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled");

  const getFilteredHistory = () => {
    let list = activeTab === "Completed" ? completedOrders : activeTab === "Cancelled" ? cancelledOrders : pendingOrders;
    if (searchTerm) {
      list = list.filter(
        (o) =>
          o.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.foodName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return list;
  };

  const OrderCard = ({ order, isPending }) => (
    <div className="bg-white p-4 flex flex-col md:flex-row items-center justify-between border-b border-gray-100 hover:bg-gray-50 transition-colors">

      {/* Customer Details */}
      <div className="flex items-center gap-4 w-full md:w-1/4 mb-4 md:mb-0">
        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
          <User size={20} className="text-amber-500" />
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-sm">{order.fullName}</h4>
          <p className="text-xs text-gray-500">{order.phoneNumber}</p>
          <p className="text-xs text-gray-400 mt-0.5">ID: {order.orderCode}</p>
        </div>
      </div>

      {/* Order Details */}
      <div className="w-full md:w-1/4 mb-4 md:mb-0">
        <h4 className="font-bold text-gray-800 text-sm">{order.foodName}</h4>
        <div className="text-xs text-gray-500 mt-1 flex flex-col gap-0.5">
          <span>Date: {new Date(order.pickupDate).toLocaleDateString()}</span>
          <span>Time: {order.pickupTime}</span>
        </div>
      </div>

      {/* Quantity & Price */}
      <div className="w-full md:w-1/6 mb-4 md:mb-0">
        <p className="text-sm font-semibold text-gray-800">Qty: {order.quantity}</p>
        <p className="text-xs text-amber-600 font-bold mt-1">Rs. {order.Price}</p>
      </div>

      {/* Status */}
      <div className="w-full md:w-1/6 mb-4 md:mb-0">
        {order.status === "In Progress" && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-xs font-bold">
            <Clock size={12} /> PENDING
          </span>
        )}
        {order.status === "Completed" && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-600 text-xs font-bold">
            <CheckCircle size={12} /> COMPLETED
          </span>
        )}
        {order.status === "Cancelled" && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
            <XCircle size={12} /> CANCELLED
          </span>
        )}
      </div>

      {/* Actions */}
      {isPending && (
        <div className="w-full md:w-auto flex items-center justify-end gap-2">
          <button
            onClick={() => handleStatusChange(order._id, "Completed")}
            className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-lg transition-colors"
            title="Approve Order"
          >
            <Check size={20} />
          </button>
          <button
            onClick={() => handleStatusChange(order._id, "Cancelled")}
            className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
            title="Reject Order"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );

  const HistoryCard = ({ order }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
            <User size={20} className="text-amber-500" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">{order.fullName}</h4>
            <p className="text-xs text-gray-500">{order.phoneNumber}</p>
          </div>
        </div>
        <div>
          {order.status === "In Progress" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold">
              PENDING
            </span>
          )}
          {order.status === "Completed" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-bold">
              COMPLETED
            </span>
          )}
          {order.status === "Cancelled" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold">
              CANCELLED
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 mb-4">
        <h4 className="font-bold text-gray-800 text-sm mb-2">{order.foodName}</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div>
            <span className="text-gray-400 block mb-0.5">Pick-up Date</span>
            <span className="font-medium">{new Date(order.pickupDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-400 block mb-0.5">Pick-up Time</span>
            <span className="font-medium">{order.pickupTime}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
        <div className="text-xs text-gray-500">
          <span className="font-medium">Qty:</span> {order.quantity}
        </div>
        <div className="text-sm font-bold text-amber-600">
          Rs. {order.Price}
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-2 text-center uppercase">ID: {order.orderCode}</p>
    </div>
  );

  return (
    <div className="mt-12 space-y-12 pb-12">
      {/* Pending Orders Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-wide">
            PENDING FOOD ORDERS
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Review and approve customer food orders
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100">
            <span className="w-1/4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Details</span>
            <span className="w-1/4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order Details</span>
            <span className="w-1/6 text-xs font-bold text-gray-500 uppercase tracking-wider">Qty & Price</span>
            <span className="w-1/6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</span>
            <span className="w-auto text-xs font-bold text-gray-500 uppercase tracking-wider pr-4">Action</span>
          </div>

          <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
            {pendingOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No pending orders.</div>
            ) : (
              pendingOrders.map((order) => (
                <OrderCard key={order._id} order={order} isPending={true} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* History Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-wide">
            IN PROGRESS, COMPLETED AND CANCELLED ORDERS
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor confirmed food orders
          </p>
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center bg-white p-1 rounded-xl border border-gray-200 shadow-sm w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("In Progress")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "In Progress"
                  ? "bg-amber-50 text-amber-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              <Clock size={16} /> In Progress ({pendingOrders.length})
            </button>
            <button
              onClick={() => setActiveTab("Completed")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "Completed"
                  ? "bg-green-50 text-green-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              <CheckCircle size={16} /> Completed ({completedOrders.length})
            </button>
            <button
              onClick={() => setActiveTab("Cancelled")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "Cancelled"
                  ? "bg-red-50 text-red-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              <XCircle size={16} /> Cancelled ({cancelledOrders.length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm shadow-sm"
            />
          </div>
        </div>

        <div>
          {getFilteredHistory().length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
              No orders found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto p-1">
              {getFilteredHistory().map((order) => (
                <HistoryCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManage;
