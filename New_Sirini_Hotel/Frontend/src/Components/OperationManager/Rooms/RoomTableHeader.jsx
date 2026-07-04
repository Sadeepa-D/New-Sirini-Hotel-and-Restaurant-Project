import React from "react";
import { Plus, Search } from "lucide-react"; // Search icon

const RoomTableHeader = ({ onAdd, searchTerm, onSearch }) => {
  return (
    <div className="bg-white rounded-2xl p-3 sm:p-5 shadow-sm mb-6 border border-gray-100 transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        
        {/* Title & Add Button Section */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            onClick={onAdd}
            style={{ borderRadius: "8px" }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-500 text-black font-black px-6 py-3 rounded-lg hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/20 transform hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out text-sm uppercase tracking-wider"
          >
            <Plus size={20} strokeWidth={3} />
            Add New Room
          </button>
        </div>

        {/* Search Input Section */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search room, type or status..."
            value={searchTerm}
            onChange={onSearch}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent focus:outline-none transition-all placeholder:text-gray-400 font-medium"
          />
        </div>

      </div>
    </div>
  );
};

export default RoomTableHeader;