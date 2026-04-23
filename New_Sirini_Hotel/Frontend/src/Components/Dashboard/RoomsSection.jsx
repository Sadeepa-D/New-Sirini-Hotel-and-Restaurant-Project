import React from "react";
import { CalendarDays, XCircle } from "lucide-react";
import { StatusBadge } from "./SharedUI";

const RoomsSection = ({ data }) => {
  return (
    // <div className="space-y-6 animate-in fade-in duration-300">
    //   <h2 className="text-xl font-bold text-gray-900 mb-6">Room Bookings</h2>
    //   {data.map((room) => (
    //     <div
    //       key={room.id}
    //       className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-colors bg-gray-50/30 gap-4"
    //     >
    //       <div>
    //         <div className="flex items-center gap-3 mb-2">
    //           <h3 className="font-semibold text-gray-900 text-lg">
    //             {room.type}
    //           </h3>
    //           <StatusBadge status={room.status} />
    //         </div>
    //         <p className="text-sm text-gray-500">
    //           Booking ID: {room.id} • Total:{" "}
    //           <span className="font-semibold text-gray-700">{room.price}</span>
    //         </p>
    //         <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
    //           <CalendarDays size={14} /> {room.checkIn} — {room.checkOut}
    //         </p>
    //       </div>
    //       <div className="flex items-center gap-3">
    //         {room.status !== "Cancelled" && (
    //           <button className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors text-sm">
    //             <XCircle size={16} /> Cancel Booking
    //           </button>
    //         )}
    //       </div>
    //     </div>
    //   ))}
    // </div>
    <>
    <h1>dashboard room section</h1>
    </>
  );
};
export default RoomsSection;
