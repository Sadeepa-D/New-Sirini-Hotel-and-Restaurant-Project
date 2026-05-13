import React, { useState } from "react";
import toast from "react-hot-toast";

export default function RestaurantCard({ item, itemsPerView, onOrder }) {
  const [selectedPortion, setSelectedPortion] = useState("Normal");

  const widthPercentage = 100 / itemsPerView;
  const gap = itemsPerView === 1 ? 16 : 24;
  const width = `calc(${widthPercentage}% - ${(gap * (itemsPerView - 1)) / itemsPerView}px)`;

  const handleAddClick = () => {
    onOrder(item, selectedPortion);
  };

  return (
    <div
      className="flex-shrink-0"
      style={{
        width,
      }}>
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

          <div className="flex flex-col gap-2 mb-4">
            {item.has_portions ? (
              <select
                value={selectedPortion}
                onChange={(e) => setSelectedPortion(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 text-neutral-800 text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-amber-500 transition-all font-semibold appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234b5563'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
              >
                <option value="Normal">Normal - LKR {item.normal_price}</option>
                <option value="Full">Full - LKR {item.full_price}</option>
              </select>
            ) : (
              <div className="bg-neutral-50 rounded-xl px-3 py-2.5 border border-neutral-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-600 uppercase tracking-wider">Price</span>
                <span className="text-amber-600 font-bold">
                  LKR {item.normal_price}
                </span>
              </div>
            )}
          </div>

          <div className="mt-auto flex justify-center">
            <button
              onClick={handleAddClick}
              disabled={item.availability === false}
              className={`w-[60%] mx-auto py-2.5 text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-sm hover:shadow-md ${
                item.availability !== false
                  ? "bg-amber-600 hover:bg-amber-700"
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
