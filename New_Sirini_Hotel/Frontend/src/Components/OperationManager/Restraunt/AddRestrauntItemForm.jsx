import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";

const AddRestrauntItemForm = ({ onClose, initialData, onSubmit }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "Rice & Curry",
        portion: "Regular",
        dietary: "Non-Vegetarian",
        preparationTime: "",
        image: "",
        description: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
        onSubmit(data);
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
                        {initialData ? "Edit Menu Item" : "Add New Menu Item"}
                    </h2>

                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                    >
                        {/* Image Upload Area */}
                        <label className="w-full h-40 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 cursor-pointer transition overflow-hidden relative">
                            {imagePreview ? (
                                <>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="absolute inset-0 w-full h-full object-contain p-2"
                                    />
                                    <span className="absolute bottom-2 bg-black/50 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                                        Click to change
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Upload className="text-[#FFAB00]" size={32} />
                                    <p className="text-xs font-bold text-gray-400">
                                        Click to upload product image
                                    </p>
                                </>
                            )}
                            <input
                                type="file"
                                name="image"
                                onChange={handleChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase text-gray-400 ml-2">
                                    Item Name
                                </label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    type="text"
                                    required
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00]"
                                    placeholder="e.g. Mixed Fried Rice"
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
                                    <option value="Main Meals">Main Meals</option>
                                    <option value="Soft Drinks">Soft Drinks</option>
                                    <option value="Fresh Juice">Fresh Juice</option>

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

                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase text-gray-400 ml-2">
                                    Dietary Preference
                                </label>
                                <select
                                    name="dietary"
                                    value={formData.dietary}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00] appearance-none"
                                >
                                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                                    <option value="Vegetarian">Vegetarian</option>
                                    <option value="Vegan">Vegan</option>
                                    <option value="Drinks">Drinks</option>
                                </select>
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
                                placeholder="Brief description of the menu item (ingredients, spices, etc.)..."
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

export default AddRestrauntItemForm;
