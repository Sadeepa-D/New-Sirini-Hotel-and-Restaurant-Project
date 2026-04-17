import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdvertisementCard from "../OperationManager/Reception/AdvertisementCard";
import AdvertismentForm from "../Receptionhall/AdvertismentForm";
import axios from "axios";
import toast from "react-hot-toast";

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
      <div className="py-10 text-center text-gray-500 animate-pulse">
        Loading advertisements...
      </div>
    );
  }
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Reception Hall Ads</h2>
        <button
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg"
          onClick={() => navigate("/reception")}
        >
          + Place New Ad
        </button>
      </div>

      {/* Cards Grid */}
      {ads.length === 0 ? (
        <p className="text-gray-500 text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
          You haven't placed any advertisements yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((ad) => (
            <AdvertisementCard
              key={ad._id}
              ad={ad}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showAdminActions={false} // Hides Manager buttons
              showEditDelete={true} // Shows User buttons
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
