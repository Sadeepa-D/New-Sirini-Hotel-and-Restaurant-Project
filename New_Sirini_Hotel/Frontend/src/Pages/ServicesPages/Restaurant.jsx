import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Exploreindicator from "../../Components/Exploreindicator";
import resturantImg from "../../assets/resturant.png";
import OrderForm from "../../Components/RestaurantPage/OrderForm";
import RestaurantCard from "../../Components/RestaurantPage/RestaurantCard";
import ProcessFlow from "../../Components/RestaurantPage/processflow";
import { Clock3, ShoppingCart } from "lucide-react";
import CartComp from "../../Components/RestaurantPage/CartComp";

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
  const [isLoading, setIsLoading] = useState(true);
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
    setIsLoading(true);
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
        toast.error("Failed to load food items");
      }
    } finally {
      setIsLoading(false);
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
        localStorage.setItem(
          `cart_items_${user._id}`,
          JSON.stringify(cartItems),
        );
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

  // Disable background scrolling when cart is open
  useEffect(() => {
    if (showCart) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCart]);

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

  const foodSectionRef = useRef(null);
  const [isFabVisible, setIsFabVisible] = useState(false);
  const [fabBottomOffset, setFabBottomOffset] = useState(32);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Show FAB after scrolling past hero
      setIsFabVisible(scrollY > windowHeight * 0.7);

      if (foodSectionRef.current) {
        const rect = foodSectionRef.current.getBoundingClientRect();
        const foodBottom = rect.bottom;

        const isMobile = window.innerWidth < 768;
        const fabMargin = 32;

        // If bottom of food items section enters viewport
        if (foodBottom < windowHeight) {
          const offset = windowHeight - foodBottom + fabMargin;
          setFabBottomOffset(offset);
        } else {
          setFabBottomOffset(fabMargin);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 relative">
      {/* HERO SECTION */}
      <header className="relative w-full h-[320px] sm:h-[400px] md:h-[500px] lg:h-[calc(100vh-75px)] overflow-hidden flex flex-col items-center justify-center text-white text-center px-4">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={resturantImg}
            alt="Our Restaurant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        {/* Content */}
        <div className="z-10 flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl md:text-6xl font-light">Our Restaurant</h1>
          <p className="text-lg md:text-xl italic tracking-widest border-t border-b border-white py-2 px-4">
            Eat well, laugh often, enjoy life
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-lg backdrop-blur-md">
            <Clock3 className="h-4 w-4 text-amber-200" />
            <span className="whitespace-nowrap">
              Opening Hours:{" "}
              <span className="font-semibold">10:00 AM - 11:00 PM</span>
            </span>
          </div>
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
              We believe good food starts with good ingredients. Our menu
              includes fresh, balanced dishes made using simple cooking methods
              to keep flavors natural and satisfying.
            </p>
          </div>
        </div>

        {/* Process Flow Section */}
        <ProcessFlow />

        {/* Category Navigation Bar */}
        <div className="sticky top-[75px] z-30 bg-neutral-50/80 backdrop-blur-md py-6 mb-8 border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth justify-start md:justify-center">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{ borderRadius: "10px" }}
                  className={`px-6 py-2.5 text-sm font-bold transition-all duration-300 whitespace-nowrap shadow-sm border transform hover:scale-105 active:scale-95
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
        <div
          ref={foodSectionRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[400px]"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              {/* Modern elegant spinner */}
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-amber-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-amber-600 border-t-transparent animate-spin"></div>
              </div>
              <p className="text-neutral-600 font-medium text-lg animate-pulse">
                Loading food items...
              </p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="flex flex-col">
              <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-x-6 md:gap-y-12 md:overflow-visible md:pb-0">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="w-[85%] shrink-0 snap-start md:w-auto md:shrink md:snap-none h-full"
                  >
                    <RestaurantCard
                      item={item}
                      itemsPerView={1}
                      onOrder={handleAddToCart}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-center text-[10px] text-gray-400 font-medium tracking-wider md:hidden">
                ← Swipe to browse →
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 text-neutral-300" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                No food items available in this category.
              </h3>
              <p className="text-neutral-500 max-w-xs">
                We couldn't find any dishes in the "{selectedCategory}" category
                at the moment.
              </p>
            </div>
          )}
        </div>

        {/* Floating Action Button (FAB) - Smart visibility */}
        <div
          className={`fixed z-[60] right-8 
            ${isFabVisible && !showCart ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-10 pointer-events-none"}`}
          style={{
            bottom: `${fabBottomOffset}px`,
            transition:
              "opacity 500ms ease-in-out, transform 500ms ease-in-out",
          }}
        >
          <button
            className="relative group transition-all duration-300"
            onClick={() => {
              setShowCart((prev) => !prev);
            }}
          >
            <div
              className="w-16 h-16 md:w-20 md:h-20 bg-amber-500 text-white flex items-center justify-center rounded-full shadow-2xl group-hover:bg-amber-600 group-hover:scale-110 transition-all duration-300"
              style={{ boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)" }}
            >
              <ShoppingCart className="w-6 h-6 md:w-9 md:h-9" />
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
            }
          }}
        />
      )}
      {/* Cart Modal */}
      {showCart && (
        <CartComp
          onClose={() => {
            setShowCart(false);
          }}
          cartItems={cartItems}
          setCartItems={setCartItems}
          onCheckout={handlecheckout}
        />
      )}
    </div>
  );
}
