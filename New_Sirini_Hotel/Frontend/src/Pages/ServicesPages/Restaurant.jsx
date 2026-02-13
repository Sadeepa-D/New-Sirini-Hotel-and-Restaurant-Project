import React from 'react'
import resturantImg from '../../assets/resturant.png'

export default function Restaurant() {
    return (
        <div>
            {/* Hero Section */}
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[650px] overflow-hidden">
                <img
                    src={resturantImg}
                    alt="Restaurant"
                    className="w-full h-full object-cover object-center"
                />

                <h1 className="absolute inset-0 flex items-center justify-center 
                       text-center font-serif font-bold text-white 
                       text-2xl md:text-5xl lg:text-6xl 
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

      

        </div>
    )
}
