import React, { useState } from "react";
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
} from "lucide-react";

const AppointmentCard = ({ appointment }) => {
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

      <h3 className="text-gray-800 font-bold text-lg mb-3 flex items-center gap-2">
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

      <div className="mt-4 pt-3 flex gap-2">
        <button className="flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest bg-green-500 text-white hover:bg-green-600 transition-all shadow-sm">
          Complete
        </button>
        <button className="flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm">
          Cancel
        </button>
      </div>
    </div>
  );
};

const AppointmentMng = () => {
  const [activeTab, setActiveTab] = useState("Pending");

  // Sample static data for UI demonstration
  const dummyAppointments = [
    {
      _id: "1",
      name: "Sadeepa Dinakara",
      email: "sadeepa.14@yahoo.com",
      phone: "0760363685",
      date: "2026-03-16",
      status: "Completed",
    },
    {
      _id: "2",
      name: "Kasun Perera",
      email: "kasun@gmail.com",
      phone: "0712345678",
      date: "2026-04-20",
      status: "Pending",
    },
    {
      _id: "3",
      name: "Dilini Silva",
      email: "dilini@outlook.com",
      phone: "0771112223",
      date: "2026-01-10",
      status: "Overdue",
    },
    {
      _id: "4",
      name: "Nuwan Sameera",
      email: "nuwan@yahoo.com",
      phone: "0759998887",
      date: "2026-04-15",
      status: "Canceled",
    },
  ];

  const tabs = ["Pending", "Completed", "Canceled", "Overdue"];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <p className="text-amber-500 text-xs uppercase tracking-[0.3em] font-medium mb-1">
            Reception Hall
          </p>
          <h2 className="font-cinzel text-2xl sm:text-3xl text-gray-800 font-semibold">
            Booking Requests
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-white text-amber-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {dummyAppointments
          .filter((item) => item.status === activeTab)
          .map((app) => (
            <AppointmentCard key={app._id} appointment={app} />
          ))}

        {/* Empty State */}
        {dummyAppointments.filter((item) => item.status === activeTab)
          .length === 0 && (
          <div className="col-span-full py-20 text-center">
            <Filter size={40} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 text-sm tracking-widest uppercase">
              No {activeTab} requests found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentMng;
