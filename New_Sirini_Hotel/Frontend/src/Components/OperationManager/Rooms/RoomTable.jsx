import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

const RoomTable = ({ rooms, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* Head */}
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 sm:px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                Room
              </th>
              <th className="text-left px-4 sm:px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                Type
              </th>
              <th className="text-left px-4 sm:px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                Price
              </th>
              <th className="text-left px-4 sm:px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                Capacity
              </th>
              <th className="text-left px-4 sm:px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                Status
              </th>
              <th className="hidden md:table-cell text-left px-4 sm:px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                Description
              </th>
              <th className="text-center px-4 sm:px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400 font-medium">
                  No rooms found.
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 sm:px-5 py-4 font-bold text-gray-900">
                    #{room.roomNumber}
                  </td>
                  <td className="px-4 sm:px-5 py-4 text-gray-600">
                    {room.type}
                  </td>
                  <td className="px-4 sm:px-5 py-4 text-gray-800 font-semibold">
                    Rs.{Number(room.price).toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-5 py-4 text-gray-600">
                    {room.capacity} {room.capacity === 1 ? "Guest" : "Guests"}
                  </td>
                  <td className="px-4 sm:px-5 py-4">
                    <StatusBadge status={room.status} />
                  </td>
                  <td className="hidden md:table-cell px-4 sm:px-5 py-4 text-gray-500 max-w-[180px] truncate">
                    {room.description}
                  </td>
                  <td className="px-4 sm:px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(room)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(room.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default RoomTable;