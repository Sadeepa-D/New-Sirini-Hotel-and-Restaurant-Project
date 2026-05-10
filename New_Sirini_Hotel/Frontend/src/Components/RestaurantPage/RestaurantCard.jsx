import React from "react";

export default function RestaurantCard({ item, itemsPerView, onOrder }) {
  return (
    <div
      className="flex-shrink-0"
      style={{
        width: `calc(${100 / itemsPerView}% - ${
          ((itemsPerView - 1) * (itemsPerView === 1 ? 16 : 24)) /
          itemsPerView
        }px)`,
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

          <div className="flex flex-col gap-1 mb-4 bg-neutral-50 rounded-xl px-3 py-2 border border-neutral-100">
            <span className="text-sm font-semibold text-neutral-800">
              Normal:
              <span className="text-amber-600 ml-1 font-bold">
                LKR {item.normal_price}
              </span>
            </span>

            {item.has_portions && (
              <span className="text-sm font-semibold text-neutral-800">
                Full:
                <span className="text-amber-600 ml-1 font-bold">
                  LKR {item.full_price}
                </span>
              </span>
            )}
          </div>

          <div className="mt-auto flex justify-center">
            <button
              onClick={() => onOrder(item)}
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