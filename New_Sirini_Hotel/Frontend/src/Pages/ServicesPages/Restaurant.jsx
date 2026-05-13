import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Exploreindicator from "../../Components/Exploreindicator";
import resturantImg from "../../assets/resturant.png";
import OrderForm from "../../Components/RestaurantPage/OrderForm";
import RestaurantCard from "../../Components/RestaurantPage/RestaurantCard";
import ProcessFlow from "../../Components/RestaurantPage/processflow";
import { ShoppingCart } from "lucide-react";
import CartComp from "../../Components/RestaurantPage/CartComp";

// Initial hardcoded data removed. Data is now fetched from the backend API.

const CATEGORIES = [
  "Chopsy Rice",
  "Rice & Nasi Goreng",
  "Kottu",
  "Noodles",
  "Bites",
  "Side Dishes",
  "Snacks",
];

export default function Restaurant() {
  const [itemsPerView, setItemsPerView] = useState(4);
  const [mealData, setMealData] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        const savedCart = localStorage.getItem(`cart_items_${user._id}`);
        return savedCart ? JSON.parse(savedCart) : [];
      } else {
        const savedGuestCart = localStorage.getItem("guest_cart");
        return savedGuestCart ? JSON.parse(savedGuestCart) : [];
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
    return [];
  });
  const [openorderform, setOpenorderform] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/restraunt/viewfooditems`,
      );
      const data = Array.isArray(response.data) ? response.data : [];

      const mappedData = data.map((item) => ({
        id: item._id,
        name: item.name,
        normal_price: item.normal_price,
        full_price: item.full_price,
        has_portions: item.has_portions,
        description: item.description,
        image: item.image,
        category: item.category,
        availability: item.availability,
        label: item.availability ? "Available" : "Unavailable",
      }));
      setMealData(mappedData);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMealData([]);
      } else {
        console.error("Error fetching food items:", error);
      }
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        localStorage.setItem(`cart_items_${user._id}`, JSON.stringify(cartItems));
      } else {
        localStorage.setItem("guest_cart", JSON.stringify(cartItems));
      }
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setItemsPerView(w < 640 ? 1 : w < 1024 ? 2 : w < 1280 ? 3 : 4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredItems =
    selectedCategory === "All"
      ? mealData
      : mealData.filter((item) => item.category === selectedCategory);

  const handleAddToCart = (item, selectedPortion) => {
    const portionToUse = item.has_portions ? selectedPortion : "Normal";
    const cartId = item.has_portions ? `${item.id}_${portionToUse}` : item.id;

    const existing = cartItems.find((i) => i.cartId === cartId);

    if (existing) {
      setCartItems((prev) =>
        prev.map((i) =>
          i.cartId === cartId ? { ...i, quantity: (i.quantity || 1) + 1 } : i,
        ),
      );
      toast.success(`${item.name} (${portionToUse}) quantity updated!`);
    } else {
      setCartItems((prev) => [
        ...prev,
        { ...item, cartId, quantity: 1, portion: portionToUse },
      ]);
      toast.success(`${item.name} (${portionToUse}) added to cart!`);
    }
  };

  const handlecheckout = (updatedItems) => {
    if (!updatedItems || updatedItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You should log in first to proceed to checkout.");
      return;
    }

    // Update cartItems with the modified items from CartComp
    setCartItems(updatedItems);
    setShowCart(false);
    setOpenorderform(true);
  };



  const [isFabVisible, setIsFabVisible] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show FAB after scrolling past hero (approx 100vh - header)
      setIsFabVisible(scrollY > windowHeight * 0.7);

      // Detect if near footer (approx 400px from bottom)
      setIsNearFooter(scrollY + windowHeight > documentHeight - 350);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 relative">
      {/* HERO SECTION */}
      <header className="relative w-full h-[calc(100vh-75px)] overflow-hidden flex flex-col items-center justify-center text-white text-center px-4">
        {/* Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${resturantImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content */}
        <div className="z-10 flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl md:text-6xl font-light">Our Restaurant</h1>
          <p className="text-lg md:text-xl italic tracking-widest border-t border-b border-white py-2 px-4">
            Eat well, laugh often, enjoy life
          </p>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <Exploreindicator />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative">
        {/* Menu Header Section */}
        <div className="px-4 py-8 md:py-12">
          <div className="mx-auto max-w-6xl border border-gray-300 bg-gray-50 rounded-lg px-6 py-10 md:py-12 text-center shadow-sm">
            <h1 className="text-5xl sm:text-6xl font-serif font-normal text-gray-800 mb-6">
              Menu
            </h1>
            <p className="text-gray-700 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-light">
              We believe good food starts with good ingredients. Our menu includes
              fresh, balanced dishes made using simple cooking methods to keep
              flavors natural and satisfying.
            </p>
          </div>
        </div>

        {/* Process Flow Section */}
        <ProcessFlow />

        {/* Category Navigation Bar */}
        <div className="sticky top-[75px] z-30 bg-neutral-50/80 backdrop-blur-md py-6 mb-8 border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar scroll-smooth">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap shadow-sm border
                    ${
                      selectedCategory === cat
                        ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-200 scale-105"
                        : "bg-white text-neutral-600 hover:bg-neutral-100 border-neutral-200 hover:border-amber-200"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Food Items Grid Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[400px]">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {filteredItems.map((item) => (
                <RestaurantCard
                  key={item.id}
                  item={item}
                  itemsPerView={1}
                  onOrder={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 text-neutral-300" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">No items found</h3>
              <p className="text-neutral-500 max-w-xs">We couldn't find any dishes in the "{selectedCategory}" category at the moment.</p>
            </div>
          )}
        </div>

        {/* Floating Action Button (FAB) - Smart visibility */}
        <div
          className={`fixed transition-all duration-500 ease-in-out z-[60] 
            ${isFabVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}
            ${isNearFooter ? 'bottom-[380px] md:bottom-[420px]' : 'bottom-8'}
            right-8`}
        >
          <button
            className="relative group transition-all duration-300"
            onClick={() => setShowCart(true)}
          >
            <div
              className="w-16 h-16 md:w-20 md:h-20 bg-amber-500 text-white flex items-center justify-center rounded-full shadow-2xl group-hover:bg-amber-600 group-hover:scale-110 transition-all duration-300"
              style={{ boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)" }}
            >
              <ShoppingCart className="w-8 h-8 md:w-10 md:h-10" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-amber-600 text-[10px] md:text-xs font-bold w-5 h-5 md:w-7 md:h-7 flex items-center justify-center rounded-full shadow-md border-2 border-amber-500 animate-in zoom-in duration-300">
                  {cartItems.length}
                </span>
              )}
            </div>
          </button>
        </div>
      </main>

      {openorderform && (
        <OrderForm
          cartItems={cartItems}
          onClose={(success) => {
            setOpenorderform(false);
            if (success) {
              setCartItems([]);
            } else if (cartItems.length > 0) {

            }
          }}
        />
      )}
      {/* Cart Modal */}
      {showCart && (
        <CartComp
          onClose={() => {
            setShowCart(false);
            if (cartItems.length > 0) {
              toast(
                "Cart saved for this session. It will be cleared if you log out before checkout.",
                {
                  icon: "⚠️",
                  duration: 6000,
                },
              );
            }
          }}
          cartItems={cartItems}
          setCartItems={setCartItems}
          onCheckout={handlecheckout}
        />
      )}
    </div>
  );
}
