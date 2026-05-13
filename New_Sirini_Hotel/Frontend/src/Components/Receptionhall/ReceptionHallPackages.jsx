import React, { useState, useEffect } from "react";
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
  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
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

  useEffect(() => {
    fetchoccasionpackages();

    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync index on resize
  useEffect(() => {
    setIndex(0);
  }, [itemsPerView]);

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

  // Calculate visible slice
  const visiblePackages = packages.slice(index, index + itemsPerView);

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
              Book for **100+ guests** and get the **Reception Hall for FREE!**{" "}
              <br />
              <span className="italic text-[10px]">
                *Less than 100 guests will incur a Rs. 2,000 hall fee per
                person.*
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
          <>
            {/* Carousel Navigation Arrows - MOVED OUTSIDE MAP */}
            {index > 0 && (
              <button
                onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all border border-gray-100"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {index + itemsPerView < packages.length && (
              <button
                onClick={() =>
                  setIndex((prev) =>
                    Math.min(packages.length - itemsPerView, prev + 1),
                  )
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all border border-gray-100"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* Grid Container */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              style={{ animation: "fadeIn 0.4s ease-out" }}
            >
              {visiblePackages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group flex flex-col relative min-h-96 sm:min-h-[450px]"
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

            {/* Pagination Dots - MOVED OUTSIDE MAP */}
            {packages.length > itemsPerView && (
              <div className="flex justify-center gap-3 mt-12">
                {Array.from({ length: packages.length - itemsPerView + 1 }).map(
                  (_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`h-1.5 transition-all duration-300 rounded-full ${
                        index === i
                          ? "w-8 bg-amber-500"
                          : "w-2 bg-gray-300 hover:bg-amber-300"
                      }`}
                    />
                  ),
                )}
              </div>
            )}
          </>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
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
