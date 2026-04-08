import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import LiqourCard from "../../Components/LiqourStore/LiqourCard";
import LiquorComparisonComp from "../../Components/LiqourStore/LiquorComparisonComp";
import LiquorDetailsComp from "../../Components/LiqourStore/LIquorDetailsComp";

const LiquorStore = () => {
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [beerIndex, setBeerIndex] = useState(0);
  const [othersIndex, setOthersIndex] = useState(0);
  const [liquorItems, setLiquorItems] = useState([]);

  const [itemsPerView, setItemsPerView] = useState(4);

  const fetchliquor = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/liquor/get`,
      );
      const data = response.data;
      setLiquorItems(data);
      if (data.length > 0) {
        const prices = data.map((item) => item.price);

        const min = Math.min(...prices);
        const max = Math.max(...prices);

        setMinPrice(min);
        setMaxPrice(max);

        setPriceRange([min, max]);
      }
    } catch (error) {
      console.error("Error fetching liquor items:", error);
    }
  };

  useEffect(() => {
    fetchliquor();
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

  useEffect(() => {
    setBeerIndex(0);
    setOthersIndex(0);
  }, [priceRange]);

  const handleDrinkClick = (drink) => {
    setSelectedDrink(drink);
    setIsModalOpen(true);
  };

  const handlePrevBeer = () => {
    setBeerIndex(Math.max(0, beerIndex - 1));
  };

  const handleNextBeer = () => {
    setBeerIndex((prev) =>
      Math.max(0, Math.min(filteredBeerDrinks.length - itemsPerView, prev + 1)),
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
  const filteredBeerDrinks = liquorItems.filter(
    (drink) =>
      drink.category === "Beer" &&
      drink.price >= priceRange[0] &&
      drink.price <= priceRange[1],
  );

  const filteredOtherDrinks = liquorItems.filter(
    (drink) =>
      drink.category !== "Beer" &&
      drink.price >= priceRange[0] &&
      drink.price <= priceRange[1],
  );

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
          <div className="grid grid-cols-1 md:grid-cols-3 items-center mb-12 gap-6">
            {/* Left: Compare Button */}
            <div className="flex justify-center md:justify-start">
              <button
                onClick={() => setIsComparisonOpen(true)}
                className="px-6 py-3 bg-yellow-500 hover:bg-amber-700 text-black rounded-lg font-medium transition-colors shadow-md whitespace-nowrap flex items-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                Compare Drinks
              </button>
            </div>

            {/* Center: Title */}
            <div className="flex justify-center">
              <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 relative inline-block">
                Our Drinks
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-amber-500 rounded-full"></span>
              </h2>
            </div>

            {/* Right: Price Filter */}
            <div className="flex justify-center md:justify-end">
              <div className="flex items-center gap-2 md:gap-4 bg-yellow-500 px-3 md:px-5 py-3 rounded-xl shadow-md border border-neutral-100 max-w-full overflow-x-auto">
                <span className="text-xs md:text-sm text-black font-semibold uppercase tracking-wider whitespace-nowrap">
                  Price
                </span>
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-xs md:text-sm font-bold text-black min-w-[3ch]">
                    LKR:{priceRange[0]}
                  </span>
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([minPrice, parseInt(e.target.value)])
                    }
                    className="w-20 md:w-32 accent-black cursor-pointer"
                  />
                  <span className="text-xs md:text-sm font-bold text-black min-w-[4ch]">
                    LKR:{priceRange[1]}
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
                  <ChevronLeft className="w-6 h-6 text-neutral-900" />
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
                      key={drink._id}
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
                  <ChevronRight className="w-6 h-6 text-neutral-900" />
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
                  <ChevronLeft className="w-6 h-6 text-neutral-900" />
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
                      key={drink._id}
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
                  <ChevronRight className="w-6 h-6 text-neutral-900" />
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
        allDrinks={liquorItems}
      />
    </div>
  );
};

export default LiquorStore;
