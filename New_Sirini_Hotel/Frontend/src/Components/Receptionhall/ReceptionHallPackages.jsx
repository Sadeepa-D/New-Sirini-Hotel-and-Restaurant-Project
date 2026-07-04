import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Utensils,
  Users,
  Gift,
} from "lucide-react";
import axios from "axios";
import CateringSelectionHub from "./CateringSelectionHub";

export default function ReceptionHallPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showCateringHub, setShowCateringHub] = useState(false);

  const VITE_URL = import.meta.env.VITE_API_URL;

  const fetchoccasionpackages = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/package/view`,
      );
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.packages || [];
      setPackages(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
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

  useEffect(() => {
    fetchoccasionpackages();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-gray-400 text-sm uppercase tracking-widest animate-pulse font-serif">
          Loading packages...
        </p>
      </div>
    );

  if (error)
    return <p className="text-center py-16 text-red-400 text-sm">{error}</p>;

  return (
    <section className="bg-gray-50 py-5 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-16 h-17">
        <p className="text-amber-500 text-xs uppercase tracking-[0.3em] mb-2 font-medium">
          Tailored For You
        </p>
        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-gray-800 font-semibold">
          Our Packages
        </h2>
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="h-[1px] w-12 bg-amber-300" />
          <div className="w-2 h-2 rounded-full border border-amber-400 rotate-45 bg-white" />
          <div className="h-[1px] w-12 bg-amber-300" />
        </div>
      </div>
      {/* Special Offer Card CSS Animations */}
      <style>
        {`
          @keyframes borderGlow {
            0%, 100% {
              border-color: rgba(245, 158, 11, 0.25);
              box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.04);
            }
            50% {
              border-color: rgba(245, 158, 11, 0.6);
              box-shadow: 0 20px 35px -5px rgba(245, 158, 11, 0.15);
            }
          }
          @keyframes shimmers {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-special-card {
            animation: borderGlow 3s infinite ease-in-out;
          }
          .shine-effect {
            background: linear-gradient(
              120deg,
              rgba(255, 255, 255, 0) 30%,
              rgba(255, 255, 255, 0.3) 40%,
              rgba(255, 255, 255, 0.3) 45%,
              rgba(255, 255, 255, 0) 55%
            );
            background-size: 200% 100%;
            animation: shimmers 4s infinite linear;
          }
        `}
      </style>

      {/* Special Offer Card */}
      <div className="max-w-3xl mx-auto mb-16 px-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/[0.08] via-amber-500/[0.02] to-transparent border p-6 sm:p-8 rounded-3xl backdrop-blur-md flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left group transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.01] animate-special-card">
          {/* Shimmer overlay */}
          <div className="absolute inset-0 shine-effect opacity-40 pointer-events-none" />
          
          {/* Glowing background circles for premium depth */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-colors duration-500" />
          <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Premium Glowing Icon Box */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-black flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <Gift size={26} className="stroke-[2]" />
          </div>

          {/* Offer Content */}
          <div className="flex-1 min-w-0 z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2">
              <h4 className="font-serif italic font-bold text-amber-950 text-lg sm:text-xl tracking-tight">
                Special Offer on Hall Charges
              </h4>
              <span className="self-center sm:self-start bg-amber-500/10 text-amber-700 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-amber-500/20 animate-pulse">
                Exclusive
              </span>
            </div>
            <p className="text-zinc-700 text-sm mt-2 leading-relaxed">
              Book your event for <span className="font-extrabold text-amber-950">100+ guests</span> and enjoy the <span className="font-black text-amber-600 bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded-lg inline-block my-0.5">Reception Hall for FREE!</span>
            </p>
            <p className="text-zinc-400 text-xs mt-1.5 italic flex items-center justify-center sm:justify-start gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Note: Less than 100 guests will incur an additional hall fee.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative px-4 md:px-10">
        {packages.length === 0 ? (
          <p className="text-center text-gray-400 font-serif py-10 italic">
            No packages currently available.
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
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  data-slider-card
                  className="w-full shrink-0 snap-start md:w-[calc(33.333%-11px)] bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group flex flex-col relative min-h-96 sm:min-h-[450px]"
                >
                  {/* Image Section */}
                  <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-amber-600 text-sm font-black px-4 py-1.5 rounded-full shadow-md border border-white/50">
                      Rs. {pkg.price?.toLocaleString()}
                    </div>

                    {/* Status Badge */}
                    {!pkg.status && (
                      <div
                        className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md ${
                          pkg.availability
                            ? "bg-emerald-500 text-white"
                            : "bg-rose-500 text-white"
                        }`}
                      >
                        {pkg.availability ? "Available" : "Unavailable"}
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-3 sm:p-4 md:p-6 flex flex-col flex-1 bg-white relative">
                    <h3 className="font-cinzel text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-amber-600 transition-colors">
                      {pkg.name}
                    </h3>
                    <p
                      className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 line-clamp-1 sm:line-clamp-2"
                      title={pkg.description}
                    >
                      {pkg.description}
                    </p>

                    {/* Features Chips */}
                    {pkg.features && pkg.features.length > 0 && (
                      <div className="mb-2 sm:mb-4">
                        <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          What's Included
                        </p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {pkg.features[0]
                            .split(",")
                            .slice(0, 5)
                            .map((feature, i) => (
                              <span
                                key={i}
                                className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-gray-700 bg-amber-50/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-amber-100/50"
                              >
                                <CheckCircle2
                                  size={12}
                                  className="text-amber-500"
                                />
                                <span className="hidden sm:inline">
                                  {feature.trim()}
                                </span>
                                <span className="sm:hidden">
                                  {feature.trim().split(" ")[0]}
                                </span>
                              </span>
                            ))}
                          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] mt-3 cursor-pointer hover:text-amber-700 hover:underline underline-offset-4 transition-all decoration-amber-200">
                            + More
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="mt-auto pt-2 sm:pt-3 md:pt-4 border-t border-gray-50">
                      <button
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setShowCateringHub(true);
                        }}
                        style={{ borderRadius: "12px" }}
                        className="mx-auto flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-900 hover:bg-amber-500 text-white font-medium py-2 sm:py-2.5 md:py-3.5 px-6 sm:px-8 w-fit transition-all duration-300 shadow-sm hover:shadow-lg group/btn text-xs sm:text-sm"
                      >
                        <Utensils
                          size={14}
                          className="text-gray-400 group-hover/btn:text-white transition-colors sm:w-5 sm:h-5"
                        />
                        <span className="hidden sm:inline">
                          View Menu Options
                        </span>
                        <span className="sm:hidden">Menu</span>
                        <ChevronRight
                          size={14}
                          className="text-gray-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all sm:w-5 sm:h-5"
                        />
                      </button>
                    </div>
                  </div>
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
      </div>

      {showCateringHub && (
        <CateringSelectionHub
          onClose={() => setShowCateringHub(false)}
          selectedPackage={selectedPackage}
          isAdd={false}
        />
      )}
    </section>
  );
  
}
