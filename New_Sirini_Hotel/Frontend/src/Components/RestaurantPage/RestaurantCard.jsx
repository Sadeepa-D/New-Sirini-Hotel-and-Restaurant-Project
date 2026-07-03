import React, { useState } from "react";
import toast from "react-hot-toast";

export default function RestaurantCard({
  item,
  itemsPerView,
  onOrder,
  isLoading,
}) {
  const [selectedPortion, setSelectedPortion] = useState("Normal");

  const widthPercentage = 100 / itemsPerView;
  const gap = itemsPerView === 1 ? 16 : 24;
  const width = `calc(${widthPercentage}% - ${(gap * (itemsPerView - 1)) / itemsPerView}px)`;

  if (isLoading) {
    return (
      <div
        className="flex-shrink-0 h-full animate-pulse"
        style={{
          width,
        }}
      >
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-100 h-full flex flex-col hover:shadow-lg transition-shadow">
          {/* Image Skeleton */}
          <div className="relative h-48 bg-neutral-200"></div>

          {/* Body Skeleton */}
          <div className="p-4 flex-grow flex flex-col justify-between">
            <div className="text-center mb-3">
              {/* Title Skeleton */}
              <div className="h-6 bg-neutral-200 rounded-md mx-auto w-3/4 mb-3"></div>
              {/* Divider Skeleton */}
              <div className="w-12 h-[2px] bg-neutral-200 mx-auto rounded-full mt-2 mb-2"></div>
              {/* Description Skeleton */}
              <div className="h-4 bg-neutral-200 rounded-md mx-auto w-5/6 mb-2"></div>
              <div className="h-4 bg-neutral-200 rounded-md mx-auto w-2/3"></div>
            </div>

            {/* Pricing Section Skeleton */}
            <div className="bg-neutral-50 rounded-xl px-4 py-3 border border-neutral-100 flex flex-col gap-2 mt-auto">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-neutral-300 tracking-wider">
                  Pricing
                </span>
              </div>
              <div className="h-6 bg-neutral-200 rounded-md w-full mt-1"></div>
            </div>

            {/* Button Skeleton */}
            <div className="mt-auto pt-6 flex justify-center">
              <div className="h-10 bg-neutral-200 w-[60%]" style={{ borderRadius: "10px" }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddClick = () => {
    onOrder(item, selectedPortion);
  };

  return (
    <div
      className="flex-shrink-0 h-full"
      style={{
        width,
      }}
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-100 h-full flex flex-col hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <div className="text-center mb-3">
            <h4
              className="text-[1.45rem] font-extrabold tracking-tight text-neutral-900 leading-snug"
              style={{ fontFamily: "serif" }}
            >
              {item.name}
            </h4>

            <div className="w-12 h-[2px] bg-amber-500 mx-auto rounded-full mt-2 mb-2"></div>

            <p className="text-[13px] text-neutral-500 leading-relaxed px-1 line-clamp-2">
              {item.description}
            </p>
          </div>

          <div className="bg-neutral-50 rounded-xl px-4 py-3 border border-neutral-100 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-neutral-400 tracking-wider">
                Pricing
              </span>
            </div>

            {!item.has_portions ? (
              /* Only Normal available */
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 font-semibold text-sm">
                  Normal Price:
                </span>
                <span className="text-amber-600 font-black text-lg">
                  LKR {item.normal_price}
                </span>
              </div>
            ) : (
              <select
                value={selectedPortion}
                onChange={(e) => setSelectedPortion(e.target.value)}
                className="w-full mt-2 bg-white border border-neutral-200 text-neutral-800 text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 transition-all font-bold appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234b5563'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1rem",
                }}
              >
                <option value="Normal">Normal – LKR {item.normal_price}</option>
                <option value="Full">Full – LKR {item.full_price}</option>
              </select>
            )}
          </div>

          <div className="mt-auto pt-6 flex justify-center">
            <button
              onClick={handleAddClick}
              disabled={item.availability === false}
              style={{ borderRadius: "10px" }}
              className={`w-[60%] mx-auto py-2.5 text-white text-sm font-semibold transition-all duration-500 transform shadow-sm hover:shadow-md ${
                item.availability !== false
                  ? "bg-amber-600 hover:bg-amber-700 hover:scale-105 active:scale-95"
                  : "bg-gray-400 cursor-not-allowed opacity-70"
              }`}
            >
              {item.availability !== false ? "Add To Cart" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
