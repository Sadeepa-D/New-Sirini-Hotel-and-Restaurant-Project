import React, { useState } from "react";
import {
  X,
  FileText,
  DollarSign,
  Users,
  Sparkles,
  Camera,
  Upload,
  Tag,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const PackageAddForm = ({ onClose, fetchpackages }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    seatings: "",
    features: "",
    image: null,
  });
  const VITE_URL = import.meta.env.VITE_API_URL;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onClose();
    const loadingToast = toast.loading("Uploading package to Sirini Hotel...");
    try {
      const response = await axios.post(
        `${VITE_URL}/api/receptionhall/package/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.status === 201) {
        toast.success("Package added successfully!");
        toast.dismiss(loadingToast);
        fetchpackages();
      }
    } catch (err) {
      toast.error("Failed to add package. Please try again.");
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div>
            <p className="text-amber-500 text-xs uppercase tracking-[0.3em] font-medium mb-0.5">
              Reception Hall
            </p>
            <h2 className="font-cinzel text-xl sm:text-2xl text-gray-800 font-semibold">
              Add New Package
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Package Name */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
              Package Name
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-400 transition-colors">
              <Tag size={15} className="text-amber-400 shrink-0" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Gold Wedding Package"
                required
                className="w-full text-sm text-gray-700 outline-none placeholder-gray-300"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
              Description
            </label>
            <div className="flex items-start gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-400 transition-colors">
              <FileText size={15} className="text-amber-400 shrink-0 mt-0.5" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g. Premium wedding setup with full decoration"
                required
                rows={3}
                className="w-full text-sm text-gray-700 outline-none placeholder-gray-300 resize-none"
              />
            </div>
          </div>

          {/* Price + Seatings side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Price */}
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
                Price (Rs.)
              </label>
              <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-400 transition-colors">
                <DollarSign size={15} className="text-amber-400 shrink-0" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 1000000"
                  required
                  className="w-full text-sm text-gray-700 outline-none placeholder-gray-300"
                />
              </div>
            </div>

            {/* Seatings */}
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
                Seatings
              </label>
              <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-400 transition-colors">
                <Users size={15} className="text-amber-400 shrink-0" />
                <input
                  type="number"
                  name="seatings"
                  value={formData.seatings}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  required
                  className="w-full text-sm text-gray-700 outline-none placeholder-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
              Features{" "}
              <span className="normal-case text-gray-300">
                (comma separated)
              </span>
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-400 transition-colors">
              <Sparkles size={15} className="text-amber-400 shrink-0" />
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="e.g. A/C, Floral decorations, Sound system"
                className="w-full text-sm text-gray-700 outline-none placeholder-gray-300"
              />
            </div>
            {/* Live preview pills */}
            {formData.features && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {formData.features
                  .split(",")
                  .filter((f) => f.trim())
                  .map((f, i) => (
                    <span
                      key={i}
                      className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200"
                    >
                      {f.trim()}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
              Package Image
            </label>
            <label className="relative w-full flex flex-col items-center justify-center text-center gap-3 border-2 border-dashed border-amber-200 hover:border-amber-400 bg-amber-50/40 hover:bg-amber-50 rounded-2xl px-4 py-10 cursor-pointer transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-amber-200 group-hover:border-amber-400 flex items-center justify-center shadow-sm transition-all duration-300">
                <Camera
                  size={20}
                  className="text-amber-400 group-hover:text-amber-500"
                />
              </div>
              <div>
                {formData.image ? (
                  <>
                    <p className="text-sm font-semibold text-amber-600">
                      {formData.image.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Click to change
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-gray-600 group-hover:text-amber-600 transition-colors">
                      Click to upload image
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      JPG, PNG or WEBP
                    </p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 bg-white border border-amber-200 group-hover:bg-amber-500 group-hover:border-amber-500 px-5 py-2 rounded-full shadow-sm transition-all duration-300">
                <Upload
                  size={13}
                  className="text-amber-500 group-hover:text-white transition-colors"
                />
                <span className="text-xs font-semibold text-amber-600 group-hover:text-white uppercase tracking-widest transition-colors">
                  Browse File
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-1/2 py-3 rounded-full border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-1/2 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Add Package
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageAddForm;
