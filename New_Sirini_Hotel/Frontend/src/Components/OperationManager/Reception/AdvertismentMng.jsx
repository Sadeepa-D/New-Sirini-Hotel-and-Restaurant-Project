import React, { useState, useEffect } from "react";
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
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [itemsPerView, setItemsPerView] = useState(
    typeof window !== "undefined"
      ? window.innerWidth < 640
        ? 1
        : window.innerWidth < 1024
          ? 2
          : 4
      : 4,
  );
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
      setIndex(0);
    } catch (err) {
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIndex((prev) =>
      Math.min(prev, Math.max(0, filtered.length - itemsPerView)),
    );
  }, [filtered.length, itemsPerView]);

  const handleApprove = async (id) => {
    try {
      const response = await axios.put(
        `${VITE_URL}/api/receptionhall/advertisment/toggle/approved/${id}`,
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
      const response = await axios.put(
        `${VITE_URL}/api/receptionhall/advertisment/toggle/rejected/${id}`,
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
    setConfirmDialog({
      isOpen: false,
      id: null,
    });
    try {
      const response = await axios.delete(
        `${VITE_URL}/api/receptionhall/advertisment/delete/${id}`,
      );
      const updatedAllAds = allAds.filter((a) => a._id !== id);
      setAllAds(updatedAllAds);
      if (selectedStatus) {
        setAds(updatedAllAds.filter((a) => a.status === selectedStatus));
      } else {
        setAds(updatedAllAds);
      }
      toast.success("Advertisement deleted successfully");
    } catch (err) {
      toast.error("Failed to delete advertisement");
    }
  };

  const handlepending = async (id) => {
    try {
      const response = await axios.put(
        `${VITE_URL}/api/receptionhall/advertisment/toggle/pending/${id}`,
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
            setIndex(0);
          }}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
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
              className={`flex items-center gap-1.5 ${
                selectedStatus === key
                  ? `${bg} ${text} border-2 border-current shadow-md`
                  : `${bg} ${text} opacity-60 hover:opacity-100`
              } text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap`}
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
          {index > 0 && (
            <button
              onClick={() => setIndex((i) => Math.max(0, i - itemsPerView))}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
          )}

          {/* Visible cards — slice-based, no translateX */}
          <div
            key={index}
            className="flex gap-3 sm:gap-4"
            style={{ animation: "fadeIn 0.25s ease" }}
          >
            {filtered.slice(index, index + itemsPerView).map((ad) => (
              <div
                key={ad._id}
                style={{
                  width: `calc((100% - ${(window.innerWidth < 640 ? 12 : 16) * (itemsPerView - 1)}px) / ${itemsPerView})`,
                }}
                className="shrink-0"
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
          {index + itemsPerView < filtered.length && (
            <button
              onClick={() =>
                setIndex((i) =>
                  Math.min(filtered.length - itemsPerView, i + itemsPerView),
                )
              }
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          )}

          {/* Page dots */}
          {filtered.length > itemsPerView && (
            <div className="flex justify-center gap-1.5 mt-4">
              {Array.from({
                length: Math.ceil(filtered.length / itemsPerView),
              }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i * itemsPerView)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    Math.floor(index / itemsPerView) === i
                      ? "bg-amber-500"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
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
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
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
