import React,{useState} from "react";
import toast from "react-hot-toast";

const CateringItemCard = ({ item }) => {
  const { name, ingredients, price, image } = item;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col">
      
      {/* Image */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-amber-500 text-amber-900 text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow">
          Rs. {price}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        
        {/* Name */}
        <h3 className="font-cinzel text-base sm:text-lg font-semibold text-gray-800 mb-3">
          {name}
        </h3>

        {/* Divider */}
        <div className="w-10 h-0.5 bg-amber-400 mb-3 rounded-full" />

        {/* Ingredients */}
        <div className="mt-auto">
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-widest mb-2 font-medium">
            Ingredients
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(Array.isArray(ingredients) ? ingredients : [ingredients]).map((ing, i) => (
              <span
                key={i}
                className="bg-amber-50 text-amber-800 text-xs px-2.5 py-1 rounded-full border border-amber-200"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
export default CateringItemCard;