import React, { useState } from "react";
import { X, Trash2, Plus, Minus, TriangleAlert } from "lucide-react";
import toast from "react-hot-toast";

const CartComp = ({ onClose, cartItems = [], setCartItems, onCheckout }) => {
  const isLoggedIn = !!localStorage.getItem("token");

  const handleQuantity = (cartId, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartId === cartId
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(100, (item.quantity || 1) + delta),
              ),
            }
          : item,
      ),
    );
  };

  const removeItem = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const getItemPrice = (item) => {
    if (item.portion === "Full" && item.has_portions) {
      return item.full_price || item.normal_price;
    }
    return item.normal_price;
  };

  const getItemTotal = (item) => {
    return getItemPrice(item) * item.quantity;
  };

  const total = cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-linear-to-r from-amber-50 to-amber-100">
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Your Cart
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-60 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">🛒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500">
                Add delicious items from our menu to get started!
              </p>
            </div>
          ) : (
            <div className="p-6">
              {/* Session Warning Message */}
              <div className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-amber-100/50 border border-amber-200 rounded-lg sm:rounded-xl text-amber-800 animate-in fade-in slide-in-from-top-1 duration-500">
                <div className="bg-amber-500 text-white rounded-full p-0.5 sm:p-1 shadow-sm shrink-0">
                  <TriangleAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <p className="text-[11px] sm:text-xs md:text-sm font-medium leading-snug">
                  Your cart is saved for this session, but it will be cleared if you log out before checking out.
                </p>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="text-left py-4 px-3 font-bold text-gray-700 text-sm">
                        Image
                      </th>
                      <th className="text-left py-4 px-3 font-bold text-gray-700 text-sm">
                        Food Name
                      </th>
                      <th className="text-center py-4 px-3 font-bold text-gray-700 text-sm">
                        Price
                      </th>
                      <th className="text-center py-4 px-3 font-bold text-gray-700 text-sm">
                        Portion
                      </th>
                      <th className="text-center py-4 px-3 font-bold text-gray-700 text-sm">
                        Quantity
                      </th>
                      <th className="text-center py-4 px-3 font-bold text-gray-700 text-sm">
                        Total
                      </th>
                      <th className="text-center py-4 px-3 font-bold text-gray-700 text-sm">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr
                        key={item.cartId}
                        className="border-b border-gray-100 hover:bg-amber-50 transition-colors duration-200"
                      >
                        {/* Image */}
                        <td className="py-4 px-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </td>

                        {/* Food Name */}
                        <td className="py-4 px-3">
                          <p className="font-semibold text-gray-900 text-sm md:text-base">
                            {item.name}
                          </p>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-3 text-center">
                          <p className="font-bold text-amber-600 text-sm md:text-base">
                            LKR {getItemPrice(item)}
                          </p>
                        </td>

                        {/* Portion */}
                        <td className="py-4 px-3">
                          <div className="flex items-center justify-center">
                            <span className="text-sm text-gray-700 font-bold bg-amber-50 px-3 py-1.5 rounded-lg">
                              {item.portion || "Normal"}
                            </span>
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className="py-4 px-3">
                          <div className="flex items-center justify-center gap-1 bg-white rounded-lg border border-gray-200 w-fit mx-auto">
                            <button
                              onClick={() => handleQuantity(item.cartId, -1)}
                              className="p-1.5 hover:bg-gray-100 transition-colors rounded"
                            >
                              <Minus size={16} className="text-gray-600" />
                            </button>
                            <span className="px-3 py-1 text-sm font-bold text-gray-800 min-w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantity(item.cartId, 1)}
                              className="p-1.5 hover:bg-gray-100 transition-colors rounded"
                            >
                              <Plus size={16} className="text-gray-600" />
                            </button>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="py-4 px-3 text-center">
                          <p className="font-bold text-amber-600 text-sm md:text-base">
                            LKR {getItemTotal(item)}
                          </p>
                        </td>

                        {/* Action */}
                        <td className="py-4 px-3">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => removeItem(item.cartId)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.cartId}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4 mb-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden shadow-sm shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-amber-600 font-bold mt-1">
                          LKR {getItemPrice(item)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">
                          Portion
                        </label>
                        <span className="text-xs text-gray-700 font-bold bg-amber-50 px-2 py-1.5 rounded-lg  block text-center">
                          {item.portion || "Normal"}
                        </span>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">
                          Quantity
                        </label>
                        <div className="flex items-center gap-1 bg-white rounded border border-gray-200">
                          <button
                            onClick={() => handleQuantity(item.cartId, -1)}
                            className="p-1 hover:bg-gray-100 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-2 text-sm font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantity(item.cartId, 1)}
                            className="p-1 hover:bg-gray-100 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                      <span className="text-sm font-semibold text-gray-600">
                        Total:
                      </span>
                      <span className="text-base font-bold text-amber-600">
                        LKR {getItemTotal(item)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => removeItem(item.cartId)}
                        className="flex-1 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t-2 border-gray-200 bg-linear-to-r from-gray-50 to-amber-50 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-3 sm:mb-6 pb-2.5 sm:pb-4 border-b border-gray-200">
              <span className="text-base sm:text-lg font-bold text-gray-800">
                Cart Total:
              </span>
              <span className="text-xl sm:text-3xl font-bold text-amber-600">
                LKR {total.toFixed(2)}
              </span>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={onClose}
                style={{ borderRadius: "10px" }}
                className="w-[44%] py-2 sm:py-3 px-2 sm:px-4 bg-gray-300 text-gray-700 hover:bg-gray-400 transition-all duration-300 transform hover:scale-105 active:scale-95 font-bold text-[10px] sm:text-xs md:text-sm leading-tight shadow-md"
              >
                Find more dishes
              </button>

              <button
                onClick={() =>
                  !isLoggedIn
                    ? toast.error(
                        "You should log in first to proceed to checkout.",
                      )
                    : onCheckout(cartItems)
                }
                style={{ borderRadius: "10px" }}
                className="w-[44%] py-2 sm:py-3 px-2 sm:px-4 bg-linear-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 active:scale-95 font-bold text-[10px] sm:text-xs md:text-sm leading-tight shadow-lg hover:shadow-xl"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}

        {cartItems.length === 0 && (
          <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-1.5 sm:py-3 px-1 sm:px-4 bg-linear-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all font-bold text-[10px] sm:text-xs md:text-base leading-tight shadow-md"
            >
              Find more dishes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartComp;
