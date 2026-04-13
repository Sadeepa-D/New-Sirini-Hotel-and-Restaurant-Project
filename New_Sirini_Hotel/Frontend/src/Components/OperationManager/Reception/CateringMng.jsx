import React, { useState } from "react";
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

const dummyCatering = [
  {
    _id: "1",
    name: "Chicken Rice",
    price: "Rs. 1,500",
    ingredients: ["chicken", "rice", "carrot"],
    availability: true,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&fit=crop",
  },
  {
    _id: "2",
    name: "Beef Curry",
    price: "Rs. 1,800",
    ingredients: ["beef", "spices", "coconut"],
    availability: true,
    image:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&fit=crop",
  },
  {
    _id: "3",
    name: "Prawn Fry",
    price: "Rs. 2,500",
    ingredients: ["prawn", "garlic", "butter"],
    availability: false,
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&fit=crop",
  },
  {
    _id: "4",
    name: "Vegetable Rice",
    price: "Rs. 1,200",
    ingredients: ["rice", "mixed veg"],
    availability: true,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&fit=crop",
  },
  {
    _id: "5",
    name: "Fish Ambul Thiyal",
    price: "Rs. 2,000",
    ingredients: ["fish", "goraka", "spices"],
    availability: true,
    image:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&fit=crop",
  },
];

const ActionRibbon = ({ item, onToggle, onEdit, onDelete }) => (
  <div className="absolute right-2 top-2 flex flex-col gap-1.5 z-10">
    <button
      onClick={() => onToggle(item._id)}
      className={`w-8 h-8 rounded-full flex items-center justify-center shadow transition-colors ${
        item.availability
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
  const [items, setItems] = useState(dummyCatering);
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(0);
  const itemsPerView = 3;

  const filtered = items.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleToggle = (id) => {
    setItems((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, availability: !p.availability } : p,
      ),
    );
  };

  const handleDelete = (id) =>
    setItems((prev) => prev.filter((p) => p._id !== id));
  const handleEdit = (item) => console.log("Edit:", item);

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
          <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm">
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </div>

      {/* Cards Slider */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-10">
          No items found
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
                  <div className="h-40 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {!item.availability && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Unavailable
                      </span>
                    </div>
                  )}

                  <ActionRibbon
                    item={item}
                    onToggle={handleToggle}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />

                  <div className="p-3 bg-white">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {item.ingredients.slice(0, 2).map((ing, i) => (
                        <span
                          key={i}
                          className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100"
                        >
                          {ing}
                        </span>
                      ))}
                      {item.ingredients.length > 2 && (
                        <span className="text-xs text-gray-400">
                          +{item.ingredients.length - 2}
                        </span>
                      )}
                    </div>
                    <span className="inline-block mt-2 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      {item.price}
                    </span>
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

      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          Total: <strong className="text-gray-600">{items.length}</strong>
        </span>
        <span className="text-xs text-gray-400">
          Active:
          <strong className="text-green-600">
            {items.filter((p) => p.availability).length}
          </strong>
        </span>
        <span className="text-xs text-gray-400">
          Inactive:{" "}
          <strong className="text-red-500">
            {items.filter((p) => !p.availability).length}
          </strong>
        </span>
      </div>
    </div>
  );
};
export default CateringMng;
