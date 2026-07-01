import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function EditOrderForm({ item = {}, editingOrder, onClose }) {
  const [form, setForm] = useState({
    name: editingOrder ? editingOrder.fullName : "",
    email: editingOrder ? editingOrder.email : "",
    phone: editingOrder ? editingOrder.phoneNumber : "",
    pickupDate: editingOrder
      ? new Date(editingOrder.pickupDate).toISOString().split("T")[0]
      : "",
    pickupTime: editingOrder ? editingOrder.pickupTime : "",
    quantity: editingOrder ? editingOrder.quantity : 1,
    portion: editingOrder ? editingOrder.portion : "Normal",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Get current Sri Lankan date and time
    const now = new Date();
    const slDateStr = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);

    const slTimeStr = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Colombo",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);

    // Validation
    // if (form.pickupDate < slDateStr) {
    //   toast.error("Selected date is in the past. Please choose today or a future date.");
    //   return;
    // }

    if (form.pickupDate === slDateStr && form.pickupTime <= slTimeStr) {
      toast.error(
        "Selected time has already passed for today. Please choose a future time.",
      );
      return;
    }

    try {
      const userDataStr = localStorage.getItem("user");
      let userId = null;
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          userId = userData._id;
        } catch (e) {}
      }

      const orderData = {
        fullName: form.name,
        email: form.email,
        // Strip non-numeric characters to match backend regex /^[0-9]{10}$/
        phoneNumber: form.phone.replace(/\D/g, ""),
        pickupDate: form.pickupDate,
        pickupTime: form.pickupTime,
        quantity: form.quantity,
        foodName: item.name || (editingOrder ? editingOrder.foodName : ""),
        userId: userId,
        Price:
          (item.price ||
            (editingOrder ? editingOrder.Price / editingOrder.quantity : 0)) *
          form.quantity,
        portion: form.portion,
      };

      if (editingOrder) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/restraunt/updateorder/${editingOrder._id}`,
          orderData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/restraunt/placeorder`,
          orderData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      setSubmitted(true);
      toast.success(
        `Order ${editingOrder ? "updated" : "placed"} successfully!`,
      );
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error saving order:", error);
      const errorMessage =
        error.response?.data?.message ||
        `Failed to ${editingOrder ? "update" : "place"} order. Please try again.`;
      toast.error(errorMessage);
    }
  };

  // Prefill email and prevent background scroll
  useEffect(() => {
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setForm((f) => ({
          ...f,
          // Only auto-fill if the field is currently empty
          email: f.email || userData.email || "",
          name: f.name || userData.name || userData.fullName || "",
          phone: f.phone || userData.Phone || userData.phone || "",
        }));
      } catch (e) {
        console.error("Error parsing user data for auto-fill:", e);
      }
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [editingOrder]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="relative px-6 pt-6 pb-4 border-b border-neutral-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-neutral-600" />
          </button>

          <span className="text-s font-semibold tracking-widest text-amber-600">
            {editingOrder ? "Edit Order" : "Order Now"}
          </span>

          <h3 className="text-2xl font-bold text-neutral-900 mt-1">
            {item.name || editingOrder?.foodName}
          </h3>
          {item.description && (
            <p className="text-sm text-neutral-500 mt-1">{item.description}</p>
          )}
        </div>

        {/* Form / Success content */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  readOnly
                  className="w-full border border-neutral-200 bg-neutral-50 rounded-lg px-4 py-2.5 text-sm text-neutral-500 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  placeholder="0771234567"
                  title="Please enter a 10-digit phone number"
                  className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        quantity: Math.max(1, f.quantity - 1),
                      }))
                    }
                    className="w-10 h-10 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition font-bold text-xl"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center text-base font-bold text-neutral-900 border border-neutral-300 rounded-lg py-2.5">
                    {form.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, quantity: f.quantity + 1 }))
                    }
                    className="w-10 h-10 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                  Pick-up Date
                </label>
                <input
                  type="date"
                  name="pickupDate"
                  value={form.pickupDate}
                  onChange={handleChange}
                  required
                  min={new Intl.DateTimeFormat("en-CA", {
                    timeZone: "Asia/Colombo",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }).format(new Date())}
                  className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                  Pick-up Time
                </label>
                <input
                  type="time"
                  name="pickupTime"
                  value={form.pickupTime}
                  onChange={handleChange}
                  required
                  className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>
            </div>

            <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-sm text-amber-800">
                  Rs.{" "}
                  {(
                    item.price ||
                    (editingOrder
                      ? editingOrder.Price / editingOrder.quantity
                      : 0)
                  ).toLocaleString()}{" "}
                  × {form.quantity}
                </span>
                <span className="text-xl font-bold text-amber-700">
                  Rs.{" "}
                  {(
                    (item.price ||
                      (editingOrder
                        ? editingOrder.Price / editingOrder.quantity
                        : 0)) * form.quantity
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-3.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 active:scale-[0.98] transition-all shadow-md shadow-amber-200/50 text-base"
              >
                {editingOrder ? "Update Order" : "Confirm Order"}
              </button>
            </div>

            {/* Success Message */}
            {submitted && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                <p className="text-orange-800 font-medium">
                  {editingOrder
                    ? "Order updated successfully."
                    : `Order placed.. we'll have your `}
                  {!editingOrder && (
                    <span className="font-bold">{item.name}</span>
                  )}
                  {!editingOrder && `, ready for pick up`}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
