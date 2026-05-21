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

function RoomFullDetails({ room, isOpen, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !room) return null;

  // Create array of images - main image plus placeholders for gallery
  // In future, this will include galleryImages from room data
  const images = [room.image, room.image, room.image, room.image];

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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-serif italic">Room {room.roomNumber}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Images Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            {/* Left Side - Main Image */}
            <div className="lg:col-span-2">
              <div className="relative bg-gray-900 rounded-xl overflow-hidden h-80">
                <img
                  src={images[currentImageIndex]}
                  alt="Room"
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all"
                >
                  <ChevronLeft size={24} className="text-gray-900" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all"
                >
                  <ChevronRight size={24} className="text-gray-900" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>
            </div>

            {/* Right - Small Images Grid (2x2) */}
            <div className="lg:col-span-1">
              <div className="grid grid-cols-2 gap-2 h-80">
                {images.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`relative rounded-lg overflow-hidden cursor-pointer transition-all transform hover:scale-105 ${
                      currentImageIndex === index
                        ? "ring-3 ring-orange-500 shadow-lg"
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
          </div>

          {/* Room Details Section Below */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-6 border-t pt-6">
            {/* Room Type */}
            <div>
              <p className="text-gray-600 text-xs mb-2 font-semibold">
                ROOM TYPE
              </p>
              <p className="text-base font-semibold text-gray-900">
                {room.roomType}
              </p>
            </div>

            {/* Price */}
            <div>
              <p className="text-gray-600 text-xs mb-2 font-semibold">
                PRICE / NIGHT
              </p>
              <p className="text-xl font-bold text-orange-600">
                Rs. {room.price?.toLocaleString()}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-gray-600 text-xs mb-2 font-semibold">STATUS</p>
              <div
                className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
                  room.status === "available"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {room.status === "available" ? "✓ Available" : "Not Available"}
              </div>
            </div>

            {/* Rating */}
            <div>
              <p className="text-gray-600 text-xs mb-2 font-semibold">RATING</p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-orange-400 text-orange-400"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Bed Type */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Bed size={18} className="text-orange-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-gray-600 text-xs font-semibold">BED TYPE</p>
                <p className="font-medium text-sm">{room.bedType}</p>
              </div>
            </div>

            {/* Capacity */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Users size={18} className="text-orange-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-gray-600 text-xs font-semibold">CAPACITY</p>
                <p className="font-medium text-sm">{room.capacity} Guests</p>
              </div>
            </div>

            {/* Climate Control */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Wind size={18} className="text-orange-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-gray-600 text-xs font-semibold">CLIMATE</p>
                <p className="font-medium text-sm">{room.condition}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {room.description && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-gray-600 text-sm mb-2">Description</p>
              <p className="text-gray-700 leading-relaxed">
                {room.description}
              </p>
            </div>
          )}

          {/* Facilities */}
          {room.facilities && room.facilities.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-gray-600 text-sm mb-3 font-semibold">
                Facilities
              </p>
              <div className="flex flex-wrap gap-2">
                {room.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Short Stay Price */}
          {room.shortStayPrice && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-gray-600 text-sm mb-1">Short Stay (3 hours)</p>
              <p className="text-xl font-bold">
                Rs. {room.shortStayPrice?.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomFullDetails;
