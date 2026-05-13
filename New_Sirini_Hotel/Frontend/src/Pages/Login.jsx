import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email or phone number is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email: formData.emailOrPhone,
        password: formData.password,
      });

      const data = response.data;

      if (data.user.Status === "Suspended" || data.user.Status === "Deleted") {
        toast.error(
          "Your Account is " +
            data.user.Status +
            ". Please contact the Hotel Admin.",
        );
        setIsLoading(false);
        return;
      }
      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Merge guest cart items into user cart
        const guestCartData = localStorage.getItem("guest_cart");
        if (guestCartData) {
          try {
            const guestCart = JSON.parse(guestCartData);
            if (Array.isArray(guestCart) && guestCart.length > 0) {
              const userCartKey = `cart_items_${data.user._id}`;
              const userCartData = localStorage.getItem(userCartKey);
              let userCart = userCartData ? JSON.parse(userCartData) : [];

              // Merge items
              guestCart.forEach((gItem) => {
                const existingIndex = userCart.findIndex(
                  (uItem) => uItem.cartId === gItem.cartId,
                );
                if (existingIndex > -1) {
                  userCart[existingIndex].quantity =
                    (userCart[existingIndex].quantity || 1) +
                    (gItem.quantity || 1);
                } else {
                  userCart.push(gItem);
                }
              });

              localStorage.setItem(userCartKey, JSON.stringify(userCart));
            }
            localStorage.removeItem("guest_cart");
          } catch (e) {
            console.error("Error merging guest cart:", e);
          }
        }

        toast.success("Welcome back, " + data.user.name);

        // Role-based Redirection
        const userRole = data.user.Role.trim();
        switch (userRole) {
          case "Admin":
            navigate("/admin");
            break;
          case "Operation Manager 1 (Restraunt,Liquor)":
            navigate("/operationmanager");
            break;
          case "Operation Manager 2 (Reception, Room)":
            navigate("/manager");
            break;
          case "User":
          default:
            navigate("/");
            break;
        }
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      setErrors({ submit: message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-linear-to-br from-slate-900 via-neutral-900 to-amber-950 px-4 py-7">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 pointer-events-none"></div>

      <div className="w-full max-w-md relative">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-amber-900/20 p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-2 tracking-wide">
              New Sirini Hotel
            </h1>
            <div className="w-16 h-0.5 bg-linear-to-r from-transparent via-amber-500 to-transparent mx-auto mb-4"></div>
            <p className="text-amber-100/70 text-sm tracking-widest uppercase">
              Welcome Back
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-amber-100/90 mb-2">
                Email or Phone Number
              </label>
              <input
                type="text"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                placeholder="Enter your email or phone"
                className={`w-full px-4 py-3 bg-white/5 border ${errors.emailOrPhone ? "border-red-500" : "border-amber-900/30"} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all`}
              />
              {errors.emailOrPhone && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.emailOrPhone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-100/90 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 bg-white/5 border ${errors.password ? "border-red-500" : "border-amber-900/30"} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-amber-100/70 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-amber-900/30 bg-white/5 text-amber-500 focus:ring-amber-500/50"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                size={12}
                className="text-amber-400 hover:text-amber-300"
              >
                Forgot password?
              </Link>
            </div>

            {errors.submit && (
              <p className="text-sm text-red-400 text-center bg-red-400/10 py-2 rounded-lg">
                {errors.submit}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 shadow-lg shadow-amber-900/20"
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-amber-100/60 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-amber-400 hover:text-amber-300 font-semibold underline decoration-amber-500/30"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center group text-amber-100/50 hover:text-amber-400 transition-all duration-300 text-sm font-medium"
          >
            <ArrowLeft
              size={18}
              className="mr-2 transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
