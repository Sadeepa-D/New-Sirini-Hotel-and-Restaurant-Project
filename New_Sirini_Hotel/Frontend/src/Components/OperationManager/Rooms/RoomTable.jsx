import React from "react";
import { Edit3, Trash2, Wind, Snowflake, Users, Info } from "lucide-react";
import StatusBadge from "./StatusBadge";

const RoomCards = ({ rooms, onEdit, onDelete }) => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Info className="text-gray-400" size={32} />
          </div>
          <p className="text-gray-500 font-semibold text-lg">No rooms in inventory</p>
          <p className="text-gray-400 text-sm">Add a new room to see it appearing here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {rooms.map((room) => (
            <div 
              key={room._id} 
              className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image Section - Increased height for better visibility */}
              <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                {room.image ? (
                  <img 
                    src={room.image} 
                    alt={room.roomType}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                    <ImageIcon size={48} strokeWidth={1} />
                  </div>
                )}
                
                {/* Status Overlay - Clean & Discrete */}
                <div className="absolute top-4 right-4 shadow-lg">
                  <StatusBadge status={room.status} />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#D4AF37] mb-1 block">
                      Room No. {room.roomNumber}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {room.roomType}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Per Night</span>
                    <p className="text-lg font-black text-gray-900">
                      Rs.{Number(room.price).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                    room.condition === "AC" 
                      ? "bg-blue-50/50 border-blue-100 text-blue-700" 
                      : "bg-orange-50/50 border-orange-100 text-orange-700"
                  }`}>
                    {room.condition === "AC" ? <Snowflake size={16} /> : <Wind size={16} />}
                    <span className="text-xs font-bold uppercase tracking-wider">{room.condition || "Fan"}</span>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-600">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">{room.capacity} Guests</span>
                  </div>
                </div>

                {/* Description - Better spacing and color */}
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-6 flex-grow">
                  {room.description || "Luxurious space designed for maximum comfort and relaxation."}
                </p>

                {/* Action Buttons - Premium Design */}
                <div className="flex gap-3 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => onEdit(room)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors font-bold text-xs uppercase tracking-widest shadow-md active:scale-95"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(room._id)}
                    className="w-14 flex items-center justify-center py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100 active:scale-95"
                    title="Delete Room"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomCards;