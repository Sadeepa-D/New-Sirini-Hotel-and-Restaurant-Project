import React from "react";
import MainRoom from "../../assets/Rooms/Main_Room.png";

const rooms = [
  {
    id: 1,
    type: "Single Room",
    roomNo: "01",
    price: "$100",
    available: true,
    image: "https://via.placeholder.com/400x300",
  },
  {
    id: 2,
    type: "Double Room",
    roomNo: "02",
    price: "$150",
    available: false,
    image: "https://via.placeholder.com/400x300",
  },
  {
    id: 3,
    type: "Family Room",
    roomNo: "03",
    price: "$250",
    available: true,
    image: "https://via.placeholder.com/400x300",
  },
  {
    id: 4,
    type: "Single Room",
    roomNo: "04",
    price: "$80",
    available: true,
    image: "https://via.placeholder.com/400x300",
  },
];

function Rooms() {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/*This is Header Section */}
      <header className="relative h-[500px] flex flex-col items-center justify-center text-white text-center overflow-hidden">
        {/* Background Image */}
        <img
          src={MainRoom}
          alt="Hotel Room Header"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Dark Overlay for main room image*/}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Main room image text */}
        <div className="relative z-20 px-4 text-center">
          <h1
            className="text-6xl md:text-7xl font-serif mb-4 drop-shadow-lg 
      transition-all duration-700 hover:scale-110 hover:text-yellow-400 cursor-pointer"
          >
            Rooms
          </h1>

          <p
            className="italic text-xl md:text-2xl font-light tracking-wide drop-shadow-md 
      transition-all duration-700 hover:tracking-widest"
          >
            Peaceful rooms designed for your perfect stay
          </p>

          <button
            className="mt-8 px-8 py-3 bg-yellow-500 text-white rounded-full 
      text-lg font-medium shadow-lg transition-all duration-300 
      hover:bg-yellow-600 hover:scale-105 hover:shadow-2xl"
          >
            Explore Rooms
          </button>
        </div>
      </header>

      {/* Title for the room page*/}

      <main className="max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-3xl text-center font-serif mb-10 text-gray-800">
          Discover the perfect accommodation for your stay
        </h2>

        <div className="space-y-10">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="group flex flex-col md:flex-row bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 hover:border-orange-500/50 transition-all duration-500"
            >
              {/* Image Container with Zoom Effect */}
              <div className="md:w-5/12 overflow-hidden relative">
                <img
                  src={room.image}
                  alt={room.type}
                  className="w-full h-72 md:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Subtle gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              </div>

              {/* Info Container */}
              <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-between text-white bg-gradient-to-br from-[#111] to-black">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    {/* Room Price or Category Tag */}
                    <span className="text-orange-400 text-xs uppercase tracking-[0.2em] font-semibold">
                      Luxury Suite
                    </span>
                    <h3 className="text-4xl font-serif tracking-tight">
                      {room.type}
                    </h3>
                  </div>
                  <p className="text-right text-gray-500 font-light italic">
                    Room No: {room.roomNo}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-12">
                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`relative flex h-3 w-3`}>
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${room.available ? "bg-green-400" : "bg-red-400"}`}
                      ></span>
                      <span
                        className={`relative inline-flex rounded-full h-3 w-3 ${room.available ? "bg-green-500" : "bg-red-500"}`}
                      ></span>
                    </span>
                    <span className="text-sm font-medium tracking-wide text-gray-300 uppercase">
                      {room.available ? "Available" : "Reserved"}
                    </span>
                  </div>

                  {/* Luxury Button */}
                  <button
                    onClick={() => handleBookNow(room)}
                    disabled={!room.available}
                    className={`
              relative overflow-hidden px-10 py-3 rounded-full font-bold transition-all duration-300
              ${
                room.available
                  ? "bg-orange-500 text-black hover:bg-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }
            `}
                  >
                    <span className="relative z-10 uppercase text-xs tracking-widest">
                      {room.available ? "Book Now" : "Sold Out"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Rooms;
