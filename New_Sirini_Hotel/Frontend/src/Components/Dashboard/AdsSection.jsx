import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdvertisementCard from "../OperationManager/Reception/AdvertisementCard";
import AdvertismentForm from "../Receptionhall/AdvertismentForm";
import axios from "axios";
import toast from "react-hot-toast";
import { Megaphone, Plus } from "lucide-react";

const AdsSection = ({ data, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((ad) => (
            <AdvertisementCard
              key={ad._id}
              ad={ad}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showAdminActions={false}
              showEditDelete={true}
            />
          ))}
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
    </div>
  );
};

export default AdsSection;
