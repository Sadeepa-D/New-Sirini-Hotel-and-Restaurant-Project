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
        setPackages(response.data);
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
    <section className="bg-neutral-50 py-16 px-4 sm:px-6 lg:px-8">
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

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 py-10">
        {packages.map((card, index) => (
          <div
            key={index}
            className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full"
          >
            {/* --- IMAGE SECTION --- */}
            <div className="relative h-72 w-full overflow-hidden">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />

              {/* Soft Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {/* Floating Price Badge (Glassmorphism) */}
              <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white text-sm font-bold px-5 py-2 rounded-2xl border border-white/30 shadow-xl">
                Rs. {card.price.toLocaleString()}
              </div>

              {/* Status Badge */}
              {!card.status && (
                <div
                  className={`absolute top-6 left-6 text-[10px] uppercase tracking-[0.2em] font-black px-4 py-2 rounded-full shadow-lg ${
                    card.status
                      ? "bg-emerald-500 text-white"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {card.status ? "Available" : "Unavailable"}
                </div>
              )}
            </div>

            {/* --- CONTENT SECTION --- */}
            <div className="p-8 flex flex-col flex-1 bg-white">
              {/* Title & Decorative Divider */}
              <div className="mb-6">
                <h3 className="font-cinzel text-2xl lg:text-3xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                  {card.name}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="h-[3px] w-12 bg-amber-400 rounded-full" />
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-500 font-cormorant text-xl italic leading-relaxed mb-8">
                "{card.description}"
              </p>

              {/* Features Chips */}
              {card.features && card.features.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 size={14} className="text-amber-500" />
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">
                      Premium Inclusions
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {card.features[0]
                      .split(",")
                      .slice(0, 3)
                      .map((f, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-neutral-50 text-neutral-600 px-4 py-2 rounded-xl border border-neutral-100 font-semibold hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-all cursor-default"
                        >
                          {f.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* --- FOOTER SECTION --- */}
              <div className="mt-auto pt-8 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-100 rounded-xl text-amber-700">
                    <Users size={20} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                      Capacity
                    </span>
                    <span className="text-sm font-black text-gray-800">
                      {card.seatings} Guests
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
