import React, { useState, useEffect } from "react";

export default function CustomizeEvents() {
  const [itemsPerView, setItemsPerView] = useState(4);
  const [indices, setIndices] = useState({
    "Catering Services": 0,
    "Photography": 0,
    "Decorations": 0,
  });

  const categories = [
    {
      title: "Catering Services",
      items: [
        {
          name: "Tasteque",
          img: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/catering-services-poster-design-template-a9caf96a21a1f867fb5df1a07757d8ba_screen.jpg?ts=1737118156",
        },
        {
          name: "KingCatering",
          img: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/professional-catering-services-flyer-design-template-d6b61e583e37906ff15d2a0c593ddcfd_screen.jpg?ts=1718024458",
        },
      ],
    },
    {
      title: "Photography",
      items: [
        {
          name: "ShutterVibe",
          img: "https://img.pikbest.com/origin/06/13/58/70hpIkbEsTVRa.jpg!w700wp",
        },
        {
          name: "PixelAura",
          img: "https://img.pikbest.com/origin/06/16/45/81dpIkbEsTf6B.jpg!bw700",
        },
      ],
    },
    {
      title: "Decorations",
      items: [
        {
          name: "Heritage",
          img: "https://content.jdmagicbox.com/v2/comp/udupi/g5/0820px820.x820.170414105953.d1g5/catalogue/heritage-event-management-and-catering-service-brahmavara-udupi-event-management-companies-moue0jlgs4.jpg",
        },
        {
          name: "West Avenue",
          img: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/corporate-events-management-organizer-and-pla-design-template-b7cce3b227396aa8321939a833f1536c_screen.jpg?ts=1748851351",
        },
      ],
    },
  ];

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

  const handlePrev = (title) => {
    setIndices((prev) => ({
      ...prev,
      [title]: Math.max(0, prev[title] - 1),
    }));
  };

  const handleNext = (title, itemsLength) => {
    setIndices((prev) => ({
      ...prev,
      [title]: Math.min(itemsLength - itemsPerView, prev[title] + 1),
    }));
  };

  return (
    <section className="bg-neutral-200 min-h-screen py-12 px-6">

      {/* Title */}
      <h2 className="text-center text-4xl italic text-a font-bold mb-16">
        Customize Your Event
      </h2>

      <div className="max-w-7xl mx-auto space-y-20">

        {categories.map((cat, index) => (
          <div key={index} className="relative">

            {/* Category header */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-gray-900 text-2xl font-semibold border-l-4 border-amber-500 pl-4">{cat.title}</h3>

              <button className="bg-amber-600 hover:bg-amber-700 text-white text-sm px-4 py-2 rounded-lg transition-colors shadow-md">
                + Add new
              </button>
            </div>

            {/* Slider Container */}
            <div className="relative group">
              {/* Prev Button */}
              {indices[cat.title] > 0 && (
                <button
                  onClick={() => handlePrev(cat.title)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 bg-white hover:bg-amber-50 rounded-full shadow-xl flex items-center justify-center transition-all border border-amber-100 group-hover:scale-110"
                >
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Cards Wrapper */}
              <div className="overflow-hidden px-2">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(-${indices[cat.title] * (100 / itemsPerView)}%)`,
                  }}
                >
                  {cat.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 px-4"
                      style={{ width: `${100 / itemsPerView}%` }}
                    >
                      {/* Image Card */}
                      <div className="rounded-xl overflow-hidden shadow-lg bg-white group/card relative h-[450px]">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                          <button className="bg-amber-500 text-black font-bold py-2 px-6 rounded-full transform translate-y-4 group-hover/card:translate-y-0 transition-transform">
                            View Details
                          </button>
                        </div>
                      </div>

                      {/* Label */}
                      <div className="flex justify-center mt-6">
                        <span className="bg-amber-600 text-white text-sm px-8 py-2 rounded-full font-bold shadow-md tracking-wider">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              {indices[cat.title] < cat.items.length - itemsPerView && (
                <button
                  onClick={() => handleNext(cat.title, cat.items.length)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 bg-white hover:bg-amber-50 rounded-full shadow-xl flex items-center justify-center transition-all border border-amber-100 group-hover:scale-110"
                >
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}