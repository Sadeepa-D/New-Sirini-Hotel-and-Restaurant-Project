import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, Search, User, Clock, Check, X } from "lucide-react";

const OrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Completed");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 4;

  const VITE_URL = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${VITE_URL}/api/restraunt/vieworders`);
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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

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
    let list =
      activeTab === "Completed"
        ? completedOrders
        : activeTab === "Cancelled"
        ? cancelledOrders
        : pendingOrders;

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

  // Pagination logic
  const filteredOrders = getFilteredHistory();
  const indexOfLast = currentPage * cardsPerPage;
  const indexOfFirst = indexOfLast - cardsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / cardsPerPage);

  const OrderCard = ({ order, isPending }) => (
    <div className="bg-white p-4 flex flex-col md:flex-row items-center justify-between border-b border-gray-100 hover:bg-gray-50 transition-colors">
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

      <div className="w-full md:w-1/4 mb-4 md:mb-0">
        <h4 className="font-bold text-gray-800 text-sm">{order.foodName}</h4>
        <div className="text-xs text-gray-500 mt-1 flex flex-col gap-0.5">
          <span>Date: {new Date(order.pickupDate).toLocaleDateString()}</span>
          <span>Time: {order.pickupTime}</span>
        </div>
      </div>

      <div className="w-full md:w-1/6 mb-4 md:mb-0">
        <p className="text-sm font-semibold text-gray-800">Qty: {order.quantity}</p>
        <p className="text-xs text-amber-600 font-bold mt-1">Rs. {order.Price}</p>
      </div>

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

      {isPending && (
        <div className="w-full md:w-auto flex items-center justify-end gap-2">
          <button
            onClick={() => handleStatusChange(order._id, "Completed")}
            className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-lg transition-colors"
          >
            <Check size={20} />
          </button>
          <button
            onClick={() => handleStatusChange(order._id, "Cancelled")}
            className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
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
          <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
            <User size={20} className="text-amber-500" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">{order.fullName}</h4>
            <p className="text-xs text-gray-500">{order.phoneNumber}</p>
          </div>
        </div>

        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          order.status === "Completed"
            ? "bg-green-50 text-green-600"
            : order.status === "Cancelled"
            ? "bg-red-50 text-red-600"
            : "bg-amber-50 text-amber-600"
        }`}>
          {order.status.toUpperCase()}
        </span>
      </div>

      <div className="flex-1 mb-4">
        <h4 className="font-bold text-gray-800 text-sm mb-2">{order.foodName}</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div>
            <span className="text-gray-400 block">Pick-up Date</span>
            <span>{new Date(order.pickupDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-400 block">Pick-up Time</span>
            <span>{order.pickupTime}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t flex justify-between text-sm">
        <span>Qty: {order.quantity}</span>
        <span className="text-amber-600 font-bold">Rs. {order.Price}</span>
      </div>
    </div>
  );

  return (
    <div className="mt-12 space-y-12 pb-12">

      {/* Pending Orders */}
      <div>
        <h2 className="text-2xl font-black text-gray-800 uppercase">
          PENDING FOOD ORDERS
        </h2>

        <div className="bg-white rounded-2xl shadow-sm border mt-4">
          {pendingOrders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No pending orders.</div>
          ) : (
            pendingOrders.map((order) => (
              <OrderCard key={order._id} order={order} isPending />
            ))
          )}
        </div>
      </div>

      {/* History Section */}
      <div>
        <h2 className="text-2xl font-black text-gray-800 uppercase">
          ORDER HISTORY
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {["In Progress", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold ${
                activeTab === tab ? "bg-amber-100 text-amber-600" : "bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mt-4 relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {currentOrders.map((order) => (
            <HistoryCard key={order._id} order={order} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-100 rounded-lg"
            >
              Previous
            </button>

            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-100 rounded-lg"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManage;