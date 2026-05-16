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

            <div className="bg-neutral-50 rounded-xl px-4 py-3 border border-neutral-100 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-neutral-400 tracking-wider">Pricing</span>
                {item.discount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                    {item.discount}% OFF
                  </span>
                )}
              </div>
              
              {/* Production Price */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-600 font-semibold">Production:</span>
                <span className="text-neutral-500 line-through font-bold">
                  Rs. {item.productionPrice}
                </span>
              </div>

              {/* Selling Price */}
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 font-semibold text-sm">Selling Price:</span>
                <span className="text-amber-600 font-black text-lg">
                  Rs. {item.sellingPrice || item.normal_price}
                </span>
              </div>

              {/* Discount Amount */}
              {item.discount > 0 && (
                <div className="flex justify-between items-center text-sm bg-red-50 px-2 py-1 rounded-lg border border-red-200">
                  <span className="text-red-700 font-semibold">You Save:</span>
                  <span className="text-red-600 font-black">
                    Rs. {Math.round(item.productionPrice - item.sellingPrice)} ({item.discount}%)
                  </span>
                </div>
              )}

              {item.has_portions && (
                <select
                  value={selectedPortion}
                  onChange={(e) => setSelectedPortion(e.target.value)}
                  className="w-full mt-2 bg-white border border-neutral-200 text-neutral-800 text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 transition-all font-bold appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234b5563'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                >
                  <option value="Normal">Normal - Rs. {item.sellingPrice || item.normal_price}</option>
                  <option value="Full">Full - Rs. {item.full_price}</option>
                </select>
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

