import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import receptionImg from "../../assets/reception.jpg";
import ReceptionHallPackages from "../../Components/Receptionhall/ReceptionHallPackages";
import BookingForm from "../../Components/Receptionhall/receptionform";
import CateringItemCard from "../../Components/Receptionhall/CateringItemCard";
import AdvertismentSection from "../../Components/Receptionhall/AdvertismentSection";
import Exploreindicator from "../../Components/Exploreindicator";
import Calander from "../../Components/Calander";
import CateringSelectionHub from "../../Components/Receptionhall/CateringSelectionHub";
import LoginMessage from "../../Components/LoginMessage";
import toast from "react-hot-toast";
import { Calendar } from "lucide-react";

export default function Reception() {
  const VITE_URL = import.meta.env.VITE_API_URL;

  const [showcalander, setShowCalander] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [bookedDates, setBookedDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isFabVisible, setIsFabVisible] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);
  const formSectionRef = useRef(null);

  const fetchBookedDates = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/booking/dates`,
      );

      const rawData = response.data;

      const normalized = rawData.map((item) => {
        const date = new Date(item.eventDate);
        const y = date.getUTCFullYear();
        const m = String(date.getUTCMonth() + 1).padStart(2, "0");
        const d = String(date.getUTCDate()).padStart(2, "0");
        return { dateStr: `${y}-${m}-${d}`, time: item.eventTime };
      });
      setBookedDates(normalized);
    } catch (error) {
      console.error("Error fetching booked dates:", error);
    } finally {
      setLoadingDates(false);
    }
  };

  useEffect(() => {
    fetchBookedDates();
  }, []);

  const handleadrequest = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      setShowForm(false);
      return;
    } else {
      setShowForm((prev) => !prev);
    }
  };

  useEffect(() => {
    if (showForm && formSectionRef.current) {
      formSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showForm]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show FAB after scrolling past hero (approx 100vh - header)
      setIsFabVisible(scrollY > windowHeight * 0.7);

      // Detect if near footer (approx 400px from bottom)
      setIsNearFooter(scrollY + windowHeight > documentHeight - 350);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* HERO SECTION - Aligned with MainPage */}
      <header className="relative w-full h-[calc(100vh-75px)] overflow-hidden flex flex-col items-center justify-center text-white text-center px-4">
        {/* Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1745573673583-a51f665ae48e?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content - centered in hero */}
        <div className="z-10 flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl md:text-6xl font-light">Reception Hall</h1>
          <p className="text-lg md:text-xl italic tracking-widest border-t border-b border-white py-2 px-4">
            Your special moments, handled with elegance
          </p>

          {/* Booking and calander Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
            <button
              onClick={() => handleadrequest()}
              className="bg-yellow-500 hover:bg-amber-700 text-black px-8 py-3 rounded-full font-semibold uppercase tracking-widest text-sm transition-all duration-300 shadow-lg mt-4"
            >
              {showForm ? "Close " : "Book Your Pre-Visit"}
            </button>
          </div>
        </div>

        {/* Explore arrow pinned to bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <Exploreindicator />
        </div>
      </header>
      {/* 4. Conditional Rendering for the Booking Form */}
      <div ref={formSectionRef}>
        {showForm && (
          <section className="px-4 sm:px-8 py-10 bg-neutral-100 border-b border-gray-200 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-center font-cinzel text-2xl mb-6 text-gray-800">
                Reservation Details
              </h3>
              <BookingForm />
            </div>
          </section>
        )}
      </div>
      {/* Content Section */}
      {/* <section className="bg-white py-8 sm:py-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="font-cinzel text-4xl sm:text-5xl text-gray-800 mb-4">
              <span className="font-cormorant italic text-gray-700 font-light">
                Every Occasion
              </span>
            </h2>
            <p className="text-gray-500 text-base sm:text-lg mt-2 leading-relaxed max-w-2xl">
              From intimate engagements to grand corporate conferences, we
              curate exceptional experiences.
            </p>
          </div>
        </div>
      </section> */}
      <ReceptionHallPackages />
      {/* <CateringItemCard /> */}
      <AdvertismentSection />
      {/* Calendar */}
      {showcalander && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Dark Background */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCalander(false)}
          />

          {/* Popup Calendar */}
          <div className="relative z-[101] animate-in fade-in zoom-in-95 duration-300">
            <Calander BookedDates={bookedDates} loading={loadingDates} />
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) - Smart visibility */}
      <div
        className={`fixed transition-all duration-500 ease-in-out z-[60] 
          ${isFabVisible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-10 pointer-events-none"}
          ${isNearFooter ? "bottom-[380px] md:bottom-[420px]" : "bottom-8"}
          right-8`}
      >
        <button
          className="relative group transition-all duration-300"
          onClick={() => setShowCalander(!showcalander)}
        >
          <div
            className="w-16 h-16 md:w-20 md:h-20 bg-amber-500 text-white flex items-center justify-center rounded-full shadow-2xl group-hover:bg-amber-600 group-hover:scale-110 transition-all duration-300"
            style={{ boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)" }}
          >
            <Calendar className="w-8 h-8 md:w-10 md:h-10" />
          </div>
        </button>
      </div>

      <LoginMessage
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
