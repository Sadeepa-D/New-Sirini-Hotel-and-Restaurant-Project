import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Power } from "lucide-react";
import axios from "axios";
import AddLiquorForm from "../Liquor/AddLiquorForm";
import DrinkCard from "../../LiqourStore/LiqourCard";
import LiquorDetailsComp from "../../LiqourStore/LIquorDetailsComp";

const LiquorManager = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [liquorItems, setLiquorItems] = useState([]);

  // Fetch liquor items from backend
  const fetchLiquorItems = async () => {
    try {
      const response = await axios.get(`${process.env.API_URI}/api/liquor/get`);
      setLiquorItems(response.data);
    } catch (error) {
      console.error("Error fetching liquor items:", error);
    }
  };

  useEffect(() => {
    fetchLiquorItems();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${process.env.API_URI}/api/liquor/delete/${id}`);
        fetchLiquorItems(); // Refresh list
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      await axios.put(`${process.env.API_URI}/api/liquor/toggle/${id}`);
      fetchLiquorItems(); // Refresh list to get updated status
    } catch (error) {
      console.error("Error toggling availability:", error);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        // Update existing item
        await axios.put(
          `${process.env.API_URI}/api/liquor/update/${editingItem._id}`,
          formData,
        );
      } else {
        // Add new item
        await axios.post(`${process.env.API_URI}/api/liquor/add`, formData);
      }
      fetchLiquorItems(); // Refresh list
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const openAddForm = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handlCardClick = (item) => {
    setSelectedDrink(item);
    setIsDetailsOpen(true);
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Header Actions - Wrapped in a card for separation */}
      <div className="bg-white rounded-xl p-4 shadow-xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100">
        <button
          onClick={openAddForm}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-orange-500 hover:text-black transition-all"
        >
          <Plus size={20} /> Add Liquor
        </button>

        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search liquor..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFAB00] shadow-sm bg-gray-50"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Liquor Cards - Wrapped in a card for separation */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {liquorItems.map((item) => (
            <div key={item._id} className="relative group">
              {/* The Shared Drink Card Component */}
              <DrinkCard drink={item} onClick={() => handlCardClick(item)} />

              {/* Overlay Edit/Delete Buttons - Always visible in Manager View */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
                <button
                  className={`p-2 rounded-full shadow-md transition ${
                    item.isAvailable !== false
                      ? "bg-green-100 text-green-600 hover:bg-green-600 hover:text-white"
                      : "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleAvailability(item._id);
                  }}
                  title={
                    item.isAvailable !== false
                      ? "Mark as Unavailable"
                      : "Mark as Available"
                  }
                >
                  <Power size={16} />
                </button>
                <button
                  className="p-2 bg-white/90 rounded-full text-blue-600 shadow-md hover:bg-blue-600 hover:text-white transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(item);
                  }}
                >
                  <Edit2 size={16} />
                </button>
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
          ))}
        </div>
      </div>

      {/* Separate Form Component Modal */}
      {isFormOpen && (
        <AddLiquorForm
          initialData={editingItem}
          onSubmit={handleSave}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* Liquor Details Modal */}
      <LiquorDetailsComp
        drink={selectedDrink}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default LiquorManager;
