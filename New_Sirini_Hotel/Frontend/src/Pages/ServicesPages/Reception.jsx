import React from 'react'
import receptionImg from "../../assets/reception.jpg";
import ReceptionServices from '../../Components/Receptionhall/receptionservices';
import BookingForm from '../../Components/Receptionhall/receptionform';
import CustomizeEvents from '../../Components/Receptionhall/customizeevents';

export default function Reception() {
  return (
    <div className="min-h-screen bg-neutral-50">
      

      <section className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[700px] overflow-hidden">
        <img
          src={receptionImg}
          alt="Reception"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-[95vw]">

            {/* Main Title */}
            <h1 className="font-cinzel text-[10rem] sm:text-[14rem] md:text-[20rem] lg:text-[26rem] font-semibold text-white leading-none mb-6 drop-shadow-[4px_4px_12px_rgba(0,0,0,0.8)]">
              Reception
            </h1>

            {/* Subtitle */}
            <p className="font-cormorant text-2xl sm:text-3xl md:text-4xl italic text-gray-200 tracking-wide">
              "Your special moments, handled with elegance."
            </p>

          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-white py-14 px-4 sm:px-8">

        {/* Heading */}
        <div className="text-center mb-10">

          <h2 className="font-cinzel text-4xl sm:text-5xl md:text-6xl text-gray-800 mb-3">
            Perfect for{" "}
            <span className="font-cormorant italic text-gray-700 font-light">
              Every Occasion
            </span>
          </h2>

          <p className="text-gray-500 text-base sm:text-lg md:text-xl mt-2 max-w-2xl mx-auto">
            From intimate engagements to grand corporate conferences, we curate exceptional experiences.
          </p>

        </div>

      </section>

      <br></br>
      <ReceptionServices />


      <CustomizeEvents/>

      <BookingForm />

    </div>
  )
}