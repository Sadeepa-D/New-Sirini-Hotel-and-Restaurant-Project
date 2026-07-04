import React from "react";
import {
  Edit3,
  Trash2,
  Wind,
  Snowflake,
  Users,
  Info,
  ImageIcon,
  Wifi,
  Droplets,
  Monitor,
  Refrigerator,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

const RoomCards = ({ rooms, onEdit, onDelete }) => {
  const scrollContainerRef = React.useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 336; // card width (320px) + gap (16px)
      const newPosition =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;
      container.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="p-4 bg-gray-50 relative">
      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">No rooms in inventory</p>
        </div>
      ) : (
        <div className="relative">
          {/* Left Scroll Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-2.5 bg-white/95 hover:bg-white text-gray-800 rounded-full shadow-lg border border-gray-200 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center -translate-x-1/2"
            title="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Cards Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 pb-4 px-4 scroll-smooth snap-x snap-mandatory 
                       [&::-webkit-scrollbar]:h-1.5 
                       [&::-webkit-scrollbar-track]:bg-gray-100 
                       [&::-webkit-scrollbar-track]:rounded-full 
                       [&::-webkit-scrollbar-thumb]:bg-gray-300 
                       [&::-webkit-scrollbar-thumb]:rounded-full 
                       hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 
                       [scrollbar-width:thin] 
                       [scrollbar-color:#d1d5db_#f3f4f6]"
          >
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col group shrink-0 w-[320px] snap-start"
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

                <div className="p-3 flex-grow flex flex-col">
                  <div className="mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#a3801c] block mb-0.5">
                      Room No {room.roomNumber}
                    </span>
                    <h5 className="text-base font-bold text-gray-900 leading-tight truncate">
                      {room.roomType} Room
                    </h5>
                    <div
                      style={{ borderRadius: "8px" }}
                      className="mt-1.5 space-y-1 bg-gray-50/50 p-1.5 border border-gray-100/50"
                    >
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-500 font-semibold">
                          Night Package:
                        </span>
                        <span className="font-black text-gray-800">
                          Rs.
                          {Number(room.nightPackagePrice || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-500 font-semibold">
                          Day Package:
                        </span>
                        <span className="font-black text-gray-800">
                          Rs.
                          {Number(room.dayPackagePrice || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Attributes: Condition & Guests */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block mb-0.5 font-bold">
                        Condition
                      </span>
                      <div
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold uppercase ${
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
                    </div>

                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block mb-0.5 font-bold">
                        Guests
                      </span>
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-100 bg-gray-50 text-gray-500 text-[10px] font-bold uppercase">
                        <Users size={12} />
                        {room.capacity}{" "}
                        {Number(room.capacity) === 1 ? "Guest" : "Guests"}
                      </div>
                    </div>
                  </div>

                  {/* Facilities */}
                  {room.facilities && room.facilities.length > 0 && (
                    <div className="mb-2">
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">
                        Facilities
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {room.facilities.includes("WiFi") && (
                          <div className="flex items-center gap-0.5 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                            <Wifi size={10} className="text-blue-500" />
                            <span className="text-[8px] font-bold text-blue-700">
                              WiFi
                            </span>
                          </div>
                        )}
                        {room.facilities.includes("Hot Water") && (
                          <div className="flex items-center gap-0.5 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                            <Droplets size={10} className="text-red-500" />
                            <span className="text-[8px] font-bold text-red-700">
                              H2O
                            </span>
                          </div>
                        )}
                        {room.facilities.includes("TV") && (
                          <div className="flex items-center gap-0.5 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                            <Monitor size={10} className="text-purple-500" />
                            <span className="text-[8px] font-bold text-purple-700">
                              TV
                            </span>
                          </div>
                        )}
                        {room.facilities.includes("Mini Fridge") && (
                          <div className="flex items-center gap-0.5 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                            <Refrigerator
                              size={10}
                              className="text-green-550"
                            />
                            <span className="text-[8px] font-bold text-green-700">
                              Fridge
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="mb-2">
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block mb-0.5 font-bold">
                      Description
                    </span>
                    <p className="text-[11px] text-gray-500 line-clamp-1 italic">
                      {room.description || "No description provided."}
                    </p>
                  </div>

                  {/*Small Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-gray-50">
                    <button
                      onClick={() => onEdit(room)}
                      style={{ borderRadius: "8px" }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-black text-white rounded-lg hover:bg-[#D4AF37] transition-all font-bold text-[10px] uppercase tracking-wider"
                    >
                      <Edit3 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(room._id)}
                      style={{ borderRadius: "8px" }}
                      className="w-10 flex items-center justify-center py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all border border-red-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-2.5 bg-white/95 hover:bg-white text-gray-800 rounded-full shadow-lg border border-gray-200 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center translate-x-1/2"
            title="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomCards;
