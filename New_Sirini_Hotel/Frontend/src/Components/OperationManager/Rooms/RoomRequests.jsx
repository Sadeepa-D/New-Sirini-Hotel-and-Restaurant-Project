import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Check, X, User, Calendar, Users, Clock, CheckCircle2, XCircle } from "lucide-react";

function RoomRequests({ onActionCompleted }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchRequests = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/rooms/viewpendingbookings");
    setRequests(res.data);
  } catch (err) {
  
    if (err.response && err.response.status === 404) {
      setRequests([]); 
    } else {
      console.error("Fetch Error:", err);
      // toast.error("Failed to load requests"); 
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, newStatus) => {
    const actionToast = toast.loading("Processing...");
    try {
      // use routes confirmbooking/:id and cancelbooking/:id 
      const endpoint = newStatus === "Confirmed" 
        ? `http://localhost:5000/api/rooms/confirmbooking/${id}` 
        : `http://localhost:5000/api/rooms/cancelbooking/${id}`;

      await axios.put(endpoint);
      toast.success(`Booking ${newStatus}`, { id: actionToast });
      
      fetchRequests();
      if (onActionCompleted) onActionCompleted();
    } catch (err) {
      toast.error("Action failed", { id: actionToast });
    }
  };

const renderStatus = (status) => {
  
  const s = status?.toLowerCase();

  switch (s) {
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-yellow-50 text-yellow-600 border border-yellow-100">
          <Clock size={12} /> Pending
        </span>
      );
    case "confirmed":
    case "booked":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-green-50 text-green-600 border border-green-100">
          <CheckCircle2 size={12} /> Approved
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-50 text-red-600 border border-red-100">
          <XCircle size={12} /> Cancelled
        </span>
      );
    case "overdue":
      //  Overdue 
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-purple-50 text-purple-600 border border-purple-200 animate-pulse">
          <Clock size={12} className="animate-spin-slow" /> Overdue
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-50 text-gray-400 border border-gray-100">
          {status}
        </span>
      );
  }
};

  if (loading) return <div className="text-center py-20 text-gray-400 font-medium italic">Loading requests...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Details</th>
              <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Room No</th>
              <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Check-In / Out</th>
              <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-gray-400 font-medium italic">No pending requests found.</td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{req.name}</p>
                        <p className="text-gray-500 text-[11px]">{req.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-gray-700">#{req.roomNumber}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col text-[11px] font-medium text-gray-600">
                      <span>In: {new Date(req.checkInDate).toLocaleDateString()}</span>
                      <span>Out: {new Date(req.checkOutDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  
                  {/* Status Column*/}
                  <td className="px-5 py-4 text-center">
                    {renderStatus(req.status)}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleAction(req._id, "Confirmed")}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                        title="Approve"
                      >
                        <Check size={16} strokeWidth={3} />
                      </button>
                      <button
                        onClick={() => handleAction(req._id, "Cancelled")}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Reject"
                      >
                        <X size={16} strokeWidth={3} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RoomRequests;