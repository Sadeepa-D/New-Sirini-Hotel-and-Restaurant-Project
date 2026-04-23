import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { User, CheckCircle2, XCircle, ListFilter, History } from "lucide-react";

function RoomConfirmedBooking({ refreshKey, onActionCompleted }) {
  const [confirmedList, setConfirmedList] = useState([]);
  const [cancelledList, setCancelledList] = useState([]);
  const [activeTab, setActiveTab] = useState("approved"); // 'approved' හෝ 'cancelled'
  const [loading, setLoading] = useState(true);

  const fetchAllBookings = useCallback(async () => {
    try {
      const responses = await Promise.allSettled([
        axios.get("http://localhost:5000/api/rooms/viewconfirmedbookings"),
        axios.get("http://localhost:5000/api/rooms/viewcancelledbookings"),
      ]);

      const confirmed = responses[0].status === "fulfilled" ? responses[0].value.data : [];
      const cancelled = responses[1].status === "fulfilled" ? responses[1].value.data : [];

      // කාලය අනුව Sort කිරීම
      setConfirmedList(confirmed.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
      setCancelledList(cancelled.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings, refreshKey]);

  const handleRejectBack = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    const actionToast = toast.loading("Updating status...");
    try {
      await axios.put(`http://localhost:5000/api/rooms/cancelbooking/${id}`);
      toast.success("Booking moved to Cancelled history", { id: actionToast });
      fetchAllBookings();
      if (onActionCompleted) onActionCompleted();
    } catch (err) {
      toast.error("Failed to cancel booking", { id: actionToast });
    }
  };

  // පෙන්විය යුතු දත්ත තෝරා ගැනීම
  const displayList = activeTab === "approved" ? confirmedList : cancelledList;

  if (loading) return <div className="text-center py-20 text-gray-400 italic">Loading records...</div>;

  return (
    <div className="mt-8 space-y-4">
      
      {/* ── Tabs Navigation ── */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-fit border border-gray-200">
        <button
          onClick={() => setActiveTab("approved")}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "approved" ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <CheckCircle2 size={14} /> Approved ({confirmedList.length})
        </button>
        <button
          onClick={() => setActiveTab("cancelled")}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "cancelled" ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <History size={14} /> Cancelled ({cancelledList.length})
        </button>
      </div>

      {/* ── Table Container ── */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-in fade-in duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {displayList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-400 font-medium italic">
                    No {activeTab} records found.
                  </td>
                </tr>
              ) : (
                displayList.map((req) => (
                  <tr key={req._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${activeTab === 'cancelled' ? 'bg-red-50 text-red-400' : 'bg-green-50 text-green-500'}`}>
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{req.name}</p>
                          <p className="text-gray-500 text-[11px] font-mono">{req.phone}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-mono font-bold text-gray-700 italic">#{req.roomNumber}</td>

                    <td className="px-5 py-4">
                      <div className="flex flex-col text-[11px] font-medium text-gray-600">
                        <span>In: {new Date(req.checkInDate).toLocaleDateString()}</span>
                        <span>Out: {new Date(req.checkOutDate).toLocaleDateString()}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        activeTab === 'cancelled' 
                        ? 'bg-red-50 text-red-600 border-red-100' 
                        : 'bg-green-50 text-green-600 border-green-100'
                      }`}>
                        {activeTab === 'cancelled' ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
                        {req.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      {activeTab === "approved" ? (
                        <button
                          onClick={() => handleRejectBack(req._id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Move to Cancelled"
                        >
                          <XCircle size={16} strokeWidth={2.5} />
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-bold uppercase italic tracking-tighter italic">
                          Archived
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RoomConfirmedBooking;