import React from "react";
import {
  X,
  Wine,
  BadgeDollarSign,
  Percent,
  FlaskConical,
  Globe,
  Tag,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const LiquorDetailsComp = ({ drink, isOpen, onClose }) => {
  if (!isOpen || !drink) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Close button ── */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-red-500/80 border border-white/15 text-white rounded-full transition-all duration-200 hover:scale-110"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* ── Left: Image ── */}
          <div className="relative h-64 md:h-full min-h-[260px] rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden">
            <img
              src={drink.image}
              alt={drink.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent md:bg-gradient-to-r" />

            {/* Availability badge on image */}
            <div className="absolute bottom-4 left-4">
              {drink.isAvailable !== false ? (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/40 text-green-400 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                  <CheckCircle2 size={12} />
                  Available
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 border border-red-500/40 text-red-400 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                  <XCircle size={12} />
                  Unavailable
                </span>
              )}
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div className="flex flex-col p-6 gap-4">
            {/* Category pill */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full">
                <Wine size={13} className="text-amber-400" />
                <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
                  {drink.category}
                </span>
              </div>
            </div>

            {/* Name */}
            <div>
              <h2 className="text-white font-serif text-2xl font-bold leading-tight mb-2">
                {drink.name}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                {drink.description ||
                  "Premium quality drink crafted with the finest ingredients."}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Price */}
              <div className="col-span-2 flex items-center justify-between px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <BadgeDollarSign size={15} className="text-amber-400" />
                  Price
                </div>
                <span className="text-amber-400 text-xl font-bold">
                  LKR {drink.price}
                </span>
              </div>

              {/* ABV */}
              <div className="flex items-center justify-between px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <Percent size={13} className="text-purple-400" />
                  ABV:
                </div>
                <span className="text-white text-sm font-bold">
                  {drink.alcoholPercentage}%
                </span>
              </div>

              {/* Volume */}
              <div className="flex items-center justify-between px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <FlaskConical size={13} className="text-blue-400" />
                  Vol:
                </div>
                <span className="text-white text-sm font-bold">
                  {drink.volume}
                </span>
              </div>

              {/* Origin (conditional) */}
              {drink.origin && (
                <div className="flex items-center justify-between px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                    <Globe size={13} className="text-green-400" />
                  </div>
                  <span
                    className="text-white text-sm truncate font-bold"
                    title={drink.origin}
                  >
                    {drink.origin}
                  </span>
                </div>
              )}

              {/* Brand (conditional) */}
              {drink.brand && (
                <div className="flex items-center justify-between px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                    <Tag size={13} className="text-pink-400" />
                  </div>
                  <span
                    className="text-white text-sm font-bold text-right truncate ml-2"
                    title={drink.brand}
                  >
                    {drink.brand}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquorDetailsComp;
