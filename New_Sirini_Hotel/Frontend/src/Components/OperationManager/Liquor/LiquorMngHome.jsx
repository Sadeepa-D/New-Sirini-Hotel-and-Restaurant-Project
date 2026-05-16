import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Power,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import AddLiquorForm from "../Liquor/AddLiquorForm";
import DrinkCard from "../../LiqourStore/LiqourCard";
import LiquorDetailsComp from "../../LiqourStore/LIquorDetailsComp";
import ConfirmDialog from "../../ConfrimDialog";
import LiquorInventory from "./LiquorInventory";

const LiquorManager = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [liquorItems, setLiquorItems] = useState([]);
  const [beerIndex, setBeerIndex] = useState(0);
  const [othersIndex, setOthersIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null,
    type: "delete",
    title: "",
    message: "",
  });

  const fetchLiquorItems = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/liquor/get`,
      );
      setLiquorItems(response.data);
    } catch (error) {
      console.error("Error fetching liquor items:", error);
    }
  };

  useEffect(() => {
    fetchLiquorItems();
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
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
    setConfirmDialog({
      isOpen: true,
      id,
      type: "delete",
      title: "Delete Liquor Item?",
      message:
        "Are you sure you want to delete this liquor item? This action cannot be undone.",
    });
  };

  const handleConfirmDelete = async () => {
    const { id } = confirmDialog;
    setConfirmDialog({ isOpen: false, id: null });
    const loadingtoast = toast.loading("Deleting item...");
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/liquor/delete/${id}`,
      );
      toast.dismiss(loadingtoast);
      toast.success("Item deleted successfully");
      fetchLiquorItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/liquor/toggle/${id}`,
      );
      fetchLiquorItems();
      toast.success("Item Availability Update Sucessfully!");
    } catch (error) {
      console.error("Error toggling availability:", error);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/liquor/update/${editingItem._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/liquor/add`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      }

      fetchLiquorItems();
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

  const filteredItems = liquorItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const beerDrinks = filteredItems.filter((item) => item.category === "Beer");
  const otherDrinks = filteredItems.filter((item) => item.category !== "Beer");

  const renderCarouselCard = (item) => (
    <div key={item._id} className="relative group">
      <DrinkCard drink={item} onClick={() => handlCardClick(item)} />
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
  );

  // Reusable carousel section component
  const renderCarouselSection = (title, items, index, setIndex) => {
    const GAP = 16;
    const cardWidth = `calc((100% - ${GAP * (itemsPerView - 1)}px) / ${itemsPerView})`;
    const visibleItems = items.slice(index, index + itemsPerView);
    const canGoBack = index > 0;
    const canGoNext = index + itemsPerView < items.length;

    return (
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-neutral-900 mb-6">{title}</h3>

        {liquorItems.length > 0 ? (
          <div className="relative">
            {canGoBack && (
              <button
                onClick={() => setIndex(Math.max(0, index - itemsPerView))}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-neutral-900" />
              </button>
            )}
            <div
              key={index}
              className="flex gap-4"
              style={{ animation: "fadeIn 0.25s ease" }}
            >
              {visibleItems.map((item) => (
                <div
                  key={item._id}
                  className="shrink-0"
                  style={{ width: cardWidth }}
                >
                  {renderCarouselCard(item)}
                </div>
              ))}
            </div>
            {canGoNext && (
              <button
                onClick={() =>
                  setIndex(
                    Math.min(items.length - itemsPerView, index + itemsPerView),
                  )
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-neutral-900" />
              </button>
            )}
            {items.length > itemsPerView && (
              <div className="flex justify-center gap-1.5 mt-4">
                {Array.from({
                  length: Math.ceil(items.length / itemsPerView),
                }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i * itemsPerView)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      Math.floor(index / itemsPerView) === i
                        ? "bg-amber-500"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <h3 className="text-2xl font-bold text-neutral-900 mb-6">
            No Liquor Items Found
          </h3>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Header Actions */}
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

      {/* Category Sections with Carousel */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        {renderCarouselSection("Beer", beerDrinks, beerIndex, setBeerIndex)}
        {renderCarouselSection(
          "Others",
          otherDrinks,
          othersIndex,
          setOthersIndex,
        )}
      </div>

      <LiquorInventory liqouritems={liquorItems} />

      {/* Form Modal */}
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
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
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

export default LiquorManager;
