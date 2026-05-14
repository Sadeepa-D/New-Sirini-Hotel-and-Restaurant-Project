import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
} from "lucide-react";
import LiqourCard from "../../Components/LiqourStore/LiqourCard";
import LiquorComparisonComp from "../../Components/LiqourStore/LiquorComparisonComp";
import LiquorDetailsComp from "../../Components/LiqourStore/LIquorDetailsComp";
import Exploreindicator from "../../Components/Exploreindicator";

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
    setBeerIndex(Math.max(0, beerIndex - itemsPerView));
  };

  const handleNextBeer = () => {
    setBeerIndex((prev) =>
      Math.min(filteredBeerDrinks.length - itemsPerView, prev + itemsPerView),
    );
  };

  const handlePrevOthers = () => {
    setOthersIndex(Math.max(0, othersIndex - itemsPerView));
  };

  const handleNextOthers = () => {
    setOthersIndex(
      Math.min(
        filteredOtherDrinks.length - itemsPerView,
        othersIndex + itemsPerView,
      ),
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

  const GAP = 16;
  const cardWidth = `calc((100% - ${GAP * (itemsPerView - 1)}px) / ${itemsPerView})`;
  const visibleBeerDrinks = filteredBeerDrinks.slice(
    beerIndex,
    beerIndex + itemsPerView,
  );
  const canGoBackBeer = beerIndex > 0;
  const canGoNextBeer = beerIndex + itemsPerView < filteredBeerDrinks.length;
  const visibleOtherDrinks = filteredOtherDrinks.slice(
    othersIndex,
    othersIndex + itemsPerView,
  );
  const canGoBackOthers = othersIndex > 0;
  const canGoNextOthers =
    othersIndex + itemsPerView < filteredOtherDrinks.length;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* HERO SECTION - Aligned with MainPage */}
      <header className="relative w-full h-[calc(100vh-75px)] overflow-hidden flex flex-col items-center justify-center text-white text-center px-4">
        {/* Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1557149559-d74af2d38a1a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content - centered in hero */}
        <div className="z-10 flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl md:text-6xl font-light">Our Liquor Store</h1>
          <p className="text-lg md:text-xl italic tracking-widest border-t border-b border-white py-2 px-4">
            A perfect drink for every celebration
          </p>
        </div>

        {/* Explore arrow pinned to bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <Exploreindicator />
        </div>
      </header>

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
              {canGoBackBeer && (
                <button
                  onClick={handlePrevBeer}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-neutral-900" />
                </button>
              )}

              <div
                key={beerIndex}
                className="flex gap-4"
                style={{ animation: "fadeIn 0.25s ease" }}
              >
                {visibleBeerDrinks.map((drink) => (
                  <div
                    key={drink._id}
                    className="shrink-0"
                    style={{ width: cardWidth }}
                  >
                    <LiqourCard drink={drink} onClick={handleDrinkClick} />
                  </div>
                ))}
              </div>

              {canGoNextBeer && (
                <button
                  onClick={handleNextBeer}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-neutral-900" />
                </button>
              )}

              {filteredBeerDrinks.length > itemsPerView && (
                <div className="flex justify-center gap-1.5 mt-4">
                  {Array.from({
                    length: Math.ceil(filteredBeerDrinks.length / itemsPerView),
                  }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setBeerIndex(i * itemsPerView)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        Math.floor(beerIndex / itemsPerView) === i
                          ? "bg-amber-500"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-6">Others</h3>

            <div className="relative">
              {canGoBackOthers && (
                <button
                  onClick={handlePrevOthers}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-neutral-900" />
                </button>
              )}

              <div
                key={othersIndex}
                className="flex gap-4"
                style={{ animation: "fadeIn 0.25s ease" }}
              >
                {visibleOtherDrinks.map((drink) => (
                  <div
                    key={drink._id}
                    className="shrink-0"
                    style={{ width: cardWidth }}
                  >
                    <LiqourCard drink={drink} onClick={handleDrinkClick} />
                  </div>
                ))}
              </div>

              {canGoNextOthers && (
                <button
                  onClick={handleNextOthers}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-neutral-900" />
                </button>
              )}

              {filteredOtherDrinks.length > itemsPerView && (
                <div className="flex justify-center gap-1.5 mt-4">
                  {Array.from({
                    length: Math.ceil(
                      filteredOtherDrinks.length / itemsPerView,
                    ),
                  }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setOthersIndex(i * itemsPerView)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        Math.floor(othersIndex / itemsPerView) === i
                          ? "bg-amber-500"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
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
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LiquorStore;
