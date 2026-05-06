import React, { useState, useEffect } from "react";
import axios from "axios";
import MainRoom from "../../assets/Rooms/Main_Room.png";
import BookingForm from "../../Components/RoomCompo/BookingForm";
import Exploreindicator from "../../Components/Exploreindicator";
import Calander from "../../Components/Calander";
import toast from "react-hot-toast";

function Rooms() {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [roomList, setRoomList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [bookedDates, setBookedDates] = useState([]);

  const fetchBookedDates = async (roomNumber) => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/rooms/unavailablerooms/dates/${roomNumber}`,
      );
      const rawData = response.data;

      const unavailableDates = [];

      const normalized = rawData.map((item) => {
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
      console.log("Fetched Booked Dates:", unavailableDates);
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
        setError("Failed to load rooms. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleBookNow = (room) => {
    if (!isLoggedIn) {
      toast.error("Please login to book a room");
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
    <div className="bg-[#f8f9fa] min-h-screen font-sans">
      {/* Header */}
      <header className="relative w-full h-[calc(100vh-120px)] overflow-hidden flex flex-col items-center justify-center text-white text-center px-4">
        {/* Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${MainRoom})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content - centered in hero */}
        <div className="z-10 flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl md:text-6xl font-light">Our Rooms</h1>
          <p className="text-lg md:text-xl italic tracking-widest border-t border-b border-white py-2 px-4">
            Peaceful rooms designed for your perfect stay
          </p>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"></div>

          {/* Explore arrow pinned to bottom */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
            <Exploreindicator />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8 md:py-16 px-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {roomList.map((room) => (
              <div
                key={room._id}
                className="flex flex-col lg:flex-row bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 group transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(249,115,22,0.15)] hover:-translate-y-1 lg:h-[400px]"
              >
                {/* Image Section */}
                <div className="w-full lg:w-5/12 relative h-[300px] lg:h-full overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.roomType}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md border border-white/30 px-4 py-2 rounded-2xl shadow-xl">
                    <p className="text-white text-[10px] uppercase tracking-widest font-medium opacity-90">
                      Room No.
                    </p>
                    <p className="text-white text-xl font-serif font-bold">
                      {room.roomNumber}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute bottom-8 left-8 transition-all duration-500 transform group-hover:-translate-y-2">
                    <span className="text-white text-[11px] font-black uppercase tracking-[0.2em]">
                      Price
                    </span>
                    <p className="text-white text-3xl font-bold">
                      Rs.{room.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Info Section */}
                <div className="w-full lg:w-7/12 p-8 md:p-10 flex flex-col justify-between bg-black relative">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <span className="text-9xl font-serif leading-none text-white">
                      {room.roomNumber}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-8 h-[1px] bg-orange-500"></span>
                      <span className="text-orange-500 text-[10px] font-black uppercase tracking-[0.3em]">
                        New Sirini Hotel Rooms
                      </span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-tight group-hover:text-orange-600 transition-colors duration-500">
                      {room.roomType}
                      <span className="text-lg font-serif text-white italic font-sans">
                        &nbsp;Room
                      </span>
                    </h3>

                    <p className="text-white text-sm md:text-base leading-relaxed mb-6 font-light max-w-md line-clamp-2">
                      {room.description ||
                        "A sanctuary of refined elegance, offering bespoke furnishings and panoramic views."}
                    </p>

                    <div className="flex flex-wrap gap-3 mb-6">
                      <div className="bg-gray-50 px-4 py-2 rounded-2xl flex flex-col items-center justify-center min-w-[90px] border border-gray-100 group-hover:bg-orange-50 transition-colors">
                        <span className="text-gray-900 font-bold text-xs">
                          {room.bedType}
                        </span>
                        <span className="text-[8px] text-gray-400 uppercase tracking-tighter">
                          Bed Type
                        </span>
                      </div>
                      <div className="bg-gray-50 px-4 py-2 rounded-2xl flex flex-col items-center justify-center min-w-[90px] border border-gray-100 group-hover:bg-orange-50 transition-colors">
                        <span className="text-gray-900 font-bold text-xs">
                          {room.capacity} Guests
                        </span>
                        <span className="text-[8px] text-gray-400 uppercase tracking-tighter">
                          Capacity
                        </span>
                      </div>
                      <div className="bg-gray-50 px-4 py-2 rounded-2xl flex flex-col items-center justify-center min-w-[90px] border border-gray-100 group-hover:bg-orange-50 transition-colors">
                        <span className="text-gray-900 font-bold text-xs">
                          {room.condition === "AC" ? "AC" : "Fan"}
                        </span>
                        <span className="text-[8px] text-gray-400 uppercase tracking-tighter">
                          Condition
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Footer */}
                  <div className="flex flex-row items-center justify-between gap-4 pt-6 border-t border-gray-50 mt-auto">
                    <div className="flex items-center gap-3">
                      <p
                        className={`text-[17px] font-black uppercase tracking-[0.2em] ${room.status === "available" ? "text-green-600" : room.status === "maintenance" ? "text-yellow-600" : "text-red-600"}`}
                      >
                        {room.status === "maintenance"
                          ? "Maintenance"
                          : room.status}
                      </p>
                    </div>

                    <button
                      onClick={() => handleBookNow(room)}
                      disabled={room.status !== "available"}
                      className={`relative overflow-hidden group/btn w-auto px-8 py-3 rounded-full font-black text-[9px] uppercase tracking-[0.2em] transition-all duration-500 ${room.status === "available" ? "bg-yellow-400 text-white hover:bg-orange-600 shadow-xl" : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none opacity-60"}`}
                    >
                      <span className="relative z-10">Book Now</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

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
