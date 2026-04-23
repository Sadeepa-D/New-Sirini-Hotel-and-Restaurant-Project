import React, { useState, useEffect } from "react";
import { Users, ArrowRight, CheckCircle2 } from "lucide-react";
import axios from "axios";

export default function ReceptionHallPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const VITE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchoccasionpackages = async () => {
      try {
        const response = await axios.get(
          `${VITE_URL}/api/receptionhall/package/view`,
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch data");
        }
        setPackages(Array.isArray(response.data) ? response.data : response.data.packages || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchoccasionpackages();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-gray-400 text-sm uppercase tracking-widest animate-pulse">
          Loading packages...
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
          Tailored For You
        </p>
        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-gray-800 font-semibold">
          Our Packages
        </h2>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-16 bg-amber-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <div className="h-px w-16 bg-amber-300" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((card, index) => (
          <div
            key={index}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col"
          >
            {/* --- IMAGE SECTION --- */}
            <div className="relative h-52 sm:h-60 w-full overflow-hidden">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />

              {/* Price Badge */}
              <div className="absolute top-4 right-4 bg-amber-500 text-amber-900 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
                Rs. {card.price.toLocaleString()}
              </div>

              {/* Status Badge */}
              {!card.status && (
                <div
                  className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full shadow-md ${
                    card.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {card.status ? "Available" : "Unavailable"}
                </div>
              )}
            </div>

            {/* --- CONTENT SECTION --- */}
            <div className="p-4 sm:p-6 flex flex-col flex-1">
              {/* Title */}
              <h3 className="font-cinzel text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                {card.name}
              </h3>

              {/* Amber divider */}
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-amber-400" />
                <div className="w-1 h-1 rounded-full bg-amber-400" />
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {card.description}
              </p>

              {/* Features Chips */}
              {card.features && card.features.length > 0 && (
                <div className="mt-auto pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-medium">
                    Inclusions
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {card.features[0]
                      .split(",")
                      .slice(0, 2)
                      .map((f, i) => (
                        <span
                          key={i}
                          className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100"
                        >
                          {f.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
