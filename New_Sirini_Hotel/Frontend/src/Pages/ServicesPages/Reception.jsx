import React, { useState, useEffect, useRef } from "react";
import { ChevronsDown } from "lucide-react";
import receptionImg from "../../assets/reception.jpg";
import ReceptionHallPackages from "../../Components/Receptionhall/ReceptionHallPackages";
import BookingForm from "../../Components/Receptionhall/receptionform";
// import CustomizeEvents from "../../Components/Receptionhall/customizeevents";
import CateringItemCard from "../../Components/Receptionhall/CateringItemCard";
import AdvertismentSection from "../../Components/Receptionhall/AdvertismentSection";

export default function Reception() {
  // 2. State to handle form visibility
  const [showForm, setShowForm] = useState(false);
  // 2. Create the reference
  const formSectionRef = useRef(null);

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
      {/* Hero Section */}
      <section
        className="relative w-full h-screen overflow-hidden"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1745573673583-a51f665ae48e?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* <img
          src={receptionImg}
          alt="Reception"
          className="w-full h-full object-cover object-center"
        /> */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-[95vw]">
            <h1 className="font-cinzel text-7xl sm:text-9xl md:text-[15rem] lg:text-[20rem] font-semibold text-white leading-none mb-6 drop-shadow-[4px_4px_12px_rgba(0,0,0,0.8)]">
              Reception
            </h1>
            <p className="font-cormorant text-2xl sm:text-3xl md:text-4xl italic text-gray-200 tracking-wide mb-8">
              "Your special moments, handled with elegance."
            </p>

            {/* 3. The Toggle Button */}
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold uppercase tracking-widest text-sm hover:bg-gray-200 transition-all duration-300 shadow-lg"
            >
              {showForm ? "Close Booking" : "Book Your Visit"}
            </button>
          </div>
        </div>
        {/* NEW: Lucide Animated Scroll Arrow */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer z-20 group">
          <div className="animate-bounce flex flex-col items-center">
            <span className="font-cormorant text-base sm:text-lg uppercase tracking-[0.3em] mb-2 text-white drop-shadow-md transition-colors group-hover:text-amber-200">
              Explore
            </span>

            <ChevronsDown
              size={36}
              strokeWidth={1}
              className="text-white transition-colors group-hover:text-amber-400"
            />
          </div>
        </div>
      </section>
      {/* 4. Conditional Rendering for the Booking Form */}
      <div ref={formSectionRef}>
        {" "}
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
      <section className="bg-white py-14 px-4 sm:px-8">
        <div className="text-center mb-10">
          <h2 className="font-cinzel text-4xl sm:text-5xl md:text-6xl text-gray-800 mb-3">
            <span className="font-cormorant italic text-gray-700 font-light">
              Every Occasion
            </span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg md:text-xl mt-2 max-w-2xl mx-auto">
            From intimate engagements to grand corporate conferences, we curate
            exceptional experiences.
          </p>
        </div>
      </section>
      <ReceptionHallPackages />
      <CateringItemCard />
      <AdvertismentSection />
    </div>
  );
}
