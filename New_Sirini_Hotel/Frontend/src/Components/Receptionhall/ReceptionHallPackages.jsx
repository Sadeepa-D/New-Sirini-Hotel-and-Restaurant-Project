import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Utensils,
  Users,
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
        <p className="text-amber-600 text-xs uppercase tracking-[0.4em] mb-3 font-bold">
          Tailored For You
        </p>
        <h2 className="font-cinzel text-4xl md:text-5xl text-gray-900 italic leading-tight">
          Our Packages
        </h2>
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="h-[1px] w-12 bg-amber-300" />
          <div className="w-2 h-2 rounded-full border border-amber-400 rotate-45 bg-white" />
          <div className="h-[1px] w-12 bg-amber-300" />
        </div>
      </div>
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-r-xl">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-white p-2 rounded-full">
            <Users size={20} />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 text-sm">
              Special Offer on Hall Charges
            </h4>
            <p className="text-xs text-amber-700">
              Book for <b>100+ guests</b> and get the{" "}
              <b>Reception Hall for FREE!</b>
              <br />
              <span className="italic text-[10px]">
                Less than 100 guests will incur a additional hall fee
              </span>
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
                        className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-900 hover:bg-amber-500 text-white font-medium py-2 sm:py-2.5 md:py-3.5 px-3 sm:px-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg group/btn text-xs sm:text-sm"
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
