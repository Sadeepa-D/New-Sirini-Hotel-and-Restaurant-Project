import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Power } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

import AddRestrauntItemForm from "./AddRestrauntItemForm";
import OrderManage from "./OrderManage";
import ConfirmDialog from "../../ConfrimDialog";

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
    <div className="p-3 flex flex-col gap-1 flex-1">
      <div>
        <span className="inline-block bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full w-fit max-w-full truncate">
          {item.name || item.foodname}
        </span>
        <p className="text-gray-400 text-[10px] mt-1 line-clamp-2 italic">
          {item.description}
        </p>
      </div>
      <div className="mt-2 space-y-1 flex-1 flex flex-col justify-end">
        <div className="flex flex-col gap-0.5">
          <p className="text-amber-500 text-sm font-bold">
            Normal Price: LKR {item.normal_price}
          </p>
        </div>
        {item.has_portions && (
          <p className="text-amber-500 text-sm font-bold">
            Full Price: LKR {item.full_price}
          </p>
        )}
        <p
          className={`text-[9px] font-black tracking-widest mt-1 uppercase ${
            item.availability !== false ? "text-green-400" : "text-red-400"
          }`}
        >
          {item.availability !== false ? "AVAILABLE" : "UNAVAILABLE"}
        </p>
      </div>
    </div>
  </div>
);

// Main RestaurantManager

const RestaurantManager = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [foodItems, setFoodItems] = useState([]);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null,
    type: "delete",
    title: "",
    message: "",
  });

  const CATEGORIES = [
    "Chopsy Rice",
    "Rice & Nasi Goreng",
    "Kottu",
    "Noodles",
    "Bites",
    "Side Dishes",
    "Snacks",
  ];
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  const fetchFoodItems = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/restraunt/viewfooditems`,
      );
      setFoodItems(data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setFoodItems([]); // Handle empty state gracefully
      } else {
        console.error("Error fetching food items:", err);
      }
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    setConfirmDialog({
      isOpen: true,
      id,
      type: "delete",
      title: "Delete Food Item?",
      message:
        "Are you sure you want to delete this food item? This action cannot be undone.",
    });
  };

  const handleConfirmDelete = async () => {
    const { id } = confirmDialog;
    setConfirmDialog({ isOpen: false, id: null });
    const loadingtoast = toast.loading("Deleting item...");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/restraunt/deletefooditem/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.dismiss(loadingtoast);
      toast.success("Item deleted successfully");
      fetchFoodItems();
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.dismiss(loadingtoast);
      toast.error("Error deleting item");
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/restraunt/toggleavailability/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Availability updated!");
      fetchFoodItems();
    } catch (err) {
      console.error("Error toggling availability:", err);
    }
  };

  const handleSave = async (formData) => {
    const loadingToast = toast.loading(
      editingItem ? "Updating item..." : "Adding item...",
    );
    try {
      const token = localStorage.getItem("token");
      if (editingItem) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/restraunt/updatefooditem/${editingItem._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success("Item updated successfully", { id: loadingToast });
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/restraunt/addfooditem`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success("Item added successfully", { id: loadingToast });
      }
      fetchFoodItems();
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Error saving item:", err);
      const errorMessage = err.response?.data?.message || "Error saving item";
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  const filteredItems = foodItems.filter((item) => {
    const itemName = item.name || item.foodname || "";
    const matchesSearch = itemName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen w-full max-w-full overflow-hidden">
      {/* Header Actions */}
      <div className="bg-white rounded-xl p-3.5 sm:p-4 shadow-xl mb-4 md:mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100">
        <button
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          style={{ borderRadius: "12px" }}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-yellow-500 text-black font-bold px-6 py-3 shadow-lg hover:bg-orange-500 hover:text-black transition-all transform hover:scale-[1.03] active:scale-[0.97] duration-200 cursor-pointer"
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
            style={{ borderRadius: "12px" }}
            placeholder="Search food items..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#FFAB00] shadow-sm bg-gray-50 outline-none transition-all focus-within:scale-[1.01]"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm mb-4 md:mb-8 border border-gray-100">
        <div className="flex flex-wrap items-center justify-center gap-2 pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{ borderRadius: "10px" }}
              className={`px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap shadow-sm border transform hover:scale-105 active:scale-95 cursor-pointer
                ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-black border-amber-500 shadow-md scale-105"
                    : "bg-gray-50 text-neutral-600 hover:bg-gray-100 border-neutral-200"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food Items Grid Section */}
      <div className="bg-white rounded-xl p-3 sm:p-4 md:p-10 shadow-sm min-h-[400px]">
        {filteredItems.length > 0 ? (
          <div className="flex flex-col">
            <div className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="relative group h-full w-[94%] shrink-0 snap-start md:w-auto md:shrink md:snap-none"
                >
                  <FoodCard item={item} onClick={() => {}} />
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
                    {/* Toggle Availability */}
                    <button
                      style={{ borderRadius: "50%" }}
                      className={`p-2 shadow-lg transition-all duration-300 transform hover:scale-115 active:scale-95 cursor-pointer ${
                        item.availability !== false
                          ? "bg-green-100 text-green-600 hover:bg-green-600 hover:text-white"
                          : "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleAvailability(item._id);
                      }}
                      title={
                        item.availability !== false
                          ? "Mark as Unavailable"
                          : "Mark as Available"
                      }
                    >
                      <Power size={16} />
                    </button>
                    {/* Edit */}
                    <button
                      style={{ borderRadius: "50%" }}
                      className="p-2 bg-white text-blue-600 shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-115 active:scale-95 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item);
                      }}
                      title="Edit Item"
                    >
                      <Edit2 size={16} />
                    </button>
                    {/* Delete */}
                    <button
                      style={{ borderRadius: "50%" }}
                      className="p-2 bg-white text-red-600 shadow-lg hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-115 active:scale-95 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                      title="Delete Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-center text-[10px] text-gray-400 font-medium tracking-wider md:hidden">
              ← Swipe to browse →
            </p>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-200" />
            </div>
            <p className="text-lg font-semibold">No food items found.</p>
            <p className="text-sm">Try a different search or category.</p>
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

      {/* Order Manage Section */}
      <hr className="my-12 border-gray-200" />
      <OrderManage />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        type={confirmDialog.type}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default RestaurantManager;
