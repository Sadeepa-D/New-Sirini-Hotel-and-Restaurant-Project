import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function OrderForm({ item, cartItems, editingOrder, onClose }) {
  const [form, setForm] = useState({
    name: editingOrder ? editingOrder.fullName : "",
    email: editingOrder ? editingOrder.email : "",
    phone: editingOrder ? editingOrder.phoneNumber : "",
    pickupDate: editingOrder
      ? new Date(editingOrder.pickupDate).toISOString().split("T")[0]
      : "",
    pickupTime: editingOrder ? editingOrder.pickupTime : "",
    portion: editingOrder ? editingOrder.portion : "Normal",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const items = cartItems && cartItems.length > 0 ? cartItems : [item];

  const getPrice = () => {
    if (!item.has_portions || form.portion === "Normal") {
      return item.normal_price || 0;
    }
    return item.full_price || 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

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

    if (form.pickupDate === slDateStr && form.pickupTime <= slTimeStr) {
      toast.error(
        "Selected time has already passed for today. Please choose a future time.",
      );
      setLoading(false);
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

      // Save all cart items as separate orders
      const orderPromises = items.map((cartItem) => {
        // Calculate price based on portion selection
        let itemPrice = cartItem.normal_price;
        if (cartItem.has_portions && cartItem.portion === "Full") {
          itemPrice = cartItem.full_price || cartItem.normal_price;
        }

        const orderData = {
          fullName: form.name,
          email: form.email,
          phoneNumber: form.phone.replace(/\D/g, ""),
          pickupDate: form.pickupDate,
          pickupTime: form.pickupTime,
          quantity: cartItem.quantity,
          portion: cartItem.has_portions ? cartItem.portion || "Normal" : null,
          foodName: cartItem.name,
          userId: userId,
          Price: itemPrice * cartItem.quantity,
        };

        if (editingOrder) {
          return axios.put(
            `${import.meta.env.VITE_API_URL}/api/restraunt/updateorder/${editingOrder._id}`,
            orderData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
        } else {
          return axios.post(
            `${import.meta.env.VITE_API_URL}/api/restraunt/placeorder`,
            orderData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
        }
      });

      await Promise.all(orderPromises);

      setSubmitted(true);
      toast.success(`Order placed successfully!`, {
        position: "top-center",
      });
      onClose();
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(`Failed to place order. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/users/profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          const userData = response.data;
          setForm((f) => ({
            ...f,
            email: f.email || userData.email || "",
            name: f.name || userData.name || "",
            phone: f.phone || userData.Phone || "",
          }));
        } catch (error) {
          console.error("Error fetching user profile for auto-fill:", error);
          const userDataStr = localStorage.getItem("user");
          if (userDataStr) {
            try {
              const userData = JSON.parse(userDataStr);
              setForm((f) => ({
                ...f,
                email: f.email || userData.email || "",
                name: f.name || userData.name || userData.fullName || "",
                phone: f.phone || userData.Phone || userData.phone || "",
              }));
            } catch (e) {}
          }
        }
      }
    };

    fetchUserProfile();

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
        <div className="relative px-6 pt-6 pb-4 border-b border-neutral-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-2 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors z-10"
          >
            <X size={18} className="text-neutral-600" />
          </button>

          {/* <div className="flex justify-between items-center gap-4"> */}
          {/* <div className="flex-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                {editingOrder ? "Edit Order" : "ADD TO CART"}
              </span>
              <h2 className="text-2xl font-bold text-neutral-900 mt-1">{item.name}</h2>
              <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{item.description}</p>

              <div className="mt-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white inline-block"
                  style={{ background: "#d97706" }}
                >
                  {item.category}
                </span>
              </div>
            </div> */}

          {/* <div className="hidden sm:block flex-shrink-0">
              <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-xl border-2 border-white ring-4 ring-amber-50">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                />
              </div>
            </div> */}
          {/* </div> */}
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4">
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
            </div>

            {/* <div className={`grid grid-cols-1 ${item.has_portions ? "sm:grid-cols-2" : ""} gap-4`}>
              {item.has_portions && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                    Portion
                  </label>
                  <select
                    name="portion"
                    value={form.portion}
                    onChange={handleChange}
                    required
                    className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Full">Full</option>
                  </select>
                </div>
              )}

              <div className={!item.has_portions ? "w-full" : ""}>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, quantity: Math.max(1, f.quantity - 1) }))}
                    className="w-10 h-10 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition font-bold text-xl"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center text-base font-bold text-neutral-900 border border-neutral-300 rounded-lg py-2.5">
                    {form.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, quantity: f.quantity + 1 }))}
                    className="w-10 h-10 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              </div>
            </div> */}

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
                {/* <span className="text-sm text-amber-800">
                  Rs. {getPrice()} × {form.quantity}
                </span> */}
                <span className="text-xl font-bold text-amber-700">
                  Rs. {getPrice() * form.quantity}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 active:scale-[0.98] transition-all shadow-md shadow-amber-200/50 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Confirm Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
