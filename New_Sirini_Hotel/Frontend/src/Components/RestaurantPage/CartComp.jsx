import React, { useState } from "react";
import { X, Trash2, Plus, Minus } from "lucide-react";

const CartComp = ({ onClose, cartItems = [], onCheckout }) => {
  const [items, setItems] = useState(cartItems);

  const handleQuantity = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = items.reduce(
    (sum, item) => sum + item.normal_price * item.quantity,
    0,
  );

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
          {items.length === 0 ? (
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
              {items.map((item) => (
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
                    <p className="text-sm text-amber-600 font-semibold">
                      Rs. {item.normal_price}
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
                        {item.quantity}
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
        {items.length > 0 && (
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
                Checkout
              </button>
            </div>
          </div>
        )}

        {items.length === 0 && (
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
