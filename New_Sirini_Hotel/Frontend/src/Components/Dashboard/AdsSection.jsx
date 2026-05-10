import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdvertisementCard from "../OperationManager/Reception/AdvertisementCard";
import AdvertismentForm from "../Receptionhall/AdvertismentForm";
import axios from "axios";
import toast from "react-hot-toast";
import { Megaphone, Plus, ChevronLeft, ChevronRight } from "lucide-react";

const AdsSection = ({ data, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(
    typeof window !== "undefined" && window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3
  );

  const VITE_URL = import.meta.env.VITE_API_URL;

  const fetchads = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to view your ads.");
        setLoading(false);
        return;
      }
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/advertisment/view/userspecific`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setAds(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user-specific advertisements:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchads();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(
        window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3,
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIndex((prev) =>
      Math.min(prev, Math.max(0, ads.length - itemsPerView))
    );
  }, [ads.length, itemsPerView]);

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setIsFormOpen(true);
  };

  const handleDelete = async (adId) => {
    if (!window.confirm("Are you sure you want to delete this advertisement?"))
      return;
    const loading = toast.loading("Deleting advertisement...");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${VITE_URL}/api/receptionhall/advertisment/delete/${adId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.dismiss(loading);
      toast.success("Advertisement deleted successfully.");
    } catch (error) {
      console.error("Error deleting advertisement:", error);
      toast.error("Failed to delete the advertisement. Please try again.");
    } finally {
      fetchads();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm animate-pulse">Loading advertisements…</p>
      </div>
    );
  }

  const visibleItems = ads.slice(index, index + itemsPerView);
  const canGoBack = index > 0;
  const canGoNext = index + itemsPerView < ads.length;
  const GAP = 16;
  const cardWidth = `calc((100% - ${GAP * (itemsPerView - 1)}px) / ${itemsPerView})`;

  return (
    <div className="space-y-6 font-sans">
      {/* ── Header ── */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">My Advertisements</h2>
          <p className="text-gray-400 text-xs mt-0.5">Manage your business promotions</p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-full text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-amber-500/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          onClick={() => navigate("/reception")}
        >
          <Plus size={14} /> Place New Ad
        </button>
      </div>

      {/* ── Cards / Empty ── */}
      {ads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Megaphone size={36} className="text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm font-medium">You haven't placed any advertisements yet.</p>
          <button
            onClick={() => navigate("/reception")}
            className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-full transition-all duration-200"
          >
            <Plus size={13} /> Place Your First Ad
          </button>
        </div>
      ) : (
        <div className="relative mt-4">
          {/* Left arrow */}
          {canGoBack && (
            <button
              onClick={() => setIndex((i) => Math.max(0, i - itemsPerView))}
              className="absolute left-0 sm:-left-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-all"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
          )}

          {/* Visible cards */}
          <div
            key={index}
            className="flex gap-4"
            style={{ animation: "fadeIn 0.25s ease" }}
          >
            {visibleItems.map((ad) => (
              <div key={ad._id} className="shrink-0" style={{ width: cardWidth }}>
                <AdvertisementCard
                  ad={ad}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  showAdminActions={false}
                  showEditDelete={true}
                />
              </div>
            ))}
          </div>

          {/* Right arrow */}
          {canGoNext && (
            <button
              onClick={() =>
                setIndex((i) =>
                  Math.min(ads.length - itemsPerView, i + itemsPerView),
                )
              }
              className="absolute right-0 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-all"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          )}

          {/* Page dots */}
          {ads.length > itemsPerView && (
            <div className="flex justify-center gap-1.5 mt-6">
              {Array.from({
                length: Math.ceil(ads.length / itemsPerView),
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

      {isFormOpen && (
        <AdvertismentForm
          onClose={() => setIsFormOpen(false)}
          editData={editingAd}
          onSuccess={() => {
            setIsFormOpen(false);
            fetchads();
          }}
        />
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdsSection;
