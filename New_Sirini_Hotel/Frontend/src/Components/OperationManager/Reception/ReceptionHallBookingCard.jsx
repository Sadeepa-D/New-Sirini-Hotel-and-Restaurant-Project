import React from "react";
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  Users,
  UtensilsCrossed,
  MessageSquare,
  Pencil,
  X,
  Clock,
  Check,
} from "lucide-react";

const ReceptionHallBookingCard = ({ booking, onEdit, onCancel, onConfirm }) => {
  const statusConfig = {
    Confirmed: {
      bg: "bg-green-100",
      text: "text-green-700",
      dot: "bg-green-400",
    },
    Cancelled: { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-400" },
  };

  const s = statusConfig[booking.status];

  const formattedDate = booking.eventDate
    ? new Date(booking.eventDate).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Top color bar by event type */}
      <div className="h-1.5 w-full rounded-t-2xl bg-amber-400" />

      <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3 relative h-full">
        {/* Status badge - positioned top right */}
        {/* Header section */}
        <div className="flex flex-col gap-2">
          {/* Status badge — top right */}
          <div className="flex justify-end">
            <div
              className={`flex items-center gap-1.5 ${s.bg} ${s.text} text-xs font-bold px-2.5 py-1 rounded-full`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {booking.status}
            </div>
          </div>

          {/* Avatar + Full name */}
          <div className="flex items-center gap-3 h-10">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <User size={18} className="text-amber-600" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">
              {booking.customerName}
            </h3>
          </div>

          {/* Event type */}
          <span className="text-xs text-amber-600 font-semibold pl-1">
            {booking.eventType}
          </span>
        </div>
        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <Mail size={13} className="text-gray-400 shrink-0" />
            <span className="text-xs text-gray-500 truncate">
              {booking.customerEmail}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={13} className="text-gray-400 shrink-0" />
            <span className="text-xs text-gray-500">
              {booking.customerPhone}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={13} className="text-gray-400 shrink-0" />
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={13} className="text-gray-400 shrink-0" />
            <span className="text-xs text-gray-500">
              {booking.numberOfGuests} Guests
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-gray-400 shrink-0" />
            <span className="text-xs text-gray-500">{booking.eventTime}</span>
          </div>
        </div>

        {/* Special requests - Now with a min-height and consistent spacing */}
        <div className="min-h-[64px] mb-2">
          {/* Wraps the requests in a fixed-height container */}
          {booking.specialRequests ? (
            <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3 h-full">
              <MessageSquare
                size={13}
                className="text-gray-400 shrink-0 mt-0.5"
              />
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                {booking.specialRequests}
              </p>
            </div>
          ) : (
            /* This invisible div keeps the space occupied when there are no requests */
            <div className="h-full w-full border border-dashed border-gray-100 rounded-xl" />
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
          <button
            onClick={() => onEdit(booking)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold transition-colors"
          >
            <Pencil size={13} /> Edit
          </button>
          {booking.status === "Confirmed" ? (
            <button
              onClick={() => onCancel(booking._id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 text-xs font-semibold transition-colors"
            >
              <X size={13} /> Cancel
            </button>
          ) : (
            <button
              onClick={() => onConfirm(booking._id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-50 text-green-500 hover:bg-green-100 text-xs font-semibold transition-colors"
            >
              <Check size={13} /> Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceptionHallBookingCard;
