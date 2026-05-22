import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdvertisementCard from "../OperationManager/Reception/AdvertisementCard";
import AdvertismentForm from "../Receptionhall/AdvertismentForm";
import ConfrimDialog from "../ConfrimDialog";
import axios from "axios";
import toast from "react-hot-toast";
import { Megaphone, Plus, ChevronLeft, ChevronRight } from "lucide-react";

const AdsSection = ({ data, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null,
    type: "delete",
    title: "",
    message: "",
  });

  const VITE_URL = import.meta.env.VITE_API_URL;

  const scrollSection = (direction) => {
    if (!sliderRef.current) return;
    const cardWidth =
      sliderRef.current.querySelector("[data-slider-card]")?.offsetWidth || 300;
    sliderRef.current.scrollBy({
      left: direction * (cardWidth + 16),
      behavior: "smooth",
    });
  };

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

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = (id) => {
    setConfirmDialog({
      isOpen: true,
      id,
      type: "delete",
      title: "Delete Advertisement?",
      message: "Are you sure you want to delete this advertisement?",
    });
  };

  const handleDelete = async () => {
    const { id } = confirmDialog;
    setConfirmDialog({ isOpen: false, id: null });
    const loading = toast.loading("Deleting advertisement...");
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
        <p className="text-gray-400 text-sm animate-pulse">
          Loading advertisements…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight truncate">
            My Advertisements
          </h2>
          <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5 truncate">
            Manage promotions
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-full text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-amber-500/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0"
          onClick={() => navigate("/reception")}
        >
          <Plus size={14} className="shrink-0" />
          <span>New Ad</span>
        </button>
      </div>

      {/* ── Slider row ── */}
      {ads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Megaphone size={32} className="text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm font-medium">
            You haven't placed any advertisements yet.
          </p>
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
          <button
            onClick={() => scrollSection(-1)}
            aria-label="Scroll left"
            className={`hidden ${ads.length > 1 ? "md:flex" : ""} absolute left-0 sm:-left-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md items-center justify-center hover:bg-gray-50 transition-all text-gray-600 active:scale-90`}
          >
            <ChevronLeft size={16} />
          </button>

          {/* Visible cards */}
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6"
          >
            {ads.map((ad) => (
              <div
                key={ad._id}
                data-slider-card
                className="shrink-0 snap-start w-[90%] md:w-[calc(33.333%-11px)]"
              >
                <AdvertisementCard
                  ad={ad}
                  onEdit={handleEdit}
                  onDelete={handleConfirmDelete}
                  showAdminActions={false}
                  showEditDelete={true}
                />
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scrollSection(1)}
            aria-label="Scroll right"
            className={`hidden ${ads.length > 1 ? "md:flex" : ""} absolute right-0 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md items-center justify-center hover:bg-gray-50 transition-all text-gray-600 active:scale-90`}
          >
            <ChevronRight size={16} />
          </button>

          {/* Swipe indicator for mobile */}
          <p className="mt-2 text-center text-[10px] text-gray-400 font-medium tracking-wider md:hidden">
            ← Swipe to browse →
          </p>
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
      <ConfrimDialog
        isOpen={confirmDialog.isOpen}
        type={confirmDialog.type}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
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
