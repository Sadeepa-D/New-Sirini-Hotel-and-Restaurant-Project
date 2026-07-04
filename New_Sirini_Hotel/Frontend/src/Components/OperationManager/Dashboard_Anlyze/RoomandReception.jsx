import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  Megaphone,
  Users,
  Bed,
  CheckCircle2,
  XCircle,
  Wrench,
  BarChart3,
  Coins,
  Zap,
} from "lucide-react";
import axios from "axios";

const RoomandReception = () => {
  const [filter, setFilter] = useState("monthly");
  const [apointmentdata, setApointmentdata] = useState([]);
  const [advertismentdata, setadvertismentdata] = useState([]);
  const [packagedata, setPackageData] = useState([]);
  const [roomdata, setRoomData] = useState([]);
  const [roombookingdata, setRoomBookingData] = useState([]);

  const VITE_URL = import.meta.env.VITE_API_URL;

  const fetchappointmentdata = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/appointment/view`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
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

  const fetchroom = async () => {
    try {
      const response = await axios.get(`${VITE_URL}/api/rooms/viewrooms`);
      setRoomData(response.data);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  const fetchroombookings = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${VITE_URL}/api/rooms/viewbookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoomBookingData(response.data);
    } catch (error) {
      console.error("Error fetching room booking data:", error);
    }
  };

  useEffect(() => {
    fetchappointmentdata();
    fetchadvertismentdata();
    fetchpackagedata();
    fetchroom();
    fetchroombookings();
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

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthAppointments = apointmentdata.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    return (
      appointmentDate.getMonth() === currentMonth &&
      appointmentDate.getFullYear() === currentYear
    );
  });

  const pendingReq = currentMonthAppointments.filter(
    (req) => req.status === "Pending",
  ).length;
  const completedReq = currentMonthAppointments.filter(
    (req) => req.status === "Completed",
  ).length;
  const cancelledReq = currentMonthAppointments.filter(
    (req) => req.status === "Cancelled",
  ).length;
  const overdueReq = currentMonthAppointments.filter((req) => {
    return req.status === "Pending" && new Date(req.date) < new Date();
  }).length;
  const totalrooms = roomdata.length;
  const availableRooms = roomdata.filter(
    (room) => room.status === "available",
  ).length;
  const bookedRooms = roomdata.filter(
    (room) => room.status === "reserved",
  ).length;
  const maintenanceRooms = roomdata.filter(
    (room) => room.status === "maintenance",
  ).length;
  const currentmonthbookings = roombookingdata.filter((booking) => {
    const bookingDate = new Date(booking.checkInDate);
    return (
      bookingDate.getMonth() === currentMonth &&
      bookingDate.getFullYear() === currentYear
    );
  });

  const totalmonthlybookings = currentmonthbookings.length;
  const monthlycompletedbookings = currentmonthbookings.filter(
    (booking) => booking.status === "Confirmed",
  ).length;
  const monthlycancelledbookings = currentmonthbookings.filter(
    (booking) => booking.status === "Cancelled",
  ).length;
  const monthlyRoomRevenue = currentmonthbookings.reduce((total, booking) => {
    if (total === null) total = 0;
    return booking.status === "Confirmed" || booking.status === "Completed"
      ? total + (booking.totalAmount || 0)
      : total;
  }, 0);
  const roomBookingCounts = currentmonthbookings.reduce((counts, booking) => {
    const roomNum = booking.roomNumber;
    counts[roomNum] = (counts[roomNum] || 0) + 1;
    return counts;
  }, {});

  const mostBookedRoom = Object.entries(roomBookingCounts).reduce(
    (max, entry) => (entry[1] > max[1] ? entry : max),
    ["None", 0],
  );

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
            Hotel Packages
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
                  Pending Appointments
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
      {/* --- Room Management Analysis Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {/* Card 4: Detailed Room Inventory */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Bed size={22} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
              Inventory
            </p>
          </div>
          <h4 className="text-gray-900 font-serif italic text-lg mb-4">
            Room Status
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold border-b border-gray-50 pb-2">
              <span className="text-gray-500">Available</span>
              <span className="text-green-600">{availableRooms}</span>
            </div>
            <div className="flex justify-between text-xs font-bold border-b border-gray-50 pb-2">
              <span className="text-gray-500">Booked</span>
              <span className="text-amber-600">{bookedRooms}</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-500">Maintenance</span>
              <span className="text-red-500 flex items-center gap-1">
                <Wrench size={10} /> {maintenanceRooms}
              </span>
            </div>
          </div>
        </div>
        {/* Card 5: Monthly Performance */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <BarChart3 size={22} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
              Volume
            </p>
          </div>
          <h4 className="text-gray-900 font-serif italic text-lg mb-4">
            Monthly Traffic
          </h4>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-gray-800">
              {totalmonthlybookings}
            </span>
            <span className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase">
              Reservations
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
              <p className="text-[8px] font-black text-green-700 uppercase">
                Success
              </p>
              <p className="text-sm font-black text-green-800">
                {monthlycompletedbookings}
              </p>
            </div>
            <div className="flex-1 bg-red-50 rounded-lg p-2 text-center">
              <p className="text-[8px] font-black text-red-700 uppercase">
                Failed
              </p>
              <p className="text-sm font-black text-red-800">
                {monthlycancelledbookings}
              </p>
            </div>
          </div>
        </div>
        {/* Card 6: Top Performer (The "Star" Room) */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <Zap size={22} />
            </div>
            <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-2 py-1 rounded-full uppercase">
              Peak Activity
            </span>
          </div>
          <h4 className="text-gray-900 font-serif italic text-lg mb-2">
            Hottest Room
          </h4>
          <p className="text-4xl font-black text-gray-800 mb-1">
            Room {mostBookedRoom[0]}
          </p>
          <p className="text-xs font-medium text-gray-500">
            <span className="mr-1">Occupied</span>
            <span className="text-amber-600 font-bold">
              {mostBookedRoom[1]} times
            </span>
            <span className="ml-1">this month</span>
          </p>
          <div className="absolute -bottom-4 -right-4 text-amber-500/5 rotate-12 group-hover:scale-110 transition-transform">
            <Zap size={120} />
          </div>
        </div>
        {/* Card 7: Room Revenue */}
        <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-[2rem] shadow-xl border border-white/5 group hover:border-amber-500/50 transition-all">
          <div className="flex justify-between items-center mb-6">
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 border border-amber-500/20">
              <Coins size={22} />
            </div>
            <p className="text-[9px] font-black text-amber-500/60 uppercase tracking-widest">
              Revenue Hub
            </p>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
            Total Room Income
          </p>
          <p className="text-3xl font-black text-white italic tracking-tighter">
            Rs. {monthlyRoomRevenue.toLocaleString()}
          </p>
          <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-[65%]" />
          </div>
          <p className="text-[9px] text-gray-500 mt-2 italic">
            Calculated from confirmed and completed stays
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomandReception;
