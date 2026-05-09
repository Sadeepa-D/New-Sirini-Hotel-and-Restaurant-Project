import React, { useState, useEffect } from "react";
import axios from "axios";
import MainRoom from "../../assets/Rooms/Main_Room.png";
import Room_1 from "../../assets/Rooms/Room_1.jpg";
import Room_2 from "../../assets/Rooms/Room_2.jpg";
import Room_3 from "../../assets/Rooms/Room_3.webp";
import BookingForm from "../../Components/RoomCompo/BookingForm";
import Exploreindicator from "../../Components/Exploreindicator";
import Calander from "../../Components/Calander";
import toast from "react-hot-toast";
import LoginMessage from "../../Components/LoginMessage";
import { Bed, Users, Wind, Star, ArrowRight } from "lucide-react";

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

  // --- Slide Show Logic ---
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
        const res = await axios.get(`${VITE_URL}/api/rooms/viewrooms`);
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
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setSelectedRoom(room);
    setIsModalOpen(true);
    fetchBookedDates(room.roomNumber);
  };

  const handleBookingConfirmed = (roomId) => {
    console.log("Booking request received for room ID:", roomId);
  };

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans">
      {/* --- Hero Section with Slide Show --- */}
      <header className="relative w-full h-[calc(100vh-120px)] overflow-hidden flex flex-col items-center justify-center text-white text-center px-4 bg-black">
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

        {/* Content */}
        <div className="z-20 flex flex-col items-center gap-4 bg-black/50 backdrop-blur-md px-8 md:px-12 py-8 rounded-2xl border border-white/20">
          <h1 className="text-5xl md:text-6xl font-serif italic text-white">
            Our Rooms
          </h1>
          <p className="text-sm md:text-base uppercase tracking-[0.4em] font-light border-b border-white/30 pb-2 text-white/90">
            Experience Luxury Stay
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <Exploreindicator />
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto py-16 px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomList.map((room) => (
              <div
                key={room._id}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.roomType}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>

                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                    <span className="text-[10px] font-black uppercase text-gray-800 tracking-tighter">
                      Room {room.roomNumber}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 z-10">
                    <p className="text-white font-bold text-2xl drop-shadow-lg">
                      Rs.{room.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className="fill-orange-400 text-orange-400"
                      />
                    ))}
                  </div>
                  <h3 className="text-2xl font-serif italic text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {room.roomType} Room
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-6 line-clamp-2">
                    {room.description ||
                      "Elegant space designed for comfort and tranquility."}
                  </p>

                  <div className="flex items-center gap-4 mb-8">
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

                  <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${room.status === "available" ? "bg-green-500 animate-pulse" : "bg-red-400"}`}
                      />
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${room.status === "available" ? "text-green-600" : "text-gray-400"}`}
                      >
                        {room.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleBookNow(room)}
                      disabled={room.status !== "available"}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                        room.status === "available"
                          ? "bg-gray-900 text-white hover:bg-orange-600 shadow-lg"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Book <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <LoginMessage
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {isModalOpen && selectedRoom && (
        <>
          <BookingForm
            selectedRoom={selectedRoom}
            onClose={() => setIsModalOpen(false)}
            onConfirmed={handleBookingConfirmed}
          />
          <Calander BookedDates={bookedDates} />
        </>
      )}
    </div>
  );
}

export default Rooms;
