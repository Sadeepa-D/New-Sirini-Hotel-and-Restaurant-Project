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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import EditOrderForm from "../RestaurantPage/EditOrderForm";

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    setIndex(0);
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setItemsPerView(w < 640 ? 1 : w < 1024 ? 2 : 3);
      setIsMobile(w < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = (order) => {
    setConfirmDialog({
      isOpen: true,
      id: order._id,
      type: "delete",
      title: "Delete Order?",
      message:
        "Are you sure you want to delete this order? This action cannot be undone.",
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
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const acceptedOrders = orders.filter((o) => o.status === "Accepted");
  const preparingOrders = orders.filter((o) => o.status === "Preparing");
  const completeOrders = orders.filter((o) => o.status === "Complete");
  const deletedOrders = orders.filter((o) => o.status === "delete");
  const overdueOrders = orders.filter((o) => o.status === "Overdue");

  const filteredOrders =
    activeTab === "Accepted"
      ? acceptedOrders
      : activeTab === "Preparing"
        ? preparingOrders
        : activeTab === "Complete"
          ? completeOrders
          : activeTab === "Deleted"
            ? deletedOrders
            : activeTab === "Overdue"
              ? overdueOrders
              : pendingOrders;

  const tabs = [
    "Pending",
    "Accepted",
    "Preparing",
    "Complete",
    "Deleted",
    "Overdue",
  ];

  const searchOrders = (searchTerm ? orders : filteredOrders).filter(
    (order) => {
      const term = searchTerm.toLowerCase();
      return (
        order.foodName.toLowerCase().includes(term) ||
        order.orderCode.toLowerCase().includes(term) ||
        new Date(order.pickupDate).toLocaleDateString("en-GB").includes(term) ||
        order.pickupTime.includes(term)
      );
    },
  );

  const tabCounts = {
    Pending: orders.filter((o) => o.status === "Pending").length,
    Accepted: orders.filter((o) => o.status === "Accepted").length,
    Preparing: orders.filter((o) => o.status === "Preparing").length,
    Complete: orders.filter((o) => o.status === "Complete").length,
    Deleted: orders.filter((o) => o.status === "delete").length,
    Overdue: orders.filter((o) => o.status === "Overdue").length,
  };

  const statusStyle = (status) => {
    if (status === "Complete")
      return "bg-green-50 text-green-600 border-green-200";
    if (status === "Accepted")
      return "bg-blue-50 text-blue-600 border-blue-200";
    if (status === "Preparing")
      return "bg-purple-50 text-purple-600 border-purple-200";
    if (status === "delete") return "bg-red-50 text-red-500 border-red-200";
    if (status === "Overdue")
      return "bg-orange-50 text-orange-600 border-orange-200";
    return "bg-amber-50 text-amber-600 border-amber-200";
  };

  const canModifyOrder = (order) => {
    if (!order.pickupDate || !order.pickupTime) return false;

    const datePart = new Date(order.pickupDate).toISOString().split("T")[0];

    const pickupDateTime = new Date(`${datePart}T${order.pickupTime}:00+05:30`);

    const now = new Date();
    const diffMinutes = (pickupDateTime.getTime() - now.getTime()) / 60000;

    return diffMinutes >= 45;
  };

  return (
    <div className="space-y-6 font-sans relative">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Restaurant Orders
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Manage and track your food orders
          </p>
          <div>
            <input
              type="text"
              placeholder="Search by booking ref..."
              className="mt-2 w-full sm:w-64 px-4 py-2 bg-gray-100 placeholder:text-gray-400 text-gray-700 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
              <span
                className={`text-[9px] font-mono ${activeTab === tab ? "text-amber-400" : "opacity-50"}`}
              >
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
      ) : searchOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-gray-100">
            <UtensilsCrossed size={40} className="text-gray-200" />
          </div>
          <h3 className="text-xl font-bold text-gray-700">
            No orders available
          </h3>
          <p className="text-gray-400 text-sm font-medium mt-1">
            No items found in the {activeTab.toLowerCase()} section
          </p>
        </div>
      ) : (
        <div className="relative group/nav">
          {/* Left Arrow */}
          {!isMobile && index > 0 && (
            <button
              onClick={() => setIndex(Math.max(0, index - 1))}
              className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 border border-gray-100 group-hover/nav:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-neutral-900" />
            </button>
          )}

          <div
            className={`overflow-x-auto md:overflow-hidden px-1 py-4 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isMobile ? "pb-6" : ""}`}
          >
            <div
              className={`flex justify-start gap-6 ${isMobile ? "snap-x snap-mandatory" : "transition-transform duration-[1200ms] ease-in-out"}`}
              style={
                isMobile
                  ? {}
                  : {
                      transform: `translateX(calc(-${index * (100 / itemsPerView)}% - ${
                        index * (24 / itemsPerView)
                      }px))`,
                    }
              }
            >
              {searchOrders.map((order) => {
                const s = order.status?.toLowerCase();

                // Status-based color tokens via inline styles
                const t = (() => {
                  if (s === "accepted")
                    return {
                      barFrom: "#3b82f6",
                      barTo: "#6366f1",
                      badgeBg: "#eff6ff",
                      badgeBorder: "#bfdbfe",
                      badgeText: "#1d4ed8",
                      priceColor: "#1d4ed8",
                    };
                  if (s === "preparing")
                    return {
                      barFrom: "#a855f7",
                      barTo: "#7c3aed",
                      badgeBg: "#faf5ff",
                      badgeBorder: "#e9d5ff",
                      badgeText: "#7c3aed",
                      priceColor: "#7c3aed",
                    };
                  if (s === "complete")
                    return {
                      barFrom: "#10b981",
                      barTo: "#14b8a6",
                      badgeBg: "#f0fdf4",
                      badgeBorder: "#bbf7d0",
                      badgeText: "#059669",
                      priceColor: "#059669",
                    };
                  if (s === "delete")
                    return {
                      barFrom: "#ef4444",
                      barTo: "#f43f5e",
                      badgeBg: "#fef2f2",
                      badgeBorder: "#fecaca",
                      badgeText: "#dc2626",
                      priceColor: "#dc2626",
                    };
                  if (s === "overdue")
                    return {
                      barFrom: "#f97316",
                      barTo: "#ef4444",
                      badgeBg: "#fff7ed",
                      badgeBorder: "#fed7aa",
                      badgeText: "#c2410c",
                      priceColor: "#c2410c",
                    };
                  // pending
                  return {
                    barFrom: "#f59e0b",
                    barTo: "#f97316",
                    badgeBg: "#fffbeb",
                    badgeBorder: "#fde68a",
                    badgeText: "#b45309",
                    priceColor: "#f97316",
                  };
                })();

                return (
                  <div
                    key={order._id}
                    className={`flex-shrink-0 ${isMobile ? "w-[90%] snap-start" : ""}`}
                    style={
                      isMobile
                        ? {}
                        : {
                            width: `calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * 24) / itemsPerView}px)`,
                          }
                    }
                  >
                    {/* ── Card ── */}
                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                      {/* Gradient top bar */}
                      <div
                        style={{
                          height: "6px",
                          background: `linear-gradient(to right, ${t.barFrom}, ${t.barTo})`,
                        }}
                        className="w-full shrink-0"
                      />

                      <div className="p-3.5 flex flex-col gap-3">
                        {/* ── Header: icon + name ── */}
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Colored icon square */}
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                            style={{
                              background: `linear-gradient(135deg, ${t.barFrom}, ${t.barTo})`,
                            }}
                          >
                            <UtensilsCrossed size={18} className="text-white" />
                          </div>
                          <p className="font-black text-gray-900 text-[14px] leading-none truncate pr-2">
                            {order.foodName}
                          </p>
                        </div>

                        {/* Order code & Status badge row */}
                        <div className="flex items-center justify-between mt-0.5">
                          <span
                            className="inline-block text-[10px] font-black font-mono px-2 py-0.5 rounded-md"
                            style={{
                              background: t.badgeBg,
                              border: `1px solid ${t.badgeBorder}`,
                              color: t.badgeText,
                            }}
                          >
                            {order.orderCode}
                          </span>
                          <span
                            className="shrink-0 text-[10px] font-bold px-3 py-1 rounded-full border"
                            style={{
                              background: t.badgeBg,
                              border: `1px solid ${t.badgeBorder}`,
                              color: t.badgeText,
                            }}
                          >
                            {order.status === "delete"
                              ? "Deleted"
                              : order.status}
                          </span>
                        </div>

                        {/* ── Info box: single gray container with rows ── */}
                        <div className="bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                          {/* Pickup date */}
                          <div className="flex items-center justify-between px-3 py-1.5">
                            <div className="flex items-center gap-2.5 text-gray-400">
                              <CalendarDays size={14} />
                              <span className="text-[12px] font-medium text-gray-500">
                                Pickup date
                              </span>
                            </div>
                            <span className="text-[12px] font-bold text-gray-900">
                              {new Date(order.pickupDate).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                          {/* Pickup time */}
                          <div className="flex items-center justify-between px-3 py-1.5">
                            <div className="flex items-center gap-2 text-gray-400">
                              <Clock size={14} />
                              <span className="text-[12px] font-medium text-gray-500">
                                Pickup time
                              </span>
                            </div>
                            <span className="text-[12px] font-bold text-gray-900">
                              {order.pickupTime}
                            </span>
                          </div>
                          {/* Quantity */}
                          <div className="flex items-center justify-between px-3 py-1.5">
                            <div className="flex items-center gap-2 text-gray-400">
                              <ShoppingBag size={14} />
                              <span className="text-[12px] font-medium text-gray-500">
                                Quantity
                              </span>
                            </div>
                            <span className="text-[12px] font-bold text-gray-900">
                              {order.quantity}{" "}
                              <span className="text-gray-400 font-normal text-xs">
                                item
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* ── Total price row ── */}
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[12px] font-semibold text-gray-500">
                            Total price
                          </span>
                          <span
                            className="text-[15px] font-black"
                            style={{ color: t.priceColor }}
                          >
                            Rs. {order.Price?.toLocaleString()}
                          </span>
                        </div>

                        {/* ── Action buttons ── */}
                        {order.status === "Pending" &&
                          (canModifyOrder(order) ? (
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEdit(order)}
                                className="flex-1 py-2 font-bold text-sm text-white flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm"
                                style={{
                                  background: "linear-gradient(to right, #1e40af, #3b82f6)",
                                  borderRadius: "14px",
                                }}
                              >
                                <Pencil size={15} /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(order)}
                                className="flex-1 py-2 font-bold text-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300"
                                style={{
                                  background: "#fef2f2",
                                  border: "1px solid #fecaca",
                                  color: "#dc2626",
                                  borderRadius: "14px",
                                }}
                              >
                                <Trash2 size={15} /> Delete
                              </button>
                            </div>
                          ) : (
                            <div className="py-2.5 text-center text-[10px] font-semibold text-gray-400 bg-gray-50 rounded-xl border border-gray-100 tracking-wider">
                              Locked — pickup within 45 min
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Arrow */}
          {!isMobile && index < searchOrders.length - itemsPerView && (
            <button
              onClick={() =>
                setIndex(
                  Math.min(searchOrders.length - itemsPerView, index + 1),
                )
              }
              className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 border border-gray-100 group-hover/nav:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-neutral-900" />
            </button>
          )}

          {isMobile && (
            <p className="mt-2 text-center text-[10px] text-gray-400 font-medium tracking-wider md:hidden">
              ← Swipe to browse →
            </p>
          )}
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

      {isEditModalOpen && selectedOrder && (
        <EditOrderForm
          item={{
            name: selectedOrder.foodName,
            price: selectedOrder.Price / selectedOrder.quantity,
          }}
          editingOrder={selectedOrder}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedOrder(null);
            fetchOrders();
          }}
        />
      )}
    </div>
  );
};

export default RestaurantSection;
