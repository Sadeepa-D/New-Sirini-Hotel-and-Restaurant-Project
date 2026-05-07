import React, { useState, useEffect } from "react";
import {
  Users,
  ChevronDown,
  Trash2,
  Utensils,
  Plus,
  Calculator,
  Receipt,
} from "lucide-react";
import axios from "axios";

const CateringSelectionHub = () => {
  const [selectedList, setSelectedList] = useState([]);
  const [participants, setParticipants] = useState(1);
  const [cateringitems, setCateringItems] = useState([]);

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
  useEffect(() => {
    fetchCateringItems();
  }, []);
  // Add item to selection list
  const addItem = (itemId) => {
    const item = cateringitems.find((i) => i._id === itemId);
    if (item && !selectedList.find((s) => s._id === itemId)) {
      setSelectedList([...selectedList, item]);
    }
  };

  // Remove item from selection list
  const removeItem = (itemId) => {
    setSelectedList(selectedList.filter((item) => item._id !== itemId));
  };

  // Calculations
  const subtotalPerPerson = selectedList.reduce(
    (sum, item) => sum + item.price,
    0,
  );
  const grandTotal = subtotalPerPerson * participants;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* --- STEP 1: Main Controls --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Item Dropdown */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-orange-500 tracking-widest ml-1">
            Select Menu Items
          </label>
          <div className="relative group">
            <Utensils
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
              size={18}
            />
            <select
              onChange={(e) => addItem(e.target.value)}
              value=""
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl appearance-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all cursor-pointer font-medium text-gray-700 shadow-sm"
            >
              <option value="" disabled>
                Choose a dish to add...
              </option>
              {cateringitems.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                  disabled={selectedList.find((s) => s._id === item._id)}
                >
                  {item.name} - (Rs. {item.price})
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
          </div>
        </div>

        {/* Participant Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-orange-500 tracking-widest ml-1">
            Total Participants
          </label>
          <div className="relative group">
            <Users
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
              size={18}
            />
            <input
              type="number"
              min="1"
              max={200}
              value={participants}
              onChange={(e) =>
                setParticipants(Math.max(1, parseInt(e.target.value) || 0))
              }
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-bold text-gray-700 shadow-sm"
              placeholder="E.g. 150"
            />
          </div>
        </div>
      </div>

      {/* --- STEP 2: Selection List --- */}
      <div className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 p-2 sm:p-6 min-h-[200px]">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 px-4 mb-4">
          <Receipt size={18} className="text-orange-500" />
          Selected Menu ({selectedList.length})
        </h3>

        <div className="space-y-3">
          {selectedList.length > 0 ? (
            selectedList.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-left-2 duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                    <Utensils size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">
                      Rs. {item.price} per head
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 space-y-2">
              <Calculator size={40} className="opacity-20" />
              <p className="text-xs uppercase tracking-widest font-medium">
                No items selected yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- STEP 3: Summary Sticky Bar --- */}
      <div className="sticky bottom-6 bg-slate-900 rounded-3xl p-6 shadow-2xl shadow-orange-900/20 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
        <div className="flex items-center gap-6">
          <div className="hidden sm:block p-3 bg-white/5 rounded-2xl border border-white/10">
            <Calculator size={24} className="text-orange-500" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-1">
              Estimated Cost
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-orange-400">
                Rs. {grandTotal.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                for {participants} guests
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CateringSelectionHub;
