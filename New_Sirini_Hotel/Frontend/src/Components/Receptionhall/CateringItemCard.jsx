import React, { useState, useEffect } from "react";

const CateringItemCard = () => {
  const [cateringItems, setCateringItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const VITE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCateringItems = async () => {
      try {
        const response = await fetch(
          `${VITE_URL}/api/receptionhall/catering/view`,
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setCateringItems(data.items || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchCateringItems();
  }, []);

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

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cateringItems.map((item) => (
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
              <div className="absolute top-4 right-4 bg-amber-500 text-amber-900 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
                Rs. {item.priceperserving}
              </div>

              {/* Availability badge */}
              {item.availability !== undefined && (
                <div
                  className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full shadow-md ${
                    item.availability
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
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
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(item.ingredients)
                    ? item.ingredients
                    : [item.ingredients]
                  ).map((ing, i) => (
                    <span
                      key={i}
                      className="bg-amber-50 text-amber-800 text-xs px-3 py-1 rounded-full border border-amber-200 font-medium"
                    >
                      ✦ {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CateringItemCard;
