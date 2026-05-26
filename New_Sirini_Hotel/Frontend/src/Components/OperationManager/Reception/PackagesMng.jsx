import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Power,
  Pencil,
  Trash2,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import PackageAddForm from "./PackageAddForm";
import ConfirmDialog from "../../ConfrimDialog";
import CateringSelectionHub from "../../Receptionhall/CateringSelectionHub";

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

const PackagesMng = () => {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null,
    type: "",
    title: "",
    message: "",
  });
  const [showCateringHub, setShowCateringHub] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const VITE_URL = import.meta.env.VITE_API_URL;

  const fetchpackages = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/package/view`,
      );
      const data = response.data;
      setPackages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load packages");
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchpackages();
  }, []);

  const filtered = packages.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleToggle = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${VITE_URL}/api/receptionhall/package/toggle/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedpackage = response.data;

      setPackages((prev) =>
        prev
          .filter((p) => p !== undefined && p !== null)
          .map((p) => (p._id === id ? updatedpackage : p)),
      );
      toast.success(
        `Package ${updatedpackage.status ? "activated" : "deactivated"} successfully`,
      );
    } catch (err) {
      toast.error("Failed to toggle package status");
    }
  };

  const handleconfrimDelete = (id) => {
    setConfirmDialog({
      isOpen: true,
      id,
      type: "delete",
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this package?",
    });
  };

  const handleDelete = async () => {
    const loadingToast = toast.loading("Deleting package...");
    const { id } = confirmDialog;
    setConfirmDialog({ isOpen: false, id: null });
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${VITE_URL}/api/receptionhall/package/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPackages((prev) => prev.filter((p) => p._id !== id));
      toast.dismiss(loadingToast);
      toast.success("Package deleted successfully");
    } catch (err) {
      toast.dismiss(loadingToast);
      setError("Failed to delete package");
      toast.error("Failed to delete package");
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const sliderRef = useRef(null);
  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;
    const cardWidth =
      sliderRef.current.querySelector("[data-slider-card]")?.offsetWidth || 320;
    sliderRef.current.scrollBy({
      left: direction * (cardWidth + 16),
      behavior: "smooth",
    });
  };

  if (loading)
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6">
        <p className="text-center text-gray-400 text-sm py-10 animate-pulse">
          Loading packages...
        </p>
      </div>
    );
  if (error)
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6">
        <p className="text-center text-red-400 text-sm py-10">{error}</p>
      </div>
    );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-amber-500 uppercase tracking-widest font-medium mb-0.5">
            Manage
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Reception Packages
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-amber-400 transition-colors">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search packages..."
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
          {/* Add Button */}
          <button
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
            onClick={() => {
              setShowForm(true);
              setEditItem(null);
            }}
          >
            <Plus size={16} />
            Add Package
          </button>
        </div>
      </div>
      {/* Cards */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-10">
          No packages found
        </p>
      ) : (
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scrollSlider(-1)}
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
            {filtered.map((item) => (
              <div
                key={item._id}
                data-slider-card
                className="w-full shrink-0 snap-start md:w-[calc(25%-12px)] relative rounded-xl overflow-hidden border border-gray-100 shadow-sm group cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedPackage(item);
                }}
              >
                {/* Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Availability overlay */}
                {!item.status && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Unavailable
                    </span>
                  </div>
                )}

                {/* Action ribbon */}
                <ActionRibbon
                  item={item}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleconfrimDelete}
                />

                {/* Info */}
                <div className="p-2 sm:p-3 bg-white">
                  <h3 className="font-semibold text-gray-800 text-sm truncate pb-2">
                    {item.name}
                  </h3>
                  <p
                    className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 line-clamp-1 sm:line-clamp-2"
                    title={item.description}
                  >
                    {item.description}
                  </p>

                  {/* Features */}
                  {item.features && item.features.length > 0 && (
                    <div className="mb-2 sm:mb-4">
                      <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        What's Included
                      </p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {item.features[0]
                          .split(",")
                          .slice(0, 5)
                          .map((feature, i) => (
                            <span
                              key={i}
                              className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-gray-700 bg-amber-50/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-amber-100/50"
                            >
                              <CheckCircle2
                                size={12}
                                className="text-amber-500"
                              />
                              <span className="hidden sm:inline">
                                {feature.trim()}
                              </span>
                              <span className="sm:hidden">
                                {feature.trim().split(" ")[0]}
                              </span>
                            </span>
                          ))}
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] mt-3 cursor-pointer hover:text-amber-700 hover:underline underline-offset-4 transition-all decoration-amber-200">
                          + More
                        </p>
                      </div>
                    </div>
                  )}
                  {/* item */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      Rs. {Number(item.price).toLocaleString()}
                    </span>
                    <button
                      className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                      onClick={() => setShowCateringHub(true)}
                    >
                      Show Food Menu
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scrollSlider(1)}
            aria-label="Scroll right"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg text-gray-600 hover:text-amber-500 hover:border-amber-400 transition-all active:scale-90"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>

          {/* Mobile swipe hint */}
          <p className="mt-2 text-center text-[10px] text-gray-400 font-medium tracking-wider md:hidden">
            ← Swipe to browse →
          </p>
        </div>
      )}
      {/* Stats footer */}
      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          Total: <strong className="text-gray-600">{packages.length}</strong>
        </span>
        <span className="text-xs text-gray-400">
          Active:
          <strong className="text-green-600">
            {packages.filter((p) => p.status).length}
          </strong>
        </span>
        <span className="text-xs text-gray-400">
          Inactive:
          <strong className="text-red-500">
            {packages.filter((p) => !p.status).length}
          </strong>
        </span>
      </div>
      {showForm && (
        <PackageAddForm
          onClose={() => setShowForm(false)}
          fetchpackages={fetchpackages}
          editItem={editItem}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        type={confirmDialog.type}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
      {showCateringHub && (
        <CateringSelectionHub
          selectedPackage={selectedPackage}
          onClose={() => {
            setShowCateringHub(false);
            setSelectedPackage(null);
          }}
          isAdd={true}
        />
      )}
    </div>
  );
};
export default PackagesMng;
