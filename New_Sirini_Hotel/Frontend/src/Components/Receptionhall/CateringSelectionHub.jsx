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
  const selectedItem = cateringitems.find((i) => i._id === selectedItemId);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Utensils className="text-orange-500" />
              Foods Include in Plate
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              This menu is based on the selected package. For Your Selected
              Package This items Will serve.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* LEFT: Package Items (Already Added) */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-800 mb-4">
              Items in This Package
            </h3>
            {loading ? (
              <div className="text-center text-gray-400 text-sm py-4 animate-pulse">
                Loading...
              </div>
            ) : packageItems.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8">
                No items added yet
              </div>
            ) : (
              <div className="space-y-2">
                {packageItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {item.name}
                        </p>
                        {isAdd && (
                          <p className="text-[10px] text-gray-500">
                            Rs. {item.price}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {isAdd && (
            <>
              {/* RIGHT: Available Items to Add */}
              <div className="w-full lg:w-96 bg-white p-6 border-l border-gray-100 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Add Items to Package
                </h3>

                {/* Available Items Dropdown */}
                <div className="mb-4">
                  <label className="text-xs text-gray-500 font-medium mb-2 block">
                    Select Item
                  </label>
                  <select
                    value={selectedItemId || ""}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Choose an item...</option>
                    {cateringitems.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name} - Rs. {item.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add Button */}
                <button
                  onClick={handleAddItem}
                  disabled={!selectedItemId}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm mb-6"
                >
                  <Plus size={16} className="inline mr-2" />
                  Add Item
                </button>

                {/* Item Preview */}
                {selectedItem && (
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      className="w-full h-32 rounded-lg object-cover mb-2"
                    />
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {selectedItem.name}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {selectedItem.description || "No description"}
                    </p>
                    <p className="text-sm font-bold text-orange-600 mt-2">
                      Rs. {selectedItem.price}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CateringSelectionHub;
