import React from "react";
import { useState } from "react"
import { Container } from 'react-bootstrap';
import resturantImg from "../assets/resturant.png";
import chickenRiceImg from "../assets/Resturant/chickenrice.jpg";


const cardsData = [
  { title: "Chicken Rice", text: "Price: Rs.350", img: chickenRiceImg },
  { title: "Card 2", text: "This is card 2", img: chickenRiceImg },
  { title: "Card 3", text: "This is card 3", img: chickenRiceImg },
  { title: "Card 4", text: "This is card 4", img: chickenRiceImg },
  { title: "Card 5", text: "This is card 5", img: chickenRiceImg },
];

export default function Resturant() {
  const [startIndex, setStartIndex] = useState(0);

  const visibleCards = 4; // show 4 cards at a time

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + 1, cardsData.length - visibleCards));
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative w-full h-[650px] overflow-hidden">

        <img
          src={resturantImg}
          alt="Restaurant"
          className="w-full h-full object-cover object-center"
        />


        <h1 className="absolute inset-0 flex items-center justify-center 
                       text-center font-serif font-bold text-white 
                       text-3xl md:text-5xl lg:text-6xl 
                       drop-shadow-[2px_2px_8px_rgba(0,0,0,0.7)]">
          Eat well, laugh often, enjoy life
        </h1>


      </div>

      <br></br>
      {/* Menu Section */}
      <div className="px-4 py-8 md:py-12">
        <div className="mx-auto max-w-6xl border border-gray-300 bg-gray-50 rounded-lg px-6 py-10 md:py-12 text-center shadow-sm">
          <h1 className="text-5xl sm:text-6xl font-serif font-normal text-gray-800 mb-6">Menu</h1>
          <p className="text-gray-700 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-light">
            We believe good food starts with good ingredients. Our menu includes fresh, balanced dishes made using simple cooking methods to keep flavors natural and satisfying.
          </p>
        </div>
      </div>

      <br></br>
      {/* Main dishes card panel */}
      <Container>
        <h1> Main Deals </h1>
        <br></br>

        <div className="relative w-full max-w-7xl mx-auto px-12">
          {/* Previous button */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10 hover:bg-gray-700"
          >
            &#8592;
          </button>

          {/* Cards container */}
          <div className="flex overflow-hidden space-x-4">
            {cardsData.slice(startIndex, startIndex + visibleCards).map((card, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-lg w-64 flex-shrink-0 flex flex-col"
              >
                {/* Card image */}
                <img
                  src={card.img}
                  alt={card.title}
                  className="rounded-t-lg w-full h-40 object-cover"
                />

                {/* Card body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-lg mb-2">{card.title}</h5>
                    <p className="text-gray-600 mb-4">{card.text}</p>
                  </div>

                  {/* Card button */}
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center">
                    Go somewhere
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10 hover:bg-gray-700"
          >
            &#8594;
          </button>
        </div>
      </Container>
      <br></br>
    </div>
  );

}
