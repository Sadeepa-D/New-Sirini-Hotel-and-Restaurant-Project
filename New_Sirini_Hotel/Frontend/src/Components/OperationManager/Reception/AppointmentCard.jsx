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
  // Status-based color tokens (all via inline styles to avoid Tailwind JIT purge)
  const t = (() => {
    const s = appointment.status;
    if (s === "Completed")
      return { barFrom: "#10b981", barTo: "#14b8a6", badgeBg: "#f0fdf4", badgeBorder: "#bbf7d0", badgeText: "#059669", iconFrom: "#10b981", iconTo: "#14b8a6" };
    if (s === "Cancelled" || s === "Canceled")
      return { barFrom: "#ef4444", barTo: "#f43f5e", badgeBg: "#fef2f2", badgeBorder: "#fecaca", badgeText: "#dc2626", iconFrom: "#ef4444", iconTo: "#f43f5e" };
    if (s === "Overdue")
      return { barFrom: "#f97316", barTo: "#ef4444", badgeBg: "#fff7ed", badgeBorder: "#fed7aa", badgeText: "#c2410c", iconFrom: "#f97316", iconTo: "#ef4444" };
    // Pending (default)
    return { barFrom: "#f59e0b", barTo: "#f97316", badgeBg: "#fffbeb", badgeBorder: "#fde68a", badgeText: "#b45309", iconFrom: "#f59e0b", iconTo: "#f97316" };
  })();

  const statusIcon = (() => {
    const s = appointment.status;
    if (s === "Completed")  return <CheckCircle2 size={11} />;
    if (s === "Cancelled" || s === "Canceled") return <XCircle size={11} />;
    if (s === "Overdue")    return <AlertCircle size={11} />;
    return <Clock size={11} />;
  })();

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">

      {/* ── Gradient top bar ── */}
      <div style={{ height: "6px", background: `linear-gradient(to right, ${t.barFrom}, ${t.barTo})` }} className="w-full shrink-0" />

      <div className="p-4 flex flex-col gap-3">

        {/* ── Row 1: icon + name ── */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Colored icon square */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ background: `linear-gradient(135deg, ${t.iconFrom}, ${t.iconTo})` }}
          >
            <User size={18} className="text-white" />
          </div>
          <p className="font-black text-gray-900 text-[14px] leading-none truncate">
            {appointment.name}
          </p>
        </div>

        {/* ── Row 2: REF code (left) + Status pill (right) ── */}
        <div className="flex items-center justify-between">
          <span className="inline-block text-[10px] font-black font-mono px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200">
            REF&nbsp; {appointment.appointcode || "N/A"}
          </span>
          <span
            className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border"
            style={{ background: t.badgeBg, border: `1px solid ${t.badgeBorder}`, color: t.badgeText }}
          >
            {statusIcon}
            {appointment.status}
          </span>
        </div>

        {/* ── Row 3: Date ── */}
        <div className="flex items-center gap-2 text-gray-400">
          <Calendar size={13} />
          <span className="text-[12px] font-semibold text-gray-500">
            {new Date(appointment.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
        </div>

        {/* ── Info box: single gray container with rows ── */}
        <div className="bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          {/* Email */}
          <div className="flex items-center gap-2.5 px-3 py-2">
            <Mail size={13} className="text-gray-400 shrink-0" />
            <span className="text-[12px] text-gray-600 truncate">{appointment.email}</span>
          </div>
          {/* Phone */}
          <div className="flex items-center gap-2.5 px-3 py-2">
            <Phone size={13} className="text-gray-400 shrink-0" />
            <span className="text-[12px] text-gray-600">{appointment.phone}</span>
          </div>
          {/* Event type */}
          <div className="flex items-center gap-2.5 px-3 py-2">
            <PartyPopper size={13} className="text-gray-400 shrink-0" />
            <span className="text-[12px] text-gray-600 truncate">{appointment.eventType}</span>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        {isAdmin
          ? (appointment.status === "Pending" || appointment.status === "Overdue") && (
              <div className="flex gap-3 mt-1">
                <button
                  className="flex-1 py-2 font-bold text-xs text-white flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm"
                  style={{ background: "linear-gradient(to right, #059669, #10b981)", borderRadius: "14px" }}
                  onClick={() => onUpdate(appointment._id, "completed")}
                >
                  <CheckCircle2 size={13} /> Complete
                </button>
                <button
                  className="flex-1 py-2 font-bold text-xs flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95 transition-all duration-300"
                  style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "14px" }}
                  onClick={() => onUpdate(appointment._id, "canceled")}
                >
                  <XCircle size={13} /> Cancel
                </button>
              </div>
            )
          : appointment.status === "Pending" && (
              <div className="flex gap-3 mt-1">
                <button
                  className="flex-1 py-2 font-bold text-xs text-gray-600 flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95 transition-all duration-300"
                  style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "14px" }}
                  onClick={() => onEdit(appointment)}
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  className="flex-1 py-2 font-bold text-xs flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95 transition-all duration-300"
                  style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "14px" }}
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
