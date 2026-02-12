import React, { useState } from "react";
import LiqourCard from "../../Components/LiqourCard";
import LiquorComparisonComp from "../../Components/LiquorComparisonComp";
import LiquorDetailsComp from "../../Components/LIquorDetailsComp";

const LiquorStore = () => {
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [beerIndex, setBeerIndex] = useState(0);
  const [othersIndex, setOthersIndex] = useState(0);

  const drinksData = [
    {
      id: "1",
      name: "Lion Lager",
      category: "Beer",
      price: 2.5,
      alcoholPercentage: 4.8,
      volume: "330ml",
      image:
        "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",
      brand: "Lion Brewery",
      origin: "Sri Lanka",
      description: "A crisp and refreshing lager beer with a smooth finish.",
    },
    {
      id: "2",
      name: "Carlsberg",
      category: "Beer",
      price: 3.0,
      alcoholPercentage: 5.0,
      volume: "330ml",
      image:
        "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&q=80",
      brand: "Carlsberg",
      origin: "Denmark",
      description: "Probably the best beer in the world.",
    },
    {
      id: "3",
      name: "Anchor Smooth",
      category: "Beer",
      price: 2.8,
      alcoholPercentage: 5.0,
      volume: "330ml",
      image:
        "https://images.unsplash.com/photo-1618885472179-5e474019f2a9?w=400&q=80",
      brand: "Asia Pacific Brewery",
      origin: "Singapore",
      description: "Smooth and easy drinking lager beer.",
    },
    {
      id: "4",
      name: "Heineken",
      category: "Beer",
      price: 3.5,
      alcoholPercentage: 5.0,
      volume: "330ml",
      image:
        "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=400&q=80",
      brand: "Heineken",
      origin: "Netherlands",
      description: "Premium quality lager with a distinctive taste.",
    },
    {
      id: "5",
      name: "Johnnie Walker Red",
      category: "Whisky",
      price: 25.0,
      alcoholPercentage: 40.0,
      volume: "700ml",
      image:
        "https://images.unsplash.com/photo-1527281400262-3b640bf75d39?w=400&q=80",
      brand: "Johnnie Walker",
      origin: "Scotland",
      description: "Bold, characterful whisky with a distinctive smoky flavor.",
    },
    {
      id: "6",
      name: "Johnnie Walker Black",
      category: "Whisky",
      price: 35.0,
      alcoholPercentage: 40.0,
      volume: "700ml",
      image:
        "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&q=80",
      brand: "Johnnie Walker",
      origin: "Scotland",
      description: "Premium blended Scotch whisky aged for 12 years.",
    },
    {
      id: "7",
      name: "Bacardi White",
      category: "Rum",
      price: 18.0,
      alcoholPercentage: 37.5,
      volume: "700ml",
      image:
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80",
      brand: "Bacardi",
      origin: "Puerto Rico",
      description: "Light and smooth white rum perfect for cocktails.",
    },
    {
      id: "8",
      name: "Jameson Irish Whiskey",
      category: "Whisky",
      price: 28.0,
      alcoholPercentage: 40.0,
      volume: "700ml",
      image:
        "https://images.unsplash.com/photo-1582818962902-1462cdbe0900?w=400&q=80",
      brand: "Jameson",
      origin: "Ireland",
      description: "Triple distilled Irish whiskey with a smooth taste.",
    },
  ];

  const beerDrinks = drinksData.filter((drink) => drink.category === "Beer");
  const otherDrinks = drinksData.filter((drink) => drink.category !== "Beer");

  const filteredBeerDrinks = beerDrinks.filter(
    (drink) => drink.price >= priceRange[0] && drink.price <= priceRange[1],
  );
  const filteredOtherDrinks = otherDrinks.filter(
    (drink) => drink.price >= priceRange[0] && drink.price <= priceRange[1],
  );

  const [itemsPerView, setItemsPerView] = useState(4);

  React.useEffect(() => {
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

  const handleDrinkClick = (drink) => {
    setSelectedDrink(drink);
    setIsModalOpen(true);
  };

  const handlePrevBeer = () => {
    setBeerIndex(Math.max(0, beerIndex - 1));
  };

  const handleNextBeer = () => {
    setBeerIndex(
      Math.min(filteredBeerDrinks.length - itemsPerView, beerIndex + 1),
    );
  };

  const handlePrevOthers = () => {
    setOthersIndex(Math.max(0, othersIndex - 1));
  };

  const handleNextOthers = () => {
    setOthersIndex(
      Math.min(filteredOtherDrinks.length - itemsPerView, othersIndex + 1),
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <section
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1920&q=80)",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">
            Liquor
          </h1>
          <p className="text-xl text-amber-100/90 italic">
            A perfect drink for every celebration
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Layout */}
          <div className="relative flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            {/* Left: Compare Button */}
            <div className="w-full md:w-1/3 flex justify-center md:justify-start order-2 md:order-1">
              <button
                onClick={() => setIsComparisonOpen(true)}
                className="px-6 py-3 bg-yellow-500 hover:bg-amber-700 text-black rounded-lg font-medium transition-colors shadow-md whitespace-nowrap flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Compare Drinks
              </button>
            </div>

            {/* Center: Title */}
            <div className="w-full md:w-1/3 text-center order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 relative inline-block">
                Our Drinks
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-amber-500 rounded-full"></span>
              </h2>
            </div>

            {/* Right: Price Filter */}
            <div className="w-full md:w-1/3 flex justify-center md:justify-end order-3">
              <div className="flex items-center gap-4 bg-yellow-500 px-5 py-3 rounded-xl shadow-md border border-neutral-100">
                <span className=" text-sm text-black font-semibold text-neutral-600 uppercase tracking-wider">
                  Price
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-amber-600 min-w-[3ch] text-black">
                    ${priceRange[0]}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([0, parseInt(e.target.value)])
                    }
                    className="w-32 accent-black cursor-pointer"
                  />
                  <span className="text-sm font-bold text-amber-600 min-w-[4ch] text-black">
                    ${priceRange[1]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-bold text-neutral-900 mb-6">Beer</h3>

            <div className="relative">
              {beerIndex > 0 && (
                <button
                  onClick={handlePrevBeer}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-neutral-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              <div className="overflow-hidden">
                <div
                  className="flex gap-4 sm:gap-6 transition-transform duration-300"
                  style={{
                    transform: `translateX(-${beerIndex * (100 / itemsPerView)}%)`,
                  }}
                >
                  {filteredBeerDrinks.map((drink) => (
                    <div
                      key={drink.id}
                      className="flex-shrink-0"
                      style={{
                        width: `calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * (itemsPerView === 1 ? 16 : 24)) / itemsPerView}px)`,
                      }}
                    >
                      <LiqourCard drink={drink} onClick={handleDrinkClick} />
                    </div>
                  ))}
                </div>
              </div>

              {beerIndex < filteredBeerDrinks.length - itemsPerView && (
                <button
                  onClick={handleNextBeer}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-neutral-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-6">Others</h3>

            <div className="relative">
              {othersIndex > 0 && (
                <button
                  onClick={handlePrevOthers}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-neutral-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              <div className="overflow-hidden">
                <div
                  className="flex gap-4 sm:gap-6 transition-transform duration-300"
                  style={{
                    transform: `translateX(-${othersIndex * (100 / itemsPerView)}%)`,
                  }}
                >
                  {filteredOtherDrinks.map((drink) => (
                    <div
                      key={drink.id}
                      className="flex-shrink-0"
                      style={{
                        width: `calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * (itemsPerView === 1 ? 16 : 24)) / itemsPerView}px)`,
                      }}
                    >
                      <LiqourCard drink={drink} onClick={handleDrinkClick} />
                    </div>
                  ))}
                </div>
              </div>

              {othersIndex < filteredOtherDrinks.length - itemsPerView && (
                <button
                  onClick={handleNextOthers}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-neutral-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <LiquorDetailsComp
        drink={selectedDrink}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <LiquorComparisonComp
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        allDrinks={drinksData}
      />
    </div>
  );
};

export default LiquorStore;
