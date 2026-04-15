import React, { useState, useEffect } from "react";
import { Camera, Music, Sparkles, Megaphone } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import AdvertisementCard from "./AdvertisementCard";
import AdvertismentForm from "./AdvertismentForm";

const categories = [
  { label: "Photography", icon: Camera },
  { label: "Audio & Musical", icon: Music },
  { label: "Decoration", icon: Sparkles },
];

const AdvertisementSection = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Photography");
  const [showForm, setShowForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const VITE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get(
          `${VITE_URL}/api/receptionhall/advertisment/view`,
        );
        if (response.status !== 200) {
          throw new Error("Failed to load advertisements");
        }
        setAds(response.data);
      } catch (err) {
        setError("Failed to load advertisements. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  const handleadrequest = () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to place an Advertisement.");
      setShowForm(false);
      return;
    } else {
      setShowForm(true);
    }
  };

  const filtered = ads.filter((ad) => ad.category === activeCategory);

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-gray-400 text-sm uppercase tracking-widest animate-pulse">
          Loading advertisements...
        </p>
      </div>
    );

  if (error)
    return <p className="text-center py-16 text-red-400 text-sm">{error}</p>;

  return (
    <section className="bg-neutral-50 py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
      {/* Section Header */}
      <div className="text-center mb-10">
        <p className="text-amber-500 text-xs uppercase tracking-[0.3em] mb-2 font-medium">
          Partner Services
        </p>
        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-gray-800 font-semibold">
          Business Advertisements
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
          Discover trusted service providers for your special event
        </p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-16 bg-amber-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <div className="h-px w-16 bg-amber-300" />
        </div>
      </div>

      {/* Request Button */}
      <div className="flex justify-center mb-10">
        <button
          onClick={() => {
            handleadrequest();
          }}
          className="group flex items-center gap-3 bg-white border-2 border-amber-400 text-amber-700 hover:bg-amber-500 hover:text-amber-900 hover:border-amber-500 px-8 py-3.5 rounded-full font-semibold text-sm uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <Megaphone
            size={16}
            className="group-hover:scale-110 transition-transform duration-300"
          />
          Request an Advertisement
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
        {categories.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActiveCategory(label)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
              activeCategory === label
                ? "bg-amber-500 text-amber-900 border-amber-500 shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-600"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 max-w-7xl mx-auto mb-8">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400 uppercase tracking-widest font-medium whitespace-nowrap">
          {activeCategory}
        </span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.length > 0 ? (
          filtered.map((ad) => <AdvertisementCard key={ad._id} ad={ad} />)
        ) : (
          <div className="col-span-full text-center py-16">
            <p className="text-gray-400 text-sm uppercase tracking-widest">
              No advertisements in this category yet
            </p>
          </div>
        )}
      </div>
      {showForm && <AdvertismentForm onClose={() => setShowForm(false)} />}
    </section>
  );
};

export default AdvertisementSection;
