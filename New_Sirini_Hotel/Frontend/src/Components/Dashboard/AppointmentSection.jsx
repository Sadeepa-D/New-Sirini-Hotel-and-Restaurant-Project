import React from "react";
import { CalendarDays, Edit2, XCircle } from "lucide-react";
import { StatusBadge } from "./SharedUI"; // Adjust path if needed

const AppointmentsSection = ({ data }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-xl font-bold text-gray-900 mb-6">My Appointments</h2>
      {data.map((app) => (
        <div
          key={app.id}
          className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-colors bg-gray-50/30 gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">
                {app.purpose}
              </h3>
              <StatusBadge status={app.status} />
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <CalendarDays size={14} /> {app.date} at {app.time}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit Appointment"
            >
              <Edit2 size={18} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors text-sm">
              <XCircle size={16} /> Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default AppointmentsSection;
