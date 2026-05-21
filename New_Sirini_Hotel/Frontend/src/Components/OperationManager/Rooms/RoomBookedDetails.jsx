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
  Filter,
} from "lucide-react";

function RoomBookedDetails({ refreshKey, onActionCompleted }) {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [pendingList, setPendingList] = useState([]);
  const [confirmedList, setConfirmedList] = useState([]);
  const [cancelledList, setCancelledList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [overdueList, setOverdueList] = useState([]);

  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      // First update overdue bookings
      await axios.put(`${VITE_URL}/api/rooms/updateoverduebookings`);

      const responses = await Promise.allSettled([
        axios.get(`${VITE_URL}/api/rooms/viewpendingbookings`),
        axios.get(`${VITE_URL}/api/rooms/viewconfirmedbookings`),
        axios.get(`${VITE_URL}/api/rooms/viewcancelledbookings`),
        axios.get(`${VITE_URL}/api/rooms/viewcompletedbookings`),
        axios.get(`${VITE_URL}/api/rooms/viewoverduebookings`),
      ]);

      setPendingList(
        responses[0].status === "fulfilled" ? responses[0].value.data : [],
      );
      setConfirmedList(
        responses[1].status === "fulfilled" ? responses[1].value.data : [],
      );
      setCancelledList(
        responses[2].status === "fulfilled" ? responses[2].value.data : [],
      );
      setCompletedList(
        responses[3].status === "fulfilled" ? responses[3].value.data : [],
      );
      setOverdueList(
        responses[4].status === "fulfilled" ? responses[4].value.data : [],
      );
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, refreshKey]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleBookingAction = async (id, actionType) => {
    const actionToast = toast.loading("Processing...");
    try {
      let endpoint = "";
      if (actionType === "confirm")
        endpoint = `${VITE_URL}/api/rooms/confirmbooking/${id}`;
      else if (actionType === "cancel")
        endpoint = `${VITE_URL}/api/rooms/cancelbooking/${id}`;
      else if (actionType === "complete")
        endpoint = `${VITE_URL}/api/rooms/completebooking/${id}`;

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
      await axios.delete(`${VITE_URL}/api/rooms/deletebooking/${id}`);
      toast.success("Deleted Successfully", { id: actionToast });
      fetchAllData();
      if (onActionCompleted) onActionCompleted();
    } catch (err) {
      toast.error("Delete failed", { id: actionToast });
    }
  };

  const getActiveList = () => {
    switch (activeTab) {
      case "pending":
        return pendingList;
      case "approved":
        return confirmedList;
      case "completed":
        return completedList;
      case "cancelled":
        return cancelledList;
      case "overdue":
        return overdueList;
      default:
        return [];
    }
  };

  const filteredList = getActiveList().filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(search) ||
      item.roomNumber?.toString().includes(search) ||
      item.bookingCode?.toLowerCase().includes(search)
    );
  });

  if (loading)
    return (
      <div className="text-center py-20 text-gray-400 italic tracking-widest uppercase">
        Loading Records...
      </div>
    );

  return (
    <div className="mt-8 space-y-8">
      {/* Search & Tabs Navigation */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 overflow-x-auto w-full xl:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <TabButton
            active={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
            icon={<Clock size={16} />}
            label="Pending"
            count={pendingList.length}
            color="text-yellow-600"
          />
          <TabButton
            active={activeTab === "approved"}
            onClick={() => setActiveTab("approved")}
            icon={<CheckCircle2 size={16} />}
            label="Approved"
            count={confirmedList.length}
            color="text-green-600"
          />
          <TabButton
            active={activeTab === "completed"}
            onClick={() => setActiveTab("completed")}
            icon={<Archive size={16} />}
            label="Completed"
            count={completedList.length}
            color="text-blue-600"
          />
          <TabButton
            active={activeTab === "cancelled"}
            onClick={() => setActiveTab("cancelled")}
            icon={<History size={16} />}
            label="Cancelled"
            count={cancelledList.length}
            color="text-red-600"
          />
          <TabButton
            active={activeTab === "overdue"}
            onClick={() => setActiveTab("overdue")}
            icon={<Flag size={16} />}
            label="Overdue"
            count={overdueList.length}
            color="text-orange-600"
          />
        </div>

        <div className="relative w-full xl:w-80">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search bookings..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-black/5 transition-all font-sans"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/*Card Slider Section with Arrows*/}
      {filteredList.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-xs">
          <Filter size={32} className="text-gray-300 mb-3 stroke-[1.5]" />
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] text-center">
            {searchTerm
              ? `No results match "${searchTerm}"`
              : `No ${activeTab} bookings found.`}
          </p>
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
            className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory px-2 scroll-smooth"
          >
            {filteredList.map((req) => (
              <div
                key={req._id}
                className="shrink-0 w-[85vw] sm:w-[320px] snap-center bg-white rounded-3xl sm:rounded-4xl p-3 sm:p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/*User Info & Status */}
                <div className="flex justify-between items-start mb-3 sm:mb-5 gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 flex-shrink-0">
                      <User size={20} />
                    </div>
                    <div className="min-w-0">
                      <h6 className="font-bold text-gray-900 text-xs sm:text-base leading-tight uppercase tracking-tighter font-sans truncate">
                        {req.name}
                      </h6>
                      <div className="flex items-center gap-1 text-gray-400 text-[8px] sm:text-[10px] font-bold truncate">
                        <Phone size={8} /> {req.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <StatusBadge status={req.status} tab={activeTab} />
                  </div>
                </div>
                <div className="mb-3 sm:mb-4 flex items-center">
                  <span className="bg-gray-100 text-gray-700 border border-gray-200/60 font-mono font-black tracking-wider text-[9px] sm:text-[11px] px-2 sm:px-2.5 py-1 rounded-lg uppercase truncate">
                    Ref: {req.bookingCode || "NA"}
                  </span>
                </div>
                {/*Room & Dates details */}
                <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex flex-col gap-1">
                      <span className="text-[7px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        Room Number
                      </span>
                      <span className="font-mono font-black text-black text-lg sm:text-2xl leading-none">
                        {req.roomNumber}
                      </span>
                    </div>
                    {req.timeSlot && (
                      <span
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[7px] sm:text-[8px] font-black uppercase tracking-widest rounded-md flex-shrink-0 text-center ${
                          req.timeSlot === "day"
                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                            : "bg-purple-50 text-purple-600 border border-purple-200"
                        }`}
                      >
                        {req.timeSlot === "day" ? "Mid Day" : "Overnight"}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-2 sm:pt-2 border-t border-gray-200/50 gap-2">
                    <div className="space-y-1">
                      <p className="text-[7px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        In
                      </p>
                      <p className="text-[10px] sm:text-xs font-bold text-gray-700">
                        {new Date(req.checkInDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[7px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        Out
                      </p>
                      <p className="text-[10px] sm:text-xs font-bold text-gray-700">
                        {req.timeSlot === "day"
                          ? new Date(req.checkInDate).toLocaleDateString()
                          : new Date(req.checkOutDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                  {activeTab === "pending" && (
                    <>
                      <button
                        onClick={() => handleBookingAction(req._id, "confirm")}
                        className="flex-1 bg-green-500 text-white py-2 sm:py-2.5 rounded-full font-bold text-[8px] sm:text-[9px] uppercase tracking-widest hover:bg-green-600 transition-all shadow-md hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5"
                      >
                        <Check size={10} strokeWidth={3} /> Approve
                      </button>
                      <button
                        onClick={() => handleBookingAction(req._id, "cancel")}
                        className="flex-1 bg-red-50 text-red-500 py-2 sm:py-2.5 rounded-full font-bold text-[8px] sm:text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5 border border-red-100/50"
                      >
                        <X size={10} strokeWidth={3} /> Cancel
                      </button>
                    </>
                  )}

                  {activeTab === "approved" && (
                    <>
                      <button
                        onClick={() => handleBookingAction(req._id, "complete")}
                        className="flex-1 bg-blue-500 text-white py-2 sm:py-2.5 rounded-full font-bold text-[8px] sm:text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5"
                      >
                        Complete Stay
                      </button>
                      <button
                        onClick={() => handleBookingAction(req._id, "cancel")}
                        className="p-2 sm:p-2.5 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all active:scale-95 border border-red-100/50 flex items-center justify-center flex-shrink-0"
                      >
                        <XCircle size={16} />
                      </button>
                    </>
                  )}

                  {activeTab !== "pending" && activeTab !== "approved" && (
                    <button
                      onClick={() => handleDeleteRecord(req._id)}
                      className="p-2 sm:p-3 text-gray-300 hover:text-red-600 transition-all ml-auto flex items-center justify-center flex-shrink-0"
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
    <span
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[9px] font-medium uppercase border-2 shadow-sm font-sans ${styles[tab] || "bg-gray-50 text-gray-500"}`}
    >
      {status}
    </span>
  );
};

export default RoomBookedDetails;
