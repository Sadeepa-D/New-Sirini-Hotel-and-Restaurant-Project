import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

const ConfirmDialog = ({ isOpen, onConfirm, onCancel, title, message, type = "delete" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
            type === "delete" ? "bg-red-100" : "bg-amber-100"
          }`}>
            {type === "delete"
              ? <Trash2 size={26} className="text-red-500" />
              : <AlertTriangle size={26} className="text-amber-500" />
            }
          </div>
        </div>

        {/* Title */}
        <h3 className="text-center text-lg font-black text-gray-900 mb-2">
          {title || (type === "delete" ? "Delete Item?" : "Confirm Action?")}
        </h3>

        {/* Message */}
        <p className="text-center text-sm text-gray-500 mb-6 leading-relaxed">
          {message || (type === "delete"
            ? "This action cannot be undone. Are you sure you want to delete this item?"
            : "Are you sure you want to proceed with this action?"
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Cancel button — red */}
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 py-3 font-semibold text-sm text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
            style={{ background: "#ef4444", borderRadius: "14px" }}
          >
            <X size={16} />
            Cancel
          </button>
          {/* Confirm button — amber or red based on type */}
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 py-3 font-semibold text-sm text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
            style={{
              background: type === "delete"
                ? "linear-gradient(to right, #dc2626, #ef4444)"
                : "linear-gradient(to right, #d97706, #f59e0b)",
              borderRadius: "14px",
            }}
          >
            {type === "delete"
              ? <><Trash2 size={16} /> Delete</>
              : <><AlertTriangle size={16} /> Confirm</>
            }
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmDialog;