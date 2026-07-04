import React, { useState, useEffect } from "react";
import {
  X,
  UtensilsCrossed,
  ChefHat,
  Banknote,
  Camera,
  Upload,
  ClipboardList,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const CateringAddForm = ({ onClose, fetchitems, editItem }) => {
  const initialState = {
    name: "",
    ingredients: "",
    price: "",
    image: null,
  };
  const [formData, setFormData] = useState(initialState);
  const [preview, setPreview] = useState(null);
  const VITE_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name || "",
        // FIX: Convert Array to String for the textarea
        ingredients: Array.isArray(editItem.ingredients)
          ? editItem.ingredients.join(",")
          : editItem.ingredients || "",
        price: editItem.price || "",
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
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onClose();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("ingredients", formData.ingredients);
    data.append("price", formData.price);

    // Only append image if a new one is selected
    if (formData.image) {
      data.append("image", formData.image);
    }
    const loadingToast = toast.loading(
      editItem ? "Updating Catering Item..." : "Adding Catering Item...",
    );
    if (editItem) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `${VITE_URL}/api/receptionhall/catering/update/${editItem._id}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.status === 201) {
          toast.success("Catering Item updated successfully!");
          toast.dismiss(loadingToast);
          fetchitems();
        }
      } catch (error) {
        toast.error("Error updating Catering Item. Please try again.");
        toast.dismiss(loadingToast);
      }
    } else {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${VITE_URL}/api/receptionhall/catering/add`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.status === 201) {
          toast.success("Catering Item uploaded successfully!");
          toast.dismiss(loadingToast);
          fetchitems();
        }
      } catch (error) {
        toast.error("Error uploading Catering Items. Please try again.");
        toast.dismiss(loadingToast);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-gray-800">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div>
            <p className="text-orange-500 text-xs uppercase tracking-[0.3em] font-medium mb-0.5">
              Sirini Hotel Kitchen
            </p>
            <h2 className="font-cinzel text-xl sm:text-2xl font-semibold">
              {editItem ? "Edit Catering Item" : "Add Catering Item"}
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
          {/* Dish Name */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-orange-400 transition-colors bg-gray-50/30">
            <UtensilsCrossed size={18} className="text-orange-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Dish Name (e.g. Chicken Rice)"
              className="w-full text-sm outline-none bg-transparent"
            />
          </div>

          {/* Ingredients with Pill Preview */}
          <div className="space-y-2">
            <div className="flex items-start gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-orange-400 transition-colors bg-gray-50/30">
              <ChefHat size={18} className="text-orange-400 mt-1" />
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Ingredients (comma separated)"
                className="w-full text-sm outline-none bg-transparent resize-none"
              />
            </div>
            
            {typeof formData.ingredients === "string" &&
              formData.ingredients && (
                <div className="flex flex-wrap gap-1.5 px-1">
                  {formData.ingredients
                    .split(",")
                    .filter((f) => f.trim())
                    .map((f, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md border border-orange-100 font-bold uppercase tracking-wider"
                      >
                        {f.trim()}
                      </span>
                    ))}
                </div>
              )}
          </div>

          {/* Price Per Serving */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-orange-400 transition-colors bg-gray-50/30">
            <Banknote size={18} className="text-orange-400" />
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="Price"
              className="w-full text-sm outline-none bg-transparent"
            />
          </div>

          {/* Modern Image Upload & Preview Container */}
          <div className="space-y-3">
            <label className="block text-xs text-gray-400 uppercase tracking-widest font-medium px-1">
              Dish Image
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Box 1: Visual Preview */}
              <div className="w-full sm:w-44 h-44 rounded-3xl overflow-hidden border border-orange-100 bg-gray-50 flex items-center justify-center relative group">
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-end p-2">
                      <span className="bg-white/90 backdrop-blur text-[9px] font-bold px-2 py-1 rounded-lg uppercase text-orange-600 shadow-sm">
                        {formData.image ? "New Photo" : "Current View"}
                      </span>
                    </div>
                  </>
                ) : (
                  <Camera size={30} className="text-gray-200" />
                )}
              </div>

              {/* Box 2: Action Area */}
              <label className="flex-1 border-2 border-dashed border-gray-200 hover:border-orange-400 bg-orange-50/5 hover:bg-orange-50/20 rounded-3xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center text-center group">
                <Upload
                  size={20}
                  className="text-orange-400 group-hover:-translate-y-1 transition-transform mb-2"
                />
                <span className="text-sm font-bold text-gray-700">
                  {formData.image ? formData.image.name : "Select Dish Photo"}
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

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-full border border-gray-200 hover:bg-gray-50 font-bold text-gray-500 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest shadow-lg shadow-orange-100 active:scale-95 transition-all"
            >
              {editItem ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CateringAddForm;
