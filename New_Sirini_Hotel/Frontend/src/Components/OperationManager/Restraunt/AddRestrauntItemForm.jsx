import React, { useState, useEffect } from "react";
import { X, Upload, Camera } from "lucide-react";
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
        productionPrice: "",
        discount: "",
        sellingPrice: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                normal_price: initialData.normal_price || "",
                full_price: initialData.full_price || "",
                has_portions: initialData.has_portions || false,
                productionPrice: initialData.productionPrice || "",
                discount: initialData.discount || "",
                sellingPrice: initialData.sellingPrice || "",
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

        if (!formData.productionPrice) {
            toast.error("Production price is required");
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
        data.append("productionPrice", formData.productionPrice);
        data.append("discount", formData.discount || 0);
        data.append("sellingPrice", formData.sellingPrice);
        data.append("normal_price", formData.sellingPrice); // Keep for compatibility
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
            setFormData((prev) => {
                const updatedData = { ...prev, [name]: value };
                
                // Calculate selling price if productionPrice or discount changes
                if (name === "productionPrice" || name === "discount") {
                    const pPrice = name === "productionPrice" ? parseFloat(value) : parseFloat(prev.productionPrice);
                    const dPct = name === "discount" ? parseFloat(value) : parseFloat(prev.discount);
                    
                    if (!isNaN(pPrice)) {
                        const discountValue = isNaN(dPct) ? 0 : dPct;
                        const sPrice = pPrice - (pPrice * discountValue / 100);
                        updatedData.sellingPrice = sPrice.toFixed(2);
                        updatedData.normal_price = sPrice.toFixed(2);
                    } else {
                        updatedData.sellingPrice = "";
                    }
                }
                
                return updatedData;
            });
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
                        {initialData ? "Edit Menu Item" : "Add New Menu Item"}
                    </h2>

                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                    >
                        {/* Image Upload – Preview left / Upload right */}
                        <div className="space-y-3">
                            <label className="block text-xs font-black uppercase text-gray-400 ml-2">
                                Menu Item Image
                            </label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Left: Visual Preview */}
                                <div className="w-full sm:w-44 h-44 rounded-3xl overflow-hidden border border-amber-100 bg-gray-50 flex items-center justify-center relative group shrink-0">
                                    {imagePreview ? (
                                        <>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/20 flex items-end p-2">
                                                <span className="bg-white/90 backdrop-blur text-[9px] font-bold px-2 py-1 rounded-lg uppercase text-amber-600 shadow-sm">
                                                    {typeof formData.image === "object" && formData.image !== null
                                                        ? "New Selection"
                                                        : "Current View"}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <Camera size={30} className="text-gray-200" />
                                    )}
                                </div>

                                {/* Right: Upload Action */}
                                <label className="flex-1 border-2 border-dashed border-amber-200 hover:border-amber-400 bg-amber-50/20 hover:bg-amber-50 rounded-3xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center text-center group">
                                    <Upload
                                        size={20}
                                        className="text-amber-500 group-hover:-translate-y-1 transition-transform mb-2"
                                    />
                                    <span className="text-sm font-bold text-gray-700">
                                        {typeof formData.image === "object" && formData.image !== null
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
                                    <option value="Chopsy Rice">Chopsy Rice</option>
                                    <option value="Rice & Nasi Goreng">Rice & Nasi Goreng</option>
                                    <option value="Kottu">Kottu</option>
                                    <option value="Noodles">Noodles</option>
                                    <option value="Bites">Bites</option>
                                    <option value="Side Dishes">Side Dishes</option>
                                    <option value="Snacks">Snacks</option>
                                </select>
                            </div>
                        </div>

                        {/* Portion Toggle */}
                        <div className="flex items-center gap-3 px-2 py-1">
                            <input
                                type="checkbox"
                                name="has_portions"
                                id="has_portions"
                                checked={formData.has_portions}
                                onChange={handleChange}
                                className="w-5 h-5 accent-[#FFAB00] cursor-pointer"
                            />
                            <label htmlFor="has_portions" className="text-sm font-bold text-gray-600 cursor-pointer">
                                This item has multiple portion sizes (Normal & Full)
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase text-gray-400 ml-2">
                                    Production Price (LKR)
                                </label>
                                <input
                                    name="productionPrice"
                                    value={formData.productionPrice}
                                    onChange={handleChange}
                                    type="number"
                                    required
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00]"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase text-gray-400 ml-2">
                                    Discount (%)
                                </label>
                                <input
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    type="number"
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00]"
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase text-gray-400 ml-2">
                                    Selling Price (LKR)
                                </label>
                                <input
                                    name="sellingPrice"
                                    value={formData.sellingPrice}
                                    readOnly
                                    type="number"
                                    className="w-full px-5 py-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 font-bold outline-none cursor-not-allowed"
                                    placeholder="Calculated"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {formData.has_portions && (
                                <div className="space-y-1 animate-in fade-in slide-in-from-left-2 duration-300 md:col-start-2">
                                    <label className="text-xs font-black uppercase text-gray-400 ml-2">
                                        Full Price (LKR)
                                    </label>
                                    <input
                                        name="full_price"
                                        value={formData.full_price}
                                        onChange={handleChange}
                                        type="number"
                                        required={formData.has_portions}
                                        className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00]"
                                        placeholder="0.00"
                                    />
                                </div>
                            )}
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
                                required
                                className="w-full px-5 py-3 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-[#FFAB00] resize-none"
                                placeholder="Brief description of the menu item..."
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
