import React from "react";
import {
  Edit3,
  Trash2,
  Wind,
  Snowflake,
  Users,
  Info,
  ImageIcon,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

const RoomCards = ({ rooms, onEdit, onDelete }) => {
  return (
    <div className="p-4 bg-gray-50">
      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">No rooms in inventory</p>
        </div>
      ) : (
    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              
              <div className="relative h-40 w-full bg-gray-100 overflow-hidden">
                {room.image ? (
                  <img
                    src={room.image}
                    alt={room.roomType}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                    <ImageIcon size={32} strokeWidth={1} />
                  </div>
                )}

                <div className="absolute top-2 right-2 scale-90 origin-top-right">
                  <StatusBadge status={room.status} />
                </div>
              </div>

              
              <div className="p-4 flex-grow flex flex-col">
                <div className="mb-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                    Room No {room.roomNumber}
                  </span>
                  <h5 className="text-base font-bold text-gray-900 leading-tight truncate">
                    {room.roomType} Room
                  </h5>
                  <p className="text-sm font-black text-gray-700 mt-1">
                    Rs.{Number(room.price).toLocaleString()}
                  </p>
                </div>

                
                <div className="flex gap-2 mb-3">
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold uppercase ${
                      room.condition === "AC"
                        ? "bg-blue-50 border-blue-100 text-blue-600"
                        : "bg-orange-50 border-orange-100 text-orange-600"
                    }`}
                  >
                    {room.condition === "AC" ? (
                      <Snowflake size={12} />
                    ) : (
                      <Wind size={12} />
                    )}
                    {room.condition || "Fan"}
                  </div>

                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-100 bg-gray-50 text-gray-500 text-[10px] font-bold uppercase">
                    <Users size={12} />
                    {room.capacity}
                  </div>
                </div>

                {/* Description*/}
                <p className="text-[11px] text-gray-400 line-clamp-1 italic mb-4">
                  {room.description || "No description provided."}
                </p>

                {/*Small Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-gray-50">
                  <button
                    onClick={() => onEdit(room)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-black text-white rounded-lg hover:bg-[#D4AF37] transition-all font-bold text-[10px] uppercase tracking-wider"
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(room._id)}
                    className="w-10 flex items-center justify-center py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all border border-red-100"
                  >
                    <Trash2 size={14} />
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
