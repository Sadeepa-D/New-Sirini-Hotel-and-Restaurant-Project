import React, { useState } from "react";
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
  const [formData, setFormData] = useState({
    name: editItem?.name || "",
    ingredients: editItem?.ingredients || "",
    priceperserving: editItem?.priceperserving || "",
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
    const loadingToast = toast.loading(
      "Uploading Catering Items to Sirini Hotel...",
    );
    try {
      const response = await axios.post(
        `${VITE_URL}/api/receptionhall/catering/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div>
            <p className="text-orange-500 text-xs uppercase tracking-[0.3em] font-medium mb-0.5">
              Sirini Hotel Kitchen
            </p>
            <h2 className="font-cinzel text-xl sm:text-2xl text-gray-800 font-semibold">
              {editItem ? "Edit Catering Item" : "Add Catering Items"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Item Name */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-semibold">
              Dish Name
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-orange-400 transition-colors bg-gray-50/50">
              <UtensilsCrossed size={18} className="text-orange-400 shrink-0" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Chicken Rice"
                required
                className="w-full text-sm text-gray-700 bg-transparent outline-none placeholder-gray-300"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-semibold">
              Ingredients{" "}
              <span className="text-[10px] lowercase font-normal">
                (comma separated)
              </span>
            </label>
            <div className="flex items-start gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-orange-400 transition-colors bg-gray-50/50">
              <ChefHat size={18} className="text-orange-400 shrink-0 mt-0.5" />
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="Saffras rice, carrot, leaks, chicken powder..."
                required
                rows={3}
                className="w-full text-sm text-gray-700 bg-transparent outline-none placeholder-gray-300 resize-none"
              />
            </div>
            {/* Visual Ingredients Preview */}
            {formData.ingredients && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.ingredients
                  .split(",")
                  .filter((i) => i.trim())
                  .map((ing, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-orange-50 text-orange-700 px-2 py-1 rounded-md border border-orange-100 flex items-center gap-1"
                    >
                      <div className="w-1 h-1 rounded-full bg-orange-400" />{" "}
                      {ing.trim()}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Price Per Serving */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-semibold">
              Price Detail
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-orange-400 transition-colors bg-gray-50/50">
              <Banknote size={18} className="text-orange-400 shrink-0" />
              <input
                type="text"
                name="priceperserving"
                value={formData.priceperserving}
                onChange={handleChange}
                placeholder="e.g. 10000 for 100 plates"
                required
                className="w-full text-sm text-gray-700 bg-transparent outline-none placeholder-gray-300"
              />
            </div>
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-semibold">
              Food Image
            </label>
            <label className="relative w-full flex flex-col items-center justify-center text-center gap-3 border-2 border-dashed border-gray-200 hover:border-orange-300 bg-gray-50/50 hover:bg-orange-50/30 rounded-3xl px-4 py-8 cursor-pointer transition-all group">
              {formData.image ? (
                <div className="flex flex-col items-center">
                  <ClipboardList className="text-orange-500 mb-2" />
                  <p className="text-sm font-bold text-gray-700">
                    {formData.image.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Click to replace photo
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">
                      Upload Dish Image
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                      High quality JPG or PNG
                    </p>
                  </div>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-1/3 py-3.5 rounded-2xl border border-gray-200 text-gray-500 text-sm font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-2/3 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold uppercase tracking-widest shadow-lg shadow-orange-200 active:scale-95 transition-all"
            >
              Save Catering Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CateringAddForm;
