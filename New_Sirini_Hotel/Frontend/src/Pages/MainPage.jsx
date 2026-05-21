import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import axios from "axios";
import Exploreindicator from "../Components/Exploreindicator";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const NewSiriniHotel = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Reception");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  // images for the hero section slideshow
  const backgroundImages = [
    "https://plus.unsplash.com/premium_photo-1661963123153-5471a95b7042?q=80&w=1074&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1100&auto=format&fit=crop",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchgalleryItems();
  }, []);

  const filteredGalleryItems = Array.isArray(galleryItems)
    ? galleryItems.filter((item) => item.category === activeFilter)
    : [];

  const openPreview = (index) => {
    setSelectedImageIndex(index);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? filteredGalleryItems.length - 1 : prev - 1,
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) =>
      prev === filteredGalleryItems.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <>
      <div className="font-serif bg-gray-100 text-gray-900">
        {/* --- Hero Section --- */}
        <header className="relative w-full h-[350px] sm:h-[450px] md:h-[600px] lg:h-[calc(100vh-75px)] overflow-hidden flex flex-col items-center justify-center text-white text-center px-4">
          {/* Background Slide Show Container */}
          <div className="absolute inset-0 z-0">
            {backgroundImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  backgroundImage: `url(${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* black overlay */}
                <div className="absolute inset-0 bg-black/50"></div>
              </div>
            ))}
          </div>

          <div className="z-10 flex flex-col items-center justify-center gap-2 md:gap-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-light">
              New Sirini Hotel
            </h1>
            <img
              src={Logo}
              alt="Logo"
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mx-auto object-contain"
            />
            <p className="text-sm sm:text-base md:text-lg lg:text-xl italic tracking-widest border-t border-b border-white py-2 px-4">
              Stay, Relax, Enjoy
            </p>
          </div>

          <div className="absolute bottom-2 sm:bottom-6 left-1/2 -translate-x-1/2 z-10">
            <Exploreindicator />
          </div>
        </header>

        {/* --- Services Section --- */}
        <section id="services" className="py-16 container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12 font-serif">
            Our Services
          </h2>
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
        <section id="gallery" className="bg-gray-100 py-6 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl mb-4 font-serif text-gray-800 tracking-tight">
              Gallery
            </h2>

            {/* Category Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {["Reception", "Rooms", "Restaurant"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
                    activeFilter === cat
                      ? "bg-slate-900 text-amber-500 border-slate-900 shadow-lg scale-105"
                      : "bg-white text-gray-400 border-gray-200 hover:border-amber-500 hover:text-amber-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Scrollable Container */}
            <div className="max-w-6xl mx-auto">
              {filteredGalleryItems.length > 0 ? (
                <div
                  className="pr-2 overflow-y-auto 
                       h-[300px] sm:h-[530px] 
                       scrollbar-thin 
                       scrollbar-thumb-amber-500 
                       scrollbar-track-transparent"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#f59e0b transparent",
                  }}
                >
                  {/* Changed to grid-cols-4 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {filteredGalleryItems.map((item, idx) => (
                      <div
                        key={item._id}
                        onClick={() => openPreview(idx)}
                        className="group relative aspect-[4/3] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 cursor-pointer"
                      >
                        <img
                          src={item.image}
                          alt={item.category}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                          <span className="text-white text-[7px] font-bold uppercase tracking-widest border border-white/40 px-1.5 py-0.5 rounded backdrop-blur-sm">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-[2rem] py-16 border border-gray-200">
                  <p className="text-gray-400 text-sm italic">
                    No photographs found.
                  </p>
                </div>
              )}
            </div>
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
              welcoming space for comfortable stays and memorable celebrations.
              We provide well-appointed rooms, a quality restaurant, and liquor
              services, making us an ideal choice for weddings, birthday
              parties, and special events. With warm hospitality and attentive
              service, we are dedicated to making every guest experience
              enjoyable and unforgettable.
            </p>
            <div className="text-yellow-500 text-xl">★★★★★</div>
          </div>

          {/* Modern Map Section with Decorations */}
          <div className="relative group">
            {/* Decorative Background Gradient */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-xl sm:rounded-2xl blur opacity-20 sm:opacity-30 group-hover:opacity-50 transition-all duration-500"></div>

            {/* Main Map Container */}
            <div className="relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-500 h-64 md:h-96 border border-gray-100">
              {/* Decorative Top Badge */}
              <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest shadow-lg flex items-center gap-1 sm:gap-2">
                <span className="text-sm sm:text-lg">📍</span>
                <span className="hidden sm:inline">Our Location</span>
                <span className="sm:hidden">Location</span>
              </div>

              {/* Map */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1015647.6659904498!2d79.35278087812499!3d6.080244600000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae14581018f8001%3A0x5b446489a6e6e3ef!2sNew%20Sirini%20Hotel!5e0!3m2!1sen!2slk!4v1778137116664!5m2!1sen!2slk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map Location"
                className="pt-6 sm:pt-8"
              ></iframe>

              {/* Decorative Corner Elements - Hide on Mobile */}
              <div className="hidden sm:block absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 border-amber-500 rounded-tr-lg"></div>
              <div className="hidden sm:block absolute bottom-2 left-2 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 border-amber-500 rounded-bl-lg"></div>

              {/* Subtle Animation Pulse */}
              <div
                className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 w-2 sm:w-3 h-2 sm:h-3 bg-red-500 rounded-full animate-pulse z-10 shadow-lg"
                style={{
                  boxShadow: "0 0 15px sm:0 0 20px rgba(239, 68, 68, 0.6)",
                }}
              ></div>
            </div>

            {/* Bottom Decorative Elements */}
            <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-500 rounded-full"></div>
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-yellow-500 rounded-full"></div>
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-400 rounded-full"></div>
            </div>
          </div>
        </section>
      </div>

      {/* Image Preview Modal */}
      {isPreviewOpen && filteredGalleryItems.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={closePreview}
              className="absolute -top-12 right-0 text-white hover:text-amber-500 transition-colors p-2 z-10"
              title="Close preview"
            >
              <X size={32} />
            </button>

            {/* Main Image */}
            <div className="relative flex-1 flex items-center justify-center bg-black/50 rounded-lg overflow-hidden">
              <img
                src={filteredGalleryItems[selectedImageIndex]?.image}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />

              {/* Previous Button */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-amber-500 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 z-20"
                title="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Next Button */}
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-amber-500 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 z-20"
                title="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Image Counter and Category */}
            <div className="mt-4 flex items-center justify-between text-white px-2">
              <span className="text-sm font-medium">
                {selectedImageIndex + 1} / {filteredGalleryItems.length}
              </span>
              <span className="text-sm bg-amber-500 text-black px-3 py-1 rounded-full font-semibold">
                {filteredGalleryItems[selectedImageIndex]?.category}
              </span>
            </div>

            {/* Thumbnails */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 px-2">
              {filteredGalleryItems.map((item, idx) => (
                <button
                  key={item._id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === selectedImageIndex
                      ? "border-amber-500 ring-2 ring-amber-500/50"
                      : "border-gray-600 hover:border-amber-500"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={`Thumbnail ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewSiriniHotel;
