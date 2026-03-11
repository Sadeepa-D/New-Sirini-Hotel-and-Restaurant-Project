import React from "react";

export default function RestaurantCard({ item, itemsPerView, onOrder }) {
  return (
    <div
      className="flex-shrink-0"
      style={{
        width: `calc(${100 / itemsPerView}% - ${
          ((itemsPerView - 1) * (itemsPerView === 1 ? 16 : 24)) / itemsPerView
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
          <p className="text-sm text-neutral-500 mb-3">
            {item.ingredients.join(", ")}
          </p>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-lg font-bold text-amber-600">
              Rs. {item.price}
            </span>
            <button
              onClick={() => onOrder(item)}
              className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
