import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import  {StatusBadge}  from "./SharedUI";

const AdsSection = ({ data }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-900">Reception Hall Ads</h2>
      <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg">
        + Place New Ad
      </button>
    </div>
    {data.map((ad) => (
      <div
        key={ad.id}
        className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-colors bg-gray-50/30 gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900 text-lg">{ad.title}</h3>
            {/* Replaced prop with direct import */}
            <StatusBadge status={ad.status} />
          </div>
          <p className="text-sm text-gray-500">
            Ad ID: {ad.id} • Submitted: {ad.submitted}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-medium transition-colors text-sm">
            <Edit2 size={16} /> Edit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors text-sm">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default AdsSection;
