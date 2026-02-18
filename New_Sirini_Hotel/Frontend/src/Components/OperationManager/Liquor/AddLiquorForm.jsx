import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";

const AddLiquorForm = ({ onClose, initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    alcoholPercentage: "",
    category: "Beer",
    image: "",
    description: "",
    volume: "",
    origin: "",
    brand: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
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

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Image Upload Area */}
            <div className="w-full h-40 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 cursor-pointer transition">
              <Upload className="text-[#FFAB00]" size={32} />
              <p className="text-xs font-bold text-gray-400">
                Click to upload product image
              </p>
              {/* Hidden file input could go here */}
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
                  Price (LKR)
                </label>
                <input
                  name="price"
                  value={formData.price}
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
