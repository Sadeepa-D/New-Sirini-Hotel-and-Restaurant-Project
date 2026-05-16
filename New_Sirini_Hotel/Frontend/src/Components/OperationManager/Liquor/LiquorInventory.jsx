import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Wine,
  Beer,
  Layers,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  RefreshCw,
  Search,
  PackageCheck,
} from "lucide-react";

const LiquorInventoryCard = ({ item, onSelect, isSelected }) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 group cursor-pointer flex flex-col justify-between min-h-80 ${
        isSelected
          ? "border-2 border-amber-500 shadow-lg scale-[0.98]"
          : "border-gray-200 hover:border-amber-400 hover:-translate-y-1 shadow-md hover:shadow-xl"
      }`}
    >
      {/* Full Background Image */}
      <img
        src={item.image}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/10" />

      {/* Selected ring highlight */}
      {isSelected && (
        <div className="absolute inset-0 ring-2 ring-amber-500 ring-inset rounded-2xl pointer-events-none" />
      )}

      {/* Top Section: Badges / Current Stock */}
      <div className="relative z-10 flex items-start justify-between w-full p-4">
        <span className="text-[12px] uppercase font-black tracking-widest bg-black/40 backdrop-blur-sm text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/30">
          {item.brand}
        </span>
        <div className="flex flex-col items-end bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
          <span className="text-[12px] text-gray-300 font-bold uppercase tracking-wider">
            Stock
          </span>
          <span
            className={`text-sm font-black leading-tight ${
              item.currentQuantityInBottles <= item.lowStockThreshold
                ? "text-red-400"
                : "text-emerald-400"
            }`}
          >
            {item.currentQuantityInBottles} btls
          </span>
        </div>
      </div>

      {/* Bottom Section: Title and Action */}
      <div className="relative z-10 w-full p-4 pt-2">
        <p className="text-[13px] font-bold text-amber-400 uppercase tracking-wider mb-0.5">
          {item.volume}
        </p>
        <h4 className="text-sm font-black text-white leading-tight mb-3 tracking-wide truncate drop-shadow">
          {item.name}
        </h4>

        <div className="flex items-center justify-between pt-3 border-t border-white/15">
          <span className="text-[15px] font-bold text-gray-200">
            LKR {item.price}
          </span>
          <div className="bg-amber-500 text-black p-2 rounded-xl group-hover:bg-orange-500 transition-colors shadow-md">
            <RefreshCw
              size={14}
              strokeWidth={3}
              className="group-hover:rotate-45 transition-transform"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const LiquorInventory = ({
  liquorItems = [],
  fetchLiquorItems,
  toogleavailability,
}) => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [activeCategoryTab, setActiveCategoryTab] = useState("Beer");
  const [selectedItem, setSelectedItem] = useState(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const sliderRef = useRef(null);

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;
    const cardWidth =
      sliderRef.current.querySelector("[data-slider-card]")?.offsetWidth || 320;
    sliderRef.current.scrollBy({
      left: direction * (cardWidth + 16),
      behavior: "smooth",
    });
  };

  const filteredItems = liquorItems.filter((item) =>
    activeCategoryTab === "Beer"
      ? item.category === "Beer"
      : item.category !== "Beer",
  );

  const handleApplyUpdate = async () => {
    if (!selectedItem || adjustQty === 0) {
      toast.error("Please specify a valid quantity change first");
      return;
    }

    const absoluteQty = Math.abs(adjustQty);

    if (adjustQty > 0) {
      await increaseLiquorInventory(selectedItem._id, absoluteQty);
    } else {
      if (selectedItem.currentQuantityInBottles + adjustQty < 0) {
        toast.error(
          `Cannot decrease past 0. Current stock is only ${selectedItem.currentQuantityInBottles} bottles.`,
        );
        return;
      }
      await decreaseLiquorInventory(selectedItem._id, absoluteQty);
    }
    setAdjustQty(0);
    setSelectedItem(null);
    if (
      selectedItem.currentQuantityInBottles <= selectedItem.lowStockThreshold
    ) {
      toogleavailability(selectedItem._id);
    }
    fetchLiquorItems();
  };

  const increaseLiquorInventory = async (id, quantity) => {
    const loadingtoast = toast.loading("Updating inventory, please wait...");
    try {
      const response = await axios.put(
        `${VITE_URL}/api/liquor/increaseinventory/`,
        {
          id,
          quantity,
        },
      );
      if (response.status === 200) {
        toast.dismiss(loadingtoast);
        toast.success("Liquor inventory increased successfully");
      } else {
        toast.dismiss(loadingtoast);
        toast.error("Failed to increase liquor inventory");
      }
    } catch (error) {
      toast.dismiss(loadingtoast);
      console.error("Error increasing liquor inventory:", error);
    }
  };

  const decreaseLiquorInventory = async (id, quantity) => {
    const loadingtoast = toast.loading("Updating inventory, please wait...");
    try {
      const response = await axios.put(
        `${VITE_URL}/api/liquor/decreaseinventory/`,
        {
          id,
          quantity,
        },
      );
      if (response.status === 200) {
        toast.dismiss(loadingtoast);
        toast.success("Liquor inventory decreased successfully");
      } else {
        toast.dismiss(loadingtoast);
        toast.error("Failed to decrease liquor inventory");
      }
    } catch (error) {
      toast.dismiss(loadingtoast);
      console.error("Error decreasing liquor inventory:", error);
    }
  };

  return (
    <div className="mt-8 w-full">
      <div className="w-full flex flex-col gap-6">
        {/* Header Title Section */}
        <div className="bg-white rounded-xl p-4 shadow-xl border border-gray-100 flex items-center gap-3">
          <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-500 shrink-0">
            <Wine size={22} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black tracking-wide text-neutral-900">
              Liquor Stock Management
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Real-time inventory &amp; stock adjustments
            </p>
          </div>
        </div>

        {/* Global Structural Layout Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* LEFT/MAIN CONTAINER: Category & Explorer Panel */}
          <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xl flex flex-col gap-6 lg:self-start">
            {/* Category Tab Layout & Search */}
            <div className="flex overflow-x-auto gap-3 border-b border-gray-100 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] sm:overflow-visible sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              {/* Tabs */}
              <div className="bg-gray-50 p-1.5 rounded-xl flex gap-1 border border-gray-200 shrink-0 sm:shrink sm:w-auto">
                <button
                  onClick={() => {
                    setActiveCategoryTab("Beer");
                    setSelectedItem(null);
                  }}
                  className={`flex items-center justify-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                    activeCategoryTab === "Beer"
                      ? "bg-yellow-500 text-black shadow-md"
                      : "text-gray-500 hover:text-neutral-900 hover:bg-white"
                  }`}
                >
                  <Beer size={14} />
                  Beer
                </button>
                <button
                  onClick={() => {
                    setActiveCategoryTab("Other");
                    setSelectedItem(null);
                  }}
                  className={`flex items-center justify-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                    activeCategoryTab === "Other"
                      ? "bg-yellow-500 text-black shadow-md"
                      : "text-gray-500 hover:text-neutral-900 hover:bg-white"
                  }`}
                >
                  <Layers size={14} />
                  Other Liquors
                </button>
              </div>

              {/* Search */}
              <div className="relative shrink-0 w-56 sm:w-64 sm:shrink">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Filter stock selection..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#FFAB00] text-neutral-800 transition-all"
                />
              </div>
            </div>

            {/* Liquor Brand Cards Slider */}
            <div className="relative">
              {/* Prev Button — desktop only */}
              <button
                onClick={() => scrollSlider(-1)}
                aria-label="Scroll left"
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg text-gray-600 hover:text-amber-500 hover:border-amber-400 hover:shadow-amber-100 transition-all active:scale-90"
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
              </button>

              {/* Scroll container */}
              <div
                ref={sliderRef}
                className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1"
              >
                {filteredItems.length === 0 ? (
                  <div className="w-full flex items-center justify-center py-12">
                    <p className="text-sm text-gray-400">No items found.</p>
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item._id}
                      data-slider-card
                      className="w-full shrink-0 snap-start md:w-[calc(33.333%-11px)]"
                    >
                      <LiquorInventoryCard
                        item={item}
                        onSelect={setSelectedItem}
                        isSelected={selectedItem?._id === item._id}
                      />
                    </div>
                  ))
                )}
              </div>

              {/* Next Button — desktop only */}
              <button
                onClick={() => scrollSlider(1)}
                aria-label="Scroll right"
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg text-gray-600 hover:text-amber-500 hover:border-amber-400 hover:shadow-amber-100 transition-all active:scale-90"
              >
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>

              {/* Mobile dot / swipe hint */}
              <p className="mt-2 text-center text-[10px] text-gray-400 font-medium tracking-wider md:hidden">
                ← Swipe to browse inventory →
              </p>
            </div>
          </div>

          {/* RIGHT SIDEBAR PANEL: Quick Stock Adjustments */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xl flex flex-col gap-4 h-full">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <PackageCheck size={18} className="text-amber-500 shrink-0" />
              <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wide">
                Quick Stock Adjuster
              </h3>
            </div>

            {selectedItem ? (
              <div className="flex flex-col gap-3">
                {/* Selected Item Details */}
                <div className="h-28 bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center gap-4">
                  <img
                    src={selectedItem.image}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200 shadow-sm shrink-0"
                    alt="Active"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-amber-500 tracking-wider font-bold uppercase">
                      {selectedItem.brand}
                    </p>
                    <h4 className="text-sm font-black text-neutral-900 truncate leading-tight mt-0.5">
                      {selectedItem.name}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      Current Base:
                      <span className="text-neutral-900 font-bold">
                        {selectedItem.currentQuantityInBottles} Bottles
                      </span>
                    </p>
                  </div>
                </div>

                {/* Quantity Adjuster */}
                <div className="flex flex-col items-center gap-1.5 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    Adjust Quantity Offset
                  </span>
                  <div className="flex items-center gap-6 mt-1">
                    <button
                      onClick={() => setAdjustQty((p) => p - 1)}
                      className="p-3 bg-white text-neutral-900 hover:text-red-500 rounded-xl border border-gray-200 transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    >
                      <Minus size={18} strokeWidth={3} />
                    </button>
                    <input
                      type="number"
                      value={adjustQty}
                      onChange={(e) => setAdjustQty(Number(e.target.value))}
                      className={`w-16 h-11 text-2xl font-black text-center tracking-tight bg-transparent border-b-2 outline-none transition-colors appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                        adjustQty > 0
                          ? "text-green-600 border-green-400"
                          : adjustQty < 0
                            ? "text-red-500 border-red-400"
                            : "text-neutral-900 border-gray-300"
                      }`}
                    />
                    <button
                      onClick={() => setAdjustQty((p) => p + 1)}
                      className="p-3 bg-white text-neutral-900 hover:text-green-600 rounded-xl border border-gray-200 transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    >
                      <Plus size={18} strokeWidth={3} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 italic mt-1 text-center">
                    Calculates offset adjustments on primary warehouse database
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleApplyUpdate}
                  className="w-full bg-yellow-500 hover:bg-orange-500 active:scale-[0.98] transition-all text-black font-black py-3.5 rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-amber-500/20"
                >
                  Confirm &amp; Update Stock
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 px-4">
                <div className="p-3 bg-white text-gray-400 rounded-xl mb-3 border border-gray-200 shadow-sm">
                  <RefreshCw size={24} />
                </div>
                <h4 className="text-sm font-bold text-neutral-700">
                  No Brand Selected
                </h4>
                <p className="text-xs text-gray-400 max-w-50 mt-1 leading-normal">
                  Tap an inventory asset card on the left container to execute
                  fast adjustments.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquorInventory;
