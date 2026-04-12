import React, { useState } from "react";
import { Camera, Music, Sparkles, Phone, Tag, User } from "lucide-react";
import AdvertisementCard from "./AdvertisementCard";

const dummyAds = [
  {
    _id: "1",
    category: "Photography",
    name: "Lens & Light Studio",
    price: 25000,
    contact: "077 123 4567",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&auto=format&fit=crop",
  },
  {
    _id: "2",
    category: "Photography",
    name: "Golden Moments Photography",
    price: 18000,
    contact: "076 234 5678",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop",
  },
  {
    _id: "3",
    category: "Audio & Musical",
    name: "SoundWave Events",
    price: 35000,
    contact: "071 345 6789",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop",
  },
  {
    _id: "4",
    category: "Audio & Musical",
    name: "Harmony Band",
    price: 45000,
    contact: "078 456 7890",
    image:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop",
  },
  {
    _id: "5",
    category: "Decoration",
    name: "Bloom & Drape Decor",
    price: 30000,
    contact: "072 567 8901",
    image:
      "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&auto=format&fit=crop",
  },
  {
    _id: "6",
    category: "Decoration",
    name: "Elegant Touch Events",
    price: 22000,
    contact: "075 678 9012",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&auto=format&fit=crop",
  },
];

const categories = [
  { label: "Photography", icon: Camera },
  { label: "Audio & Musical", icon: Music },
  { label: "Decoration", icon: Sparkles },
];

const AdvertisementSection = () => {
  const [activeCategory, setActiveCategory] = useState("Photography");

  const filtered = dummyAds.filter((ad) => ad.category === activeCategory);

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

      {/* Divider with active category label */}
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
    </section>
  );
};

export default AdvertisementSection;
