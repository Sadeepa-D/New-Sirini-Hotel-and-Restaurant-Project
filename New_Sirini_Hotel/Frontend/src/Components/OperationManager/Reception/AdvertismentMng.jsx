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
    typeof window !== "undefined" && window.innerWidth < 640 ? 1 : 3,
  );

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
      const data = response.data || [];
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
      const data = response.data || [];
      setAds(Array.isArray(data) ? data : []);
      setAllAds(Array.isArray(data) ? data : []);
      setSelectedStatus(status);
      setSearch("");
      setIndex(0);
    } catch (err) {
      toast.error(`Failed to fetch ${status} advertisements`);
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
      setItemsPerView(window.innerWidth < 640 ? 1 : 3);
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
  const handleDelete = async (id) => {
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <p className="text-center text-gray-400 text-sm py-10 animate-pulse">
          Loading advertisements...
        </p>
      </div>
    );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
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
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => {
            setSelectedStatus(null);
            setAds(allAds);
            setSearch("");
            setIndex(0);
          }}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
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
              } text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer`}
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
          {index > 0 && (
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
          )}

          <div className="overflow-hidden px-1 sm:px-9">
            <div
              className="flex gap-4 transition-transform duration-300"
              style={{
                transform: `translateX(-${index * (100 / itemsPerView)}%)`,
              }}
            >
              {filtered.map((ad) => {
                const {
                  label,
                  bg,
                  text,
                  icon: StatusIcon,
                } = statusConfig[ad.status];
                return (
                  <div
                    key={ad._id}
                    className="relative shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm group flex flex-col"
                    style={{
                      width:
                        itemsPerView === 1
                          ? "100%"
                          : `calc(${100 / itemsPerView}% - 12px)`,
                      minWidth: itemsPerView === 1 ? "100%" : "220px",
                    }}
                  >
                    {/* Image */}
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={ad.image}
                        alt={ad.BuissnesName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Status badge */}
                      <div
                        className={`absolute top-2 left-2 flex items-center gap-1 ${bg} ${text} text-xs font-semibold px-2.5 py-1 rounded-full shadow`}
                      >
                        <StatusIcon size={11} />
                        {label}
                      </div>

                      {/* Delete ribbon */}
                      <div className="absolute right-2 top-2">
                        <button
                          onClick={() => handleDelete(ad._id)}
                          className="w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center shadow transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 bg-white flex flex-col flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm truncate">
                        {ad.BuissnesName}
                      </h3>
                      <span className="text-xs text-amber-600 font-medium mt-0.5">
                        {ad.category}
                      </span>

                      <div className="flex items-center gap-1 mt-1.5">
                        <MapPin size={11} className="text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-400 truncate">
                          {ad.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Phone size={11} className="text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-400">
                          {ad.TPNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Globe size={11} className="text-gray-400 shrink-0" />
                        <span className="text-xs text-blue-400 truncate">
                          {ad.portfolio}
                        </span>
                      </div>

                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-2 self-start">
                        {ad.price}
                      </span>

                      {/* Approve / Reject buttons */}
                      {ad.status === "pending" && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleApprove(ad._id)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
                          >
                            <CheckCircle size={13} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(ad._id)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
                          >
                            <XCircle size={13} />
                            Reject
                          </button>
                        </div>
                      )}

                      {ad.status !== "pending" && (
                        <button
                          onClick={() => handlepending(ad._id)}
                          className="mt-3 w-full flex items-center justify-center gap-1.5 border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs font-semibold py-1.5 rounded-lg transition-colors"
                        >
                          <Clock size={12} />
                          Reset to Pending
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {index < filtered.length - itemsPerView && (
            <button
              onClick={() =>
                setIndex((i) => Math.min(filtered.length - itemsPerView, i + 1))
              }
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
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
    </div>
  );
};
export default AdvertismentMng;
