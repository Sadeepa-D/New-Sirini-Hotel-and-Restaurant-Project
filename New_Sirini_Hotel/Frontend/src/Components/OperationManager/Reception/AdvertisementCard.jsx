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
  BadgeDollarSign,
} from "lucide-react";

const statusConfig = {
  pending: {
    label: "Pending",
    pill: "bg-amber-50 text-amber-600 border-amber-200",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    pill: "bg-green-50 text-green-600 border-green-200",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    pill: "bg-red-50 text-red-500 border-red-200",
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
  showAdminActions = true,
  showEditDelete = false,
}) => {
  const { label, pill, icon: StatusIcon } =
    statusConfig[ad.status] || statusConfig.pending;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group flex flex-col bg-white">
      {/* ── Image ── */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={ad.image}
          alt={ad.BuissnesName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Status badge */}
        <div className={`absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm ${pill}`}>
          <StatusIcon size={11} />
          {label}
        </div>

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={() => onDelete(ad._id)}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center shadow transition-all duration-200 backdrop-blur-sm"
          >
            <Trash2 size={13} />
          </button>
        )}

        {/* Business name pinned at bottom of image */}
        <div className="absolute bottom-2.5 left-3 right-3">
          <h3 className="text-white font-bold text-sm truncate drop-shadow-md">
            {ad.BuissnesName}
          </h3>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Category */}
        <span className="self-start text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          {ad.category}
        </span>

        {/* Contact details */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={12} className="text-amber-400 shrink-0" />
            <span className="truncate">{ad.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Phone size={12} className="text-amber-400 shrink-0" />
            <span>{ad.TPNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Globe size={12} className="text-amber-400 shrink-0" />
            <span className="text-blue-400 truncate">{ad.portfolio}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100">
          <BadgeDollarSign size={14} className="text-amber-500" />
          <span className="text-amber-600 font-bold text-sm">{ad.price}</span>
        </div>

        {/* Admin actions */}
        {showAdminActions && ad.status === "pending" && (
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => onApprove(ad._id)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-500 text-green-600 hover:text-white border border-green-200 hover:border-green-500 text-xs font-bold py-2 rounded-xl transition-all duration-200"
            >
              <CheckCircle size={13} /> Approve
            </button>
            <button
              onClick={() => onReject(ad._id)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-200 hover:border-red-500 text-xs font-bold py-2 rounded-xl transition-all duration-200"
            >
              <XCircle size={13} /> Reject
            </button>
          </div>
        )}

        {showAdminActions && ad.status !== "pending" && (
          <button
            onClick={() => onResetPending(ad._id)}
            className="mt-1 w-full flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 border border-gray-200 text-xs font-bold py-2 rounded-xl transition-all duration-200"
          >
            <Clock size={12} /> Reset to Pending
          </button>
        )}

        {/* User edit action */}
        {showEditDelete && (
          <div className="flex gap-2 mt-1">
            {onEdit && (
              <button
                onClick={() => onEdit(ad)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-700 border border-gray-200 hover:border-amber-200 text-xs font-bold py-2 rounded-xl transition-all duration-200"
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
