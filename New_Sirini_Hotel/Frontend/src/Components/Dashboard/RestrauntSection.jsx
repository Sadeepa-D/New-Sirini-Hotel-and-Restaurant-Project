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
    const userDataStr = localStorage.getItem("user");
    let userRole = "";
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        userRole = userData.role || "";
      } catch (e) { }
    }

    const isStaff = userRole.includes("Operation Manager") || userRole === "Admin";

    if (!isStaff) {
      const now = new Date();
      const slDateStr = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Colombo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(now);

      const slTimeStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Colombo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(now);

      const pickupDateStr = new Date(order.pickupDate).toISOString().split('T')[0];
      const pickupDateTime = new Date(`${pickupDateStr}T${order.pickupTime}`);
      const currentSLDateTime = new Date(`${slDateStr}T${slTimeStr}`);

      const diffInMs = pickupDateTime - currentSLDateTime;
      const diffInHours = diffInMs / (1000 * 60 * 60);

      if (diffInHours < 1) {
        toast.error("Cannot cancel now. Less than 1 hour left. Please contact hotel for cancellation.");
        return;
      }
    }

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
      const response = await axios.delete(
        `${VITE_URL}/api/restraunt/deleteorder/${id}`,
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
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] uppercase tracking-wider transition-all whitespace-nowrap font-semibold ${
                activeTab === tab
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className={`border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col ${
                order.status === "delete" 
                  ? "bg-red-50/30 border-red-100" 
                  : "bg-white border-gray-100"
              }`}
            >
              {/* Top accent bar */}
              <div className={`h-1 w-full ${
                order.status === "delete" 
                  ? "bg-gradient-to-r from-red-400 to-red-300" 
                  : "bg-gradient-to-r from-amber-400 to-amber-300"
              }`} />

              <div className="p-5 flex flex-col flex-1">
                {/* Food name + status */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-50 border border-amber-100 rounded-xl">
                      <UtensilsCrossed size={16} className="text-amber-500" />
                    </div>
                    <span className="font-bold text-sm text-gray-900 leading-tight">{order.foodName}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${statusStyle(order.status)}`}>
                    {order.status === "delete" ? "Deleted" : order.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2.5 mb-4 flex-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Hash size={12} className="text-gray-300" /> Order ID
                    </span>
                    <span className="font-mono text-gray-600 font-semibold">{order.orderCode}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <ShoppingBag size={12} className="text-gray-300" /> Quantity
                    </span>
                    <span className="text-gray-700 font-bold">{order.quantity} Items</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                      <span className="flex items-center gap-1 text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                        <CalendarDays size={10} /> Date
                      </span>
                      <span className="text-xs text-gray-700 font-semibold">
                        {new Date(order.pickupDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                      <span className="flex items-center gap-1 text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                        <Clock size={10} /> Time
                      </span>
                      <span className="text-xs text-gray-700 font-semibold">{order.pickupTime}</span>
                    </div>
                  </div>
                </div>

                {/* Price row */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5 text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    <BadgeDollarSign size={13} className="text-amber-500" /> Total
                  </span>
                  <span className="text-amber-600 font-black text-base">Rs. {order.Price}</span>
                </div>

                {/* Actions */}
                {order.status === "Pending" && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(order)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-700 border border-gray-200 hover:border-amber-200 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(order)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-200 hover:border-red-500 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                )}
              </div>
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
