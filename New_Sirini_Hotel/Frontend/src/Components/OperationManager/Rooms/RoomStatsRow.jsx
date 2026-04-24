import React from "react";

const RoomStatsRow = ({ stats }) => {
  const items = [
    {
      label: "Available",
      value: stats.available || 0,
      color: "bg-green-50 text-green-700 border border-green-100",
      dot: "bg-green-500",
    },
    {
      label: "Reserved", 
      value: stats.reserved || 0, 
      color: "bg-red-50 text-red-700 border border-red-100",
      dot: "bg-red-500",
    },
    {
      label: "Maintenance",
      value: stats.maintenance || 0,
      color: "bg-yellow-50 text-yellow-700 border border-yellow-100", 
      dot: "bg-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-2xl p-3 sm:p-5 ${item.color} flex items-center gap-3 sm:gap-4 transition-all duration-300 hover:shadow-md`}
        >
          {/* Status Dot with Pulse Effect for Available */}
          <div className="relative flex items-center justify-center">
            {item.label === "Available" && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-20"></span>
            )}
            <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${item.dot}`} />
          </div>

          <div className="min-w-0">
            <p className="text-xl sm:text-3xl font-black leading-tight tracking-tight text-gray-900">
              {item.value}
            </p>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-80 truncate">
              {item.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomStatsRow;