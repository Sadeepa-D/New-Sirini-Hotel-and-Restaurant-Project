import React, { useState } from "react";
import MainRoom from "../../assets/Rooms/Main_Room.png";
import room1 from "../../assets/Rooms/D_Image.jpg";
import BookingForm from "../../Components/RoomCompo/BookingForm";
import Exploreindicator from "../../Components/Exploreindicator";

// Current Room Data
const initialRooms = [
  {
    id: 1,
    type: "Single Room",
    roomNo: "01",
    price: 5000,
    available: true,
    image: room1,
    bed: "1 Single Bed",
    guests: 1,
  },
  {
    id: 2,
    type: "Double Room",
    roomNo: "02",
    price: 10000,
    available: false,
    image: room1,
    bed: "1 Queen Bed",
    guests: 2,
  },
  {
    id: 3,
    type: "Family Room",
    roomNo: "03",
    price: 12000,
    available: true,
    image: room1,
    bed: "2 Twin Beds",
    guests: 4,
  },
  {
    id: 4,
    type: "Single Room",
    roomNo: "04",
    price: 6000,
    available: true,
    image: room1,
    bed: "1 Single Bed",
    guests: 1,
  },
];

// Main Component
function Rooms() {
  const [roomList, setRoomList] = useState(initialRooms); // ← rooms in state now
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleBookNow = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  // ── Called after booking confirmed → marks room as unavailable ──
  // TODO: when backend is ready, replace with API call result
  const handleBookingConfirmed = (roomId) => {
    setRoomList((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, available: false } : r)),
    );
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* ── Header Section - Aligned with MainPage ── */}
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
        </div>

        {/* Explore arrow pinned to bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <Exploreindicator />
        </div>
      </header>

      {/* ── Page Title ── */}
      <main className="max-w-5xl mx-auto py-6 sm:py-12 px-3 sm:px-4">
        <h2 className="text-base sm:text-2xl md:text-3xl text-center font-serif mb-5 sm:mb-10 text-gray-800">
          Discover the perfect accommodation for your stay
        </h2>

        {/* ── Room Cards ── */}
        <div className="space-y-4 sm:space-y-6">
          {roomList.map(
            (
              room, // ← now uses roomList instead of rooms
            ) => (
              <div
                key={room.id}
                className="group flex flex-col md:flex-row bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 hover:border-orange-500/50 transition-all duration-500"
              >
                {/* ── Image Section ── */}
                <div className="w-full md:w-5/12 overflow-hidden relative h-[180px] sm:h-[220px] md:min-h-[180px] md:h-auto">
                  <img
                    src={room.image}
                    alt={room.type}
                    className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Room Number Badge — top left */}
                  <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4">
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-2 py-1 sm:px-3 sm:py-2 text-center">
                      <p className="text-orange-400 text-[7px] sm:text-[9px] uppercase tracking-widest font-semibold">
                        Room
                      </p>
                      <p className="text-white text-sm sm:text-lg font-serif font-bold leading-none">
                        {room.roomNo}
                      </p>
                    </div>
                  </div>

                  {/* Price Tag — bottom right */}
                  <div className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4">
                    <div className="bg-black/30 backdrop-blur-md border border-white/30 rounded-lg px-3 py-1 sm:px-6 sm:py-1.5">
                      <p className="text-white/60 text-[7px] sm:text-[8px] uppercase tracking-widest font-semibold">
                        Per Night
                      </p>
                      <p className="text-white text-sm sm:text-lg font-bold font-serif leading-tight">
                        Rs.{room.price}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Info Section ── */}
                <div className="w-full md:w-7/12 p-3.5 sm:p-5 md:p-7 flex flex-col justify-between text-white bg-gradient-to-br from-[#111] to-black">
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-tight mb-2">
                      {room.type}
                    </h3>

                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <span className="w-8 h-px bg-orange-500/60"></span>
                      <span className="w-1.5 h-1.5 bg-orange-500/60 rotate-45 inline-block"></span>
                      <span className="flex-1 h-px bg-white/5"></span>
                    </div>

                    {/* Spec Cards */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-2 sm:p-3 text-center hover:border-orange-500/30 transition-colors">
                        <div className="flex justify-center mb-1">
                          <svg
                            width="13"
                            height="13"
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                          >
                            <path d="M2 19V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10" />
                            <path d="M2 12h20" />
                            <path d="M6 12V7" />
                          </svg>
                        </div>
                        <p className="text-white text-[10px] sm:text-xs font-medium leading-snug">
                          {room.bed}
                        </p>
                        <p className="text-gray-600 text-[8px] sm:text-[10px] mt-1 uppercase tracking-wider">
                          Bed
                        </p>
                      </div>

                      <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-2 sm:p-3 text-center hover:border-orange-500/30 transition-colors">
                        <div className="flex justify-center mb-1">
                          <svg
                            width="13"
                            height="13"
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </div>
                        <p className="text-white text-[10px] sm:text-xs font-medium">
                          {room.guests} {room.guests === 1 ? "Guest" : "Guests"}
                        </p>
                        <p className="text-gray-600 text-[8px] sm:text-[10px] mt-1 uppercase tracking-wider">
                          Capacity
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status + Button */}
                  <div>
                    <div className="w-full h-px bg-white/[0.06] my-3 sm:my-4" />
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0">
                          <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${room.available ? "bg-green-400" : "bg-red-400"}`}
                          />
                          <span
                            className={`relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 ${room.available ? "bg-green-500" : "bg-red-500"}`}
                          />
                        </span>
                        <div>
                          <p
                            className={`text-[9px] sm:text-xs font-semibold uppercase tracking-widest ${room.available ? "text-green-400" : "text-red-400"}`}
                          >
                            {room.available ? "Available" : "Reserved"}
                          </p>
                          <p className="text-gray-600 text-[8px] sm:text-[10px] mt-0.5 hidden sm:block">
                            {room.available
                              ? "Ready to book"
                              : "Currently occupied"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBookNow(room)}
                        disabled={!room.available}
                        className={`
                        group/btn relative overflow-hidden px-4 sm:px-8 py-2 sm:py-3 rounded-full font-bold transition-all duration-300 text-[9px] sm:text-xs uppercase tracking-widest whitespace-nowrap flex-shrink-0
                        ${
                          room.available
                            ? "bg-orange-500 text-black hover:bg-orange-400 hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] active:scale-95"
                            : "bg-gray-800 text-gray-500 cursor-not-allowed"
                        }
                      `}
                      >
                        {room.available && (
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500" />
                        )}
                        <span className="relative z-10">
                          {room.available ? "Book Now →" : "Booked"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </main>

      {/* ── BookingForm Modal ── */}
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
