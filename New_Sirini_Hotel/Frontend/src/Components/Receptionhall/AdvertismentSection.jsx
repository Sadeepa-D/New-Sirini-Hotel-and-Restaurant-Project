import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Music,
  Sparkles,
  Megaphone,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import AdvertisementCard from "./AdvertisementCard";
import AdvertismentForm from "./AdvertismentForm";
import LoginMessage from "../../Components/LoginMessage";

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
  const [showLoginModal, setShowLoginModal] = useState(false);

  const VITE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${VITE_URL}/api/receptionhall/advertisment/view/approved`,
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

  const handleadrequest = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
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
      <div className="text-center mb-10 h-20">
        <p className="text-amber-500 text-xs uppercase tracking-[0.3em] mb-2 font-medium">
          Partner Services
        </p>
        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-gray-800 font-semibold">
          Business Advertisements
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
          Discover trusted service providers for your special event
        </p>
        {/* <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-16 bg-amber-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <div className="h-px w-16 bg-amber-300" />
        </div> */}
      </div>

      {/* Request Button */}
      <div className="flex justify-center mb-10">
        <button
          onClick={() => {
            handleadrequest();
          }}
          style={{ borderRadius: "9999px" }}
          className="group relative flex items-center gap-3 overflow-hidden bg-zinc-900 text-white hover:text-black hover:bg-amber-500 px-8 py-3.5 font-semibold text-xs md:text-sm uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-amber-500/20 border border-zinc-800"
        >
          {/* Subtle gold line on top of the button for premium look */}
          <span className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />
          
          <Megaphone
            size={16}
            className="text-amber-400 group-hover:text-black group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300"
          />
          <span className="relative z-10">Request an Advertisement</span>
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
      <div className="max-w-7xl mx-auto">
        {filtered.length > 0 ? (
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
                  className="w-full shrink-0 snap-start md:w-[calc(33.333%-11px)]"
                >
                  <AdvertisementCard ad={ad} />
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
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm uppercase tracking-widest">
              No advertisements in this category yet
            </p>
          </div>
        )}
      </div>
      {showForm && <AdvertismentForm onClose={() => setShowForm(false)} />}
      <LoginMessage
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </section>
  );
};

export default AdvertisementSection;
