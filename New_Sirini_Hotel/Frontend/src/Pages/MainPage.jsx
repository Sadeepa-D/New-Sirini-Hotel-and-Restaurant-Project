import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpeg";

const NewSiriniHotel = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const services = [
    {
      title: "Reception",
      desc: "Friendly service to assist you every step of your stay.",
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400",
    },
    {
      title: "Rooms",
      desc: "Comfortable rooms designed for rest and relaxation.",
      img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=400",
    },
    {
      title: "Restaurant",
      desc: "Delicious food made with fresh ingredients.",
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400",
    },
    {
      title: "Liquor",
      desc: "Enjoy expertly selected spirits in a relaxed setting.",
      img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=400",
      path: "/liquor",
    },
  ];

  return (
    <div className="font-serif bg-gray-100 text-gray-900">
      {/* --- Hero Section --- */}
      <header className="relative h-[60vh] md:h-[80vh] flex flex-col items-center justify-center text-white text-center px-4">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200"
            className="w-full h-full object-cover brightness-50"
            alt="Hotel Building"
          />
        </div>
        <div className="z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-light mb-4">
            New Sirini Hotel
          </h1>
          <img
            src={Logo}
            alt="New Sirini Hotel Logo"
            className="w-50 h-50 mx-auto mb-4 object-contain"
          />
          <p className="text-lg md:text-xl italic tracking-widest border-t border-b border-white py-2">
            Stay, Relax, Enjoy
          </p>
        </div>
      </header>

      {/* --- Services Section --- */}
      <section className="py-16 container mx-auto px-4">
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
      <section className="bg-gray-200 py-12 text-center">
        <h2 className="text-4xl mb-8 font-serif">Gallery</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {["All", "Reception", "Rooms", "Restaurant", "Liquor"].map((cat) => (
            <button
              key={cat}
              className="px-6 py-1 bg-black text-white rounded-full text-sm hover:bg-yellow-500 transition"
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="bg-gray-300 h-64 md:h-96 mx-4 rounded-lg flex items-center justify-center text-gray-500">
          [Gallery Content Placeholder]
        </div>
      </section>

      {/* --- About Us --- */}
      <section className="py-16 container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
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
        <div className="w-140 rounded-lg overflow-hidden shadow-xl h-83">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d80.54!3d6.23!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTMnNDguMCJOIDgwwrAzMicyNC4wIkU!5e0!3m2!1sen!2slk!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default NewSiriniHotel;
