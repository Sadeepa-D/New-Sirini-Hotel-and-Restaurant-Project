import React, { useState, useEffect } from "react";
import axios from "axios";
import MainRoom from "../../assets/Rooms/Main_Room.png";
import Room_1 from "../../assets/Rooms/Room_1.png";
import Room_2 from "../../assets/Rooms/Room_2.jpg";
import Room_3 from "../../assets/Rooms/Room_3.webp";
import BookingForm from "../../Components/RoomCompo/BookingForm";
import RoomPackageInfo from "../../Components/RoomCompo/RoomPackageInfo";
import Exploreindicator from "../../Components/Exploreindicator";
import Calander from "../../Components/Calander";
import toast from "react-hot-toast";
import LoginMessage from "../../Components/LoginMessage";
import RoomFullDetails from "../../Components/RoomCompo/RoomFullDetails";
import StarRating from "../../Components/StarRating";
import ShowFeedback from "../../Components/ShowFeedback";
import {
  Bed,
  Users,
  Wind,
  Star,
  ArrowRight,
  Wifi,
  Droplets,
  Monitor,
  Refrigerator,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function Rooms() {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [roomList, setRoomList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [bookedDates, setBookedDates] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRoomForDetails, setSelectedRoomForDetails] = useState(null);
  const scrollContainerRef = React.useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 380; // Card width + gap
      const newPosition =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;
      container.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  //Slide show in main room page
  const backgroundImages = [Room_1, Room_2, Room_3];
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prev) =>
        prev === backgroundImages.length - 1 ? 0 : prev + 1,
      );
    }, 5000);
    return () => clearInterval(bgInterval);
  }, []);

  const fetchBookedDates = async (roomNumber) => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/rooms/unavailablerooms/dates/${roomNumber}`,
      );
      const rawData = response.data;
      const unavailableDates = [];
      rawData.map((item) => {
        const startdate = new Date(item.checkInDate);
        const enddate = new Date(item.checkOutDate);
        const current = new Date(startdate);
        while (current <= enddate) {
          const y = current.getUTCFullYear();
          const m = String(current.getUTCMonth() + 1).padStart(2, "0");
          const d = String(current.getUTCDate()).padStart(2, "0");
          unavailableDates.push(`${y}-${m}-${d}`);
          current.setDate(current.getDate() + 1);
        }
      });
      setBookedDates(unavailableDates);
    } catch (error) {
      console.error("Error fetching booked dates:", error);
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${VITE_URL}/api/rooms/viewrooms?t=${Date.now()}`, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        setRoomList(res.data);
      } catch (err) {
        setError("Failed to load rooms.");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [VITE_URL]);

  const handleBookNow = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
    fetchBookedDates(room.roomNumber);
  };

  const handleBookingConfirmed = (roomId) => {
    console.log("Booking request received for room ID:", roomId);
  };

  const handleViewRoomDetails = (room) => {
    setSelectedRoomForDetails(room);
    setShowDetailsModal(true);
  };

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans">
      {/*Slide show*/}
      <header className="relative w-full h-[320px] sm:h-[400px] md:h-[500px] lg:h-[calc(100vh-75px)] overflow-hidden flex flex-col items-center justify-center text-white text-center px-4 bg-black">
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentBgIndex
                  ? "translate-x-0 opacity-100 z-10"
                  : "translate-x-0 opacity-0 z-0"
              }`}
              style={{
                backgroundImage: `url(${backgroundImages[index]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          ))}
        </div>

        <div className="z-20 flex flex-col items-center gap-1.5 sm:gap-4 bg-white px-4 py-3.5 sm:px-8 sm:py-6 md:px-12 md:py-8 rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg w-[88%] sm:w-auto max-w-[280px] sm:max-w-none">
          <h1
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic text-black"
            style={{
              animation: "slideUpFadeIn 0.7s ease-out forwards",
            }}
          >
            Our Rooms
          </h1>
          <p
            className="text-[10px] sm:text-xs md:text-sm lg:text-base uppercase tracking-[0.2em] sm:tracking-[0.4em] font-light border-b border-gray-300 pb-1 sm:pb-2 text-gray-700 leading-normal"
            style={{
              animation: "slideUpFadeIn 0.7s ease-out 0.15s forwards",
            }}
          >
            The perfect end to your day.
          </p>
          <style>{`
            @keyframes slideUpFadeIn {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>

        <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-20">
          <Exploreindicator />
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-16 px-6">
        <RoomPackageInfo />
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="relative group/slider max-w-full">
            {/* Left Scroll Button */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-1 md:-left-6 lg:-left-12 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white/90 hover:bg-white text-orange-600 rounded-full shadow-lg border border-orange-200 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
              title="Scroll left"
            >
              <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* Cards Container */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-6 px-12 scroll-smooth snap-x snap-mandatory 
                         [&::-webkit-scrollbar]:h-2 
                         [&::-webkit-scrollbar-track]:bg-orange-500/10 
                         [&::-webkit-scrollbar-track]:rounded-full 
                         [&::-webkit-scrollbar-thumb]:bg-orange-500/60 
                         [&::-webkit-scrollbar-thumb]:rounded-full 
                         hover:[&::-webkit-scrollbar-thumb]:bg-orange-600 
                         [scrollbar-width:thin] 
                         [scrollbar-color:#f97316_rgba(249,115,22,0.1)]"
            >
              {roomList.map((room) => (
                <div
                  key={room._id}
                  onClick={() => handleViewRoomDetails(room)}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border border-gray-100 flex flex-col h-full w-80 sm:w-[350px] shrink-0 snap-start cursor-pointer"
                >
                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.roomType}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Dark Overlay in the image*/}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>

                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                      <span className="text-[10px] font-black uppercase text-gray-800 tracking-tighter">
                        Room {room.roomNumber}
                      </span>
                    </div>
                    {/* Price Pill Bar */}
                    <div className="absolute bottom-3 left-3 right-3 z-10">
                      <div className="flex items-stretch bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden divide-x divide-white/10">
                        {/* Night Price */}
                        <div className="flex-1 flex flex-col px-3 py-2">
                          <span className="text-white/50 text-[7px] uppercase tracking-[0.2em] font-semibold mb-0.5">Night Package</span>
                          <span className="text-white font-bold text-sm leading-none">
                            Rs. {(room.nightPackagePrice || 0).toLocaleString()}
                          </span>
                        </div>
                        {/* Short Stay Price */}
                        <div className="flex-1 flex flex-col px-3 py-2">
                          <span className="text-orange-300/80 text-[7px] uppercase tracking-[0.2em] font-semibold mb-0.5">Day Package</span>
                          <span className="text-orange-300 font-bold text-sm leading-none">
                            Rs. {(room.dayPackagePrice || 1500).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 flex flex-col flex-grow">
                    <div className="mb-2">
                      <StarRating roomNumber={room.roomNumber} size="sm" />
                    </div>
                    <h3 className="text-lg font-serif italic text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {room.roomType} Room
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-2.5 line-clamp-2">
                      {room.description ||
                        "Elegant space designed for comfort and tranquility."}
                    </p>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Bed size={14} className="text-orange-500" />
                        <span className="text-[11px] font-medium">
                          {room.bedType}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Users size={14} className="text-orange-500" />
                        <span className="text-[11px] font-medium">
                          {room.capacity} Guests
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Wind size={14} className="text-orange-500" />
                        <span className="text-[11px] font-medium">
                          {room.condition}
                        </span>
                      </div>
                    </div>

                    {room.facilities && room.facilities.length > 0 && (
                      <div className="mb-2 pb-2">
                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
                          Facilities
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {room.facilities.includes("WiFi") && (
                            <div className="flex items-center gap-1 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100">
                              <Wifi size={12} className="text-blue-500" />
                              <span className="text-[10px] font-medium text-blue-700">
                                WiFi
                              </span>
                            </div>
                          )}
                          {room.facilities.includes("Hot Water") && (
                            <div className="flex items-center gap-1 bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-100">
                              <Droplets size={12} className="text-red-500" />
                              <span className="text-[10px] font-medium text-red-700">
                                Hot Water
                              </span>
                            </div>
                          )}
                          {room.facilities.includes("TV") && (
                            <div className="flex items-center gap-1 bg-purple-50 px-2.5 py-1.5 rounded-lg border border-purple-100">
                              <Monitor size={12} className="text-purple-500" />
                              <span className="text-[10px] font-medium text-purple-700">
                                TV
                              </span>
                            </div>
                          )}
                          {room.facilities.includes("Mini Fridge") && (
                            <div className="flex items-center gap-1 bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-100">
                              <Refrigerator
                                size={12}
                                className="text-green-500"
                              />
                              <span className="text-[10px] font-medium text-green-700">
                                Mini Fridge
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-y-3">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border ${
                          room.status === "available"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            room.status === "available"
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-rose-500"
                          }`}
                        />
                        {room.status}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookNow(room);
                        }}
                        disabled={room.status !== "available"}
                        style={{ borderRadius: "12px" }}
                        className={`group relative flex items-center justify-center 
      w-full sm:w-fit px-6 py-3 sm:py-2.5 
      font-semibold text-[11px] sm:text-[10px] uppercase tracking-widest 
      transition-all duration-500 overflow-hidden ${
        room.status === "available"
          ? "bg-gray-900 text-white shadow-md hover:shadow-orange-500/20 hover:-translate-y-0.5 active:scale-95"
          : "bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100"
      }`}
                      >
                        {/* Hover Glow Effect */}
                        {room.status === "available" && (
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        )}

                        <span className="relative z-10 flex items-center gap-2">
                          Book Now
                          <ArrowRight
                            size={12}
                            className="shrink-0 transition-all duration-500 group-hover:translate-x-0.5 group-hover:rotate-[-45deg]"
                          />
                        </span>

                        {room.status === "available" && (
                          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Scroll Button */}
            <button
              onClick={() => scroll("right")}
              className="absolute right-1 md:-right-6 lg:-right-12 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white/90 hover:bg-white text-orange-600 rounded-full shadow-lg border border-orange-200 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
              title="Scroll right"
            >
              <ChevronRight size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        )}

        <div className="mt-16">
          <ShowFeedback />
        </div>
      </main>

      <LoginMessage
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <RoomFullDetails
        room={selectedRoomForDetails}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onBookNow={handleBookNow}
      />

      {isModalOpen && selectedRoom && (
        <>
          <BookingForm
            selectedRoom={selectedRoom}
            onClose={() => setIsModalOpen(false)}
            onConfirmed={handleBookingConfirmed}
            isLoggedIn={isLoggedIn}
            onRequireLogin={() => setShowLoginModal(true)}
          />
          <Calander BookedDates={bookedDates} />
        </>
      )}
    </div>
  );
}

export default Rooms;
