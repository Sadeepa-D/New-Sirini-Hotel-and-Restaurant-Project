import React, { useState, useEffect } from "react";
import { X, Trash2, Utensils, Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const CateringSelectionHub = ({ onClose, selectedPackage, isAdd = true }) => {
  const [packageItems, setPackageItems] = useState([]);
  const [cateringitems, setCateringItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [loading, setLoading] = useState(true);

  const VITE_URL = import.meta.env.VITE_API_URL;

  const fetchCateringItems = async () => {
    try {
      const response = await axios.get(
        `${VITE_URL}/api/receptionhall/catering/view`,
      );
      setCateringItems(response.data);
    } catch (error) {
      console.error("Error fetching catering items:", error);
    }
  };

  const fetchPackageItems = async () => {
    try {
      if (selectedPackage?._id) {
        const response = await axios.get(
          `${VITE_URL}/api/receptionhall/package/${selectedPackage._id}/items`,
        );
        setPackageItems(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching package items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCateringItems();
    fetchPackageItems();
  }, [selectedPackage]);

  const handleAddItem = async () => {
    try {
      const alreadyadded = packageItems.some(
        (item) => item._id === selectedItemId,
      );
      if (alreadyadded) {
        toast.error("Item is already in the package");
        return;
      }
      const response = await axios.post(
        `${VITE_URL}/api/receptionhall/package/${selectedPackage._id}/add-catering`,
        {
          cateringItemId: selectedItemId,
        },
      );
      toast.success("Item added to package");
      setSelectedItemId(null);
      fetchPackageItems();
    } catch (error) {
      console.error(
        "Error adding item:",
        error.response?.data || error.message,
      );
      toast.error(error.response?.data?.message || "Failed to add item");
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!selectedPackage?._id) {
      toast.error("Package not found");
      return;
    }
    try {
      await axios.delete(
        `${VITE_URL}/api/receptionhall/package/${selectedPackage._id}/remove-catering/${itemId}`,
      );
      toast.success("Item removed from package");
      fetchPackageItems();
    } catch (error) {
      console.error(
        "Error removing item:",
        error.response?.data || error.message,
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-7xl max-h-[95vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Utensils className="text-orange-500" />
              Foods Include in Plate
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Customize the menu for your selected package. Items shown here
              will be served to guests.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-gray-50/50">
          {/* LEFT: Available Items Grid (Cardcoise items showing place) */}
          {isAdd && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Available Catering Items
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Select items to add them to your package
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {cateringitems.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setSelectedItemId(item._id)}
                    className={`cursor-pointer transition-all border-2 rounded-xl p-3 flex flex-col group ${
                      selectedItemId === item._id
                        ? "border-orange-500 bg-orange-50 shadow-md ring-2 ring-orange-200/50"
                        : "border-transparent bg-white shadow-sm hover:shadow-md hover:border-orange-200"
                    }`}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-32 object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      {selectedItemId === item._id && (
                        <div className="absolute inset-0 bg-orange-500/10 rounded-lg"></div>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">
                      {item.name}
                    </h4>
                    <div className="mt-auto pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-medium">
                        Ingredients
                      </p>
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
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                      <p className="text-sm font-bold text-orange-600">
                        Rs. {item.price}
                      </p>
                      {selectedItemId === item._id ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddItem();
                          }}
                          className="bg-orange-500 hover:bg-orange-600 text-white p-1.5 rounded-lg shadow-sm transition-colors flex items-center justify-center animate-in zoom-in"
                          title="Add to package"
                        >
                          <Plus size={16} />
                        </button>
                      ) : (
                        <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-400 transition-colors">
                          <Plus size={14} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RIGHT: Added Items (items adding place) */}
          <div
            className={`w-full ${isAdd ? "lg:w-[400px] border-l border-gray-200 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]" : "lg:w-full"} bg-white flex flex-col z-10`}
          >
            <div className="p-6 border-b border-gray-100 bg-white">
              <h3 className="text-lg font-bold text-gray-800 flex items-center justify-between">
                Added to Package
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {packageItems.length}
                  {packageItems.length === 1 ? "Item" : "Items"}
                </span>
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
              {loading ? (
                <div className="text-center text-gray-400 text-sm py-8 flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  Loading items...
                </div>
              ) : packageItems.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-12 flex flex-col items-center justify-center h-full">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Utensils className="text-gray-300 w-8 h-8" />
                  </div>
                  <p className="font-medium text-gray-500">
                    Your package is empty
                  </p>
                  {isAdd && (
                    <p className="text-xs mt-1">
                      Select an item from the left to add.
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className={
                    isAdd
                      ? "space-y-3"
                      : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                  }
                >
                  {packageItems.map((item) =>
                    isAdd ? (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover border border-gray-50 shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs font-bold text-orange-600 mt-1">
                            Rs. {item.price}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ) : (
                      <div
                        key={item._id}
                        className="transition-all border-2 border-transparent bg-white shadow-sm hover:shadow-md rounded-xl p-3 flex flex-col group"
                      >
                        <div className="relative overflow-hidden rounded-lg mb-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-32 object-cover transform group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">
                          {item.name}
                        </h4>
                        <div className="mt-auto pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-medium">
                            Ingredients
                          </p>
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
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* Package Summary Footer */}
            {isAdd && packageItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    Total Items
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {packageItems.length}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold transition-colors shadow-md"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default CateringSelectionHub;
