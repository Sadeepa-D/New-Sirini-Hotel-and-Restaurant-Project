import React, { useState } from "react";
import { X, Upload } from "lucide-react";

const RoomFormModal = ({ initialData, onSubmit, onClose }) => {
  const [form, setForm] = useState(
    initialData || {
      roomNumber: "",
      roomType: "Single",
      price: "",
      bedType: "Single Bed",
      capacity: "",
      description: "",
      condition: "Fan",
      status: "available",
    },
  );
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!form.roomNumber || !form.price || !form.capacity) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!initialData && !imageFile) {
      alert("Please upload a room image.");
      return;
    }

    onSubmit({ ...form, imageFile });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-base sm:text-xl font-bold text-gray-900">
            {initialData ? "Edit Room Details" : "Add New Room"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3 sm:space-y-4">
          {/* Image Upload Field */}
          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
              Room Image *
            </label>
            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-yellow-400 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-1">
                <Upload size={20} className="text-gray-400" />
                <p className="text-[10px] sm:text-xs text-gray-500">
                  {imageFile ? imageFile.name : "Click to upload room image"}
                </p>
              </div>
            </div>
          </div>

          {/* Room Number & Type Row */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                Room Number *
              </label>
              <input
                name="roomNumber"
                value={form.roomNumber}
                onChange={handleChange}
                placeholder="e.g. 101"
                className="w-full border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                Room Type
              </label>
              <select
                name="roomType"
                value={form.roomType}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
                <option value="Family">Family</option>
              </select>
            </div>
          </div>

          {/* Condition Field (AC/Fan) */}
          <div className="flex-1">
            <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
              Room Condition
            </label>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white"
            >
              <option value="Fan">Fan</option>
              <option value="AC">AC</option>
            </select>
          </div>

          {/* Price & Bed Type Row */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                Price (Rs.) *
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 5000"
                className="w-full border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                Bed Type
              </label>
              <select
                name="bedType"
                value={form.bedType}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white cursor-pointer"
              >
                <option value="Single">Single Bed</option>
                <option value="Double">Double Bed</option>
                <option value="Queen">Queen Size</option>
                <option value="King">King Size</option>
              </select>
            </div>
          </div>
          {/* Capacity & Availability Row */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                Capacity *
              </label>
              <input
                name="capacity"
                type="number"
                value={form.capacity}
                onChange={handleChange}
                placeholder="e.g. 2"
                className="w-full border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                Room Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Description Field */}
          <div className="mt-4">
            <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
              Room Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Describe the room features, view, or special amenities..."
              className="w-full border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 py-2 sm:py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-xs sm:text-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 sm:py-2.5 rounded-xl bg-yellow-500 text-black font-bold text-xs sm:text-sm hover:bg-yellow-400 transition"
          >
            {initialData ? "Update Room" : "Add Room"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomFormModal;
