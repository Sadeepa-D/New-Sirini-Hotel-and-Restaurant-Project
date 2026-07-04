import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  Camera,
  Tag,
  DollarSign,
  Percent,
  Wine,
  Layers,
  Ruler,
  MapPin,
  Notebook,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

const AddLiquorForm = ({ onClose, initialData, onSubmit }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    buyingPrice: "",
    discount: "",
    sellingPrice: "",
    alcoholPercentage: "",
    category: "Beer",
    image: "",
    description: "",
    volume: "",
    origin: "",
    brand: "",
    stockType: "Bottles",
    bottlesPerCase: "",
    currentQuantityInBottles: "",
    currentQuantityInCases: "",
    lowStockThreshold: "",
  });

  useEffect(() => {
    if (initialData) {
      
      const cleanedData = Object.keys(initialData).reduce((acc, key) => {
        acc[key] = initialData[key] ?? "";
        return acc;
      }, {});
      setFormData({ ...formData, ...cleanedData });
      if (typeof initialData.image === "string" && initialData.image) {
        setImagePreview(initialData.image);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onClose();
    const loading = toast.loading(
      initialData ? "Updating liquor item..." : "Adding new liquor...",
    );
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (
      !formData.name ||
      !formData.buyingPrice ||
      !formData.sellingPrice ||
      !formData.category ||
      !formData.stockType ||
      !formData.volume ||
      !formData.brand
    ) {
      toast.error("Please fill in all required fields.");
      toast.dismiss(loading);
      return;
    }
    try {
      await onSubmit(data);
      toast.dismiss(loading);
      toast.success(
        initialData ? "Item updated successfully" : "Item added successfully",
      );
    } catch (error) {
      toast.dismiss(loading);
      toast.error(initialData ? "Failed to update item" : "Failed to add item");
    }
  };

  const inputClass =
    "w-full text-sm text-gray-700 outline-none placeholder-gray-400 bg-transparent transition-colors focus:text-amber-600";
  const selectClass =
    "w-full text-sm text-gray-700 outline-none bg-transparent cursor-pointer appearance-none focus:text-amber-600 font-semibold";
  const wrapClass =
    "flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/10 hover:border-amber-400/80 hover:scale-[1.01] transition-all duration-300 ease-in-out bg-white shadow-sm";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        style={{ borderRadius: "24px" }}
        className="bg-white w-full max-w-2xl shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ borderRadius: "50%" }}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 cursor-pointer text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="font-cormorant italic text-3xl sm:text-4xl text-amber-500 font-semibold mb-1">
              {initialData ? "Edit Liquor Details" : "Add New Liquor Brand"}
            </h2>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">
              {initialData ? "Update product specifications" : "Register a new asset to inventory"}
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            {/* Modern Image Upload & Preview Container */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                Liquor Image
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Box 1: Visual Preview */}
                <div
                  style={{ borderRadius: "20px" }}
                  className="w-full sm:w-44 h-44 overflow-hidden border border-amber-100 bg-gray-50 flex items-center justify-center relative group shadow-inner"
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/25 flex items-end p-2.5">
                        <span className="bg-white/90 backdrop-blur text-[8px] font-bold px-2 py-1 rounded uppercase text-amber-600 shadow-sm tracking-wider">
                          {typeof formData.image === "object" &&
                          formData.image !== null
                            ? "New Selection"
                            : "Current View"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <Camera size={26} className="text-gray-300 mx-auto mb-1" />
                      <span className="text-[10px] text-gray-400 font-medium">No Image</span>
                    </div>
                  )}
                </div>

                {/* Box 2: Action Area */}
                <label
                  style={{ borderRadius: "20px" }}
                  className="flex-1 border border-dashed border-amber-200 hover:border-amber-400 bg-amber-50/10 hover:bg-amber-50/20 p-5 transition-all cursor-pointer flex flex-col items-center justify-center text-center group shadow-sm hover:scale-[1.01]"
                >
                  <Upload
                    size={20}
                    className="text-amber-500 group-hover:-translate-y-1 transition-all duration-300 mb-2"
                  />
                  <span className="text-xs font-bold text-gray-700 truncate max-w-[250px]">
                    {typeof formData.image === "object" &&
                    formData.image !== null
                      ? formData.image.name
                      : "Select Product Photo"}
                  </span>
                  <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
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
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Product Name
                </label>
                <div className={wrapClass}>
                  <Tag size={16} className="text-amber-500 shrink-0" />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    required
                    className={inputClass}
                    placeholder="e.g. Tiger Beer"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Category
                </label>
                <div className={wrapClass}>
                  <Layers size={16} className="text-amber-500 shrink-0" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    <option value="Beer">Beer</option>
                    <option value="Whisky">Whisky</option>
                    <option value="Arrack">Arrack</option>
                    <option value="Wine">Wine</option>
                  </select>
                  <ChevronDown size={16} className="text-gray-400 shrink-0 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Buying Price (LKR)
                </label>
                <div className={wrapClass}>
                  <DollarSign size={16} className="text-amber-500 shrink-0" />
                  <input
                    name="buyingPrice"
                    value={formData.buyingPrice}
                    onChange={handleChange}
                    type="number"
                    required
                    className={inputClass}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Discount (%)
                </label>
                <div className={wrapClass}>
                  <Percent size={16} className="text-amber-500 shrink-0" />
                  <input
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    type="number"
                    className={inputClass}
                    placeholder="0.00%"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Selling Price (LKR)
                </label>
                <div className={wrapClass}>
                  <DollarSign size={16} className="text-amber-500 shrink-0" />
                  <input
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    type="number"
                    required
                    className={inputClass}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Alcohol %
                </label>
                <div className={wrapClass}>
                  <Sparkles size={16} className="text-amber-500 shrink-0" />
                  <input
                    name="alcoholPercentage"
                    value={formData.alcoholPercentage}
                    onChange={handleChange}
                    type="text"
                    required
                    className={inputClass}
                    placeholder="e.g. 4.5%"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {!initialData && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Stock Type
                  </label>
                  <div className={wrapClass}>
                    <Layers size={16} className="text-amber-500 shrink-0" />
                    <select
                      name="stockType"
                      value={formData.stockType}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option value="Bottles">Bottles</option>
                      <option value="Cases">Cases</option>
                    </select>
                    <ChevronDown size={16} className="text-gray-400 shrink-0 pointer-events-none" />
                  </div>
                </div>
              )}

              {formData.stockType === "Bottles" && !initialData && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Quantity In Bottles
                  </label>
                  <div className={wrapClass}>
                    <Wine size={16} className="text-amber-500 shrink-0" />
                    <input
                      name="currentQuantityInBottles"
                      value={formData.currentQuantityInBottles}
                      onChange={handleChange}
                      type="number"
                      className={inputClass}
                      placeholder="0"
                    />
                  </div>
                </div>
              )}

              {formData.stockType === "Cases" && !initialData && (
                <>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Quantity In Cases
                    </label>
                    <div className={wrapClass}>
                      <Layers size={16} className="text-amber-500 shrink-0" />
                      <input
                        name="currentQuantityInCases"
                        value={formData.currentQuantityInCases}
                        onChange={handleChange}
                        type="number"
                        className={inputClass}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Bottles Per Case
                    </label>
                    <div className={wrapClass}>
                      <Wine size={16} className="text-amber-500 shrink-0" />
                      <input
                        name="bottlesPerCase"
                        value={formData.bottlesPerCase}
                        onChange={handleChange}
                        type="number"
                        className={inputClass}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Low Stock Threshold
                </label>
                <div className={wrapClass}>
                  <Notebook size={16} className="text-amber-500 shrink-0" />
                  <input
                    name="lowStockThreshold"
                    value={formData.lowStockThreshold}
                    onChange={handleChange}
                    type="number"
                    className={inputClass}
                    placeholder="10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Volume
                </label>
                <div className={wrapClass}>
                  <Ruler size={14} className="text-amber-500 shrink-0" />
                  <input
                    name="volume"
                    value={formData.volume}
                    onChange={handleChange}
                    type="text"
                    className={inputClass}
                    placeholder="e.g. 750ml"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Origin
                </label>
                <div className={wrapClass}>
                  <MapPin size={14} className="text-amber-500 shrink-0" />
                  <input
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Scotland"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Brand
                </label>
                <div className={wrapClass}>
                  <Tag size={14} className="text-amber-500 shrink-0" />
                  <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Jameson"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                Description
              </label>
              <div className="flex gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/10 hover:border-amber-400/80 hover:scale-[1.01] transition-all duration-300 ease-in-out bg-white shadow-sm">
                <Notebook size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full text-sm text-gray-700 outline-none placeholder-gray-400 bg-transparent resize-none focus:text-amber-600"
                  placeholder="Brief description of the product..."
                ></textarea>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                style={{ borderRadius: "12px" }}
                className="w-fit mx-auto px-16 block bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold uppercase tracking-widest py-3.5 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {initialData ? "Save Changes" : "Confirm & Add Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLiquorForm;
