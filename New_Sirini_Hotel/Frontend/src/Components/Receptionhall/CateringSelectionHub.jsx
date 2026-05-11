import React, { useState, useEffect } from "react";
import {
  Users,
  X,
  Trash2,
  Utensils,
  Plus,
  Calculator,
  Receipt,
  Search,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";

const CateringSelectionHub = ({ onClose }) => {
  const [selectedList, setSelectedList] = useState([]);
  const [participants, setParticipants] = useState(100); // Default to 100 for your business logic
  const [cateringitems, setCateringItems] = useState([]);
  const [searchQuery, setSearch] = useState("");
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCateringItems();
  }, []);

  const toggleItem = (item) => {
    const isSelected = selectedList.find((s) => s._id === item._id);
    if (isSelected) {
      setSelectedList(selectedList.filter((s) => s._id !== item._id));
    } else {
      setSelectedList([...selectedList, item]);
    }
  };

  // --- Business Logic Calculations ---
  const subtotalPerPerson = selectedList.reduce(
    (sum, item) => sum + item.price,
    0,
  );
  const hallChargePerPerson = participants < 100 ? 2000 : 0;
  const finalPricePerPlate = subtotalPerPerson + hallChargePerPerson;
  const grandTotal = finalPricePerPlate * participants;

  const filteredItems = cateringitems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
          {/* LEFT: Food Item Grid */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-400 animate-pulse">
                Loading Menu...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredItems.map((item) => {
                  const isSelected = selectedList.find(
                    (s) => s._id === item._id,
                  );
                  return (
                    <div
                      key={item._id}
                      onClick={() => toggleItem(item)}
                      className={`group cursor-pointer bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 ${isSelected ? "border-orange-500 shadow-md scale-[0.98]" : "border-transparent hover:border-orange-200 shadow-sm"}`}
                    >
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center backdrop-blur-[1px]">
                            <CheckCircle2
                              className="text-white fill-orange-500"
                              size={32}
                            />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-orange-600">
                          Rs. {item.price}
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-bold text-gray-800 text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 line-clamp-1 mt-1">
                          {Array.isArray(item.ingredients)
                            ? item.ingredients[0]
                            : "Fresh ingredients"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CateringSelectionHub;
