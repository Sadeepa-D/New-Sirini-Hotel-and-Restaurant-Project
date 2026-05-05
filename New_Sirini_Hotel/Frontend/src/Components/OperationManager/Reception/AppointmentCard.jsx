import {
  Calendar,
  Mail,
  Phone,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit2,
} from "lucide-react";

const AppointmentCard = ({
  appointment,
  onUpdate,
  onEdit,
  onCancel,
  isAdmin = false,
}) => {
  // Define status styles
  const statusStyles = {
    Completed: {
      bg: "bg-green-50",
      text: "text-green-700",
      icon: <CheckCircle2 size={16} />,
    },
    Pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      icon: <Clock size={16} />,
    },
    Canceled: {
      bg: "bg-red-50",
      text: "text-red-700",
      icon: <XCircle size={16} />,
    },
    Overdue: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      icon: <AlertCircle size={16} />,
    },
  };

  const style = statusStyles[appointment.status] || statusStyles.Pending;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-gray-50"
          style={{
            backgroundColor: style.bg.replace("bg-", ""),
            color: style.text.replace("text-", ""),
          }}
        >
          <span className={style.text}>{style.icon}</span>
          <span className={style.text}>{appointment.status}</span>
        </div>
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest flex items-center gap-1">
          <Calendar size={12} />
          {new Date(appointment.date).toLocaleDateString()}
        </p>
      </div>

      <h3 className="text-gray-800 font-bold text-lg mb-3 flex items-center gap-2 whitespace-nowrap">
        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
          <User size={16} />
        </div>
        {appointment.name}
      </h3>

      <div className="space-y-2 border-t border-gray-50 pt-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Mail size={14} className="text-amber-400" />
          <span className="truncate">{appointment.email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Phone size={14} className="text-amber-400" />
          <span>{appointment.phone}</span>
        </div>
      </div>

      {/* Conditionally Render Buttons Based on Role */}
      {isAdmin
        ? // ================= MANAGER BUTTONS =================
          (appointment.status === "Pending" ||
            appointment.status === "Overdue") && (
            <div className="mt-4 pt-3 flex gap-2">
              <button
                className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
                onClick={() => onUpdate(appointment._id, "completed")}
              >
                Complete
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
                onClick={() => onUpdate(appointment._id, "cancelled")}
              >
                Cancel
              </button>
            </div>
          )
        : // ================= USER BUTTONS =================
          appointment.status === "Pending" && (
            <div className="mt-4 pt-3 flex gap-2">
              <button
                className="flex-1 flex items-center justify-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                onClick={() => onEdit(appointment)}
              >
                <Edit2 size={14} /> Edit
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                onClick={() => onCancel(appointment._id)}
              >
                <XCircle size={14} /> Cancel
              </button>
            </div>
          )}
    </div>
  );
};

export default AppointmentCard;
