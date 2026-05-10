import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, Search, User, Clock, Check, X } from "lucide-react";
import ConfirmDialog from "../../ConfrimDialog";

const OrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null,
    type: "delete",
    title: "",
    message: "",
  });

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
      const endpointMap = {
        "Accepted": "accepted",
        "Preparing": "preparing",
        "Complete": "complete"
      };
      const endpoint = endpointMap[status];
      await axios.put(`${VITE_URL}/api/restraunt/updateorderstatus/${endpoint}/${id}`);
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
      message: "Are you sure you want to delete this order? This action cannot be undone.",
    });
  };

  const handleConfirmDelete = async () => {
    const { id } = confirmDialog;
    setConfirmDialog({ isOpen: false, id: null });
    const loadingtoast = toast.loading("Deleting order...");
    try {
      await axios.delete(`${VITE_URL}/api/restraunt/deleteorder/${id}`);
      toast.dismiss(loadingtoast);
      toast.success(`Order Deleted Successfully`);
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

  const getFilteredHistory = () => {
    let list =
      activeTab === "Accepted"
        ? acceptedOrders
        : activeTab === "Preparing"
          ? preparingOrders
          : activeTab === "Complete"
            ? completeOrders
            : pendingOrders;

    if (searchTerm) {
      list = list.filter(
        (o) =>
          o.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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



  const HistoryCard = ({ order }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
            <User size={20} className="text-amber-500" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm leading-tight">{order.fullName}</h4>
            <p className="text-[10px] text-gray-500 leading-tight">{order.email}</p>
            <p className="text-[10px] text-gray-400 leading-tight">{order.phoneNumber}</p>
          </div>
        </div>

        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.status === "Complete"
            ? "bg-green-50 text-green-600"
            : order.status === "Accepted"
              ? "bg-blue-50 text-blue-600"
              : order.status === "Preparing"
                ? "bg-purple-50 text-purple-600"
                : order.status === "delete"
                  ? "bg-red-50 text-red-600"
                  : "bg-amber-50 text-amber-600"
          }`}>
          {order.status === "delete" ? "DELETED" : order.status.toUpperCase()}
        </span>
      </div>

      <div className="flex-1 mb-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-gray-800 text-sm">{order.foodName}</h4>
          <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
            #{order.orderCode}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div>
            <span className="text-gray-400 block">Pick-up Date</span>
            <span className="font-medium">{new Date(order.pickupDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-400 block">Pick-up Time</span>
            <span className="font-medium">{order.pickupTime}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t flex justify-between text-sm mb-4">
        <span>Qty: {order.quantity}</span>
        <span className="text-amber-600 font-bold">Rs. {order.Price}</span>
      </div>

      <div className="flex gap-2 mt-auto">
        {order.status === "Pending" && (
          <button
            onClick={() => handleStatusChange(order._id, "Accepted")}
            className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold text-[10px] hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
          >
            <Check size={12} /> ACCEPT
          </button>
        )}
        {order.status === "Accepted" && (
          <button
            onClick={() => handleStatusChange(order._id, "Preparing")}
            className="flex-1 py-2 bg-purple-600 text-white rounded-xl font-bold text-[10px] hover:bg-purple-700 transition-colors flex items-center justify-center gap-1"
          >
            <Clock size={12} /> PREPARE
          </button>
        )}
        {order.status === "Preparing" && (
          <button
            onClick={() => handleStatusChange(order._id, "Complete")}
            className="flex-1 py-2 bg-green-600 text-white rounded-xl font-bold text-[10px] hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
          >
            <CheckCircle size={12} /> COMPLETE
          </button>
        )}
        {order.status !== "Complete" && order.status !== "delete" && (
          <button
            onClick={() => confirmDeleteOrder(order._id)}
            className="flex-1 py-2 bg-red-600 text-white rounded-xl font-bold text-[10px] hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
          >
            <X size={12} /> DELETE
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-12 space-y-12 pb-12">



      {/* History Section */}
      <div>
        <h2 className="text-2xl font-black text-gray-800 uppercase">
          ORDER HISTORY
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {["Pending", "Accepted", "Preparing", "Complete"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === tab ? "bg-amber-100 text-amber-600" : "bg-gray-100"
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

export default OrderManage;