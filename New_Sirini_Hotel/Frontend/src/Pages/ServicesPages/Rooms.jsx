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
      </header>
    </div>
  );
}

export default Rooms;
