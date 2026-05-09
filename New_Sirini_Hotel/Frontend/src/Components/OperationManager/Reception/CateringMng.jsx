import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Power,
  Pencil,
  Trash2,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import CateringAddForm from "./CateringAddForm";
import ConfirmDialog from "../../ConfrimDialog";

const ActionRibbon = ({ item, onToggle, onEdit, onDelete }) => (
  <div className="absolute right-2 top-2 flex flex-col gap-1.5 z-10">
    <button
      onClick={() => onToggle(item._id)}
      className={`w-8 h-8 rounded-full flex items-center justify-center shadow transition-colors ${
        item.status
          ? "bg-green-100 text-green-600 hover:bg-green-200"
          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
      }`}
    >
      <Power size={14} />
    </button>
    <button
      onClick={() => onEdit(item)}
      className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center shadow transition-colors"
    >
      <Pencil size={14} />
    </button>
    <button
      onClick={() => onDelete(item._id)}
      className="w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center shadow transition-colors"
    >
      <Trash2 size={14} />
    </button>
  </div>
);

const CateringMng = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [itemsPerView, setItemsPerView] = useState(
    typeof window !== "undefined"
      ? window.innerWidth < 640
        ? 1
        : window.innerWidth < 1024
          ? 2
          : 4
      : 4,
  );
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null,
    type: "",
    title: "",
    message: "",
  });

  const VITE_URL = import.meta.env.VITE_API_URL;

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/catering/view`,
      );
      const data = response.data;
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filtered = items.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    setIndex((prev) =>
      Math.min(
        prev,
        Math.max(
          0,
          Math.floor((filtered.length - 1) / itemsPerView) * itemsPerView,
        ),
      ),
    );
  }, [filtered.length, itemsPerView]);

  const handleToggle = async (id) => {
    try {
      const response = await axios.put(
        `${VITE_URL}/api/receptionhall/catering/toggle/${id}`,
      );
      const updatedItem = response.data;
      toast.success("Availability updated Successfully");
      setItems((prev) =>
        prev
          .filter((p) => p !== undefined && p !== null)
          .map((p) => (p._id === id ? updatedItem : p)),
      );
    } catch (err) {
      toast.error("Failed to update availability");
    }
  };

  const handleconfrimDelete = (id) => {
    setConfirmDialog({
      isOpen: true,
      id,
      type: "delete",
      title: "Delete Catering Item",
      message: "Are you sure you want to delete this item?",
    });
  };

  const handleDelete = async () => {
    const { id } = confirmDialog;
    setConfirmDialog({
      isOpen: false,
      id: null,
    });
    try {
      await axios.delete(`${VITE_URL}/api/receptionhall/catering/delete/${id}`);
      await fetchItems();
      toast.success("Item deleted successfully");
    } catch (err) {
      toast.error("Failed to delete item");
      await fetchItems();
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  if (loading)
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <p className="text-center text-gray-400 text-sm py-10 animate-pulse">
          Loading catering items...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <p className="text-center text-red-400 text-sm py-10">{error}</p>
      </div>
    );

  const visibleItems = filtered.slice(index, index + itemsPerView);
  const canGoBack = index > 0;
  const canGoNext = index + itemsPerView < filtered.length;
  const GAP = 16;
  const cardWidth = `calc((100% - ${GAP * (itemsPerView - 1)}px) / ${itemsPerView})`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-amber-500 uppercase tracking-widest font-medium mb-0.5">
            Manage
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Catering Items
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-amber-400 transition-colors">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm text-gray-600 outline-none w-40 placeholder-gray-300"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={13} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <button
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
            onClick={() => {
              setShowForm(true);
              setEditItem(null);
            }}
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-10">
          No items found
        </p>
      ) : (
        <div className="relative">
          {/* Left arrow */}
          {canGoBack && (
            <button
              onClick={() => setIndex((i) => Math.max(0, i - itemsPerView))}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
          )}

          {/* Visible cards — slice-based, no translateX */}
          <div
            key={index}
            className="flex gap-4"
            style={{ animation: "fadeIn 0.25s ease" }}
          >
            {visibleItems.map((item) => (
              <div
                key={item._id}
                className="relative shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm group"
                style={{ width: cardWidth }}
              >
                {/* Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {!item.status && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mt-8">
                      Unavailable
                    </span>
                  </div>
                )}

                {/* Action ribbon — absolute top-right, same as PackagesMng */}
                <ActionRibbon
                  item={item}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleconfrimDelete}
                />

                {/* Card info */}
                <div className="p-3 bg-white">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {(Array.isArray(item.ingredients)
                      ? item.ingredients[0].split(",")
                      : []
                    )
                      .slice(0, 2)
                      .map((ing, i) => (
                        <span
                          key={i}
                          className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100"
                        >
                          {ing.trim()}
                        </span>
                      ))}
                  </div>
                  <span className="inline-block mt-2 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    Rs: {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          {canGoNext && (
            <button
              onClick={() =>
                setIndex((i) =>
                  Math.min(filtered.length - itemsPerView, i + itemsPerView),
                )
              }
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          )}

          {/* Page dots */}
          {filtered.length > itemsPerView && (
            <div className="flex justify-center gap-1.5 mt-4">
              {Array.from({
                length: Math.ceil(filtered.length / itemsPerView),
              }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i * itemsPerView)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    Math.floor(index / itemsPerView) === i
                      ? "bg-amber-500"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer stats */}
      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          Total: <strong className="text-gray-600">{items.length}</strong>
        </span>
        <span className="text-xs text-gray-400">
          Active:
          <strong className="text-green-600">
            {items.filter((p) => p.status).length}
          </strong>
        </span>
        <span className="text-xs text-gray-400">
          Inactive:{" "}
          <strong className="text-red-500">
            {items.filter((p) => !p.status).length}
          </strong>
        </span>
      </div>

      {showForm && (
        <CateringAddForm
          onClose={() => setShowForm(false)}
          fetchitems={fetchItems}
          editItem={editItem}
        />
      )}

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
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default CateringMng;
