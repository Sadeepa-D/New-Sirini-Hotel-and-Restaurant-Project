import React, { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Bed,
  Users,
  Wind,
  Star,
} from "lucide-react";

function RoomFullDetails({ room, isOpen, onClose, onBookNow }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 flex justify-between items-center rounded-t-xl sm:rounded-t-2xl">
          <h2 className="text-lg sm:text-2xl font-serif italic">Room {room.roomNumber}</h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-3 sm:p-6">
          {/* Images Section */}
          <div className="flex flex-col gap-2 sm:gap-4 mb-6 sm:mb-8">
            {/* Main Image - Large */}
            <div className="relative bg-gray-900 rounded-lg sm:rounded-xl overflow-hidden h-48 sm:h-96 w-full">
              <img
                src={images[currentImageIndex]}
                alt="Room"
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 sm:p-2 rounded-full transition-all"
              >
                <ChevronLeft size={20} className="sm:w-6 sm:h-6 text-gray-900" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 sm:p-2 rounded-full transition-all"
              >
                <ChevronRight size={20} className="sm:w-6 sm:h-6 text-gray-900" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-black/60 text-white px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Images Below - Horizontal Scroll */}
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`relative rounded-lg overflow-hidden cursor-pointer transition-all transform hover:scale-105 flex-shrink-0 w-16 h-16 sm:w-24 sm:h-24 ${
                    currentImageIndex === index
                      ? "ring-2 sm:ring-3 ring-orange-500 shadow-lg"
                      : "border-2 border-gray-200 hover:border-orange-300"
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-t pt-4 sm:pt-6">
            {/* Room Type */}
            <div>
              <p className="text-gray-600 text-xs font-semibold mb-1 sm:mb-2">
                ROOM TYPE
              </p>
              <p className="text-sm sm:text-base font-semibold text-gray-900">
                {room.roomType} Room
              </p>
            </div>

            {/* Price */}
            <div>
              <p className="text-gray-600 text-xs font-semibold mb-1 sm:mb-2">
                PRICE / NIGHT
              </p>
              <p className="text-lg sm:text-xl font-bold text-orange-600">
                Rs. {room.price?.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-gray-600 text-xs font-semibold mb-1 sm:mb-2">
                PRICE / MIDDAY
              </p>
              <p className="text-lg sm:text-xl font-bold text-orange-600">
               Rs. {room.shortStayPrice?.toLocaleString()}
              </p>
            </div>

            {/* Rating */}
            <div>
              <p className="text-gray-600 text-xs font-semibold mb-1 sm:mb-2">RATING</p>
              <div className="flex gap-0.5 sm:gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className="sm:w-4 sm:h-4 fill-orange-400 text-orange-400"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
            {/* Bed Type */}
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
              <Bed size={16} className="sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-gray-600 text-xs font-semibold">BED TYPE</p>
                <p className="font-medium text-xs sm:text-sm">{room.bedType}</p>
              </div>
            </div>

            {/* Capacity */}
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
              <Users size={16} className="sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-gray-600 text-xs font-semibold">CAPACITY</p>
                <p className="font-medium text-xs sm:text-sm">{room.capacity} Guests</p>
              </div>
            </div>

            {/* Condition */}
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
              <Wind size={16} className="sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-gray-600 text-xs font-semibold">CONDITION</p>
                <p className="font-medium text-xs sm:text-sm">{room.condition}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {room.description && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
              <p className="text-gray-600 text-xs sm:text-sm mb-2 font-semibold">DESCRIPTION</p>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                {room.description}
              </p>
            </div>
          )}

          {/* Facilities */}
          {room.facilities && room.facilities.length > 0 && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
              <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 font-semibold">
                FACILITIES
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {room.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}

         
          {/* STATUS & ACTION */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-gray-600 text-xs mb-1.5 sm:mb-2 font-semibold">STATUS</p>
                <div
                  className={`inline-block px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold ${
                    room.status === "available"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {room.status === "available" ? "✓ Available" : "Not Available"}
                </div>
              </div>
              <button
                onClick={handleBookNow}
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold transition-colors text-sm sm:text-base"
              >
                Book Now
              </button>
            </div>
          
        </div>
      </div>
    </div>
  );
}

export default RoomFullDetails;
