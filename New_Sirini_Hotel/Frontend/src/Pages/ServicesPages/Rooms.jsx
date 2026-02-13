import React from "react";
import MainRoom from "../../assets/Rooms/Main_Room.png";

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
      
     
      <h1 className="text-6xl md:text-7xl font-serif mb-4 drop-shadow-lg 
      transition-all duration-700 hover:scale-110 hover:text-yellow-400 cursor-pointer">
        Rooms
      </h1>

     
      <p className="italic text-xl md:text-2xl font-light tracking-wide drop-shadow-md 
      transition-all duration-700 hover:tracking-widest">
        Peaceful rooms designed for your perfect stay
      </p>

      
      <button className="mt-8 px-8 py-3 bg-yellow-500 text-white rounded-full 
      text-lg font-medium shadow-lg transition-all duration-300 
      hover:bg-yellow-600 hover:scale-105 hover:shadow-2xl">
        Explore Rooms
      </button>

    </div>

        
      </header>
    </div>
  );
}

export default Rooms;
