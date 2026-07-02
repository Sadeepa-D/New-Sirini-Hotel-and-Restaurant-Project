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
} from "lucide-react";
import moment from "moment";
const NotifiCenter = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onClose,
}) => {
  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes("new")) {
      return <PlusCircle className="text-blue-500 shrink-0" size={18} />;
    }
    if (t.includes("cancel")) {
      return <XCircle className="text-red-500 shrink-0" size={18} />;
    }
    if (t.includes("delete")) {
      return <Trash2 className="text-rose-600 shrink-0" size={18} />;
    }
    if (t.includes("update")) {
      return <RefreshCw className="text-sky-400 shrink-0" size={18} />;
    }
    if (t.includes("preparing")) {
      return <ChefHat className="text-indigo-400 shrink-0" size={18} />;
    }
    if (t.includes("accepted") || t.includes("success")) {
      return <CheckCheck className="text-emerald-500 shrink-0" size={18} />;
    }
    if (t.includes("complete") || t.includes("checkout")) {
      return <CheckCheck className="text-teal-500 shrink-0" size={18} />;
    }
    if (t.includes("overdue")) {
      return <Clock className="text-amber-500 shrink-0" size={18} />;
    }
    return <AlertCircle className="text-zinc-400 shrink-0" size={18} />;
  };

  return (
    <div className="fixed md:absolute top-24 md:top-full left-4 md:left-0 right-4 md:right-auto mx-auto md:mx-0 mt-4 md:mt-4 w-[calc(100vw-2rem)] md:w-85 max-w-sm bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/2">
        <div>
          <h3 className="text-white font-medium text-sm sm:text-base">
            Notifications
          </h3>
          <p className="text-zinc-500 text-xs mt-0.5">
            You have {notifications.filter((n) => !n.isRead).length} unread
            messages
          </p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAllAsRead();
            }}
            className="text-xs font-semibold text-yellow-500 hover:text-yellow-400 transition-colors cursor-pointer bg-yellow-500/10 px-2.5 py-1 rounded-lg"
          >
            Mark all as read
          </button>
        )}
      </div>
      {/* Notifications List */}
      <div className="max-h-87.5 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            No notifications yet.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={(e) => {
                e.stopPropagation();
                if (!n.isRead) onMarkAsRead(n._id);
              }}
              className={`p-4 flex gap-3.5 items-start transition-all duration-200 cursor-pointer text-left select-none
                ${n.isRead ? "bg-transparent hover:bg-white/2" : "bg-yellow-500/3 hover:bg-yellow-500/5"}`}
            >
              {/* Icon */}
              <div className="mt-0.5">{getIcon(n.title)}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-xs sm:text-sm font-medium truncate ${n.isRead ? "text-zinc-300" : "text-white font-semibold"}`}
                  >
                    {n.title}
                  </p>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed wrap-break-word">
                  {n.message}
                </p>
                <span className="text-[12px] text-zinc-600 block mt-1.5">
                  {moment(n.createdAt).fromNow()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      {notifications.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-zinc-950 via-zinc-950/95 to-transparent flex justify-center pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClearAll();
            }}
            className="pointer-events-auto flex items-center justify-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-rose-600 border border-white/10 hover:border-rose-500 shadow-xl px-4 py-2 rounded-xl transition-all duration-300 scale-100 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Clear All Notifications</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default NotifiCenter;
