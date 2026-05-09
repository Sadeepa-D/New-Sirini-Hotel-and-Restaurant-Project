import React from "react";
import { X } from "lucide-react";

const CartComp = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-amber-50">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Your Cart</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-amber-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🛒</span>
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-1">Your cart is empty</h3>
          <p className="text-sm text-gray-400">Looks like you haven't added anything yet.</p>
        </div>
        
        {/* Footer */}
        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-bold text-sm"
          >
            Close
          </button>
          <button 
            className="flex-1 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-bold text-sm shadow-md"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartComp;
