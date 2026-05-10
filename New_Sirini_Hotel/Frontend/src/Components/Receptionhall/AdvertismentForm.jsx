import React, { useState, useEffect } from "react";
import {
  X,
  Building2,
  Tag,
  FileText,
  Link,
  DollarSign,
  MapPin,
  Phone,
  Camera,
  Music,
  Sparkles,
  Upload,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const categories = ["Photography", "Audio & Musical", "Decoration"];

const AdvertismentForm = ({ onClose, editData = null, onSuccess }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    BuissnesName: "",
    category: "",
    description: "",
    portfolio: "",
    price: "",
    location: "",
    TPNumber: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (editData) {
      setFormData({
        BuissnesName: editData.BuissnesName || "",
        category: editData.category || "",
        description: editData.description || "",
        portfolio: editData.portfolio || "",
        price: editData.price || "",
        location: editData.location || "",
        TPNumber: editData.TPNumber || "",
        image: null,
      });
      setPreview(editData.image || null);
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onClose();
    const loadingtoast = toast.loading(
      editData
        ? "Updating advertisement..."
        : "Submitting your advertisement request...",
    );
    try {
      const submitData = new FormData();
      submitData.append("BuissnesName", formData.BuissnesName);
      submitData.append("category", formData.category);
      submitData.append("description", formData.description);
      submitData.append("portfolio", formData.portfolio);
      submitData.append("price", formData.price);
      submitData.append("location", formData.location);
      submitData.append("TPNumber", formData.TPNumber);
      if (formData.image) {
        submitData.append("image", formData.image);
      }
      const token = localStorage.getItem("token");
      if (editData) {
        // ================= EDIT MODE =================
        await axios.put(
          `${API_URL}/api/receptionhall/advertisment/update/${editData._id}`,
          submitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const changestatus = await axios.put(
          `${API_URL}/api/receptionhall/advertisment/toggle/pending/${editData._id}`,
          { status: "pending" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        toast.success("Advertisement updated successfully!");
      } else {
        // ================= ADD MODE =================
        await axios.post(
          `${API_URL}/api/receptionhall/advertisment/add`,
          submitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success("Advertisement request submitted successfully!");
      }

      toast.dismiss(loadingtoast);
      if (onSuccess) onSuccess(); // Refresh the parent list
    } catch (error) {
      toast.dismiss(loadingtoast);
      toast.error("Failed to submit advertisement. Please try again.");
    } finally {
      toast.dismiss(loadingtoast);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div>
            <p className="text-amber-500 text-xs uppercase tracking-[0.3em] font-medium mb-0.5">
              Partner With Us
            </p>
            <h2 className="font-cinzel text-xl sm:text-2xl text-gray-800 font-semibold">
              Request Advertisement
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
          {/* Business Name */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
              Business Name
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-400 transition-colors">
              <Building2 size={15} className="text-amber-400 shrink-0" />
              <input
                type="text"
                name="BuissnesName"
                value={formData.BuissnesName}
                onChange={handleChange}
                placeholder="e.g. Lens & Light Studio"
                required
                className="w-full text-sm text-gray-700 outline-none placeholder-gray-300"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
              Category
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-400 transition-colors">
              <Tag size={15} className="text-amber-400 shrink-0" />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full text-sm text-gray-700 outline-none bg-transparent"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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
                placeholder="e.g. photo, video, drone coverage"
                required
                rows={3}
                className="w-full text-sm text-gray-700 outline-none placeholder-gray-300 resize-none"
              />
            </div>
          </div>

          {/* Portfolio */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
              Portfolio / Social Link
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-400 transition-colors">
              <Link size={15} className="text-amber-400 shrink-0" />
              <input
                type="text"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="e.g. www.facebook.com/yourbusiness"
                className="w-full text-sm text-gray-700 outline-none placeholder-gray-300"
              />
            </div>
          </div>

          {/* Price + Location — side by side on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Price */}
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
                Price
              </label>
              <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-400 transition-colors">
                <DollarSign size={15} className="text-amber-400 shrink-0" />
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. upto Rs.100000"
                  required
                  className="w-full text-sm text-gray-700 outline-none placeholder-gray-300"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
                Location
              </label>
              <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-400 transition-colors">
                <MapPin size={15} className="text-amber-400 shrink-0" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Richmond Hill, Galle"
                  required
                  className="w-full text-sm text-gray-700 outline-none placeholder-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
              Contact Number
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-400 transition-colors">
              <Phone size={15} className="text-amber-400 shrink-0" />
              <input
                type="tel"
                name="TPNumber"
                value={formData.TPNumber}
                onChange={handleChange}
                placeholder="e.g. 071 448 0408"
                required
                className="w-full text-sm text-gray-700 outline-none placeholder-gray-300"
              />
            </div>
          </div>

          {/* Modern Image Upload & Preview Container */}
          <div className="space-y-3">
            <label className="block text-xs text-gray-400 uppercase tracking-widest font-medium">
              Business Image
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Box 1: Visual Preview */}
              <div className="w-full sm:w-44 h-44 rounded-3xl overflow-hidden border border-amber-100 bg-gray-50 flex items-center justify-center relative group">
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-end p-2">
                      <span className="bg-white/90 backdrop-blur text-[9px] font-bold px-2 py-1 rounded-lg uppercase text-amber-600 shadow-sm">
                        {formData.image ? "New Selection" : "Current View"}
                      </span>
                    </div>
                  </>
                ) : (
                  <Camera size={30} className="text-gray-200" />
                )}
              </div>

              {/* Box 2: Action Area */}
              <label className="flex-1 border-2 border-dashed border-amber-200 hover:border-amber-400 bg-amber-50/20 hover:bg-amber-50 rounded-3xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center text-center group">
                <Upload
                  size={20}
                  className="text-amber-500 group-hover:-translate-y-1 transition-transform mb-2"
                />
                <span className="text-sm font-bold text-gray-700">
                  {formData.image
                    ? formData.image.name
                    : "Select Business Photo"}
                </span>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">
                  JPG, PNG or WEBP (Max 2MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
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
              className="w-full sm:w-1/2 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-amber-900 text-sm font-semibold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvertismentForm;
