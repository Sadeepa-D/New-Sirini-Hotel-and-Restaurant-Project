import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import AppointmentCard from "./AppointmentCard";

const AppointmentMng = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const VITE_URL = import.meta.env.VITE_API_URL;

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/appointment/view/${activeTab.toLowerCase()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setAppointments(response.data);
    } catch (err) {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [activeTab]);

  const sliderRef = useRef(null);
  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;
    const cardWidth =
      sliderRef.current.querySelector("[data-slider-card]")?.offsetWidth || 320;
    sliderRef.current.scrollBy({
      left: direction * (cardWidth + 16),
      behavior: "smooth",
    });
  };

  const handlestatuseChange = async (id, newStatus) => {
    const loadingtoast = toast.loading("Updating status to ${newStatus}...");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${VITE_URL}/api/receptionhall/appointment/update/${newStatus}/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.status === 200) {
        toast.success("Status updated successfully");
        fetchAppointments();
      }
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      toast.dismiss(loadingtoast);
    }
  };

  const tabs = ["Pending", "Completed", "Canceled", "Overdue"];

  const filteredAppointments = appointments.filter((app) => {
    const search = searchTerm.toLowerCase();
    return (
      app.name?.toLowerCase().includes(search) ||
      app.appointcode?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-3 sm:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <p className="text-amber-500 text-xs uppercase tracking-[0.3em] font-medium mb-1">
            Reception Hall
          </p>
          <h2 className="font-cinzel text-2xl sm:text-3xl text-gray-800 font-semibold whitespace-nowrap">
            Appointment Requests
          </h2>
        </div>
        <div className="w-full lg:w-72 md:max-w-md ml-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name or booking code..."
            className="w-full px-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-xl font-medium placeholder-gray-400 focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 focus:bg-white focus:outline-none text-xs transition-all duration-200"
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
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

      {/* Carousel Section */}
      {loading ? (
        <div className="py-20 text-center animate-pulse text-gray-400 uppercase tracking-widest text-sm font-bold">
          Loading...
        </div>
      ) : appointments.length === 0 ? (
        <div className="py-20 text-center">
          <Filter size={40} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 text-sm tracking-widest uppercase font-bold">
            No {activeTab} requests found
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scrollSlider(-1)}
            aria-label="Scroll left"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg text-gray-600 hover:text-amber-500 hover:border-amber-400 transition-all active:scale-90"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>

          {/* Scroll container */}
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1"
          >
            {filteredAppointments.map((app) => (
              <div
                key={app._id}
                data-slider-card
                className="w-full shrink-0 snap-start md:w-[calc(25%-12px)]"
              >
                <AppointmentCard
                  appointment={app}
                  onUpdate={handlestatuseChange}
                  isAdmin={true}
                />
              </div>
            ))}
            {!filteredAppointments.length && (
              <div className="w-full flex flex-col items-center justify-center py-16 px-4 bg-gray-50/40 rounded-2xl border border-dashed border-gray-200">
                <Filter
                  size={28}
                  className="text-gray-300 mb-2.5 stroke-[1.5]"
                />
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest text-center">
                  No record matches "{searchTerm}"
                </p>
              </div>
            )}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scrollSlider(1)}
            aria-label="Scroll right"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg text-gray-600 hover:text-amber-500 hover:border-amber-400 transition-all active:scale-90"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>

          {/* Mobile swipe hint */}
          <p className="mt-2 text-center text-[10px] text-gray-400 font-medium tracking-wider md:hidden">
            ← Swipe to browse →
          </p>
        </div>
      )}
    </div>
  );
};

export default AppointmentMng;
