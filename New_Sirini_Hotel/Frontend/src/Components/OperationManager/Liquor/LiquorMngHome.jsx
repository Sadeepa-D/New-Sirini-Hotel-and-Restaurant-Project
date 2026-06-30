import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Power,
  ChevronLeft,
  ChevronRight,
  PackageX,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import AddLiquorForm from "../Liquor/AddLiquorForm";
import DrinkCard from "../../LiqourStore/LiqourCard";
import LiquorDetailsComp from "../../LiqourStore/LIquorDetailsComp";
import ConfrimDialog from "../../ConfrimDialog";
import LiquorInventory from "./LiquorInventory";

const LiquorManager = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [liquorItems, setLiquorItems] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null,
    type: "delete",
    title: "",
    message: "",
  });

  const beerSliderRef = useRef(null);
  const othersSliderRef = useRef(null);

  const scrollSection = (ref, direction) => {
    if (!ref.current) return;
    const cardWidth =
      ref.current.querySelector("[data-slider-card]")?.offsetWidth || 320;
    ref.current.scrollBy({
      left: direction * (cardWidth + 16),
      behavior: "smooth",
    });
  };

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
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/liquor/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/liquor/toggle/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchLiquorItems();
      toast.success("Item Availability Update Sucessfully!");
    } catch (error) {
      console.error("Error toggling availability:", error);
    }
  };

  const handleSave = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      if (editingItem) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/liquor/update/${editingItem._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/liquor/add`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
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
  const renderCarouselSection = (title, items, sliderRef) => {
    return (
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-neutral-900 mb-6">{title}</h3>

        {items.length > 0 ? (
          <div className="relative">
            {/* Prev Button — desktop only */}
            <button
              onClick={() => scrollSection(sliderRef, -1)}
              aria-label="Scroll left"
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg text-gray-600 hover:text-amber-500 hover:border-amber-400 transition-all active:scale-90"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>

            {/* Scroll container */}
            <div
              ref={sliderRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1"
            >
              {items.map((item) => (
                <div
                  key={item._id}
                  data-slider-card
                  className="w-full shrink-0 snap-start md:w-64"
                >
                  {renderCarouselCard(item)}
                </div>
              ))}
            </div>

            {/* Next Button — desktop only */}
            <button
              onClick={() => scrollSection(sliderRef, 1)}
              aria-label="Scroll right"
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg text-gray-600 hover:text-amber-500 hover:border-amber-400 transition-all active:scale-90"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>

            {/* Mobile swipe hint */}
            <p className="mt-2 text-center text-[10px] text-gray-400 font-medium tracking-wider md:hidden">
              ← Swipe to browse ←
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-10 px-6 bg-gray-50 border border-gray-200 rounded-2xl text-center">
            <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-1">
              <PackageX size={22} className="text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              No {title} Available
            </p>
            <p className="text-[11px] text-gray-400">
              No items found in this section
            </p>
          </div>
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
        {renderCarouselSection("Beer", beerDrinks, beerSliderRef)}
        {renderCarouselSection("Others", otherDrinks, othersSliderRef)}
      </div>

      <LiquorInventory
        liquorItems={liquorItems}
        fetchLiquorItems={fetchLiquorItems}
        toogleavailability={handleToggleAvailability}
      />

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

      <ConfrimDialog
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
