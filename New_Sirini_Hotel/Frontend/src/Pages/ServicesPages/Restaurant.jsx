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
  const [categoryIndices, setCategoryIndices] = useState({});
  const [mealData, setMealData] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
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

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setItemsPerView(w < 640 ? 1 : w < 1024 ? 2 : w < 1280 ? 3 : 4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCategoryIndex = (cat) => categoryIndices[cat] || 0;

  const handlePrev = (cat) => {
    setCategoryIndices((prev) => ({
      ...prev,
      [cat]: Math.max(0, (prev[cat] || 0) - 1),
    }));
  };

  const handleNext = (cat, itemsCount) => {
    setCategoryIndices((prev) => ({
      ...prev,
      [cat]: Math.min(itemsCount - itemsPerView, (prev[cat] || 0) + 1),
    }));
  };

  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i,
        );
      }
      return [
        ...prev,
        { ...item, cartId: item.id, quantity: 1, portion: "Normal" },
      ];
    });
    toast.success(`${item.name} added to cart!`);
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

  const MenuSection = ({ title, items, index, onPrev, onNext, onOrder }) => (
    <div className="mb-16">
      <h3 className="text-2xl font-bold text-neutral-900 mb-6">{title}</h3>
      <div className="relative">
        {index > 0 && (
          <button
            onClick={onPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-neutral-900" />
          </button>
        )}

        <div className="overflow-hidden">
          <div
            className="flex gap-4 sm:gap-6 transition-transform duration-300"
            style={{
              transform: `translateX(-${index * (100 / itemsPerView)}%)`,
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
                onPrev={() => handlePrev(cat)}
                onNext={() => handleNext(cat, catItems.length)}
                onOrder={handleAddToCart}
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
          onClose={() => {
            setOpenorderform(false);
            setCartItems([]);
          }}
        />
      )}
      {/* Cart Modal */}
      {showCart && (
        <CartComp
          onClose={() => setShowCart(false)}
          cartItems={cartItems}
          setCartItems={setCartItems}
          onCheckout={handlecheckout}
        />
      )}
    </div>
  );
}
