import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  Search,
  User,
  Clock,
  Check,
  X,
  ArrowUpDown,
  ClipboardList,
} from "lucide-react";
import ConfirmDialog from "../../ConfrimDialog";

const OrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null,
    type: "delete",
    title: "",
    message: "",
  });

  const VITE_URL = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${VITE_URL}/api/restraunt/vieworders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
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
      const token = localStorage.getItem("token");
      const endpointMap = {
        Accepted: "accepted",
        Preparing: "preparing",
        Complete: "complete",
      };
      const endpoint = endpointMap[status];
      await axios.put(
        `${VITE_URL}/api/restraunt/updateorderstatus/${endpoint}/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const confirmDeleteOrder = (id) => {
    setConfirmDialog({
      isOpen: true,
      id,
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
      await axios.delete("${VITE_URL}/api/restraunt/deleteorder/${id}", {
        headers: {
          Authorization: "Bearer ${token}",
        },
      });
      toast.dismiss(loadingtoast);
      toast.success("Order Deleted Successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.dismiss(loadingtoast);
      toast.error("Failed to delete order");
    }
  };

  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const acceptedOrders = orders.filter((o) => o.status === "Accepted");
  const preparingOrders = orders.filter((o) => o.status === "Preparing");
  const completeOrders = orders.filter((o) => o.status === "Complete");
  const deletedOrders = orders.filter((o) => o.status === "delete");
  const overdueOrders = orders.filter((o) => o.status === "Overdue");

  const getFilteredHistory = () => {
    let list =
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

    if (searchTerm) {
      list = list.filter(
        (o) =>
          o.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.foodName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Sort by Date and Time
    list.sort((a, b) => {
      const dateA = new Date(a.pickupDate);
      const dateB = new Date(b.pickupDate);

      if (dateA - dateB !== 0) {
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }

      const timeA = a.pickupTime || "";
      const timeB = b.pickupTime || "";
      return sortOrder === "asc"
        ? timeA.localeCompare(timeB)
        : timeB.localeCompare(timeA);
    });

    return list;
  };

  const currentOrders = getFilteredHistory();

  const HistoryCard = ({ order }) => (
    <div
      className={`p-4 sm:p-5 rounded-[1.75rem] shadow-sm border transition-all duration-300 flex flex-col h-full group ${
        order.status === "delete"
          ? "bg-red-50/30 border-red-100 hover:border-red-200"
          : order.status === "Overdue"
            ? "bg-orange-50/30 border-orange-100 hover:border-orange-200"
            : "bg-white border-gray-100 hover:shadow-xl hover:border-amber-200/50"
      }`}
    >
      
      {/* Customer Header */}
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shrink-0">
            <User size={18} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h5 className="font-bold text-gray-900 text-[13px] leading-tight line-clamp-1 break-words">
              {order.fullName}
            </h5>
            <span className="text-[12px] text-gray-600 font-medium truncate">
              {order.phoneNumber}
            </span>
          </div>
        </div>

        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block shrink-0 max-w-[85px] sm:max-w-none truncate text-center ${
            order.status === "Complete"
              ? "bg-green-50 text-green-600"
              : order.status === "Accepted"
                ? "bg-[#013155] text-white"
                : order.status === "Preparing"
                  ? "bg-purple-50 text-purple-600"
                  : order.status === "delete"
                    ? "bg-red-50 text-red-600"
                    : order.status === "Overdue"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-amber-50 text-amber-600"
          }`}
        >
          {order.status === "delete" ? "DELETED" : order.status.toUpperCase()}
        </span>
      </div>

      {/* Order Item Section */}
      <div className="flex-1 space-y-4">
        <div className="flex flex-col gap-1 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
          <h4 className="font-black text-gray-800 text-[13px] leading-tight line-clamp-1">
            {order.foodName}
          </h4>
          <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md w-fit">
            #{order.orderCode}
          </span>
        </div>

        <div className="space-y-2.5 px-1">
          <div className="flex justify-between items-center pb-2 border-b border-gray-50">
            <span className="text-[13px] text-gray-500 font-medium">
              Pickup Date
            </span>
            <span className="text-[13px] font-semibold text-gray-800">
              {new Date(order.pickupDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-50">
            <span className="text-[13px] text-gray-500 font-medium">
              Pickup Time
            </span>
            <span className="text-[13px] font-semibold text-gray-800">
              {order.pickupTime}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-50">
            <span className="text-[13px] text-gray-500 font-medium">
              Quantity
            </span>
            <span className="text-[13px] font-bold text-gray-900">
              {order.quantity}{" "}
              <span className="text-gray-400 font-medium text-[11px]">
                items
              </span>
            </span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-[13px] text-gray-500 font-medium">
              Total Price
            </span>
            <span className="text-[15px] font-bold text-amber-600 font-sans">
              Rs. {order.Price?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 sm:gap-3 mt-6">
        {order.status === "Pending" && (
          <button
            onClick={() => handleStatusChange(order._id, "Accepted")}
            className="flex-1 py-2 sm:py-2.5 bg-gradient-to-r from-blue-900 to-blue-500 text-white rounded-full font-bold text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 uppercase"
          >
            <Check size={14} strokeWidth={2.5} className="shrink-0" /> Accept
          </button>
        )}
        {order.status === "Accepted" && (
          <button
            onClick={() => handleStatusChange(order._id, "Preparing")}
            className="flex-1 py-2 sm:py-2.5 bg-gradient-to-r from-purple-900 to-purple-500 text-white rounded-full font-bold text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 uppercase"
          >
            <Clock size={14} strokeWidth={2.5} className="shrink-0" /> Prepare
          </button>
        )}
        {order.status === "Preparing" && (
          <button
            onClick={() => handleStatusChange(order._id, "Complete")}
            className="flex-1 py-2 sm:py-2.5 bg-gradient-to-r from-green-900 to-green-500 text-white rounded-full font-bold text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 uppercase"
          >
            <CheckCircle size={14} strokeWidth={2.5} className="shrink-0" /> Complete
          </button>
        )}
        {order.status !== "Complete" &&
          order.status !== "delete" &&
          order.status !== "Overdue" && (
            <button
              onClick={() => confirmDeleteOrder(order._id)}
              className="flex-1 py-2 sm:py-2.5 bg-white text-red-700 border border-red-100 rounded-full font-bold text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest hover:bg-red-50 hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 uppercase"
              title="Delete Order"
            >
              <X size={14} strokeWidth={2.5} className="shrink-0" /> Delete
            </button>
          )}
      </div>
    </div>
  );

  return (
    <div className="mt-12 space-y-12 pb-12 w-full max-w-full overflow-hidden">
      {/* History Section */}
      <div>
        <h2 className="text-2xl font-black text-gray-800 uppercase">
          ORDER HISTORY
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
          {[
            "Pending",
            "Accepted",
            "Preparing",
            "Complete",
            "Deleted",
            "Overdue",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? tab === "Deleted"
                    ? "bg-red-100 text-red-600"
                    : tab === "Overdue"
                      ? "bg-orange-100 text-orange-600 shadow-sm ring-1 ring-orange-200"
                      : "bg-amber-100 text-amber-600"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:border-amber-300 transition-all cursor-pointer group">
            <ArrowUpDown
              size={16}
              className="text-gray-400 group-hover:text-amber-500"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
            >
              <option value="desc">Latest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Cards */}
        {currentOrders.length > 0 ? (
          <div className="flex flex-col w-full max-w-full overflow-hidden">
            <div className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6 lg:grid lg:grid-cols-3 xl:grid-cols-5 mt-6">
              {currentOrders.map((order) => (
                <div
                  key={order._id}
                  className="w-[94%] sm:w-[48%] shrink-0 snap-start lg:w-auto lg:shrink lg:snap-none"
                >
                  <HistoryCard order={order} />
                </div>
              ))}
            </div>
            <p className="mt-2 text-center text-[10px] text-gray-400 font-medium tracking-wider lg:hidden">
              ← Swipe to browse →
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200 mt-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 border border-gray-100">
              <ClipboardList size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 uppercase tracking-tight">
              No orders available
            </h3>
            <p className="text-sm text-gray-400 font-medium mt-1">
              No items found in this section
            </p>
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
    </div>
  );
};

export default OrderManage;
