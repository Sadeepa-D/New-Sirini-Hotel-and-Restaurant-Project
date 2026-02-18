import React from "react";

const DrinkCard = ({ drink, onClick }) => {
  return (
    <div
      onClick={() => onClick(drink)}
      className={`group relative w-full h-[350px] rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] cursor-pointer bg-white ${
        !drink.isAvailable ? "grayscale" : ""
      }`}
    >
      {/* Image Section */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-white relative z-0">
        <img
          src={drink.image}
          alt={drink.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 w-full h-[55%] bg-black/60 flex flex-col items-center pt-14 px-4 pb-4">
        {/* Title Pill */}
        <div className="absolute top-3 bg-amber-500 text-black font-serif px-8 py-2.5 rounded-full shadow-lg font-bold text-lg tracking-wide whitespace-nowrap z-10">
          {drink.name}
        </div>

        {/* Details */}
        <div className="flex flex-col items-center gap-2 mt-4 text-center w-full">
          <p className="text-white text-base tracking-wide font-medium drop-shadow-md">
            Alcohol by Volume:{" "}
            <span className="font-bold">{drink.alcoholPercentage}%</span>
          </p>
          <p className="text-white text-base tracking-wide font-medium drop-shadow-md">
            Price : LKR: <span className="font-bold">{drink.price}</span>
          </p>
        </div>

        {/* Status */}
        <div className="mt-auto">
          {drink.isAvailable !== false ? (
            <span className="text-green-400 font-bold uppercase tracking-widest text-sm animate-pulse drop-shadow-md">
              Available
            </span>
          ) : (
            <span className="text-red-500 font-bold uppercase tracking-widest text-sm drop-shadow-md">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrinkCard;
