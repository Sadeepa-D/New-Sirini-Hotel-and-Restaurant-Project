import React, { useState } from "react";
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
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 group cursor-pointer flex flex-col justify-between min-h-[200px] ${
        isSelected
          ? "border-amber-500 shadow-xl shadow-amber-500/30 scale-[0.98]"
          : "border-gray-200 hover:border-amber-400 hover:-translate-y-1 shadow-md hover:shadow-xl"
      }`}
    >
      {/* Full Background Image */}
      <img
        src={
          item.image ||
          "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?q=80&w=600"
        }
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
        <span className="text-[10px] uppercase font-black tracking-widest bg-black/40 backdrop-blur-sm text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/30">
          {item.brand || "Premium"}
        </span>
        <div className="flex flex-col items-end bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
          <span className="text-[9px] text-gray-300 font-bold uppercase tracking-wider">
            Stock
          </span>
          <span
            className={`text-sm font-black leading-tight ${
              item.currentQuantity <= item.lowStockThreshold
                ? "text-red-400"
                : "text-emerald-400"
            }`}
          >
            {item.currentQuantity} btls
          </span>
        </div>
      </div>

      {/* Bottom Section: Title and Action */}
      <div className="relative z-10 w-full p-4 pt-2">
        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-0.5">
          {item.volume}
        </p>
        <h4 className="text-sm font-black text-white leading-tight mb-3 tracking-wide truncate drop-shadow">
          {item.name}
        </h4>

        <div className="flex items-center justify-between pt-3 border-t border-white/15">
          <span className="text-xs font-bold text-gray-200">
            LKR {item.sellingPrice}
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

const LiquorInventory = () => {
  const [activeCategoryTab, setActiveCategoryTab] = useState("Beer");
  const [selectedItem, setSelectedItem] = useState(null);
  const [adjustQty, setAdjustQty] = useState(0);

  // Hardcoded mock representation for inventory items view array
  const [mockItems, setMockItems] = useState([
    {
      _id: "1",
      name: "Lion Stout",
      category: "Beer",
      currentQuantity: 45,
      lowStockThreshold: 15,
      sellingPrice: 480,
      volume: "625ml",
      brand: "Lion",
      image:
        "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=400",
    },
    {
      _id: "2",
      name: "Corona Extra",
      category: "Beer",
      currentQuantity: 12,
      lowStockThreshold: 15,
      sellingPrice: 850,
      volume: "355ml",
      brand: "Corona",
      image:
        "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?q=80&w=400",
    },
    {
      _id: "3",
      name: "Heineken Premium",
      category: "Beer",
      currentQuantity: 89,
      lowStockThreshold: 20,
      sellingPrice: 650,
      volume: "330ml",
      brand: "Heineken",
      image:
        "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?q=80&w=400",
    },
    {
      _id: "4",
      name: "Rockland Red Rum",
      category: "Other",
      currentQuantity: 24,
      lowStockThreshold: 8,
      sellingPrice: 3200,
      volume: "750ml",
      brand: "Rockland",
      image:
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400",
    },
    {
      _id: "5",
      name: "V領 Old Arrack",
      category: "Other",
      currentQuantity: 5,
      lowStockThreshold: 10,
      sellingPrice: 2800,
      volume: "750ml",
      brand: "DCSL",
      image:
        "https://images.unsplash.com/photo-1527281400828-ac737c95047a?q=80&w=400",
    },
  ]);

  const filteredItems = mockItems.filter((item) =>
    activeCategoryTab === "Beer"
      ? item.category === "Beer"
      : item.category !== "Beer",
  );

  const handleApplyUpdate = () => {
    if (!selectedItem) return;
    setMockItems((prev) =>
      prev.map((img) => {
        if (img._id === selectedItem._id) {
          return {
            ...img,
            currentQuantity: Math.max(0, img.currentQuantity + adjustQty),
          };
        }
        return img;
      }),
    );
    toast.success("Stock updated locally!");
    setAdjustQty(0);
    setSelectedItem(null);
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
              Real-time barrel conversions &amp; inventory levels
            </p>
          </div>
        </div>

        {/* Global Structural Layout Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* LEFT/MAIN CONTAINER: Category & Explorer Panel */}
          <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xl flex flex-col gap-6">

            {/* Category Tab Layout & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              {/* Tabs */}
              <div className="bg-gray-50 p-1.5 rounded-xl flex gap-1 border border-gray-200 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setActiveCategoryTab("Beer");
                    setSelectedItem(null);
                  }}
                  className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
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
                  className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
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
              <div className="relative w-full sm:w-64">
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

            {/* Liquor Brand Cards Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <LiquorInventoryCard
                  key={item._id}
                  item={item}
                  onSelect={setSelectedItem}
                  isSelected={selectedItem?._id === item._id}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                Showing {filteredItems.length} Brands
              </p>
              <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-200">
                <button className="p-2 text-gray-400 hover:text-neutral-900 rounded-lg hover:bg-white transition-all">
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-black px-3 text-amber-500">
                  1
                </span>
                <button className="p-2 text-gray-400 hover:text-neutral-900 rounded-lg hover:bg-white transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR PANEL: Quick Stock Adjustments */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xl flex flex-col gap-6 lg:sticky lg:top-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <PackageCheck size={18} className="text-amber-500 shrink-0" />
              <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wide">
                Quick Stock Adjuster
              </h3>
            </div>

            {selectedItem ? (
              <div className="flex flex-col gap-5">
                {/* Selected Item Details */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center gap-4">
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
                      Current Base:{" "}
                      <span className="text-neutral-900 font-bold">
                        {selectedItem.currentQuantity} Bottles
                      </span>
                    </p>
                  </div>
                </div>

                {/* Quantity Adjuster */}
                <div className="flex flex-col items-center gap-3 bg-gray-50 p-5 rounded-xl border border-gray-200">
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
                      className={`w-16 text-2xl font-black text-center tracking-tight bg-transparent border-b-2 outline-none transition-colors appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
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
