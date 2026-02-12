import React from "react";
import { Link } from "react-router-dom";

const MainPage = ({ isAuthenticated, user, onLogout }) => {
  const services = [
    {
      id: 1,
      title: "Reception",
      category: "RECEPTION",
      image:
        "https://images.unsplash.com/photo-1520483691742-bada60a1edd6?w=600&q=80",
      description: "Friendly service to assist you every step of your stay...",
    },
    {
      id: 2,
      title: "Rooms",
      category: "ROOMS",
      image:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80",
      description: "Comfortable rooms designed for rest and relaxation...",
    },
    {
      id: 3,
      title: "Restaurant",
      category: "RESTAURANT",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
      description:
        "Delicious food made with fresh ingredients in a relaxed setting...",
    },
    {
      id: 4,
      title: "Liquor",
      category: "LIQUOR",
      image:
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
      description: "Enjoy expertly selected spirits in a relaxed setting...",
    },
  ];

  const galleryCategories = [
    { id: "all", label: "All", active: true },
    { id: "reception", label: "Reception", active: false },
    { id: "rooms", label: "Rooms", active: false },
    { id: "restaurant", label: "Restaurant", active: false },
    { id: "liquor", label: "Liquor", active: false },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80)",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 tracking-wide">
            New Sirini Hotel
          </h1>

          <div className="mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full"></div>
              <div className="relative">
                <svg
                  className="w-32 h-32 md:w-40 md:h-40"
                  viewBox="0 0 200 200"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="1"
                  />
                  <text
                    x="100"
                    y="110"
                    textAnchor="middle"
                    className="fill-amber-500 text-5xl font-serif"
                  >
                    SH
                  </text>
                  <text
                    x="100"
                    y="145"
                    textAnchor="middle"
                    className="fill-amber-500 text-xs tracking-widest"
                  >
                    New Sirini Hotel
                  </text>
                </svg>
              </div>
            </div>
          </div>

          <p className="text-xl md:text-2xl text-white font-light tracking-widest mb-12">
            Stay. Relax. Enjoy.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="aspect-[3/4] relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                  <div className="absolute top-4 left-4 right-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-3 h-3 fill-amber-500"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="inline-block px-4 py-1 bg-amber-600 text-white text-xs font-semibold tracking-wider rounded mb-3">
                      {service.category}
                    </div>
                    <p className="text-gray-900 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {galleryCategories.map((category) => (
              <button
                key={category.id}
                className={`px-6 py-2 text-sm font-medium transition-colors rounded ${
                  category.active
                    ? "bg-transparent text-amber-500 border-b-2 border-amber-500"
                    : "text-gray-600 hover:text-amber-600"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <p className="text-neutral-500 text-lg">
              Gallery images will be displayed here
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="text-gray-900">
              <div className="flex items-center space-x-2 text-amber-500 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              <h2 className="text-3xl md:text-4xl font-serif mb-6">
                New Sirini Hotel
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                New Sirini Hotel in Kamburupitiya, Sri Lanka offers comfortable
                rooms, luxury dining, and event spaces for weddings and
                celebrations
              </p>

              <div className="flex items-center space-x-4">
                <a
                  href="#"
                  className="text-gray-900 hover:text-amber-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-900 hover:text-amber-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-neutral-800 rounded-lg overflow-hidden h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d80.54!3d6.23!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTMnNDguMCJOIDgwwrAzMicyNC4wIkU!5e0!3m2!1sen!2slk!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;
