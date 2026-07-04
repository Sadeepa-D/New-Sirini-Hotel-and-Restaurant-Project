import {
  Calendar,
  Mail,
  Phone,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Edit2,
  PartyPopper,
} from "lucide-react";

const AppointmentCard = ({
  appointment,
  onUpdate,
  onEdit,
  onCancel,
  isAdmin = false,
}) => {
  const statusConfig = {
    Completed: {
      pill: "bg-green-50 text-green-600 border-green-200",
      icon: <CheckCircle2 size={12} />,
    },
    Pending: {
      pill: "bg-amber-50 text-amber-600 border-amber-200",
      icon: <Clock size={12} />,
    },
    Canceled: {
      pill: "bg-red-50 text-red-500 border-red-200",
      icon: <XCircle size={12} />,
    },
    Overdue: {
      pill: "bg-purple-50 text-purple-600 border-purple-200",
      icon: <AlertCircle size={12} />,
    },
  };

  const cfg = statusConfig[appointment.status] || statusConfig.Pending;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-linear-to-r from-amber-400 to-amber-300" />

      <div className="p-3 sm:p-5">
        {/* Status + Date row */}
        <div className="flex justify-between items-center mb-4">
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cfg.pill}`}
          >
            {cfg.icon}
            {appointment.status}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
            <Calendar size={11} className="text-amber-400" />
            {new Date(appointment.date).toLocaleDateString()}
          </span>
        </div>

        {/* Name */}
        <div className="flex items-start gap-2 mb-4 h-16">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <User size={16} className="text-amber-500" />
          </div>
          <h3
            className="text-gray-900 font-bold text-base leading-tight line-clamp-2 overflow-hidden"
            title={appointment.name}
          >
            {appointment.name}
          </h3>
        </div>

        <div className="mb-4 flex items-center">
          <span className="bg-gray-100 text-gray-700 border border-gray-200/60 font-mono font-black tracking-wider text-[11px] px-2.5 py-1 rounded-lg uppercase">
            Ref: {appointment.appointcode || "NA"}
          </span>
        </div>

        {/* Contact details */}
        <div className="space-y-2 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <Mail size={13} className="text-amber-400 shrink-0" />
            <span className="truncate text-xs">{appointment.email}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <Phone size={13} className="text-amber-400 shrink-0" />
            <span className="text-xs">{appointment.phone}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <PartyPopper size={13} className="text-amber-400 shrink-0" />
            <span className="text-xs truncate">{appointment.eventType}</span>
          </div>
        </div>

        {/* Action Buttons */}
        {isAdmin
          ? (appointment.status === "Pending" ||
              appointment.status === "Overdue") && (
              <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                <button
                  style={{ borderRadius: "10px" }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-500 text-green-600 hover:text-white border border-green-200 hover:border-green-500 text-xs font-bold py-2 rounded-xl transform hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
                  onClick={() => onUpdate(appointment._id, "completed")}
                >
                  <CheckCircle2 size={13} /> Complete
                </button>
                <button
                  style={{ borderRadius: "10px" }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-200 hover:border-red-500 text-xs font-bold py-2 rounded-xl transform hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
                  onClick={() => onUpdate(appointment._id, "canceled")}
                >
                  <XCircle size={13} /> Cancel
                </button>
              </div>
            )
          : appointment.status === "Pending" && (
              <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                <button
                  style={{ borderRadius: "10px" }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-700 border border-gray-200 hover:border-amber-200 text-xs font-bold py-2 rounded-xl transform hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
                  onClick={() => onEdit(appointment)}
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  style={{ borderRadius: "10px" }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-200 hover:border-red-500 text-xs font-bold py-2 rounded-xl transform hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
                  onClick={() => onCancel(appointment._id)}
                >
                  <XCircle size={13} /> Cancel
                </button>
              </div>
            )}
      </div>
    </div>
  );
};

export default AppointmentCard;
