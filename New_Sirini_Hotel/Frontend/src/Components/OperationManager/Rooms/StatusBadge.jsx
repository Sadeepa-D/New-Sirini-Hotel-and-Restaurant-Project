import React from "react";

const StatusBadge = ({ status }) => {
  const styles = {
    available:   "bg-green-100 text-green-700",
    occupied:    "bg-red-100 text-red-700",
    maintenance: "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`
        inline-block
        px-2 py-0.5 sm:px-2.5 sm:py-1
        rounded-full
        text-[9px] sm:text-xs
        font-bold uppercase tracking-wide
        ${styles[status] || "bg-gray-100 text-gray-600"}
      `}
    >
      {status}
    </span>
  );
};

export default StatusBadge;