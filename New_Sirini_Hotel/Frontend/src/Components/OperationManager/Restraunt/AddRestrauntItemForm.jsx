import React, { useState, useEffect } from "react";
import { X, Upload, Camera, Utensils, Layers, AlignLeft, Check } from "lucide-react";
import toast from "react-hot-toast";

const AddRestrauntItemForm = ({ onClose, initialData, onSubmit }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    normal_price: "",
    full_price: "",
    description: "",
    category: "Chopsy Rice",
    has_portions: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        normal_price: initialData.normal_price || "",
        full_price: initialData.full_price || "",
        has_portions: initialData.has_portions || false,
      });
      if (typeof initialData.image === "string" && initialData.image) {
        setImagePreview(initialData.image);
      }
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name) {
      toast.error("Item name is required");
      return;
    }
    if (!formData.description) {
      toast.error("Description is required");
      return;
    }
    if (!initialData && !formData.image) {
      toast.error("Product image is required");
      return;
    }

    if (!formData.normal_price) {
      toast.error("Normal price is required");
      return;
    }

    if (formData.has_portions && !formData.full_price) {
      toast.error("Full price is required when portions are enabled");
      return;
    }

    onClose();
    const data = new FormData();

    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("has_portions", String(formData.has_portions));
    data.append("normal_price", formData.normal_price);
    data.append("full_price", formData.has_portions ? formData.full_price : "");

    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    onSubmit(data);
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white/95 backdrop-blur-md border border-gray-100 w-full max-w-2xl rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.15)] relative animate-in fade-in zoom-in-95 duration-300 max-h-[92vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-amber-200/60 [&::-webkit-scrollbar-thumb]:rounded-full flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100/80 rounded-full transition-all duration-300 hover:rotate-90 shadow-sm border border-gray-100/50 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="p-8 pb-4">
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block mb-1">
            {initialData ? "Management Portal" : "Inventory Control"}
          </span>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            {initialData ? "Edit Menu Item" : "Add New Menu Item"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Fill in the details below to update the restaurant's menu catalog.
          </p>
        </div>

        <div className="px-8 pb-8 flex-1">
          <form
            className="space-y-6"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            {/* Image Upload – Preview left / Upload right */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-400 tracking-wider ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Menu Item Image
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Left: Visual Preview */}
                <div className="w-full sm:w-44 h-44 rounded-2xl overflow-hidden border border-amber-100/50 bg-amber-50/5 flex items-center justify-center relative group shrink-0 transition-all duration-300 shadow-inner">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/25 flex items-end p-2">
                        <span className="bg-white/95 backdrop-blur text-[9px] font-extrabold px-2.5 py-1 rounded-lg uppercase text-amber-600 shadow-sm">
                          {typeof formData.image === "object" &&
                          formData.image !== null
                            ? "New Selection"
                            : "Current View"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <Camera size={32} className="text-amber-200/80 animate-pulse" />
                  )}
                </div>

                {/* Right: Upload Action */}
                <label className="flex-1 border-2 border-dashed border-amber-200 hover:border-amber-400 bg-amber-50/10 hover:bg-amber-50/30 rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center group shadow-sm hover:shadow-md hover:scale-[1.01]">
                  <Upload
                    size={24}
                    className="text-amber-500 group-hover:-translate-y-1 transition-transform duration-300 mb-2"
                  />
                  <span className="text-sm font-extrabold text-gray-700 group-hover:text-amber-600 transition-colors duration-300">
                    {typeof formData.image === "object" &&
                    formData.image !== null
                      ? formData.image.name
                      : "Select Product Photo"}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                    JPG, PNG or WEBP (Max 2MB)
                  </p>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-400 tracking-wider ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Item Name
                </label>
                <div className="relative flex items-center">
                  <Utensils size={16} className="absolute left-4 text-amber-500/70" />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    required
                    className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-gray-50/50 border border-gray-200/60 text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none transition-all duration-300 shadow-inner"
                    placeholder="e.g. Mixed Fried Rice"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-400 tracking-wider ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Category
                </label>
                <div className="relative flex items-center">
                  <Layers size={16} className="absolute left-4 text-amber-500/70" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-gray-50/50 border border-gray-200/60 text-gray-800 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="Chopsy Rice">Chopsy Rice</option>
                    <option value="Rice & Nasi Goreng">Rice & Nasi Goreng</option>
                    <option value="Kottu">Kottu</option>
                    <option value="Noodles">Noodles</option>
                    <option value="Bites">Bites</option>
                    <option value="Side Dishes">Side Dishes</option>
                    <option value="Snacks">Snacks</option>
                  </select>
                  <div className="absolute right-4 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Portion Toggle Switch */}
            <div className="pt-2">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/20 hover:bg-amber-50/40 border border-amber-100/30 backdrop-blur-sm cursor-pointer select-none transition-all duration-300 group shadow-sm">
                <div className="flex flex-col pr-4">
                  <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
                    Portioned Item
                  </span>
                  <span className="text-xs text-gray-400 mt-0.5">
                    This item has multiple sizes (Normal & Full)
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    name="has_portions"
                    id="has_portions"
                    checked={formData.has_portions}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-checked:bg-amber-500 rounded-full transition-colors duration-300 flex items-center px-0.5">
                    <div className="w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 transition-transform duration-300"></div>
                  </div>
                </div>
              </label>
            </div>

            {/* Pricing Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-400 tracking-wider ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  {formData.has_portions ? "Normal Price (LKR)" : "Price (LKR)"}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-xs font-black text-amber-600/80">LKR</span>
                  <input
                    name="normal_price"
                    value={formData.normal_price}
                    onChange={handleChange}
                    type="number"
                    required
                    className="w-full pl-14 pr-5 py-3.5 rounded-2xl bg-gray-50/50 border border-gray-200/60 text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none transition-all duration-300 shadow-inner"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {formData.has_portions && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-400 tracking-wider ml-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Full Price (LKR)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-xs font-black text-amber-600/80">LKR</span>
                    <input
                      name="full_price"
                      value={formData.full_price}
                      onChange={handleChange}
                      type="number"
                      required={formData.has_portions}
                      className="w-full pl-14 pr-5 py-3.5 rounded-2xl bg-gray-50/50 border border-gray-200/60 text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none transition-all duration-300 shadow-inner"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-400 tracking-wider ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Description
              </label>
              <div className="relative flex items-start">
                <AlignLeft size={16} className="absolute left-4 top-4 text-amber-500/70" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  required
                  className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-gray-50/50 border border-gray-200/60 text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none transition-all duration-300 resize-none shadow-inner"
                  placeholder="Provide a delicious description of the menu item..."
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                style={{ borderRadius: "12px" }}
                className="w-fit px-10 py-3 bg-[#FFAB00] text-black hover:bg-amber-500 transform hover:scale-105 active:scale-[0.98] font-black shadow-lg hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                <Check size={16} className="stroke-[3]" />
                {initialData ? "Save Changes" : "Confirm & Add Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRestrauntItemForm;
