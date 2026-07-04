import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Trash2,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import AdvertisementCard from "./AdvertisementCard";
import ConfirmDialog from "../../ConfrimDialog";

const statusConfig = {
  pending: {
    label: "Pending",
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    activeClass: "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20",
    icon: Clock,
    iconColor: "text-amber-500",
  },
  approved: {
    label: "Approved",
    bg: "bg-green-100",
    text: "text-green-700",
    activeClass: "bg-green-500 text-white border-green-500 shadow-md shadow-green-500/20",
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-100",
    text: "text-red-600",
    activeClass: "bg-red-500 text-white border-red-500 shadow-md shadow-red-500/20",
    icon: XCircle,
    iconColor: "text-red-500",
  },
};

const AdvertismentMng = () => {
  const [ads, setAds] = useState([]);
  const [allAds, setAllAds] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null,
    type: "",
    title: "",
    message: "",
  });

  const VITE_URL = import.meta.env.VITE_API_URL;

  const filtered = ads.filter(
    (a) =>
      a.BuissnesName.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()),
  );

  const fetchAds = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/advertisment/view`,
      );
      const data = response.data;
      setAds(Array.isArray(data) ? data : []);
      setAllAds(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      toast.error("Failed to fetch advertisements");
      setAds([]);
      setAllAds([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdsByStatus = async (status) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/advertisment/view/${status}`,
      );
      const data = response.data;
      setAds(Array.isArray(data) ? data : []);
      setSelectedStatus(status);
      setSearch("");
    } catch (err) {
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${VITE_URL}/api/receptionhall/advertisment/toggle/approved/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const updatedAd = response.data;
      toast.success("Advertisement approved successfully");
      const updatedAllAds = allAds.map((a) =>
        a._id === id ? { ...a, status: "approved" } : a,
      );
      setAllAds(updatedAllAds);
      if (selectedStatus) {
        setAds(updatedAllAds.filter((a) => a.status === selectedStatus));
      } else {
        setAds(updatedAllAds);
      }
    } catch (err) {
      toast.error("Failed to approve advertisement");
    }
  };
  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${VITE_URL}/api/receptionhall/advertisment/toggle/rejected/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const updatedAd = response.data;
      toast.success("Advertisement rejected successfully");
      const updatedAllAds = allAds.map((a) =>
        a._id === id ? { ...a, status: "rejected" } : a,
      );
      setAllAds(updatedAllAds);
      if (selectedStatus) {
        setAds(updatedAllAds.filter((a) => a.status === selectedStatus));
      } else {
        setAds(updatedAllAds);
      }
    } catch (err) {
      toast.error("Failed to reject advertisement");
    }
  };

  const handleConfirmDelete = async (id) => {
    setConfirmDialog({
      isOpen: true,
      id: id,
      type: "delete",
      title: "Delete Advertisement",
      message: "Are you sure you want to delete this advertisement?",
    });
  };

  const handleDelete = async () => {
    const { id } = confirmDialog;
    const loadingtoast = toast.loading("Deleting advertisement...");
    setConfirmDialog({
      isOpen: false,
      id: null,
    });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${VITE_URL}/api/receptionhall/advertisment/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const updatedAllAds = allAds.filter((a) => a._id !== id);
      setAllAds(updatedAllAds);
      if (selectedStatus) {
        setAds(updatedAllAds.filter((a) => a.status === selectedStatus));
      } else {
        setAds(updatedAllAds);
      }
      toast.dismiss(loadingtoast);
      toast.success("Advertisement deleted successfully");
    } catch (err) {
      toast.dismiss(loadingtoast);
      toast.error("Failed to delete advertisement");
    }
  };

  const handlepending = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${VITE_URL}/api/receptionhall/advertisment/toggle/pending/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const updatedAd = response.data;
      toast.success("Advertisement reset to pending successfully");
      const updatedAllAds = allAds.map((a) =>
        a._id === id ? { ...a, status: "pending" } : a,
      );
      setAllAds(updatedAllAds);
      if (selectedStatus) {
        setAds(updatedAllAds.filter((a) => a.status === selectedStatus));
      } else {
        setAds(updatedAllAds);
      }
    } catch (err) {
      toast.error("Failed to reset advertisement to pending");
    }
  };

  const sliderRef = useRef(null);
  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;
    const cardWidth =
      sliderRef.current.querySelector("[data-slider-card]")?.offsetWidth || 320;
    sliderRef.current.scrollBy({
      left: direction * (cardWidth + 16),
      behavior: "smooth",
    });
  };

  if (loading)
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6">
        <p className="text-center text-gray-400 text-sm py-10 animate-pulse">
          Loading advertisements...
        </p>
      </div>
    );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-amber-500 uppercase tracking-widest font-medium mb-0.5">
            Manage
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Advertisements
          </h2>
        </div>
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-amber-400 transition-colors">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search ads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm text-gray-600 outline-none w-40 placeholder-gray-300"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={13} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Status summary pills */}
      <div className="flex items-center overflow-x-auto sm:flex-wrap gap-2 mb-5 pb-1 sm:pb-0 no-scrollbar">
        <button
          onClick={() => {
            setSelectedStatus(null);
            setAds(allAds);
            setSearch("");
          }}
          style={{ borderRadius: "10px" }}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 transition-all cursor-pointer whitespace-nowrap transform hover:scale-105 active:scale-95 duration-300 ease-in-out border ${
            selectedStatus === null
              ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20"
              : "bg-gray-50 text-gray-600 border-gray-200/80 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          All ({allAds.length})
        </button>
        {Object.entries(statusConfig).map(
          ([key, { label, activeClass, icon: Icon, iconColor }]) => (
            <button
              key={key}
              onClick={() => fetchAdsByStatus(key)}
              style={{ borderRadius: "10px" }}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 transition-all cursor-pointer whitespace-nowrap transform hover:scale-105 active:scale-95 duration-300 ease-in-out border ${
                selectedStatus === key
                  ? activeClass
                  : "bg-gray-50 text-gray-600 border-gray-200/80 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon size={12} className={selectedStatus === key ? "text-white" : iconColor} />
              {label}: {allAds.filter((a) => a.status === key).length}
            </button>
          ),
        )}
      </div>

      {/* Cards Slider */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-10">
          No advertisements found
        </p>
      ) : (
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scrollSlider(-1)}
            aria-label="Scroll left"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg text-gray-600 hover:text-amber-500 hover:border-amber-400 transition-all active:scale-90"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>

          {/* Scroll container */}
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1"
          >
            {filtered.map((ad) => (
              <div
                key={ad._id}
                data-slider-card
                className="w-full shrink-0 snap-start md:w-[calc(25%-12px)]"
              >
                <AdvertisementCard
                  ad={ad}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onDelete={handleConfirmDelete}
                  onResetPending={handlepending}
                  showAdminActions={true}
                  showEditDelete={false}
                />
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scrollSlider(1)}
            aria-label="Scroll right"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg text-gray-600 hover:text-amber-500 hover:border-amber-400 transition-all active:scale-90"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>

          {/* Mobile swipe hint */}
          <p className="mt-2 text-center text-[10px] text-gray-400 font-medium tracking-wider md:hidden">
            ← Swipe to browse →
          </p>
        </div>
      )}

      {/* Footer stats */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-3 sm:gap-4">
        {/* Total Stat Card */}
        <div
          style={{ borderRadius: "12px" }}
          className="flex items-center gap-2.5 bg-gray-50 border border-gray-200/80 px-4 py-2 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total:</span>
          <strong className="text-lg font-black text-gray-800 font-mono leading-none">{allAds.length}</strong>
        </div>

        {/* Pending Stat Card */}
        <div
          style={{ borderRadius: "12px" }}
          className="flex items-center gap-2.5 bg-yellow-50/40 border border-yellow-100 px-4 py-2 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="text-xs font-bold text-yellow-700 uppercase tracking-wider">Pending:</span>
          <strong className="text-lg font-black text-yellow-700 font-mono leading-none">
            {allAds.filter((a) => a.status === "pending").length}
          </strong>
        </div>

        {/* Approved Stat Card */}
        <div
          style={{ borderRadius: "12px" }}
          className="flex items-center gap-2.5 bg-green-50/40 border border-green-100 px-4 py-2 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Approved:</span>
          <strong className="text-lg font-black text-green-700 font-mono leading-none">
            {allAds.filter((a) => a.status === "approved").length}
          </strong>
        </div>

        {/* Rejected Stat Card */}
        <div
          style={{ borderRadius: "12px" }}
          className="flex items-center gap-2.5 bg-red-50/40 border border-red-100 px-4 py-2 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Rejected:</span>
          <strong className="text-lg font-black text-red-700 font-mono leading-none">
            {allAds.filter((a) => a.status === "rejected").length}
          </strong>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        type={confirmDialog.type}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
    </div>
  );
};
export default AdvertismentMng;
