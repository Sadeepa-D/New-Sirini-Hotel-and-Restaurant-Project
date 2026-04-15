import React from "react";

const RoomStatsRow = ({ stats }) => {
  const items = [
    { label: "Available",   value: stats.available,   color: "bg-green-50 text-green-700",   dot: "bg-green-500" },
    { label: "Occupied",    value: stats.occupied,    color: "bg-red-50 text-red-700",       dot: "bg-red-500" },
    { label: "Maintenance", value: stats.maintenance, color: "bg-orange-50 text-orange-700", dot: "bg-orange-500" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-xl p-2.5 sm:p-4 ${item.color} flex items-center gap-2 sm:gap-3`}
        >
          <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0 ${item.dot}`} />
          <div className="min-w-0">
            <p className="text-lg sm:text-2xl font-bold leading-tight">{item.value}</p>
            <p className="text-[9px] sm:text-xs font-semibold uppercase tracking-wide opacity-70 truncate">
              {item.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomStatsRow;