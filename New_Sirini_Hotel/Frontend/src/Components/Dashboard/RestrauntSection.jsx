import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../ConfrimDialog";
import {
  UtensilsCrossed,
  Hash,
  ShoppingBag,
  CalendarDays,
  Clock,
  BadgeDollarSign,
  Pencil,
  Trash2,
} from "lucide-react";

const RestaurantSection = ({ data }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const navigate = useNavigate();
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null,
    type: "delete",
    title: "",
    message: "",
  });

  const VITE_URL = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to view orders.");
        return;
      }
      const response = await axios.get(
        `${VITE_URL}/api/restraunt/orders/userspecific`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = (order) => {
    // Simplified deletion logic: allow for all active orders

    setConfirmDialog({
      isOpen: true,
      id: order._id,
      type: "delete",
      title: "Delete Order?",
      message: "Are you sure you want to delete this order? This action cannot be undone.",
    });
  };

  const handleConfirmDelete = async () => {
    const { id } = confirmDialog;
    setConfirmDialog({ isOpen: false, id: null });
    const loadingtoast = toast.loading("Deleting order...");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${VITE_URL}/api/restraunt/deleteorder/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        toast.dismiss(loadingtoast);
        toast.success("Order deleted successfully");
        fetchOrders();
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.dismiss(loadingtoast);
      toast.error("Failed to delete order");
    }
  };

  const handleEdit = (order) => {
    navigate("/restaurant", { state: { editOrder: order } });
  };

  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const acceptedOrders = orders.filter((o) => o.status === "Accepted");
  const preparingOrders = orders.filter((o) => o.status === "Preparing");
  const completeOrders = orders.filter((o) => o.status === "Complete");
  const deletedOrders = orders.filter((o) => o.status === "delete");

  const filteredOrders = activeTab === "Accepted"
    ? acceptedOrders
    : activeTab === "Preparing"
      ? preparingOrders
      : activeTab === "Complete"
        ? completeOrders
        : activeTab === "Deleted"
          ? deletedOrders
          : pendingOrders;

  const tabs = ["Pending", "Accepted", "Preparing", "Complete", "Deleted"];

  const tabCounts = {
    "Pending": orders.filter(o => o.status === "Pending").length,
    "Accepted": orders.filter(o => o.status === "Accepted").length,
    "Preparing": orders.filter(o => o.status === "Preparing").length,
    "Complete": orders.filter(o => o.status === "Complete").length,
    "Deleted": orders.filter(o => o.status === "delete").length,
  };

  const statusStyle = (status) => {
    if (status === "Complete") return "bg-green-50 text-green-600 border-green-200";
    if (status === "Accepted") return "bg-blue-50 text-blue-600 border-blue-200";
    if (status === "Preparing") return "bg-purple-50 text-purple-600 border-purple-200";
    if (status === "delete") return "bg-red-50 text-red-500 border-red-200";
    return "bg-amber-50 text-amber-600 border-amber-200";
  };

  return (
    <div className="space-y-6 font-sans relative">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Restaurant Orders</h2>
          <p className="text-gray-400 text-xs mt-0.5">Manage and track your food orders</p>
        </div>

        {/* Tab bar */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 gap-0.5 shadow-inner overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] uppercase tracking-wider transition-all whitespace-nowrap font-semibold ${activeTab === tab
                  ? "bg-white text-amber-600 shadow-sm ring-1 ring-black/5"
                  : "text-gray-400 hover:text-gray-600 font-normal"
                }`}
            >
              {tab}
              <span className={`text-[9px] font-mono ${activeTab === tab ? "text-amber-400" : "opacity-50"}`}>
                ({tabCounts[tab]})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm animate-pulse">Loading orders…</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-gray-100">
            <UtensilsCrossed size={40} className="text-gray-200" />
          </div>
          <h3 className="text-xl font-bold text-gray-700">No orders available</h3>
          <p className="text-gray-400 text-sm font-medium mt-1">No items found in the {activeTab.toLowerCase()} section</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className={`p-5 rounded-[1.75rem] shadow-sm border transition-all duration-300 flex flex-col h-full group ${order.status === "delete"
                ? "bg-red-50/30 border-red-100 hover:border-red-200"
                : "bg-white border-gray-100 hover:shadow-xl hover:border-amber-200/50"
                }`}
            >
              {/* Card Header */}
              <div className="flex items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <h5 className="font-bold text-gray-900 text-[12px] leading-snug">{order.foodName}</h5>
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md w-fit mt-1">
                      #{order.orderCode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="flex-1 space-y-2.5 px-1">
                <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <span className="text-[13px] text-gray-500 font-medium">Pickup Date</span>
                  <span className="text-[13px] font-semibold text-gray-800">
                    {new Date(order.pickupDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <span className="text-[13px] text-gray-500 font-medium">Pickup Time</span>
                  <span className="text-[13px] font-semibold text-gray-800">{order.pickupTime}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <span className="text-[13px] text-gray-500 font-medium">Quantity</span>
                  <span className="text-[13px] font-bold text-gray-900">{order.quantity} <span className="text-gray-400 font-medium text-[11px]">items</span></span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[13px] text-gray-500 font-medium">Total Price</span>
                  <span className="text-[15px] font-bold text-amber-600 font-sans">Rs. {order.Price?.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              {order.status === "Pending" && (
                <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => handleEdit(order)}
                      className="flex-1 py-1.5 bg-gradient-to-r from-blue-900 to-blue-500 text-white rounded-full font-bold text-[10px] tracking-widest hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 uppercase"
                    >
                      <Pencil size={14} strokeWidth={2.5} /> Edit
                    </button>
                  <button
                    onClick={() => handleDelete(order)}
                    className="flex-1 py-1.5 bg-white text-red-700 border border-red-100 rounded-full font-bold text-[10px] tracking-widest hover:bg-red-50 hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 uppercase"
                  >
                    <Trash2 size={14} strokeWidth={2.5} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        type={confirmDialog.type}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default RestaurantSection;
