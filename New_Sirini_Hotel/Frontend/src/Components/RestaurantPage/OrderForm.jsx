import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function OrderForm({ item, cartItems, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pickupDate: "",
    pickupTime: "",
    portion: "",
  });
  const [loading, setLoading] = useState(false);

  const getSLDateStr = () =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

  const getSLTimeStr = () =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Colombo",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());

  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const items = cartItems && cartItems.length > 0 ? cartItems : [item];

  const getTotalPrice = () => {
    return items.reduce((sum, currentItem) => {
      if (!currentItem) return sum;
      const price =
        currentItem.portion === "Full" && currentItem.full_price
          ? currentItem.full_price
          : currentItem.normal_price;
      return sum + price * (currentItem.quantity || 1);
    }, 0);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    const slDateStr = getSLDateStr();
    const slTimeStr = getSLTimeStr();

    if (form.pickupDate === slDateStr) {
      const nowMinutes = timeToMinutes(slTimeStr);
      const pickupMinutes = timeToMinutes(form.pickupTime);

      if (pickupMinutes <= nowMinutes) {
        toast.error(
          "Selected time has already passed for today. Please choose a future time.",
        );
        setLoading(false);
        return;
      }

      if (pickupMinutes - nowMinutes < 60) {
        toast.error("Please select a pick-up time at least 1 hour from now.");
        setLoading(false);
        return;
      }
    }
    try {
      const userDataStr = localStorage.getItem("user");
      let userId = null;
      if (userDataStr) {
        try {
          userId = JSON.parse(userDataStr)._id;
        } catch (e) {}
      }

      const orderItems = items.map((cartItem) => {
        const itemPrice =
          cartItem.portion === "Full" && cartItem.full_price
            ? cartItem.full_price
            : cartItem.normal_price;
        const quantity = cartItem.quantity || 1;
        const portionValue = cartItem.has_portions
          ? cartItem.portion || "Normal"
          : "Normal";
        return {
          foodName: cartItem.name,
          quantity,
          portion: portionValue,
          Price: itemPrice * quantity,
        };
      });

      const orderData = {
        fullName: form.name,
        email: form.email,
        phoneNumber: form.phone.replace(/\D/g, ""),
        pickupDate: form.pickupDate,
        pickupTime: form.pickupTime,
        userId,
        items: orderItems,
      };
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/restraunt/placeorder`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(`Order placed successfully!`);
      onClose(true);
    } catch (error) {
      console.error("Error placing order:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to place order. Please try again.";
      toast.error(errorMessage);
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
  }, []);

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
        </div>

        <div className="text-center">
          <h3 className="font-bold text-amber-600 text-2xl ">
            Confirm Your Order
          </h3>
          <p className="text-amber-600 italic text-sm ">
            Please fill the following details to confirm your order
          </p>
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
                  onChange={handleChange}
                  required
                  placeholder="example@mail.com"
                  className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
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
                  min={
                    form.pickupDate === getSLDateStr()
                      ? getSLTimeStr()
                      : undefined
                  }
                  className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>
            </div>

            <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-amber-700">
                  Rs. {getTotalPrice()}
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
