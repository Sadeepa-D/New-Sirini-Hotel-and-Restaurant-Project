import React, { useState, useEffect } from "react";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
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
    <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-16">
        <p className="text-amber-600 text-xs uppercase tracking-[0.4em] mb-3 font-bold">
          Tailored For You
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-gray-900 italic leading-tight">
          Our Packages
        </h2>
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="h-[1px] w-12 bg-amber-300" />
          <div className="w-2 h-2 rounded-full border border-amber-400 rotate-45 bg-white" />
          <div className="h-[1px] w-12 bg-amber-300" />
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
                  className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full"
                >
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-amber-500 text-amber-950 text-sm font-black px-4 py-2 rounded-2xl shadow-lg">
                      Rs. {pkg.price?.toLocaleString()}
                    </div>

                    {/* Status Badge - Only show when unavailable */}
                    {!pkg.status && (
                      <div
                        className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
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
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="font-serif text-2xl text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 italic">
                      "{pkg.description}"
                    </p>

                    {/* Features Chips */}
                    {pkg.features && pkg.features.length > 0 && (
                      <div className="mt-auto pt-6 border-t border-gray-100">
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4">
                          Package Inclusions
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {pkg.features[0]
                            .split(",")
                            .slice(0, 3)
                            .map((feature, i) => (
                              <span
                                key={i}
                                className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100"
                              >
                                <CheckCircle2
                                  size={12}
                                  className="text-amber-500"
                                />
                                {feature.trim()}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setShowCateringHub(true);
                    }}
                    className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Show Menu
                  </button>
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
