import React from "react";
import {
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Globe,
  Pencil,
} from "lucide-react";

const statusConfig = {
  pending: {
    label: "Pending",
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    bg: "bg-green-100",
    text: "text-green-700",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-100",
    text: "text-red-600",
    icon: XCircle,
  },
};

const AdvertisementCard = ({
  ad,
  onApprove,
  onReject,
  onDelete,
  onEdit,
  onResetPending,
  showAdminActions = true, // admin approve/reject/reset
  showEditDelete = false, // user edit/delete
}) => {
  const {
    label,
    bg,
    text,
    icon: StatusIcon,
  } = statusConfig[ad.status] || statusConfig.pending;

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-100 shadow-sm group flex flex-col bg-white">
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={ad.image}
          alt={ad.BuissnesName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Status badge */}
        <div
          className={`absolute top-2 left-2 flex items-center gap-1 ${bg} ${text} text-xs font-semibold px-2.5 py-1 rounded-full shadow`}
        >
          <StatusIcon size={11} />
          {label}
        </div>

        {/* Delete button top-right */}
        {onDelete && (
          <div className="absolute right-2 top-2">
            <button
              onClick={() => onDelete(ad._id)}
              className="w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center shadow transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-800 text-sm truncate">
          {ad.BuissnesName}
        </h3>
        <span className="text-xs text-amber-600 font-medium mt-0.5">
          {ad.category}
        </span>

        <div className="flex items-center gap-1 mt-1.5">
          <MapPin size={11} className="text-gray-400 shrink-0" />
          <span className="text-xs text-gray-400 truncate">{ad.location}</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <Phone size={11} className="text-gray-400 shrink-0" />
          <span className="text-xs text-gray-400">{ad.TPNumber}</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <Globe size={11} className="text-gray-400 shrink-0" />
          <span className="text-xs text-blue-400 truncate">{ad.portfolio}</span>
        </div>

        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-2 self-start">
          {ad.price}
        </span>

        {/* Admin actions */}
        {showAdminActions && ad.status === "pending" && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onApprove(ad._id)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
            >
              <CheckCircle size={13} /> Approve
            </button>
            <button
              onClick={() => onReject(ad._id)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
            >
              <XCircle size={13} /> Reject
            </button>
          </div>
        )}

        {showAdminActions && ad.status !== "pending" && (
          <button
            onClick={() => onResetPending(ad._id)}
            className="mt-3 w-full flex items-center justify-center gap-1.5 border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs font-semibold py-1.5 rounded-lg transition-colors"
          >
            <Clock size={12} /> Reset to Pending
          </button>
        )}

        {/* User edit/delete actions */}
        {showEditDelete && (
          <div className="flex gap-2 mt-3">
            {onEdit && (
              <button
                onClick={() => onEdit(ad)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold py-1.5 rounded-lg transition-colors"
              >
                <Pencil size={13} /> Edit
              </button>
            )}
            {/* {onDelete && (
              <button
                onClick={() => onDelete(ad._id)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-1.5 rounded-lg transition-colors"
              >
                <Trash2 size={13} /> Delete
              </button>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvertisementCard;
