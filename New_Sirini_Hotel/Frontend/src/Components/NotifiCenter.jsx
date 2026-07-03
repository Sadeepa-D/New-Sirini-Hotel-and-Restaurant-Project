import React from "react";
import {
  CheckCheck,
  AlertCircle,
  XCircle,
  Clock,
  PlusCircle,
  Trash2,
  RefreshCw,
  ChefHat,
  Bell,
  X,
} from "lucide-react";
import moment from "moment";

const NotifiCenter = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onClose,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // icon + accent color pairing per notification type
  const getIconConfig = (title) => {
    const t = title.toLowerCase();
    if (t.includes("new"))
      return { icon: PlusCircle, color: "text-blue-400", bg: "bg-blue-500/10" };
    if (t.includes("cancel"))
      return { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" };
    if (t.includes("delete"))
      return { icon: Trash2, color: "text-rose-400", bg: "bg-rose-500/10" };
    if (t.includes("update"))
      return { icon: RefreshCw, color: "text-sky-400", bg: "bg-sky-500/10" };
    if (t.includes("preparing"))
      return { icon: ChefHat, color: "text-indigo-400", bg: "bg-indigo-500/10" };
    if (t.includes("accepted") || t.includes("success"))
      return { icon: CheckCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" };
    if (t.includes("complete") || t.includes("checkout"))
      return { icon: CheckCheck, color: "text-teal-400", bg: "bg-teal-500/10" };
    if (t.includes("overdue"))
      return { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" };
    return { icon: AlertCircle, color: "text-zinc-400", bg: "bg-zinc-500/10" };
  };

  return (
    <div className="fixed md:absolute top-24 md:top-full left-4 md:left-0 right-4 md:right-auto mx-auto md:mx-0 mt-4 md:mt-3 w-[calc(100vw-2rem)] md:w-96 max-w-sm bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-white/5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-medium text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[11px] font-medium text-blue-300 bg-blue-500/15 px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-1 -m-1 rounded-lg hover:bg-white/5"
              aria-label="Close notifications"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <p className="text-zinc-500 text-xs mt-1">Stay on top of your orders</p>

        {/* Action row */}
        {notifications.length > 0 && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAllAsRead();
              }}
              disabled={unreadCount === 0}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/5"
            >
              <CheckCheck size={13} />
              <span>Mark all read</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearAll();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Clear all</span>
            </button>
          </div>
        )}
      </div>

      {/* Notifications list */}
      <div className="max-h-87.5 overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-10 text-center">
            <Bell size={22} className="text-zinc-700 mx-auto mb-2" />
            <p className="text-zinc-500 text-sm">No notifications yet.</p>
          </div>
        ) : (
          <div className="p-2 flex flex-col gap-1.5">
            {notifications.map((n) => {
              const { icon: Icon, color, bg } = getIconConfig(n.title);
              return (
                <div
                  key={n._id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!n.isRead) onMarkAsRead(n._id);
                  }}
                  className={`p-3 rounded-xl flex gap-3 items-start cursor-pointer select-none transition-colors
                    ${
                      n.isRead
                        ? "bg-transparent border border-transparent hover:bg-white/3"
                        : "bg-white/3 border border-blue-500/20 hover:bg-white/5"
                    }`}
                >
                  {/* Icon avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${bg}`}
                  >
                    <Icon size={16} className={color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-xs sm:text-sm truncate ${
                          n.isRead ? "text-zinc-300 font-normal" : "text-white font-medium"
                        }`}
                      >
                        {n.title}
                      </p>
                      {!n.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed break-words">
                      {n.message}
                    </p>
                    <span className="text-[11px] text-zinc-600 block mt-1.5">
                      {moment(n.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotifiCenter;
