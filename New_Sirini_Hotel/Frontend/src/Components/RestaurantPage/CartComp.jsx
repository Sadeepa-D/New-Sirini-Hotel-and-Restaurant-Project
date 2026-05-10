import React, { useState, useEffect } from "react";
import { X, Trash2, Plus, Minus } from "lucide-react";

const CartComp = ({ onClose, cartItems = [], setCartItems, onCheckout }) => {
  const handlePortionChange = (id, newPortion) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, portion: newPortion } : item
      )
    );
  };

  const handleQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, Math.min(999, (item.quantity || 1) + delta)),
            }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculate total with proper quantity and price handling
  const total = cartItems.reduce((sum, item) => {
    const itemPrice = item.portion === "full" && item.full_price ? item.full_price : item.normal_price;
    return sum + itemPrice * (item.quantity || 1);
  }, 0);

  // Get item subtotal
  const getItemTotal = (item) => {
    const itemPrice = item.portion === "full" && item.full_price ? item.full_price : item.normal_price;
    return itemPrice * (item.quantity || 1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-amber-50">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-1">
                Your cart is empty
              </h3>
              <p className="text-sm text-gray-400">
                Looks like you haven't added anything yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-amber-200 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 truncate">
                      {item.name}
                    </h4>
                    {item.has_portions && item.full_price ? (
                      <div className="mt-1 flex items-center gap-2">
                        <select
                          value={item.portion || "normal"}
                          onChange={(e) => handlePortionChange(item.id, e.target.value)}
                          className="text-xs font-semibold border border-amber-200 rounded p-1 text-amber-700 bg-amber-50 outline-none focus:ring-1 focus:ring-amber-400"
                        >
                          <option value="normal">Normal (Rs. {item.normal_price})</option>
                          <option value="full">Full (Rs. {item.full_price})</option>
                        </select>
                      </div>
                    ) : (
                      <p className="text-sm text-amber-600 font-semibold mt-1">
                        Rs. {item.normal_price}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Subtotal: Rs. {getItemTotal(item)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 bg-white rounded border border-gray-200">
                      <button
                        onClick={() => handleQuantity(item.id, -1)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-2 text-sm font-bold">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => handleQuantity(item.id, 1)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50">
            <div className="mb-4 flex justify-between items-center">
              <span className="font-bold text-gray-700">Total:</span>
              <span className="text-xl font-bold text-amber-600">
                Rs. {total}
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-bold text-sm"
              >
                Close
              </button>
              <button
                onClick={onCheckout}
                className="flex-1 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-bold text-sm shadow-md"
              >
                Checkout ({cartItems.length} items)
              </button>
            </div>
          </div>
        )}

        {cartItems.length === 0 && (
          <div className="p-5 border-t border-gray-100 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-bold text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartComp;
