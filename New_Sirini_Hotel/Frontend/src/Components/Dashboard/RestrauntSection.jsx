import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RestaurantSection = ({ data }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("In Progress");
  const navigate = useNavigate();

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
        }
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

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const response = await axios.delete(`${VITE_URL}/api/restraunt/deleteorder/${orderId}`);
      if (response.status === 200) {
        toast.success("Order deleted successfully");
        fetchOrders(); // Refresh to move to cancelled/deleted view
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const handleEdit = (order) => {
    navigate('/restaurant', { state: { editOrder: order } });
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "In Progress") return order.status === "In Progress";
    if (activeTab === "Completed") return order.status === "Completed";
    if (activeTab === "Cancelled") return order.status === "Cancelled" || order.status === "delete";
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-900 uppercase">Restaurant Order Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
          {["In Progress", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab
                  ? "bg-amber-100 text-amber-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>


      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-100 rounded-3xl p-12 text-center">
          <p className="text-gray-400">No {activeTab.toLowerCase()} orders found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-amber-50 p-2 rounded-xl">
                    <span className="font-bold text-sm text-amber-700">{order.foodName}</span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${order.status === "Completed"
                      ? "bg-green-50 text-green-600"
                      : order.status === "Cancelled" || order.status === "delete"
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-600"
                    }`}>
                    {order.status === "delete" ? "DELETED" : order.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Order ID</span>
                    <span className="font-mono text-gray-600 font-medium">{order.orderCode}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Quantity</span>
                    <span className="text-gray-700 font-bold">{order.quantity} Items</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Date</span>
                      <span className="text-xs text-gray-700 font-medium">{new Date(order.pickupDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Time</span>
                      <span className="text-xs text-gray-700 font-medium">{order.pickupTime}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-xs text-gray-400">Total Amount</span>
                  <span className="text-amber-600 font-black">Rs. {order.Price}</span>
                </div>
              </div>

              {order.status === "In Progress" && (
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => handleEdit(order)}
                    className="flex-1 bg-gray-50 text-gray-700 hover:bg-amber-100 hover:text-amber-700 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center"
                  >
                    DELETE
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}


    </div>
  );
};
export default RestaurantSection;
