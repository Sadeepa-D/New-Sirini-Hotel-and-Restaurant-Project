import React, { useState, useEffect } from "react";
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

const PackageAddForm = ({ onClose, fetchpackages, editItem }) => {
  const initialState = {
    name: "",
    description: "",
    price: "",
    seatings: "",
    features: "",
    image: null,
  };
  const [formData, setFormData] = useState(initialState);
  const [preview, setPreview] = useState(null);
  const VITE_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name || "",
        description: editItem.description || "",
        price: editItem.price || "",
        seatings: editItem.seatings || "",
        features: Array.isArray(editItem.features)
          ? editItem.features.join(",")
          : editItem.features || "",
        image: null,
      });
      setPreview(editItem.image);
    } else {
      setFormData(initialState);
      setPreview(null);
    }
  }, [editItem]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file)); // Create local preview URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onClose();
    const loadingToast = toast.loading(
      editItem ? "Updating package..." : "Adding package...",
    );
    try {
      const token = localStorage.getItem("token");
      if (editItem) {
        const response = await axios.put(
          `${VITE_URL}/api/receptionhall/package/update/${editItem._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success("Package updated successfully!");
        toast.dismiss(loadingToast);
        fetchpackages();
      } else {
        const response = await axios.post(
          `${VITE_URL}/api/receptionhall/package/add`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.status === 201) {
          toast.success("Package added successfully!");
          toast.dismiss(loadingToast);
          fetchpackages();
        }
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to save package. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-gray-800">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div>
            <p className="text-amber-500 text-xs uppercase tracking-[0.3em] font-medium mb-0.5">
              Reception Hall
            </p>
            <h2 className="font-cinzel text-xl sm:text-2xl font-semibold">
              {editItem ? "Edit Package" : "Add New Package"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Text Inputs */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-400">
            <Tag size={15} className="text-amber-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Package Name"
              className="w-full text-sm outline-none"
            />
          </div>

          <div className="flex items-start gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-400">
            <FileText size={15} className="text-amber-400 mt-1" />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Description"
              className="w-full text-sm outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-400">
              <DollarSign size={15} className="text-amber-400" />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="Price"
                className="w-full text-sm outline-none"
              />
            </div>
            <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-400">
              <Users size={15} className="text-amber-400" />
              <input
                type="number"
                name="seatings"
                value={formData.seatings}
                onChange={handleChange}
                required
                placeholder="Seats"
                className="w-full text-sm outline-none"
              />
            </div>
          </div>

          {/* Features Input & Pill Preview */}
          <div>
            <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-400">
              <Sparkles size={15} className="text-amber-400" />
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="Features (comma separated)"
                className="w-full text-sm outline-none"
              />
            </div>
            {/* Safe split logic to prevent crashes */}
            {typeof formData.features === "string" && formData.features && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {formData.features
                  .split(",")
                  .filter((f) => f.trim())
                  .map((f, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 uppercase font-bold"
                    >
                      {f.trim()}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Modern Image Upload & Preview Container */}
          <div className="space-y-3">
            <label className="block text-xs text-gray-400 uppercase tracking-widest font-medium">
              Package Image
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
                    : "Select Package Photo"}
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

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-gray-200 hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all"
            >
              {editItem ? "Save Changes" : "Add Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageAddForm;
