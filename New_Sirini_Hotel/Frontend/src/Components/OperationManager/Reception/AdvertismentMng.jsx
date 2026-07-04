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
    icon: Clock,
  },
  approved: {
    label: "Approved",
    bg: "bg-green-100",
    text: "text-green-700",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-100",
    text: "text-red-600",
    icon: XCircle,
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
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 transition-all cursor-pointer whitespace-nowrap transform hover:scale-105 active:scale-95 duration-300 ease-in-out ${
            selectedStatus === null
              ? "bg-blue-100 text-blue-700 border-2 border-blue-400"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All ({allAds.length})
        </button>
        {Object.entries(statusConfig).map(
          ([key, { label, bg, text, icon: Icon }]) => (
            <button
              key={key}
              onClick={() => fetchAdsByStatus(key)}
              style={{ borderRadius: "10px" }}
              className={`flex items-center gap-1.5 ${
                selectedStatus === key
                  ? `${bg} ${text} border-2 border-current shadow-md`
                  : `${bg} ${text} opacity-60 hover:opacity-100`
              } text-xs font-semibold px-3 py-1.5 transition-all cursor-pointer whitespace-nowrap transform hover:scale-105 active:scale-95 duration-300 ease-in-out`}
            >
              <Icon size={12} />
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

      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          Total: <strong className="text-gray-600">{allAds.length}</strong>
        </span>
        <span className="text-xs text-gray-400">
          Pending:{" "}
          <strong className="text-yellow-600">
            {allAds.filter((a) => a.status === "pending").length}
          </strong>
        </span>
        <span className="text-xs text-gray-400">
          Approved:{" "}
          <strong className="text-green-600">
            {allAds.filter((a) => a.status === "approved").length}
          </strong>
        </span>
        <span className="text-xs text-gray-400">
          Rejected:{" "}
          <strong className="text-red-500">
            {allAds.filter((a) => a.status === "rejected").length}
          </strong>
        </span>
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
