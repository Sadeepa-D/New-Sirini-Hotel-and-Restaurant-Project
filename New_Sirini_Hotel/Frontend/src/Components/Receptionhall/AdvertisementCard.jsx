import React from "react";
import { Phone, User } from "lucide-react";

const AdvertisementCard = ({ ad }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col">
      {/* Image */}
      <div className="relative h-52 sm:h-60 w-full overflow-hidden">
        <img
          src={ad.image}
          alt={ad.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />

        {/* Price badge */}
        <div className="absolute top-4 right-4 bg-amber-500 text-amber-900 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
          Rs. {ad.price.toLocaleString()}
        </div>

        {/* Category badge */}
        <div className="absolute top-4 left-4 bg-white/90 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
          {ad.category}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3 sm:px-5 sm:py-4 flex flex-col flex-1">
        {/* Name */}
        <div className="flex items-start gap-2 mb-2">
          <User size={15} className="text-amber-500 mt-0.5 shrink-0" />
          <h3 className="font-cinzel text-base sm:text-lg font-semibold text-gray-800 leading-snug">
            {ad.name}
          </h3>
        </div>

        {/* Amber divider */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-8 bg-amber-400" />
          <div className="w-1 h-1 rounded-full bg-amber-400" />
        </div>

        {/* Contact */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-medium">
            Contact
          </p>

          <a
            href={`tel:${ad.contact}`}
            className="flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
          >
            <Phone size={14} />
            {ad.contact}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementCard;
