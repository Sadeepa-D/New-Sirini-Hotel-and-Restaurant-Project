import React from "react";
import resturantImg from "../assets/resturant.png";

const meals = [
  {
    id: 1,
    name: "Chicken Rice",
    price: "LKR 350",
    ingredients: "rice, chicken",
    rating: 4,
    image: "https://images.unsplash.com/photo-1604908177522-04038e37c055",
  },
  {
    id: 2,
    name: "Noodles",
    price: "LKR 150",
    ingredients: "noodles, vegetables",
    rating: 5,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246",
  },
  {
    id: 3,
    name: "Kottu",
    price: "LKR 450",
    ingredients: "chicken, carrot",
    rating: 5,
    image: "https://images.unsplash.com/photo-1617196034738-26c5f8f8a5b1",
  },
  {
    id: 4,
    name: "Pasta",
    price: "LKR 400",
    ingredients: "macaroni, cheese",
    rating: 4,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
  },
];


export default function Resturant() {

  return (
    <div>
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] overflow-hidden">

        <img
          src={resturantImg}
          alt="Restaurant"
          className="w-full h-full object-cover object-center"
        />


        <h1 className="absolute inset-0 flex items-center justify-center 
                       text-center font-serif font-bold text-white 
                       text-xl md:text-5xl lg:text-6xl 
                       drop-shadow-[2px_2px_8px_rgba(0,0,0,0.7)] px-4">
          Eat well, laugh often, enjoy life
        </h1>


      </div>

      <br></br>
      {/* Menu Section */}
      <div className="px-4 py-4 md:py-12">
        <div className="mx-auto max-w-6xl border border-gray-300 bg-gray-50 rounded-lg px-4 py-6 md:px-6 md:py-12 text-center shadow-sm">
          <h1 className="text-4xl sm:text-6xl font-serif font-normal text-gray-800 mb-3 md:mb-6">Menu</h1>
          <p className="text-gray-700 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto font-light">
            We believe good food starts with good ingredients. Our menu includes fresh, balanced dishes made using simple cooking methods to keep flavors natural and satisfying.
          </p>
        </div>
      </div>

      <br></br>

      {/* Menu Items - main meals */}
      <div className="w-full bg-white py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Main Meals</h2>
          <br></br>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="bg-gray-700 rounded-xl overflow-hidden shadow-lg flex flex-col"
              >
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="h-70 w-full object-cover"
                />

                <div className="p-3 text-white flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-1">{meal.name}</h3>

                  <p className="text-xl mb-1">
                    <span className="font-medium">Price:</span> {meal.price}
                  </p>

                  <p className="text-xl mb-2">
                    <span className="font-medium">Ingredients:</span>{" "}
                    {meal.ingredients}
                  </p>

                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < meal.rating
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <button className="mt-auto bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition">
                    Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );

}
