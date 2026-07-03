import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BarChart3, ChevronLeft, ChevronRight, PackageX } from "lucide-react";
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
  const [liquorItems, setLiquorItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const beerSliderRef = useRef(null);
  const othersSliderRef = useRef(null);

  const scrollSection = (ref, direction) => {
    if (!ref.current) return;
    const cardWidth =
      ref.current.querySelector("[data-slider-card]")?.offsetWidth || 320;
    ref.current.scrollBy({
      left: direction * (cardWidth + 16),
      behavior: "smooth",
    });
  };

  const fetchliquor = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchliquor();
  }, []);

  const handleDrinkClick = (drink) => {
    setSelectedDrink(drink);
    setIsModalOpen(true);
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
      {/* HERO SECTION - Aligned with MainPage */}
      <header className="relative w-full h-80 sm:h-100 md:h-125 lg:h-[calc(100vh-75px)] overflow-hidden flex flex-col items-center justify-center text-white text-center px-4">
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
        <div className="z-10 flex flex-col items-center justify-center gap-1.5 sm:gap-4 max-w-[90%] sm:max-w-none">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light">
            Our Liquor Store
          </h1>
          <p className="text-[10px] sm:text-sm md:text-lg lg:text-xl italic tracking-wider sm:tracking-widest border-t border-b border-white py-1 px-2.5 sm:py-1.5 sm:px-3 md:py-2 md:px-4">
            A perfect drink for every celebration
          </p>
        </div>

        {/* Explore arrow pinned to bottom */}
        <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-10">
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
                style={{ borderRadius: "10px" }}
                className="px-6 py-3 bg-yellow-500 hover:bg-amber-700 text-black font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md whitespace-nowrap flex items-center gap-2"
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

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 w-full gap-5">
              {/* Custom CSS Liquor Bottle with Wobble effect */}
              <div className="relative w-20 h-28 flex flex-col items-center justify-end animate-[bounce_1.5s_infinite]">
                {/* Bottle Neck & Cap Container */}
                <div className="flex flex-col items-center origin-bottom animate-[pulse_1.2s_infinite]">
                  {/* Cap */}
                  <div className="w-5 h-3 bg-amber-700 rounded-t-sm shadow-inner"></div>
                  {/* Neck */}
                  <div className="w-4 h-8 bg-linear-to-r from-amber-500 to-amber-600 border-x border-amber-700/30"></div>
                </div>

                {/* Bottle Body */}
                <div className="w-14 h-18 bg-linear-to-b from-amber-400 to-amber-600 rounded-b-xl border-t-4 border-amber-700 relative overflow-hidden shadow-xl border">
                  {/* Liquid Glow Effect */}
                  <div className="absolute inset-x-0 bottom-0 top-1/4 bg-linear-to-t from-amber-700 to-amber-500 rounded-b-lg">
                    {/* Floating Bubbles */}
                    <span className="absolute bottom-2 left-3 w-2 h-2 bg-white/40 rounded-full animate-ping [animation-duration:1.4s]"></span>
                    <span className="absolute bottom-6 right-4 w-1 h-1 bg-white/30 rounded-full animate-ping [animation-duration:1s]"></span>
                    <span className="absolute bottom-4 left-7 w-1.5 h-1.5 bg-white/20 rounded-full animate-bubble opacity-70"></span>
                  </div>

                  {/* Classic Bottle Label */}
                  <div className="absolute top-4 inset-x-2 h-7 bg-yellow-50/90 border border-amber-800/40 rounded shadow-sm flex flex-col items-center justify-center p-0.5">
                    <div className="w-6 h-0.5 bg-amber-800/60 mb-0.5"></div>
                    <div className="w-4 h-0.5 bg-amber-800/40"></div>
                  </div>
                </div>
              </div>

              {/* Premium Message */}
              <div className="text-center">
                <p className="text-sm font-semibold text-amber-600 tracking-widest uppercase animate-pulse">
                  Pouring Your Drinks
                </p>
                <p className="text-[11px] text-neutral-400 mt-1 italic">
                  Preparing the finest selection...
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-neutral-900 mb-6">
                  Beer
                </h3>
                <div className="relative">
                  <button
                    onClick={() => scrollSection(beerSliderRef, -1)}
                    aria-label="Scroll left"
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg text-gray-600 hover:text-amber-500 hover:border-amber-400 transition-all active:scale-90"
                  >
                    <ChevronLeft size={18} strokeWidth={2.5} />
                  </button>
                  <div
                    ref={beerSliderRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1"
                  >
                    {filteredBeerDrinks.length === 0 && (
                      <div className="flex flex-col items-center justify-center gap-2 py-10 px-6 bg-gray-50 border border-gray-200 rounded-2xl text-center w-full">
                        <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-1">
                          <PackageX
                            size={22}
                            className="text-gray-400"
                            strokeWidth={1.5}
                          />
                        </div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                          No Beer Available
                        </p>
                        <p className="text-[11px] text-gray-400">
                          No items found in this section
                        </p>
                      </div>
                    )}
                    {filteredBeerDrinks.map((drink) => (
                      <div
                        key={drink._id}
                        data-slider-card
                        className="w-[85%] shrink-0 snap-start md:w-64"
                      >
                        <LiqourCard drink={drink} onClick={handleDrinkClick} />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => scrollSection(beerSliderRef, 1)}
                    aria-label="Scroll right"
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg text-gray-600 hover:text-amber-500 hover:border-amber-400 transition-all active:scale-90"
                  >
                    <ChevronRight size={18} strokeWidth={2.5} />
                  </button>
                  <p className="mt-2 text-center text-[10px] text-gray-400 font-medium tracking-wider md:hidden">
                    ← Swipe to browse →
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-6">
                  Others
                </h3>
                <div className="relative">
                  <button
                    onClick={() => scrollSection(othersSliderRef, -1)}
                    aria-label="Scroll left"
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg text-gray-600 hover:text-amber-500 hover:border-amber-400 transition-all active:scale-90"
                  >
                    <ChevronLeft size={18} strokeWidth={2.5} />
                  </button>
                  <div
                    ref={othersSliderRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1"
                  >
                    {filteredOtherDrinks.length === 0 && (
                      <div className="flex flex-col items-center justify-center gap-2 py-10 px-6 bg-gray-50 border border-gray-200 rounded-2xl text-center w-full">
                        <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-1">
                          <PackageX
                            size={22}
                            className="text-gray-400"
                            strokeWidth={1.5}
                          />
                        </div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                          No Others Available
                        </p>
                        <p className="text-[11px] text-gray-400">
                          No items found in this section
                        </p>
                      </div>
                    )}
                    {filteredOtherDrinks.map((drink) => (
                      <div
                        key={drink._id}
                        data-slider-card
                        className="w-[85%] shrink-0 snap-start md:w-64"
                      >
                        <LiqourCard drink={drink} onClick={handleDrinkClick} />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => scrollSection(othersSliderRef, 1)}
                    aria-label="Scroll right"
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg text-gray-600 hover:text-amber-500 hover:border-amber-400 transition-all active:scale-90"
                  >
                    <ChevronRight size={18} strokeWidth={2.5} />
                  </button>
                  <p className="mt-2 text-center text-[10px] text-gray-400 font-medium tracking-wider md:hidden">
                    ← Swipe to browse →
                  </p>
                </div>
              </div>
            </>
          )}
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
