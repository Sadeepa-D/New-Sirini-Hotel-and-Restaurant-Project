import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, Power } from "lucide-react";
import AddLiquorForm from "../Liquor/AddLiquorForm";
import DrinkCard from "../../LiqourStore/LiqourCard";
import LiquorDetailsComp from "../../LiqourStore/LIquorDetailsComp";

const LiquorManager = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Sample data - This will come from your backend later
  const [liquorItems, setLiquorItems] = useState([
    {
      id: 1,
      name: "Lion Lager",
      price: "350",
      alcoholPercentage: "4.8",
      category: "Beer",
      image:
        "https://lankareporter.com/wp-content/uploads/2022/08/SINHA-LAGER-BOTTLE-AND-GLASS-1-773x762.jpg",
      description:
        "Lion Lager is a 4.8% ABV lager produced by Lion Brewery in Sri Lanka. It is the best-selling beer in Sri Lanka and is exported to over 20 countries.",
      volume: "625ml",
      origin: "Sri Lanka",
      brand: "Lion",
      isAvailable: true,
    },
    {
      id: 2,
      name: "Black Label",
      price: "18500",
      alcoholPercentage: "40",
      category: "Whisky",
      image: "https://www.hellowcost.fr/5766/511.jpg",
      description:
        "Johnnie Walker Black Label is a true icon, recognised as the benchmark for all other deluxe blends. Created using only whiskies aged for a minimum of 12 years from the four corners of Scotland.",
      volume: "750ml",
      origin: "Scotland",
      brand: "Johnnie Walker",
      isAvailable: true,
    },
  ]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setLiquorItems(liquorItems.filter((item) => item.id !== id));
    }
  };

  const handleToggleAvailability = (id) => {
    setLiquorItems(
      liquorItems.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item,
      ),
    );
  };

  const handleSave = (itemData) => {
    if (editingItem) {
      // Update existing item
      setLiquorItems(
        liquorItems.map((item) =>
          item.id === editingItem.id ? { ...item, ...itemData } : item,
        ),
      );
    } else {
      // Add new item
      const newItem = {
        ...itemData,
        id: Date.now(), // Simple ID generation
        image: itemData.image || "https://via.placeholder.com/150",
        isAvailable: true, // Default to available
      };
      setLiquorItems([...liquorItems, newItem]);
    }
    setEditingItem(null); // Reset editing state
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
            <div key={item.id} className="relative group">
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
                    handleToggleAvailability(item.id);
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
                    handleDelete(item.id);
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
