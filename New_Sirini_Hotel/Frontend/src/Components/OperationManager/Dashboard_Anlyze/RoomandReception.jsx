import React, { useState, useEffect } from "react";
import { CalendarCheck, Megaphone, Users } from "lucide-react";
import axios from "axios";

const RoomandReception = () => {
  const [filter, setFilter] = useState("monthly");
  const [apointmentdata, setApointmentdata] = useState([]);
  const [advertismentdata, setadvertismentdata] = useState([]);
  const [packagedata, setPackageData] = useState([]);

  const VITE_URL = import.meta.env.VITE_API_URL;

  const fetchappointmentdata = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/appointment/view`,
      );
      setApointmentdata(response.data);
    } catch (error) {
      console.error("Error fetching appointment data:", error);
    }
  };
  const fetchadvertismentdata = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/advertisment/view`,
      );
      setadvertismentdata(response.data);
    } catch (error) {
      console.error("Error fetching advertisement data:", error);
    }
  };
  const fetchpackagedata = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/package/view`,
      );
      setPackageData(response.data);
    } catch (error) {
      console.error("Error fetching package data:", error);
    }
  };

  useEffect(() => {
    fetchappointmentdata();
    fetchadvertismentdata();
    fetchpackagedata();
  }, []);

  const activepackages = packagedata.filter(
    (pkg) => pkg.status === true,
  ).length;
  const inactivepackages = packagedata.filter(
    (pkg) => pkg.status === false,
  ).length;
  const activeads = advertismentdata.filter(
    (ad) => ad.status === "approved",
  ).length;
  const pendingads = advertismentdata.filter(
    (ad) => ad.status === "pending",
  ).length;
  const inactiveads = advertismentdata.filter(
    (ad) => ad.status === "rejected",
  ).length;
  const pendingReq = apointmentdata.filter(
    (req) => req.status === "Pending",
  ).length;
  const completedReq = apointmentdata.filter(
    (req) => req.status === "Completed",
  ).length;
  const cancelledReq = apointmentdata.filter(
    (req) => req.status === "Cancelled",
  ).length;
  const overdueReq = apointmentdata.filter((req) => {
    return req.status === "Pending" && new Date(req.date) < new Date();
  }).length;

  return (
    <div className="p-3 sm:p-4 md:p-8">
      {/* --- Advanced Analytics Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* Card 1: Package Inventory */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-xl transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <CalendarCheck size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Inventory
            </span>
          </div>
          <h4 className="text-gray-900 font-serif italic text-xl mb-6">
            Service Packages
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[9px] font-black uppercase text-green-500 mb-1">
                Active
              </p>
              <p className="text-2xl font-black text-gray-800">
                {activepackages}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[9px] font-black uppercase text-red-400 mb-1">
                Inactive
              </p>
              <p className="text-2xl font-black text-gray-800">
                {inactivepackages}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Advertisement Performance */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-xl transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Megaphone size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Marketing
            </span>
          </div>
          <h4 className="text-gray-900 font-serif italic text-xl mb-6">
            Advertisments
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2">
              <p className="text-[8px] font-black text-green-600 mb-1">LIVE</p>
              <p className="text-xl font-black">{activeads}</p>
            </div>
            <div className="text-center p-2 border-x border-gray-100">
              <p className="text-[8px] font-black text-amber-500 mb-1">
                PENDING
              </p>
              <p className="text-xl font-black">{pendingads}</p>
            </div>
            <div className="text-center p-2">
              <p className="text-[8px] font-black text-gray-400 mb-1">
                OFFLINE
              </p>
              <p className="text-xl font-black">{inactiveads}</p>
            </div>
          </div>
        </div>

        {/* Card 3: Appointment Hub (Full Width on Mobile, 3rd Col on Desktop) */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 lg:col-span-1 md:col-span-2 group hover:shadow-xl transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors">
              <Users size={24} />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-rose-500 uppercase">
                Alert
              </p>
              <p className="text-sm font-bold text-gray-800">
                {overdueReq} Overdue
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-bold text-gray-600 uppercase">
                  Pending Requests
                </span>
              </div>
              <span className="text-lg font-black">{pendingReq}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-bold text-gray-600 uppercase">
                  Completed
                </span>
              </div>
              <span className="text-lg font-black">{completedReq}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs font-bold text-gray-600 uppercase">
                  Cancelled
                </span>
              </div>
              <span className="text-lg font-black">{cancelledReq}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomandReception;
