import React from "react";

export const StatusBadge = ({ status }) => {
  const colors = {
    Confirmed: "bg-green-100 text-green-700",
    Approved: "bg-green-100 text-green-700",
    Delivered: "bg-gray-100 text-gray-700",
    Pending: "bg-amber-100 text-amber-700",
    "Under Review": "bg-amber-100 text-amber-700",
    Preparing: "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
};
