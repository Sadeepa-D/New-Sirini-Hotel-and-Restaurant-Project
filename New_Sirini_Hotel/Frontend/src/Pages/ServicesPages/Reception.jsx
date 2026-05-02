import React, { useState, useEffect, useRef } from "react";
import receptionImg from "../../assets/reception.jpg";
import ReceptionHallPackages from "../../Components/Receptionhall/ReceptionHallPackages";
import BookingForm from "../../Components/Receptionhall/receptionform";
import CateringItemCard from "../../Components/Receptionhall/CateringItemCard";
import AdvertismentSection from "../../Components/Receptionhall/AdvertismentSection";
import Exploreindicator from "../../Components/Exploreindicator";
import Calander from "../../Components/Calander";
import toast from "react-hot-toast";

export default function Reception() {
  // 2. State to handle form visibility
  const [showForm, setShowForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  // 2. Create the reference
  const formSectionRef = useRef(null);

  const handleadrequest = () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to place Your Appointment.");
      setShowForm(false);
      return;
    } else {
      setShowForm((prev) => !prev);
    }
  };

  // 3. Effect to scroll when showForm becomes true
  useEffect(() => {
    if (showForm && formSectionRef.current) {
      formSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showForm]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* HERO SECTION - Aligned with MainPage */}
      <header className="relative w-full h-[calc(100vh-120px)] overflow-hidden flex flex-col items-center justify-center text-white text-center px-4">
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

          {/* Booking Button */}
          <button
            onClick={() => handleadrequest()}
            className="bg-yellow-500 hover:bg-amber-700 text-black px-8 py-3 rounded-full font-semibold uppercase tracking-widest text-sm transition-all duration-300 shadow-lg mt-4"
          >
            {showForm ? "Close Booking" : "Book Your Visit"}
          </button>
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
      <section className="bg-white py-8 sm:py-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* Text Content */}
            <div className="flex flex-col justify-center">
              <h2 className="font-cinzel text-4xl sm:text-5xl text-gray-800 mb-4">
                <span className="font-cormorant italic text-gray-700 font-light">
                  Every Occasion
                </span>
              </h2>
              <p className="text-gray-500 text-base sm:text-lg mt-2 leading-relaxed">
                From intimate engagements to grand corporate conferences, we
                curate exceptional experiences.
              </p>
            </div>
            {/* Calendar */}
            <div className="flex justify-center lg:justify-end">
              <Calander />
            </div>
          </div>
        </div>
      </section>
      <ReceptionHallPackages />
      <CateringItemCard />
      <AdvertismentSection />
    </div>
  );
}
