import React, { useState, useEffect } from "react";
import resturantImg from "../../assets/resturant.png";

const mealData = [
  {
    id: "1",
    name: "Chicken Rice",
    category: "Main Meals",
    price: 350,
    ingredients: ["Chicken", "Rice", "Vegetables"],
    label: "Spicy",
    image:
      "https://plus.unsplash.com/premium_photo-1694141252774-c937d97641da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2tlbiUyMHJpY2V8ZW58MHx8MHx8fDA%3D",
    description: "Chicken and rice, cooked to perfection.",
  },
  {
    id: "2",
    name: "Noodles",
    category: "Main Meals",
    price: 350,
    ingredients: ["Noodles", "Vegetables"],
    label: "Vegetarian",
    image:
      "https://allthenoodles.com/wp-content/uploads/2024/09/spicy-garlic-beef-noodles-9.jpg",
    description: "Noodles and vegetables, cooked to perfection.",
  },
  {
    id: "3",
    name: "Coca Cola",
    category: "Soft Drinks",
    price: 150,
    ingredients: ["Carbonated Water", "Sugar"],
    label: "Refreshing",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80",
    description: "Classic refreshing soft drink.",
  },
  {
    id: "4",
    name: "Orange Juice",
    category: "Fresh Juice",
    price: 250,
    ingredients: ["Fresh Oranges"],
    label: "Healthy",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80",
    description: "Freshly squeezed orange juice.",
  },
];

export default function Restaurant() {
  const [itemsPerView, setItemsPerView] = useState(4);
  const [mealsIndex, setMealsIndex] = useState(0);
  const [softdrinkIndex, setSoftdrinkIndex] = useState(0);
  const [freshJuiceIndex, setFreshJuiceIndex] = useState(0);

  const mainmeals = mealData.filter((meal) => meal.category === "Main Meals");
  const softdrinks = mealData.filter((meal) => meal.category === "Soft Drinks");
  const freshJuice = mealData.filter((meal) => meal.category === "Fresh Juice");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrevMeals = () => setMealsIndex(Math.max(0, mealsIndex - 1));
  const handleNextMeals = () =>
    setMealsIndex(Math.min(mainmeals.length - itemsPerView, mealsIndex + 1));

  const handlePrevSoftdrinks = () => setSoftdrinkIndex(Math.max(0, softdrinkIndex - 1));
  const handleNextSoftdrinks = () =>
    setSoftdrinkIndex(Math.min(softdrinks.length - itemsPerView, softdrinkIndex + 1));

  const handlePrevFreshJuice = () => setFreshJuiceIndex(Math.max(0, freshJuiceIndex - 1));
  const handleNextFreshJuice = () =>
    setFreshJuiceIndex(Math.min(freshJuice.length - itemsPerView, freshJuiceIndex + 1));

  const MenuSection = ({ title, items, index, onPrev, onNext }) => (
    <div className="mb-16">
      <h3 className="text-2xl font-bold text-neutral-900 mb-6">{title}</h3>
      <div className="relative">
        {index > 0 && (
          <button
            onClick={onPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div className="overflow-hidden">
          <div
            className="flex gap-4 sm:gap-6 transition-transform duration-300"
            style={{
              transform: `translateX(-${index * (100 / itemsPerView)}%)`,
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0"
                style={{
                  width: `calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * (itemsPerView === 1 ? 16 : 24)) / itemsPerView
                    }px)`,
                }}
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-100 h-full flex flex-col hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded">
                        {item.label}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h4 className="text-xl font-bold text-neutral-900 mb-1">{item.name}</h4>
                    <p className="text-sm text-neutral-500 mb-3">{item.ingredients.join(", ")}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-lg font-bold text-amber-600">Rs. {item.price}</span>
                      <button className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors">
                        Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {index < items.length - itemsPerView && (
          <button
            onClick={onNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[650px] overflow-hidden">
        <img
          src={resturantImg}
          alt="Restaurant"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <h1 className="absolute inset-0 flex items-center justify-center 
               text-center font-serif font-bold text-white 
               text-2xl md:text-5xl lg:text-6xl 
               drop-shadow-[2px_2px_8px_rgba(0,0,0,0.7)]">
          Eat well, laugh often, enjoy life
        </h1>
      </div>

      {/* Menu Header Section */}
      <div className="px-4 py-8 md:py-12">
        <div className="mx-auto max-w-6xl border border-gray-300 bg-gray-50 rounded-lg px-6 py-10 md:py-12 text-center shadow-sm">
          <h1 className="text-5xl sm:text-6xl font-serif font-normal text-gray-800 mb-6">Menu</h1>
          <p className="text-gray-700 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-light">
            We believe good food starts with good ingredients. Our menu includes fresh, balanced dishes made using simple cooking methods to keep flavors natural and satisfying.
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {mainmeals.length > 0 && (
          <MenuSection
            title="Main Meals"
            items={mainmeals}
            index={mealsIndex}
            onPrev={handlePrevMeals}
            onNext={handleNextMeals}
          />
        )}
        {softdrinks.length > 0 && (
          <MenuSection
            title="Soft Drinks"
            items={softdrinks}
            index={softdrinkIndex}
            onPrev={handlePrevSoftdrinks}
            onNext={handleNextSoftdrinks}
          />
        )}
        {freshJuice.length > 0 && (
          <MenuSection
            title="Fresh Juice"
            items={freshJuice}
            index={freshJuiceIndex}
            onPrev={handlePrevFreshJuice}
            onNext={handleNextFreshJuice}
          />
        )}
      </div>
    </div>
  );
}
