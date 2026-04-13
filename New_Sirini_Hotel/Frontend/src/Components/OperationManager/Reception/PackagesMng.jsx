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
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerView = 3;

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
      const response = await axios.put(
        `${VITE_URL}/api/receptionhall/package/toggle/${id}`,
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${VITE_URL}/api/receptionhall/package/delete/${id}`);
      setPackages((prev) => prev.filter((p) => p._id !== id));
      toast.success("Package deleted successfully");
    } catch (err) {
      setError("Failed to delete package");
      toast.error("Failed to delete package");
    }
  };

  const handleEdit = (item) => {
    toast.error("Edit functionality not implemented yet"); // connect your edit modal here
  };

  if (loading)
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <p className="text-center text-gray-400 text-sm py-10 animate-pulse">
          Loading packages...
        </p>
      </div>
    );
  if (error)
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <p className="text-center text-red-400 text-sm py-10">{error}</p>
      </div>
    );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
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
          <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm">
            <Plus size={16} />
            Add Package
          </button>
        </div>
      </div>
      {/* Cards Slider */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-10">
          No packages found
        </p>
      ) : (
        <div className="relative">
          {index > 0 && (
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
          )}

          <div className="overflow-hidden px-9">
            <div
              className="flex gap-4 transition-transform duration-300"
              style={{
                transform: `translateX(-${index * (100 / itemsPerView)}%)`,
              }}
            >
              {filtered.map((item) => (
                <div
                  key={item._id}
                  className="relative shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm group"
                  style={{
                    width: `calc(${100 / itemsPerView}% - 12px)`,
                    minWidth: "200px",
                  }}
                >
                  {/* Image */}
                  <div className="h-40 overflow-hidden">
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
                    onDelete={handleDelete}
                  />

                  {/* Info */}
                  <div className="p-3 bg-white">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {item.description}
                    </p>

                    {/* Features */}
                    {item.features && item.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {item.features[0]
                          .split(",")
                          .slice(0, 2)
                          .map((f, i) => (
                            <span
                              key={i}
                              className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100"
                            >
                              {f.trim()}
                            </span>
                          ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        Rs. {Number(item.price).toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400">
                        Seats: {item.seatings}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {index < filtered.length - itemsPerView && (
            <button
              onClick={() =>
                setIndex((i) => Math.min(filtered.length - itemsPerView, i + 1))
              }
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          )}
        </div>
      )}
      {/* Stats footer */}
      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          Total: <strong className="text-gray-600">{packages.length}</strong>
        </span>
        <span className="text-xs text-gray-400">
          Active:{" "}
          <strong className="text-green-600">
            {packages.filter((p) => p.status).length}
          </strong>
        </span>
        <span className="text-xs text-gray-400">
          Inactive:{" "}
          <strong className="text-red-500">
            {packages.filter((p) => !p.status).length}
          </strong>
        </span>
      </div>
    </div>
  );
};
export default PackagesMng;
