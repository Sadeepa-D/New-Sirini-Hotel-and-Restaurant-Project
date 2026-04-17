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

export const InputField = ({
  label,
  type = "text",
  defaultValue,
  placeholder,
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-gray-900 bg-white"
    />
  </div>
);
