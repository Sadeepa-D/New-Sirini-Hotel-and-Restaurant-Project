import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  User,
  CheckCircle2,
  XCircle,
  History,
  Archive,
  Flag,
  Search,
  Trash2,
  Clock,
  Check,
  X,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function RoomBookedDetails({ refreshKey, onActionCompleted }) {
  const [pendingList, setPendingList] = useState([]);
  const [confirmedList, setConfirmedList] = useState([]);
  const [cancelledList, setCancelledList] = useState([]);
  const [completedList, setCompletedList] = useState([]);

  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Slider එක පාලනය කිරීමට useRef භාවිතා කිරීම
  const scrollRef = useRef(null);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const responses = await Promise.allSettled([
        axios.get("http://localhost:5000/api/rooms/viewpendingbookings"),
        axios.get("http://localhost:5000/api/rooms/viewconfirmedbookings"),
        axios.get("http://localhost:5000/api/rooms/viewcancelledbookings"),
        axios.get("http://localhost:5000/api/rooms/viewcompletedbookings"),
      ]);

      setPendingList(responses[0].status === "fulfilled" ? responses[0].value.data : []);
      setConfirmedList(responses[1].status === "fulfilled" ? responses[1].value.data : []);
      setCancelledList(responses[2].status === "fulfilled" ? responses[2].value.data : []);
      setCompletedList(responses[3].status === "fulfilled" ? responses[3].value.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, refreshKey]);

  // Slider එක දෙපසට scroll කරන function එක
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleBookingAction = async (id, actionType) => {
    const actionToast = toast.loading("Processing...");
    try {
      let endpoint = "";
      if (actionType === "confirm")
        endpoint = `http://localhost:5000/api/rooms/confirmbooking/${id}`;
      else if (actionType === "cancel")
        endpoint = `http://localhost:5000/api/rooms/cancelbooking/${id}`;
      else if (actionType === "complete")
        endpoint = `http://localhost:5000/api/rooms/completebooking/${id}`;

      await axios.put(endpoint);
      toast.success(`Status Updated`, { id: actionToast });
      fetchAllData();
      if (onActionCompleted) onActionCompleted();
    } catch (err) {
      toast.error("Action failed", { id: actionToast });
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm("Permanently delete this record?")) return;
    const actionToast = toast.loading("Deleting...");
    try {
      await axios.delete(`http://localhost:5000/api/rooms/deletebooking/${id}`);
      toast.success("Deleted Successfully", { id: actionToast });
      fetchAllData();
      if (onActionCompleted) onActionCompleted();
    } catch (err) {
      toast.error("Delete failed", { id: actionToast });
    }
  };

  const getActiveList = () => {
    switch (activeTab) {
      case "pending": return pendingList;
      case "approved": return confirmedList;
      case "completed": return completedList;
      case "cancelled": return cancelledList;
      default: return [];
    }
  };

  const filteredList = getActiveList().filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.roomNumber.toString().includes(searchTerm)
  );

  if (loading)
    return <div className="text-center py-20 text-gray-400 italic tracking-widest uppercase">Loading Records...</div>;

  return (
    <div className="mt-8 space-y-8">
      {/* Search & Tabs Navigation */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 overflow-x-auto w-full xl:w-auto">
          <TabButton active={activeTab === "pending"} onClick={() => setActiveTab("pending")} icon={<Clock size={16} />} label="Pending" count={pendingList.length} color="text-yellow-600" />
          <TabButton active={activeTab === "approved"} onClick={() => setActiveTab("approved")} icon={<CheckCircle2 size={16} />} label="Approved" count={confirmedList.length} color="text-green-600" />
          <TabButton active={activeTab === "completed"} onClick={() => setActiveTab("completed")} icon={<Archive size={16} />} label="Completed" count={completedList.length} color="text-blue-600" />
          <TabButton active={activeTab === "cancelled"} onClick={() => setActiveTab("cancelled")} icon={<History size={16} />} label="Cancelled" count={cancelledList.length} color="text-red-600" />
        </div>

        <div className="relative w-full xl:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search bookings..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-black/5 transition-all font-sans"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- Card Slider Section with Arrows --- */}
      {filteredList.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">No {activeTab} bookings found.</p>
        </div>
      ) : (
        <div className="relative group px-4">
          {/* Left Arrow */}
          <button 
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg border border-gray-100 hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden sm:block"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Slider Container */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x snap-mandatory px-1 scroll-smooth"
          >
            {filteredList.map((req) => (
              <div 
                key={req._id} 
                className="flex-shrink-0 w-full sm:w-[320px] snap-center bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Header: User Info & Status */}
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                      <User size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base leading-tight uppercase tracking-tighter font-sans">{req.name}</h4>
                      <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold">
                        <Phone size={10} /> {req.phone}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={req.status} tab={activeTab} />
                </div>

                {/* Body: Room & Dates */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Room Number</span>
                    <div className="flex items-center gap-2">
                      {req.timeSlot && (
                        <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md ${
                          req.timeSlot === "day" 
                            ? "bg-blue-50 text-blue-500 border border-blue-100" 
                            : "bg-purple-50 text-purple-500 border border-purple-100"
                        }`}>
                          {req.timeSlot === "day" ? "Mid Day Stay" : "Overnight Stay"}
                        </span>
                      )}
                    <span className="font-mono font-bold text-black text-lg">{req.roomNumber}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">In</p>
                      <p className="text-xs font-bold text-gray-700">{new Date(req.checkInDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Out</p>
                       <p className="text-xs font-bold text-gray-700">
                        {req.timeSlot === "day" 
                          ? new Date(req.checkInDate).toLocaleDateString()
                          : new Date(req.checkOutDate).toLocaleDateString()
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-auto flex items-center gap-2 pt-2">
                  {activeTab === "pending" && (
                    <>
                      <button
                        onClick={() => handleBookingAction(req._id, "confirm")}
                        className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-green-500/20 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Check size={14} strokeWidth={3} /> Approve
                      </button>
                      <button
                        onClick={() => handleBookingAction(req._id, "cancel")}
                        className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 border border-red-100"
                      >
                        <X size={14} strokeWidth={3} /> Cancel
                      </button>
                    </>
                  )}

                  {activeTab === "approved" && (
                    <>
                      <button
                        onClick={() => handleBookingAction(req._id, "complete")}
                        className="flex-1 bg-blue-400 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-md active:scale-95"
                      >
                        Complete Stay
                      </button>
                      <button
                        onClick={() => handleBookingAction(req._id, "cancel")}
                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                      >
                        <XCircle size={18} />
                      </button>
                    </>
                  )}

                  {activeTab !== "pending" && activeTab !== "approved" && (
                    <button
                      onClick={() => handleDeleteRecord(req._id)}
                      className="p-3 text-gray-300 hover:text-red-600 transition-all ml-auto"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg border border-gray-100 hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden sm:block"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}

const TabButton = ({ active, onClick, icon, label, count, color }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] uppercase tracking-widest transition-all whitespace-nowrap font-sans antialiased
    ${active ? `bg-white ${color} shadow-md ring-1 ring-black/5 font-medium` : "text-gray-400 hover:text-gray-600 font-normal"}`}
  >
    {icon} {label} <span className="opacity-40 ml-1">[{count}]</span>
  </button>
);

const StatusBadge = ({ status, tab }) => {
  const styles = {
    pending: "bg-yellow-50 text-yellow-600 border-yellow-200",
    approved: "bg-green-50 text-green-600 border-green-200",
    completed: "bg-blue-50 text-blue-600 border-blue-200",
    cancelled: "bg-red-50 text-red-600 border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[9px] font-medium uppercase border-2 shadow-sm font-sans ${styles[tab] || "bg-gray-50 text-gray-500"}`}>
      {status}
    </span>
  );
};

export default RoomBookedDetails;