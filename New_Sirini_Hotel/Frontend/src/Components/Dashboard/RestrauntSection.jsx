import React,{useState,useEffect} from "react";
import axios from "axios";
import toast from "react-hot-toast";

const RestaurantSection = ({ data }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
  
  return (
     <div className="space-y-6 animate-in fade-in duration-300 relative">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Orders you placed in the restaurant</h1>


        {orders.length === 0 ? (
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg text-amber-700">{order.foodName}</span>
                <span className="text-sm px-2 py-1 bg-amber-100 text-amber-800 rounded-full font-medium">
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Quantity:</span> {order.quantity}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Pick-up Date:</span> {new Date(order.pickupDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Pick-up Time:</span> {order.pickupTime}
              </p>
              </div>
            ))}
          </div>
        )}


    </div>
  );
};
export default RestaurantSection;
