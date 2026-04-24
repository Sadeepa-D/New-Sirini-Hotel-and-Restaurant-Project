import React from "react";

const StatusBadge = ({ status }) => {
  // වර්ණ සහ මෝස්තර (Styles)
  const styles = {
    available:   "bg-green-100 text-green-700 border-green-200",
    reserved:    "bg-red-100 text-red-700 border-red-200",    // ✅ occupied වෙනුවට reserved
    maintenance: "bg-yellow-100 text-yellow-700 border-yellow-200", // ✅ maintenance සඳහා yellow/amber
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        px-2.5 py-1 
        rounded-lg
        text-[10px] sm:text-[11px]
        font-black uppercase tracking-widest
        border
        ${styles[status] || "bg-gray-100 text-gray-600 border-gray-200"}
      `}
    >
      {/* තත්ත්වය පෙන්වන වචනය */}
      {status === "available" ? "Available" : 
       status === "maintenance" ? "Maintenance" : "Reserved"}
    </span>
  );
};

export default StatusBadge;