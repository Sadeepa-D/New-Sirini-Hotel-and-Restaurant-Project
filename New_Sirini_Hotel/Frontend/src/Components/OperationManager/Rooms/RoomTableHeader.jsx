import React from "react";
import { Plus } from "lucide-react";

const RoomTableHeader = ({ onAdd, searchTerm, onSearch }) => {
  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm mb-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        
        {/* Add Room Button */}
        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-2 bg-yellow-500 text-black font-bold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl hover:bg-yellow-400 transition text-sm"
        >
          <Plus size={18} />
          Add Room
        </button>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by room no, type, status..."
          value={searchTerm}
          onChange={onSearch}
          className="w-full sm:w-72 border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-gray-50"
        />

      </div>
    </div>
  );
};

export default RoomTableHeader;