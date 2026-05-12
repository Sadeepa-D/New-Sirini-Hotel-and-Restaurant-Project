import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Exploreindicator from "../../Components/Exploreindicator";
import resturantImg from "../../assets/resturant.png";
import OrderForm from "../../Components/RestaurantPage/OrderForm";
import RestaurantCard from "../../Components/RestaurantPage/RestaurantCard";
import ProcessFlow from "../../Components/RestaurantPage/ProcessFlow";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
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
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
    return [];
  });
  const [openorderform, setOpenorderform] = useState(false);

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

  const [categoryIndices, setCategoryIndices] = useState(() => {
    const defaultIndices = CATEGORIES.reduce((acc, cat) => {
      acc[cat] = 0;
      return acc;
    }, {});
    try {
      const saved = sessionStorage.getItem("restaurant_category_indices");
      return saved
        ? { ...defaultIndices, ...JSON.parse(saved) }
        : defaultIndices;
    } catch (e) {
      return defaultIndices;
    }
  });

  // Persist category indices to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(
      "restaurant_category_indices",
      JSON.stringify(categoryIndices),
    );
  }, [categoryIndices]);

  const getCategoryIndex = (cat) => categoryIndices[cat] || 0;

  const handlePrev = (e, cat) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }
    setCategoryIndices((prev) => ({
      ...prev,
      [cat]: Math.max(0, (prev[cat] || 0) - 1),
    }));
  };

  const handleNext = (e, cat, itemsCount) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }
    setCategoryIndices((prev) => ({
      ...prev,
      [cat]: Math.min(itemsCount - itemsPerView, (prev[cat] || 0) + 1),
    }));
  };

  const handleAddToCart = (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You should log in first");
      return;
    }

    if (!item.has_portions) {
      // Case 1: Food item has NO portion
      const existing = cartItems.find((i) => i.id === item.id);
      if (existing) {
        setCartItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i,
          ),
        );
        toast.success(`${item.name} quantity updated!`);
      } else {
        setCartItems((prev) => [
          ...prev,
          { ...item, cartId: item.id, quantity: 1, portion: "Normal" },
        ]);
        toast.success(`${item.name} added to cart!`);
      }
      return;
    }

    // Case 2: Food item HAS portion options
    const existingNormal = cartItems.find(
      (i) => i.id === item.id && i.portion === "Normal",
    );
    const existingFull = cartItems.find(
      (i) => i.id === item.id && i.portion === "Full",
    );

    if (existingNormal && existingFull) {
      // If both portion variants exist, block further adding and show message
      toast.error("Already added. You can change quantity in the cart");
      return;
    } else if (existingNormal) {
      // If Normal exists, add Full portion
      setCartItems((prev) => [
        ...prev,
        { ...item, cartId: `${item.id}_Full`, quantity: 1, portion: "Full" },
      ]);
      toast.success(`${item.name} (Full) added to cart!`);
    } else if (existingFull) {
      // If Full exists, add Normal portion
      setCartItems((prev) => [
        ...prev,
        { ...item, cartId: `${item.id}_Normal`, quantity: 1, portion: "Normal" },
      ]);
      toast.success(`${item.name} (Normal) added to cart!`);
    } else {
      // If none exist, add Normal portion as default
      setCartItems((prev) => [
        ...prev,
        { ...item, cartId: `${item.id}_Normal`, quantity: 1, portion: "Normal" },
      ]);
      toast.success(`${item.name} added to cart!`);
    }
  };

  const handlecheckout = (updatedItems) => {
    if (!updatedItems || updatedItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    // Update cartItems with the modified items from CartComp
    setCartItems(updatedItems);
    setShowCart(false);
    setOpenorderform(true);
  };

const MenuSection = ({
  title,
  items,
  index,
  onPrev,
  onNext,
  onOrder,
  itemsPerView,
}) => (
  <div className="mb-16">
    <h3 className="text-2xl font-bold text-neutral-900 mb-6">{title}</h3>
    <div className="relative">
      {index > 0 && (
        <button
          type="button"
          onClick={onPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-neutral-900" />
        </button>
      )}

      <div className="overflow-hidden">
        <div
          className="flex justify-start gap-4 sm:gap-6 transition-transform duration-[1200ms] ease-in-out"
          style={{
            transform: `translateX(calc(-${index * (100 / itemsPerView)}% - ${
              index * ((itemsPerView === 1 ? 16 : 24) / itemsPerView)
            }px))`,
          }}
        >
          {items.map((item) => (
            <RestaurantCard
              key={item.id}
              item={item}
              itemsPerView={itemsPerView}
              onOrder={onOrder}
            />
          ))}
        </div>
      </div>

      {index < items.length - itemsPerView && (
        <button
          type="button"
          onClick={onNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-neutral-900" />
        </button>
      )}
    </div>
  </div>
);

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

        {/* Categories Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {CATEGORIES.map((cat) => {
            const catItems = mealData.filter((item) => item.category === cat);
            if (catItems.length === 0) return null;

            return (
              <MenuSection
                key={cat}
                title={cat}
                items={catItems}
                index={getCategoryIndex(cat)}
                onPrev={(e) => handlePrev(e, cat)}
                onNext={(e) => handleNext(e, cat, catItems.length)}
                onOrder={handleAddToCart}
                itemsPerView={itemsPerView}
              />
            );
          })}
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
