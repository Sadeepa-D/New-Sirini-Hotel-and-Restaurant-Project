import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import axios from "axios";

const CateringItemCard = () => {
  const [cateringItems, setCateringItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(
    typeof window !== "undefined" && window.innerWidth < 640 ? 1 : 3,
  );

  const VITE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCateringItems = async () => {
      try {
        const response = await axios.get(
          `${VITE_URL}/api/receptionhall/catering/view`,
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch catering items");
        }
        setCateringItems(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchCateringItems();
  }, []);

  useEffect(() => {
    // Add fade animation styles
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth < 640 ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIndex((prev) =>
      Math.min(
        prev,
        Math.max(
          0,
          Math.floor((cateringItems.length - 1) / itemsPerView) * itemsPerView,
        ),
      ),
    );
  }, [cateringItems.length, itemsPerView]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-gray-400 text-sm uppercase tracking-widest animate-pulse">
          Loading catering items...
        </p>
      </div>
    );

  if (error)
    return <p className="text-center py-16 text-red-400 text-sm">{error}</p>;

  const visibleItems = cateringItems.slice(index, index + itemsPerView);
  const canGoBack = index > 0;
  const canGoNext = index + itemsPerView < cateringItems.length;
  const GAP = 32;
  const cardWidth = `calc((100% - ${GAP * (itemsPerView - 1)}px) / ${itemsPerView})`;

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-12">
        <p className="text-amber-500 text-xs uppercase tracking-[0.3em] mb-2 font-medium">
          Freshly Prepared
        </p>
        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-gray-800 font-semibold">
          Our Catering Items
        </h2>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-16 bg-amber-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <div className="h-px w-16 bg-amber-300" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {cateringItems.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-10">
            No items found
          </p>
        ) : (
          <div className="relative">
            {/* Left arrow */}
            {canGoBack && (
              <button
                onClick={() => setIndex((i) => Math.max(0, i - itemsPerView))}
                className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50"
              >
                <ChevronLeft size={16} className="text-gray-600" />
              </button>
            )}

            {/* Visible cards */}
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              style={{ animation: "fadeIn 0.25s ease" }}
            >
              {visibleItems.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-52 sm:h-60 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />

                    {/* Price badge */}
                    {/* <div className="absolute top-4 right-4 bg-amber-500 text-amber-900 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
                      Rs. {item.priceperserving}
                    </div> */}

                    {/* Availability badge */}
                    {!item.status && (
                      <div
                         className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                          item.availability
                             ? "bg-emerald-500 text-white"
                            : "bg-rose-500 text-white"
                        }`}
                      >
                        {item.availability ? "Available" : "Unavailable"}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6 flex flex-col flex-1">
                    {/* Name */}
                    <h3 className="font-cinzel text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                      {item.name}
                    </h3>

                    {/* Amber divider */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-px w-8 bg-amber-400" />
                      <div className="w-1 h-1 rounded-full bg-amber-400" />
                    </div>

                    {/* Ingredients */}
                    <div className="mt-auto pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-medium">
                        Ingredients
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {(Array.isArray(item.ingredients)
                          ? item.ingredients[0].split(",")
                          : []
                        )
                          .slice(0, 2)
                          .map((ing, i) => (
                            <span
                              key={i}
                              className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100"
                            >
                              {ing.trim()}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right arrow */}
            {canGoNext && (
              <button
                onClick={() =>
                  setIndex((i) =>
                    Math.min(
                      cateringItems.length - itemsPerView,
                      i + itemsPerView,
                    ),
                  )
                }
                className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50"
              >
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            )}

            {/* Page dots */}
            {cateringItems.length > itemsPerView && (
              <div className="flex justify-center gap-1.5 mt-6">
                {Array.from({
                  length: Math.ceil(cateringItems.length / itemsPerView),
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
      </div>
    </section>
  );
};

export default CateringItemCard;
