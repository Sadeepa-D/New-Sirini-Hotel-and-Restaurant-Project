import React, { useState, useEffect } from "react";
import axios from "axios";
import MainRoom from "../../assets/Rooms/Main_Room.png";
import BookingForm from "../../Components/RoomCompo/BookingForm";
import Exploreindicator from "../../Components/Exploreindicator";

function Rooms() {
  const [roomList, setRoomList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/rooms/viewrooms",
        );
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
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleBookingConfirmed = (roomId) => {
    setRoomList((prev) =>
      prev.map((r) => (r._id === roomId ? { ...r, status: "reserved" } : r)),
    );
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans">
      {/* Header */}
      <header className="relative w-full h-[70vh] md:h-screen overflow-hidden">
        {/* Background Image */}
        <img
          src={MainRoom}
          alt="Luxury Room Header"
          className="w-full h-full object-cover object-center transition-transform duration-[2000ms] hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/40 shadow-inner"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1
            className="font-serif font-bold text-white 
                 text-4xl md:text-7xl lg:text-8xl 
                 drop-shadow-[4px_4px_15px_rgba(0,0,0,0.8)]
                 leading-tight transition-all duration-700"
          >
            Our Rooms
          </h1>
          <p className="text-white/90 italic text-sm md:text-xl font-light tracking-widest max-w-2xl drop-shadow-md">
            Peaceful rooms designed for your perfect stay
          </p>

          <Exploreindicator />
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
                className="flex flex-col lg:flex-row bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 group transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(249,115,22,0.15)] hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="w-full lg:w-5/12 relative h-[300px] lg:h-auto overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.roomType}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />

                  <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-2xl shadow-xl">
                    <p className="text-white text-[10px] uppercase tracking-widest font-medium opacity-90">
                      Room No.
                    </p>
                    <p className="text-white text-xl font-serif font-bold">
                      {room.roomNumber}
                    </p>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute bottom-8 left-8 transition-all duration-500 transform group-hover:-translate-y-2">
                    <span className=" text-white text-[11px] font-black uppercase tracking-[0.2em]">
                      Price
                    </span>
                    <p className="text-white text-3xl font-bold">
                      Rs.{room.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                {/* --- Info Section --- */}
                <div className="w-full lg:w-7/12 p-8 md:p-12 flex flex-col justify-between bg-white relative">
                  {/* Decorative Background Element */}
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <span className="text-9xl font-serif">
                      {room.roomNumber}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-8 h-[1px] bg-orange-500"></span>
                      <span className="text-orange-500 text-[10px] font-black uppercase tracking-[0.3em]">
                        Luxury Collection
                      </span>
                    </div>

                    <h3 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 leading-tight group-hover:text-orange-600 transition-colors duration-500">
                      {room.roomType}{" "}
                      <span className="text-lg font-light text-gray-400 font-sans italic">
                        Room
                      </span>
                    </h3>

                    <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 font-light max-w-md">
                      {room.description ||
                        "A sanctuary of refined elegance, offering bespoke furnishings and panoramic views for the discerning traveler."}
                    </p>

                    {/* Feature Grid */}
                    <div className="flex flex-wrap gap-4 mb-10">
                      <div className="bg-gray-50 px-6 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[100px] border border-gray-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                        <span className="text-gray-900 font-bold text-sm">
                          {room.bedType}
                        </span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-tighter">
                          Bed Type
                        </span>
                      </div>
                      <div className="bg-gray-50 px-6 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[100px] border border-gray-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                        <span className="text-gray-900 font-bold text-sm">
                          {room.capacity} Guests
                        </span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-tighter">
                          Capacity
                        </span>
                      </div>
                      <div className="bg-gray-50 px-6 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[100px] border border-gray-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                        <span className="text-gray-900 font-bold text-sm">
                          {room.condition === "AC"
                            ? "Air Conditioned"
                            : "Fan Cooled"}
                        </span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-tighter">
                          Condition
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* --- Status & Footer --- */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-8 border-t border-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center justify-center">
                        <div
                          className={`w-3 h-3 rounded-full animate-ping absolute opacity-20 ${
                            room.status === "available"
                              ? "bg-green-500"
                              : room.status === "maintenance"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                        <div
                          className={`w-3 h-3 rounded-full relative shadow-sm ${
                            room.status === "available"
                              ? "bg-green-500"
                              : room.status === "maintenance"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                      </div>
                      <p
                        className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                          room.status === "available"
                            ? "text-green-600"
                            : room.status === "maintenance"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {room.status === "maintenance"
                          ? "Under Maintenance"
                          : room.status}
                      </p>
                    </div>

                    <button
                      onClick={() => handleBookNow(room)}
                      disabled={room.status !== "available"}
                      className={`relative overflow-hidden group/btn w-full sm:w-auto px-14 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 
          ${
            room.status === "available"
              ? "bg-gray-900 text-white hover:bg-orange-600 shadow-xl shadow-gray-200"
              : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none opacity-60"
          }`}
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
        <BookingForm
          selectedRoom={selectedRoom}
          onClose={() => setIsModalOpen(false)}
          onConfirmed={handleBookingConfirmed}
        />
      )}
    </div>
  );
}

export default Rooms;
