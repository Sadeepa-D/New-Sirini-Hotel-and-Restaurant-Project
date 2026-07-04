import React, { useState, useEffect } from "react";
import { X, Upload, Camera } from "lucide-react";
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

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">
            {initialData ? "Edit Liquor" : "Add New Liquor"}
          </h2>

          <form
            className="space-y-5"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            {/* Modern Image Upload & Preview Container */}
            <div className="space-y-3">
              <label className="block text-xs font-black uppercase text-gray-400 ml-2">
                Liquor Image
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Box 1: Visual Preview */}
                <div className="w-full sm:w-44 h-44 rounded-3xl overflow-hidden border border-amber-100 bg-gray-50 flex items-center justify-center relative group">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-end p-2">
                        <span className="bg-white/90 backdrop-blur text-[9px] font-bold px-2 py-1 rounded-lg uppercase text-amber-600 shadow-sm">
                          {typeof formData.image === "object" &&
                          formData.image !== null
                            ? "New Selection"
                            : "Current View"}
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
                    {typeof formData.image === "object" &&
                    formData.image !== null
                      ? formData.image.name
                      : "Select Product Photo"}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">
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
                <label className="text-xs font-black uppercase text-gray-400 ml-2">
                  Product Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  required
                  className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00]"
                  placeholder="e.g. Tiger Beer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400 ml-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00] appearance-none"
                >
                  <option value="Beer">Beer</option>
                  <option value="Whisky">Whisky</option>
                  <option value="Arrack">Arrack</option>
                  <option value="Wine">Wine</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400 ml-2">
                  Buying Price (LKR)
                </label>
                <input
                  name="buyingPrice"
                  value={formData.buyingPrice}
                  onChange={handleChange}
                  type="number"
                  required
                  className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00]"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400 ml-2">
                  discount (%)
                </label>
                <input
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  type="number"
                  className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00]"
                  placeholder="0.00%"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400 ml-2">
                  selling price (LKR)
                </label>
                <input
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  type="number"
                  required
                  className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00]"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400 ml-2">
                  Alcohol %
                </label>
                <input
                  name="alcoholPercentage"
                  value={formData.alcoholPercentage}
                  onChange={handleChange}
                  type="text"
                  required
                  className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00]"
                  placeholder="4.5%"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {!initialData && (
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-gray-400 ml-2">
                    Stock Type
                  </label>
                  <select
                    name="stockType"
                    value={formData.stockType}
                    onChange={handleChange}
                    type="number"
                    className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00]"
                    placeholder="0.00"
                  >
                    <option value="Bottles">Bottles</option>
                    <option value="Cases">Cases</option>
                  </select>
                </div>
              )}

              {formData.stockType === "Bottles" && !initialData && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-gray-400 ml-2">
                      Current Quantity In Bottles
                    </label>
                    <input
                      name="currentQuantityInBottles"
                      value={formData.currentQuantityInBottles}
                      onChange={handleChange}
                      type="number"
                      className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00]"
                      placeholder="0"
                    />
                  </div>
                </>
              )}
              {formData.stockType === "Cases" && !initialData && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-gray-400 ml-2">
                      Current Quantity In Cases
                    </label>
                    <input
                      name="currentQuantityInCases"
                      value={formData.currentQuantityInCases}
                      onChange={handleChange}
                      type="number"
                      className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00]"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-gray-400 ml-2">
                      Bottles PerCase
                    </label>
                    <input
                      name="bottlesPerCase"
                      value={formData.bottlesPerCase}
                      onChange={handleChange}
                      type="number"
                      className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00]"
                      placeholder="0"
                    />
                  </div>
                </>
              )}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400 ml-2">
                  Low Stock Threshold
                </label>
                <input
                  name="lowStockThreshold"
                  value={formData.lowStockThreshold}
                  onChange={handleChange}
                  type="number"
                  className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00]"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400 ml-2">
                  Volume
                </label>
                <input
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00]"
                  placeholder="e.g. 750ml"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400 ml-2">
                  Origin
                </label>
                <input
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00]"
                  placeholder="e.g. Scotland"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400 ml-2">
                  Brand
                </label>
                <input
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00]"
                  placeholder="e.g. Jameson"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00] resize-none"
                placeholder="Brief description of the product..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FFAB00] text-black font-black py-4 rounded-2xl shadow-lg hover:shadow-[#FFAB00]/40 transition-all mt-4"
            >
              {initialData ? "Save Changes" : "Confirm & Add Item"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLiquorForm;
