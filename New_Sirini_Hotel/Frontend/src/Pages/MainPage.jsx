import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import axios from "axios";
import Exploreindicator from "../Components/Exploreindicator";

const NewSiriniHotel = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Reception");

  const services = [
    {
      title: "Reception",
      desc: "Friendly service to assist you every step of your stay.",
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400",
      path: "/reception",
    },
    {
      title: "Rooms",
      desc: "Comfortable rooms designed for rest and relaxation.",
      img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=400",
      path: "/rooms",
    },
    {
      title: "Restaurant",
      desc: "Delicious food made with fresh ingredients.",
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400",
      path: "/restaurant",
    },
    {
      title: "Liquor",
      desc: "Enjoy expertly selected spirits in a relaxed setting.",
      img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=400",
      path: "/liquor",
    },
  ];

  const fetchgalleryItems = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/api/gallery/view`);
      setGalleryItems(response.data);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      setGalleryItems([]);
    }
  };

  useEffect(() => {
    fetchgalleryItems();
  }, []);

  const filteredGalleryItems = Array.isArray(galleryItems)
    ? galleryItems.filter((item) => item.category === activeFilter)
    : [];

  return (
    <div className="font-serif bg-gray-100 text-gray-900">
      {/* --- Hero Section --- */}
      {/* Hero Section */}
      <header className="relative w-full h-[calc(100vh-120px)] overflow-hidden flex flex-col items-center justify-center text-white text-center px-4">
        {/* Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url(https://plus.unsplash.com/premium_photo-1661963123153-5471a95b7042?q=80&w=1074&auto=format&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content — centered in hero */}
        <div className="z-10 flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl md:text-6xl font-light">New Sirini Hotel</h1>
          <img
            src={Logo}
            alt="New Sirini Hotel Logo"
            className="w-40 h-40 mx-auto object-contain"
          />
          <p className="text-lg md:text-xl italic tracking-widest border-t border-b border-white py-2 px-4">
            Stay, Relax, Enjoy
          </p>
        </div>

        {/* Explore arrow pinned to bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <Exploreindicator />
        </div>
      </header>

      {/* --- Services Section --- */}
      <section id="services" className="py-16 container mx-auto px-4">
        <h2 className="text-4xl text-center mb-12 font-serif">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <div
              key={idx}
              onClick={() => service.path && navigate(service.path)}
              className={`relative h-96 rounded-2xl overflow-hidden shadow-xl group hover:scale-[1.02] transition-all duration-300 ${
                service.path ? "cursor-pointer" : ""
              }`}
            >
              <img
                src={service.img}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-center translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="bg-amber-500 text-black font-serif text-xl px-8 py-2 rounded-full mb-4 shadow-lg transform -translate-y-2">
                  {service.title}
                </span>
                <p className="text-white text-lg font-light leading-relaxed opacity-90">
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Gallery Filter --- */}
      <section id="gallery" className="bg-gray-200 py-12 text-center">
        <h2 className="text-4xl mb-8 font-serif">Gallery</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {["Reception", "Rooms", "Restaurant"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-8 py-2 rounded-full text-sm font-medium tracking-wider transition-all duration-300 border ${
                activeFilter === cat
                  ? "bg-black text-white border-black shadow-lg scale-105"
                  : "bg-white text-gray-600 border-gray-200 hover:border-amber-500 hover:text-amber-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Dynamic Image Grid */}
        <div className="min-h-[400px]">
          {filteredGalleryItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGalleryItems.map((item) => (
                <div
                  key={item._id}
                  className="group relative aspect-square rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
                >
                  <img
                    src={item.image}
                    alt={item.category}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest border border-white/40 px-3 py-1 rounded-lg backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-[3rem] py-20 border-2 border-dashed border-gray-200">
              <p className="text-gray-400 italic font-serif">
                No photographs found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* --- About Us --- */}
      <section
        id="about"
        className="py-16 container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center"
      >
        <div>
          <h2 className="text-4xl mb-6 font-serif">About Us</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            New Sirni Hotel, located in Kamburupitiya, Sri Lanka, offers a
            welcoming space for comfortable stays and memorable celebrations. We
            provide well-appointed rooms, a quality restaurant, and liquor
            services, making us an ideal choice for weddings, birthday parties,
            and special events. With warm hospitality and attentive service, we
            are dedicated to making every guest experience enjoyable and
            unforgettable.
          </p>
          <div className="text-yellow-500 text-xl">★★★★★</div>
        </div>
        <div className="w-full rounded-lg overflow-hidden shadow-xl h-64 md:h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1015647.6659904498!2d79.35278087812499!3d6.080244600000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae14581018f8001%3A0x5b446489a6e6e3ef!2sNew%20Sirini%20Hotel!5e0!3m2!1sen!2slk!4v1778137116664!5m2!1sen!2slk"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map Location"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default NewSiriniHotel;
