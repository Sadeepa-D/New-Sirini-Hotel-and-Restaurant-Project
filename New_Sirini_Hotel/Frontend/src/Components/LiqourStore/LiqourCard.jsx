import React from "react";
import { Percent, BadgeDollarSign, CheckCircle2, XCircle, Wine } from "lucide-react";

const DrinkCard = ({ drink, onClick }) => {
  return (
    <div
      onClick={() => onClick(drink)}
      className={`group relative w-full h-[360px] rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-all duration-400 hover:scale-[1.03] hover:shadow-2xl hover:shadow-amber-500/20 ${
        !drink.isAvailable ? "grayscale opacity-70" : ""
      }`}
    >
      {/* ── Background Image ── */}
      <img
        src={drink.image}
        alt={drink.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
      />

      {/* ── Dark gradient overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* ── Availability badge (top-right) ── */}
      <div className="absolute top-3 right-3 z-10">
        {drink.isAvailable !== false ? (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-green-500/20 border border-green-500/40 text-green-400 rounded-full text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm">
            <CheckCircle2 size={11} />
            Available
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-red-500/20 border border-red-500/40 text-red-400 rounded-full text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm">
            <XCircle size={11} />
            Unavailable
          </span>
        )}
      </div>

      {/* ── Wine icon badge (top-left) ── */}
      <div className="absolute top-3 left-3 z-10 p-2 bg-amber-500/20 border border-amber-500/30 rounded-xl backdrop-blur-sm">
        <Wine size={16} className="text-amber-400" />
      </div>

      {/* ── Bottom content panel ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4 pt-3">
        {/* Name pill */}
        <div className="mb-3">
          <h3 className="text-white font-serif text-lg font-bold leading-tight tracking-wide drop-shadow-lg line-clamp-1">
            {drink.name}
          </h3>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between gap-2">
          {/* ABV */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 rounded-xl backdrop-blur-sm">
            <Percent size={13} className="text-amber-400 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 leading-none mb-0.5">ABV</p>
              <p className="text-white text-sm font-bold leading-none">{drink.alcoholPercentage}%</p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-500/25 rounded-xl backdrop-blur-sm">
            <BadgeDollarSign size={13} className="text-amber-400 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 leading-none mb-0.5">Price</p>
              <p className="text-amber-400 text-sm font-bold leading-none">LKR {drink.price}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrinkCard;
