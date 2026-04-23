import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { User, CheckCircle2, XCircle, History, Archive, Flag, Search, Trash2 } from "lucide-react";

function RoomConfirmedBooking({ refreshKey, onActionCompleted }) {
  const [confirmedList, setConfirmedList] = useState([]);
  const [cancelledList, setCancelledList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [activeTab, setActiveTab] = useState("approved");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAllBookings = useCallback(async () => {
    try {
      setLoading(true);
      const responses = await Promise.allSettled([
        axios.get("http://localhost:5000/api/rooms/viewconfirmedbookings"),
        axios.get("http://localhost:5000/api/rooms/viewcancelledbookings"),
        axios.get("http://localhost:5000/api/rooms/viewcompletedbookings"),
      ]);

      const confirmed = responses[0].status === "fulfilled" ? responses[0].value.data : [];
      const cancelled = responses[1].status === "fulfilled" ? responses[1].value.data : [];
      const completed = responses[2].status === "fulfilled" ? responses[2].value.data : [];

      setConfirmedList(confirmed.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
      setCancelledList(cancelled.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
      setCompletedList(completed.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings, refreshKey]);

  //දත්තයක් ස්ථිරවම මැකීමේ Function එක
  const handleDeleteRecord = async (id) => {
    if (!window.confirm("Are you sure you want to PERMANENTLY delete this record? This action cannot be undone.")) return;

    const actionToast = toast.loading("Deleting record...");
    try {
      await axios.delete(`http://localhost:5000/api/rooms/deletebooking/${id}`);
      toast.success("Record permanently deleted", { id: actionToast });
      fetchAllBookings(); // වගුව refresh කරන්න
      if (onActionCompleted) onActionCompleted();
    } catch (err) {
      toast.error("Failed to delete record", { id: actionToast });
    }
  };

  const handleComplete = async (id) => {
    const actionToast = toast.loading("Processing...");
    try {
      await axios.put(`http://localhost:5000/api/rooms/completebooking/${id}`);
      toast.success("Stay marked as Completed", { id: actionToast });
      fetchAllBookings();
      if (onActionCompleted) onActionCompleted();
    } catch (err) {
      toast.error("Failed to update status", { id: actionToast });
    }
  };

  const handleRejectBack = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    const actionToast = toast.loading("Updating status...");
    try {
      await axios.put(`http://localhost:5000/api/rooms/cancelbooking/${id}`);
      toast.success("Booking moved to Cancelled", { id: actionToast });
      fetchAllBookings();
      if (onActionCompleted) onActionCompleted();
    } catch (err) {
      toast.error("Failed to cancel booking", { id: actionToast });
    }
  };

  const getBaseList = () => {
    if (activeTab === "approved") return confirmedList;
    if (activeTab === "completed") return completedList;
    return cancelledList;
  };

  const filteredList = getBaseList().filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.roomNumber.toString().includes(searchTerm)
  );

  if (loading) return <div className="text-center py-20 text-gray-400 italic">Loading records...</div>;

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 w-fit">
          <button onClick={() => setActiveTab("approved")} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === "approved" ? "bg-white text-green-600 shadow-sm" : "text-gray-500"}`}>
            <CheckCircle2 size={14} /> Approved ({confirmedList.length})
          </button>
          <button onClick={() => setActiveTab("completed")} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === "completed" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}>
            <Archive size={14} /> Completed ({completedList.length})
          </button>
          <button onClick={() => setActiveTab("cancelled")} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === "cancelled" ? "bg-white text-red-600 shadow-sm" : "text-gray-500"}`}>
            <History size={14} /> Cancelled ({cancelledList.length})
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-in fade-in duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase">Room</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase">Dates</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase text-center">Status</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredList.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16 text-gray-400 font-medium italic">No records found.</td></tr>
              ) : (
                filteredList.map((req) => (
                  <tr key={req._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${activeTab === 'cancelled' ? 'bg-red-50 text-red-400' : activeTab === 'completed' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'}`}><User size={18} /></div>
                        <div><p className="font-bold text-gray-900">{req.name}</p><p className="text-gray-500 text-[11px] font-mono">{req.phone}</p></div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-gray-700 italic">#{req.roomNumber}</td>
                    <td className="px-5 py-4 text-[11px] font-medium text-gray-600">
                      <div>In: {new Date(req.checkInDate).toLocaleDateString()}</div>
                      <div>Out: {new Date(req.checkOutDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${activeTab === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' : activeTab === 'completed' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                        {activeTab === 'cancelled' ? <XCircle size={12} /> : <CheckCircle2 size={12} />} {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* සෑම Tab එකකදීම පෙනෙන Delete බොත්තම */}
                        <button 
                          onClick={() => handleDeleteRecord(req._id)} 
                          className="p-2 bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                          title="Permanently Delete"
                        >
                          <Trash2 size={16} />
                        </button>

                        {/* Approved Tab එකේ පමණක් පෙනෙන අමතර Actions */}
                        {activeTab === "approved" && (
                          <>
                            <button onClick={() => handleComplete(req._id)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all" title="Mark as Completed"><Flag size={16} /></button>
                            <button onClick={() => handleRejectBack(req._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all" title="Cancel Booking"><XCircle size={16} /></button>
                          </>
                        )}
                      </div>
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