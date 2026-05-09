import React, { useState } from "react";
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
  Swords,
  TrendingDown,
  Zap,
  Trophy,
} from "lucide-react";

const LiquorComparisonComp = ({ isOpen, onClose, allDrinks }) => {
  const [selectedDrink1, setSelectedDrink1] = useState(null);
  const [selectedDrink2, setSelectedDrink2] = useState(null);

  if (!isOpen) return null;

  const handleSelectDrink1 = (e) => {
    const drink = allDrinks.find((d) => d._id === e.target.value);
    setSelectedDrink1(drink);
  };

  const handleSelectDrink2 = (e) => {
    const drink = allDrinks.find((d) => d._id === e.target.value);
    setSelectedDrink2(drink);
  };

  const StatRow = ({ icon: Icon, iconColor, label, value }) => (
    <div className="flex items-center justify-between px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl">
      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
        <Icon size={13} className={iconColor} />
        {label}
      </div>
      <span className="text-white text-sm font-bold truncate ml-2">
        {value}
      </span>
    </div>
  );

  const ComparisonCard = ({ drink, onSelect, selectedId }) => (
    <div className="flex-1 flex flex-col gap-3">
      {/* Dropdown */}
      <select
        onChange={onSelect}
        value={selectedId || ""}
        className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200 appearance-none cursor-pointer"
      >
        <option value="" className="bg-neutral-900">
          Select a drink…
        </option>
        {allDrinks.map((d) => (
          <option key={d._id} value={d._id} className="bg-neutral-900">
            {d.name}
          </option>
        ))}
      </select>

      {drink ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {/* Image */}
          <div className="relative h-52 overflow-hidden">
            <img
              src={drink.image}
              alt={drink.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Availability */}
            <div className="absolute bottom-3 left-3">
              {drink.isAvailable !== false ? (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-green-500/20 border border-green-500/40 text-green-400 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
                  <CheckCircle2 size={10} /> Available
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-red-500/20 border border-red-500/40 text-red-400 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
                  <XCircle size={10} /> Unavailable
                </span>
              )}
            </div>

            {/* Category */}
            <div className="absolute top-3 left-3">
              <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
                <Wine size={10} /> {drink.category}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 flex flex-col gap-3">
            <h3 className="text-white font-serif text-lg font-bold leading-tight">
              {drink.name}
            </h3>

            <div className="flex flex-col gap-2">
              {/* Price */}
              <div className="flex items-center justify-between px-3 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <BadgeDollarSign size={13} className="text-amber-400" />
                  Price
                </div>
                <span className="text-amber-400 text-base font-bold">
                  RS:{drink.price}
                </span>
              </div>

              <StatRow
                icon={Percent}
                iconColor="text-purple-400"
                label="Alcohol %"
                value={`${drink.alcoholPercentage}%`}
              />
              <StatRow
                icon={FlaskConical}
                iconColor="text-blue-400"
                label="Volume"
                value={drink.volume}
              />
              {drink.origin && (
                <StatRow
                  icon={Globe}
                  iconColor="text-green-400"
                  label="Origin"
                  value={drink.origin}
                />
              )}
              {drink.brand && (
                <StatRow
                  icon={Tag}
                  iconColor="text-pink-400"
                  label="Brand"
                  value={drink.brand}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 border-2 border-dashed border-white/15 rounded-2xl h-80 flex flex-col items-center justify-center gap-3">
          <Wine size={32} className="text-white/20" />
          <p className="text-gray-500 text-sm text-center">
            Select a drink to compare
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/15 border border-amber-500/25 rounded-xl">
              <Swords size={18} className="text-amber-400" />
            </div>
            <h2 className="text-white text-xl font-bold tracking-wide">
              Compare Drinks
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-red-500/80 border border-white/15 text-white rounded-full transition-all duration-200 hover:scale-110"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {/* Two cards */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <ComparisonCard
              drink={selectedDrink1}
              onSelect={handleSelectDrink1}
              selectedId={selectedDrink1?._id}
            />

            {/* VS divider */}
            <div className="flex md:flex-col items-center justify-center gap-2 shrink-0">
              <div className="w-px h-full md:w-full md:h-px bg-white/10 hidden md:block" />
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-black font-black text-sm shadow-lg shadow-amber-500/30 shrink-0">
                VS
              </div>
              <div className="w-px h-full md:w-full md:h-px bg-white/10 hidden md:block" />
            </div>

            <ComparisonCard
              drink={selectedDrink2}
              onSelect={handleSelectDrink2}
              selectedId={selectedDrink2?._id}
            />
          </div>

          {/* Summary panel */}
          {selectedDrink1 && selectedDrink2 && (
            <div className="bg-white/5 border border-amber-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy size={16} className="text-amber-400" />
                <h3 className="text-white font-bold text-sm uppercase tracking-widest">
                  Comparison Summary
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Price diff */}
                <div className="text-center p-4 bg-white/5 border border-white/10 rounded-xl">
                  <TrendingDown
                    size={18}
                    className="text-amber-400 mx-auto mb-2"
                  />
                  <p className="text-gray-400 text-xs mb-1">Price Difference</p>
                  <p className="text-amber-400 text-2xl font-bold">
                    RS:
                    {Math.abs(
                      selectedDrink1.price - selectedDrink2.price,
                    ).toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {selectedDrink1.price < selectedDrink2.price
                      ? `${selectedDrink1.name} is cheaper`
                      : selectedDrink1.price > selectedDrink2.price
                        ? `${selectedDrink2.name} is cheaper`
                        : "Same price"}
                  </p>
                </div>

                {/* ABV diff */}
                <div className="text-center p-4 bg-white/5 border border-white/10 rounded-xl">
                  <Zap size={18} className="text-purple-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-xs mb-1">
                    Alcohol % Difference
                  </p>
                  <p className="text-amber-400 text-2xl font-bold">
                    {Math.abs(
                      selectedDrink1.alcoholPercentage -
                        selectedDrink2.alcoholPercentage,
                    ).toFixed(1)}
                    %
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {selectedDrink1.alcoholPercentage >
                    selectedDrink2.alcoholPercentage
                      ? `${selectedDrink1.name} is stronger`
                      : selectedDrink1.alcoholPercentage <
                          selectedDrink2.alcoholPercentage
                        ? `${selectedDrink2.name} is stronger`
                        : "Same strength"}
                  </p>
                </div>

                {/* Best value */}
                <div className="text-center p-4 bg-white/5 border border-white/10 rounded-xl">
                  <Trophy size={18} className="text-yellow-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-xs mb-1">Best Value</p>
                  <p className="text-amber-400 text-lg font-bold leading-tight">
                    {selectedDrink1.price / selectedDrink1.alcoholPercentage <
                    selectedDrink2.price / selectedDrink2.alcoholPercentage
                      ? selectedDrink1.name
                      : selectedDrink2.name}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Based on price per alcohol %
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiquorComparisonComp;
