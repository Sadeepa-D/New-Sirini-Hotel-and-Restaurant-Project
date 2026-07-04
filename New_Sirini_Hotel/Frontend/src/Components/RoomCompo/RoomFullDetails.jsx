import React, { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Bed,
  Users,
  Wind,
  Star,
  Wifi,
  Droplets,
  Tv,
  Refrigerator,
  Coffee,
  Car,
  Utensils,
} from "lucide-react";
import StarRating from "../StarRating";

const getFacilityIcon = (facility) => {
  const name = facility.toLowerCase();
  if (name.includes("wifi") || name.includes("internet")) return <Wifi size={14} className="text-blue-500" />;
  if (name.includes("hot water") || name.includes("shower") || name.includes("water")) return <Droplets size={14} className="text-cyan-500" />;
  if (name.includes("tv") || name.includes("television") || name.includes("monitor")) return <Tv size={14} className="text-purple-500" />;
  if (name.includes("fridge") || name.includes("refrigerator")) return <Refrigerator size={14} className="text-emerald-500" />;
  if (name.includes("ac") || name.includes("air cond") || name.includes("cooling")) return <Wind size={14} className="text-sky-500" />;
  if (name.includes("breakfast") || name.includes("food") || name.includes("meal")) return <Coffee size={14} className="text-amber-600" />;
  if (name.includes("parking")) return <Car size={14} className="text-slate-600" />;
  if (name.includes("restaurant") || name.includes("dining")) return <Utensils size={14} className="text-red-500" />;
  return <Star size={14} className="text-orange-500" />;
};

function RoomFullDetails({ room, isOpen, onClose, onBookNow }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!isOpen || !room) return null;

  const handleBookNow = () => {
    onClose();
    onBookNow(room);
  };

  // Include main image first, then gallery images
  const images = [
    room.image,
    ...(room.galleryImages && room.galleryImages.length > 0
      ? room.galleryImages
      : []),
  ];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-4xl bg-white shadow-[0_24px_80px_rgba(15,23,42,0.35)] ring-1 ring-white/20">
        {/* Close Button */}
        <div className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center rounded-t-2xl sm:rounded-t-4xl">
          <div>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-orange-500 font-semibold">
              Room Details
            </p>
            <h2 className="text-lg sm:text-2xl font-serif text-slate-900 mt-1">
              Room {room.roomNumber}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="grid place-items-center p-2 sm:p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-3 sm:p-6 bg-linear-to-b from-white to-slate-50/70">
          {/* Images Section */}
          <div className="flex flex-col gap-2 sm:gap-4 mb-6 sm:mb-8">
            {/* Main Image - Large */}
            <div className="relative w-full h-48 sm:h-96 overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 shadow-lg ring-1 ring-slate-200">
              <img
                src={images[currentImageIndex]}
                alt="Room"
                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 hover:scale-105"
                onClick={() => setIsLightboxOpen(true)}
              />

              <div className="absolute inset-0 bg-linear-to-t from-slate-950/45 via-transparent to-transparent pointer-events-none" />

              {/* Navigation Arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 grid place-items-center bg-white/85 hover:bg-white text-slate-900 p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-md hover:scale-105"
              >
                <ChevronLeft
                  size={20}
                  className="sm:w-6 sm:h-6 text-gray-900"
                />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 grid place-items-center bg-white/85 hover:bg-white text-slate-900 p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-md hover:scale-105"
              >
                <ChevronRight
                  size={20}
                  className="sm:w-6 sm:h-6 text-gray-900"
                />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-slate-950/70 text-white px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-sm font-medium tracking-wide backdrop-blur-sm ring-1 ring-white/10 pointer-events-none">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Images Below - Horizontal Scroll */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-2 hide-scrollbar">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 shrink-0 w-16 h-16 sm:w-24 sm:h-24 shadow-sm ${
                    currentImageIndex === index
                      ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-white shadow-lg"
                      : "border border-slate-200 hover:border-orange-300 bg-white"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Room ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {currentImageIndex === index && (
                    <div className="absolute inset-0 bg-orange-500/20" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Room Details Section Below */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-t border-slate-200 pt-4 sm:pt-6">
            {/* Room Type */}
            <div className="rounded-2xl bg-white p-3 sm:p-4 shadow-sm ring-1 ring-slate-100">
              <p className="text-slate-500 text-[10px] sm:text-xs font-semibold mb-1 sm:mb-2 uppercase tracking-[0.22em]">
                ROOM TYPE
              </p>
              <p className="text-sm sm:text-base font-semibold text-slate-900">
                {room.roomType} Room
              </p>
            </div>

            {/* Price */}
            <div className="rounded-2xl bg-white p-3 sm:p-4 shadow-sm ring-1 ring-slate-100">
              <p className="text-slate-500 text-[10px] sm:text-xs font-semibold mb-1 sm:mb-2 uppercase tracking-[0.22em]">
                NIGHT PACKAGE
              </p>
              <p className="text-lg sm:text-xl font-bold text-orange-600">
                Rs. {room.nightPackagePrice?.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-3 sm:p-4 shadow-sm ring-1 ring-slate-100">
              <p className="text-slate-500 text-[10px] sm:text-xs font-semibold mb-1 sm:mb-2 uppercase tracking-[0.22em]">
                DAY PACKAGE
              </p>
              <p className="text-lg sm:text-xl font-bold text-orange-600">
                Rs. {room.dayPackagePrice?.toLocaleString()}
              </p>
            </div>

            {/* Rating */}
            <div className="rounded-2xl bg-white p-3 sm:p-4 shadow-sm ring-1 ring-slate-100">
              <p className="text-slate-500 text-[10px] sm:text-xs font-semibold mb-1 sm:mb-2 uppercase tracking-[0.22em]">
                RATING
              </p>
              <StarRating roomNumber={room.roomNumber} size="md" />
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
            {/* Bed Type */}
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-2xl shadow-sm ring-1 ring-slate-100">
              <Bed
                size={16}
                className="sm:w-5 sm:h-5 text-orange-600 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em]">
                  BED TYPE
                </p>
                <p className="font-medium text-xs sm:text-sm text-slate-900">
                  {room.bedType}
                </p>
              </div>
            </div>

            {/* Capacity */}
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-2xl shadow-sm ring-1 ring-slate-100">
              <Users
                size={16}
                className="sm:w-5 sm:h-5 text-orange-600 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em]">
                  CAPACITY
                </p>
                <p className="font-medium text-xs sm:text-sm text-slate-900">
                  {room.capacity} Guests
                </p>
              </div>
            </div>

            {/* Condition */}
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-2xl shadow-sm ring-1 ring-slate-100">
              <Wind
                size={16}
                className="sm:w-5 sm:h-5 text-orange-600 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em]">
                  CONDITION
                </p>
                <p className="font-medium text-xs sm:text-sm text-slate-900">
                  {room.condition}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {room.description && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200">
              <p className="text-slate-500 text-[10px] sm:text-xs mb-2 font-semibold uppercase tracking-[0.22em]">
                DESCRIPTION
              </p>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                {room.description}
              </p>
            </div>
          )}

          {/* Facilities */}
          {room.facilities && room.facilities.length > 0 && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200">
              <p className="text-slate-500 text-[10px] sm:text-xs mb-2 sm:mb-3 font-semibold uppercase tracking-[0.22em]">
                FACILITIES
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {room.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium ring-1 ring-orange-100/50"
                  >
                    {getFacilityIcon(facility)}
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* STATUS & ACTION */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-slate-500 text-[10px] sm:text-xs mb-1.5 sm:mb-2 font-semibold uppercase tracking-[0.22em]">
                STATUS
              </p>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
                  room.status === "available"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    room.status === "available"
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-rose-500"
                  }`}
                />
                {room.status === "available" ? "Available" : "Not Available"}
              </div>
            </div>
            <button
              onClick={handleBookNow}
              style={{ borderRadius: "12px" }}
              className="w-full sm:w-auto bg-linear-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white px-5 sm:px-7 py-2.5 sm:py-3 font-semibold transition-all duration-300 text-sm sm:text-base shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Overlay */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-2 sm:p-4 select-none cursor-pointer"
          onClick={() => setIsLightboxOpen(false)}
        >
          <style>{`
            @keyframes lightboxFadeInZoom {
              from {
                opacity: 0;
                transform: scale(0.93);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}</style>

          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 backdrop-blur-md shadow-lg"
            aria-label="Close fullscreen view"
          >
            <X size={24} />
          </button>

          {/* Left Arrow */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-md shadow-lg hover:scale-105"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Large Image Container */}
          <div
            className="w-full max-w-[95vw] h-full max-h-[90vh] flex items-center justify-center relative cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentImageIndex]}
              alt="Room Fullscreen"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-all duration-300 select-none"
              style={{
                animation: "lightboxFadeInZoom 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            />
          </div>

          {/* Right Arrow */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-md shadow-lg hover:scale-105"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Image Counter Badge */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/90 text-xs sm:text-sm font-semibold tracking-widest uppercase bg-black/60 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-md">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomFullDetails;
