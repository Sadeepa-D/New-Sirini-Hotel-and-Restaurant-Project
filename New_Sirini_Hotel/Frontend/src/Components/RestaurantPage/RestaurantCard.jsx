import React from "react";

export default function RestaurantCard({ item, itemsPerView, onOrder }) {
  return (
    <div
      className="flex-shrink-0"
      style={{
        width: `calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * (itemsPerView === 1 ? 16 : 24)) / itemsPerView
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
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded">
              {item.label}
            </span>
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h4 className="text-xl font-bold text-neutral-900 mb-1">
            {item.name}
          </h4>
          <p className="text-xs text-neutral-500 mb-4 line-clamp-2">
            {item.description}
          </p>
          <div className="mt-auto flex items-center justify-between gap-4">
            <div className="flex-grow">
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-amber-600 leading-tight">
                  Normal: Rs. {item.normal_price}
                </span>
                {item.has_portions && (
                  <span className="text-[13px] font-bold text-amber-600 leading-tight">
                    Full: Rs. {item.full_price}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => onOrder(item)}
              disabled={item.availability === false}
              className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${item.availability !== false
                  ? "bg-amber-600 hover:bg-orange-700"
                  : "bg-gray-400 cursor-not-allowed opacity-70"
                }`}
            >
              {item.availability !== false ? "Order" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
