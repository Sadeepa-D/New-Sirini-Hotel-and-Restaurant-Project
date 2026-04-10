import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Power,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

import AddRestrauntItemForm from "./AddRestrauntItemForm";

// ─────────────────────────────────────────────
// FoodCard – mirrors DrinkCard styling
// ─────────────────────────────────────────────
const FoodCard = ({ item, onClick }) => (
  <div
    onClick={onClick}
    className="relative rounded-2xl overflow-hidden cursor-pointer bg-neutral-800 shadow-md hover:shadow-xl transition-shadow duration-300 select-none h-full flex flex-col"
    style={{ minHeight: 280 }}
  >
    {/* Image */}
    <div className="h-44 w-full overflow-hidden">
      <img
        src={item.image || "https://via.placeholder.com/300x180?text=No+Image"}
        alt={item.name || item.foodname}
        className="w-full h-full object-cover"
      />
    </div>

    {/* Info */}
    <div className="p-3 flex flex-col gap-1 flex-1 justify-between">
      <div>
        <span className="inline-block bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full w-fit max-w-full truncate">
        {item.name || item.foodname}
      </span>
      {item.label && (
        <p className="text-gray-400 text-xs">Label: {item.label}</p>
      )}
      </div>
      <div className="mt-2 space-y-1">
        <p className="text-white text-sm font-semibold">Price: LKR {item.price}</p>
        <p
          className={`text-xs font-bold tracking-wide ${
            item.availability !== false ? "text-green-400" : "text-red-400"
          }`}
        >
          {item.availability !== false ? "AVAILABLE" : "UNAVAILABLE"}
        </p>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Main RestaurantManager
// ─────────────────────────────────────────────
const RestaurantManager = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [indexes, setIndexes] = useState({});
  const [itemsPerView, setItemsPerView] = useState(4);

  const CATEGORIES = ["Main Meals", "Soft Drinks", "Fresh Juice"];

  const fetchFoodItems = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/restraunt/viewfooditems`
      );
      setFoodItems(data);
    } catch (err) {
      console.error("Error fetching food items:", err);
    }
  };

  useEffect(() => {
    fetchFoodItems();

    const handleResize = () => {
      const w = window.innerWidth;
      setItemsPerView(w < 640 ? 1 : w < 1024 ? 2 : w < 1280 ? 3 : 4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/restraunt/deletefooditem/${id}`);
      toast.success("Item deleted successfully");
      fetchFoodItems();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/restraunt/toggleavailability/${id}`);
      toast.success("Availability updated!");
      fetchFoodItems();
    } catch (err) {
      console.error("Error toggling availability:", err);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/restraunt/updatefooditem/${editingItem._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Item updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/restraunt/addfooditem`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Item added successfully");
      }
      fetchFoodItems();
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Error saving item:", err);
    }
  };

  const filteredItems = foodItems.filter((item) => {
    const itemName = item.name || item.foodname || "";
    return itemName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getIndex = (cat) => indexes[cat] || 0;
  const setIndex = (cat, val) =>
    setIndexes((prev) => ({ ...prev, [cat]: val }));

  // ── Carousel card with action buttons ──
  const renderCarouselCard = (item) => (
    <div key={item._id} className="relative group h-full">
      <FoodCard item={item} onClick={() => {}} />
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
        {/* Toggle Availability */}
        <button
          className={`p-2 rounded-full shadow-md transition ${
            item.availability !== false
              ? "bg-green-100 text-green-600 hover:bg-green-600 hover:text-white"
              : "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleToggleAvailability(item._id);
          }}
          title={item.availability !== false ? "Mark as Unavailable" : "Mark as Available"}
        >
          <Power size={16} />
        </button>
        {/* Edit */}
        <button
          className="p-2 bg-white/90 rounded-full text-blue-600 shadow-md hover:bg-blue-600 hover:text-white transition"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(item);
          }}
        >
          <Edit2 size={16} />
        </button>
        {/* Delete */}
        <button
          className="p-2 bg-white/90 rounded-full text-red-600 shadow-md hover:bg-red-600 hover:text-white transition"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(item._id);
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  // ── Carousel section ──
  const renderCarouselSection = (category) => {
    const items = filteredItems.filter((i) => i.category === category);
    if (items.length === 0) return null;

    const idx = getIndex(category);

    return (
      <div key={category} className="mb-12">
        <h3 className="text-2xl font-bold text-neutral-900 mb-6">{category}</h3>
        <div className="relative">
          {/* Left arrow */}
          {idx > 0 && (
            <button
              onClick={() => setIndex(category, Math.max(0, idx - 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-neutral-900" />
            </button>
          )}

          <div className="overflow-hidden">
            <div
              className="flex gap-4 sm:gap-6 transition-transform duration-300"
              style={{
                transform: `translateX(-${idx * (100 / itemsPerView)}%)`,
              }}
            >
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex-shrink-0"
                  style={{
                    width: `calc(${100 / itemsPerView}% - ${
                      ((itemsPerView - 1) * (itemsPerView === 1 ? 16 : 24)) /
                      itemsPerView
                    }px)`,
                  }}
                >
                  {renderCarouselCard(item)}
                </div>
              ))}
            </div>
          </div>

          {/* Right arrow */}
          {idx < items.length - itemsPerView && (
            <button
              onClick={() =>
                setIndex(category, Math.min(items.length - itemsPerView, idx + 1))
              }
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-neutral-900" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Header Actions */}
      <div className="bg-white rounded-xl p-4 shadow-xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100">
        <button
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-orange-500 hover:text-black transition-all"
        >
          <Plus size={20} /> Add Food Item
        </button>

        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search food items..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFAB00] shadow-sm bg-gray-50 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Carousels */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        {CATEGORIES.map((cat) => renderCarouselSection(cat))}

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-semibold">No food items found.</p>
            <p className="text-sm">Add a new item or try a different search.</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <AddRestrauntItemForm
          initialData={editingItem}
          onSubmit={handleSave}
          onClose={() => {
            setIsFormOpen(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

export default RestaurantManager;