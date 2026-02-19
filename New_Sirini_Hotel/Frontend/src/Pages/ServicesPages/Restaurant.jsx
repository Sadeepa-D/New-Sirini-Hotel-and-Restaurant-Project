import React, { useState, useEffect } from "react";
import resturantImg from "../../assets/resturant.png";

const mealData = [
  {
    id: "1",
    name: "Chicken Rice",
    category: "Main Meals",
    price: 350,
    ingredients: ["Chicken", "Rice", "Vegetables"],
    label: "Spicy",
    image:
      "https://plus.unsplash.com/premium_photo-1694141252774-c937d97641da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2tlbiUyMHJpY2V8ZW58MHx8MHx8fDA%3D",
    description: "Chicken and rice, cooked to perfection.",
  },
  {
    id: "2",
    name: "Noodles",
    category: "Main Meals",
    price: 350,
    ingredients: ["Noodles", "Vegetables"],
    label: "Vegetarian",
    image:
      "https://allthenoodles.com/wp-content/uploads/2024/09/spicy-garlic-beef-noodles-9.jpg",
    description: "Noodles and vegetables, cooked to perfection.",
  },
  {
    id: "5",
    name: "Fried Rice",
    category: "Main Meals",
    price: 400,
    ingredients: ["Rice", "Egg", "Chicken", "Vegetables"],
    label: "Chef Special",
    image: "https://www.australianeggs.org.au/assets/Uploads/Egg-fried-rice-2__ScaleWidthWzEyMDBd_ExtRewriteWyJqcGciLCJhdmlmIl0_QualityWzYwXQ.avif",
    description: "Flavorful fried rice with tender chicken and fresh vegetables.",
  },
  {
    id: "6",
    name: "Chicken Kottu",
    category: "Main Meals",
    price: 450,
    ingredients: ["Roti", "Chicken", "Egg", "Vegetables", "Spices"],
    label: "Popular",
    image: "https://dailyglobalbites.com/_next/image?url=%2Fimages%2Frecipes%2Fkottu%2Fslk1.jpg&w=1920&q=75",
    description: "Sri Lankan style kottu with chicken and aromatic spices.",
  },

  {
    id: "3",
    name: "Coca Cola",
    category: "Soft Drinks",
    price: 150,
    ingredients: ["Carbonated Water", "Sugar"],
    label: "Refreshing",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80",
    description: "Classic refreshing soft drink.",
  },
  {
    id: "7",
    name: "Sprite",
    category: "Soft Drinks",
    price: 150,
    ingredients: ["Carbonated Water", "Sugar", "Lemon Flavor"],
    label: "Chilled",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuwfyPonH0cPvqO_SELhyYHAZUmRYluj5n2w&s",
    description: "Cool lemon flavored soft drink.",
  },
  {
    id: "8",
    name: "Fanta",
    category: "Soft Drinks",
    price: 150,
    ingredients: ["Carbonated Water", "Sugar", "Orange Flavor"],
    label: "Sweet",
    image: "https://thechocolatehouse.lk/wp-content/uploads/2025/10/Fanta-Orange-Soft-Drink.jpg",
    description: "Orange flavored sparkling soft drink.",
  },
  {
    id: "9",
    name: "Necto",
    category: "Soft Drinks",
    price: 180,
    ingredients: ["Necto", "Sugar",],
    label: "Cool",
    image: "https://i0.wp.com/onlinekade.lk/wp-content/uploads/NECTO.webp?fit=744%2C744&ssl=1",
    description: "Chilled Necto with a sweet, fruity taste.",
  },
  {
    id: "4",
    name: "Orange Juice",
    category: "Fresh Juice",
    price: 250,
    ingredients: ["Fresh Oranges"],
    label: "Healthy",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80",
    description: "Freshly squeezed orange juice.",
  },

  {
    id: "10",
    name: "Mango Juice",
    category: "Fresh Juice",
    price: 280,
    ingredients: ["Fresh Mangoes"],
    label: "Seasonal",
    image: "https://miro.medium.com/v2/resize:fit:1400/1*YEvGeOTWYgIcyv89lCen8Q.jpeg",
    description: "Fresh mango juice with natural sweetness.",
  },
  {
    id: "11",
    name: "Pineapple Juice",
    category: "Fresh Juice",
    price: 260,
    ingredients: ["Fresh Pineapple"],
    label: "Tropical",
    image: "https://thumbs.dreamstime.com/b/pineapple-juice-glass-fresh-pineapples-sunlight-great-creative-professional-projects-369361083.jpg",
    description: "Chilled pineapple juice made from ripe fruit.",
  },
  {
    id: "12",
    name: "Watermelon Juice",
    category: "Fresh Juice",
    price: 240,
    ingredients: ["Fresh Watermelon"],
    label: "Hydrating",
    image: "https://static.vecteezy.com/system/resources/previews/055/940/512/non_2x/watermelon-juice-with-splash-on-black-background-photo.jpg",
    description: "Light and refreshing watermelon juice.",
  },
];

function OrderModal({ item, onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickupDate: "",
    pickupTime: "",
    quantity: 1,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Prevent background scroll
  useEffect(() => {
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
        {/* Header with close button */}
        <div className="relative px-6 pt-6 pb-4 border-b border-neutral-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
          >
            <svg
              className="w-4 h-4 text-neutral-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
            Order Now
          </span>
          <h2 className="text-2xl font-bold text-neutral-900 mt-1">{item.name}</h2>
          <p className="text-sm text-neutral-500 mt-1">{item.description}</p>

          {/* Small label pill - optional, looks nice */}
          <div className="mt-3 inline-block">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ background: "#d97706" }}
            >
              {item.label}
            </span>
          </div>
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
                  placeholder="+94 77 123 4567"
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
                  min={new Date().toISOString().split("T")[0]}
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

            {/* Total Price */}
            <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-sm text-amber-800">
                  Rs. {item.price} × {form.quantity}
                </span>
                <span className="text-xl font-bold text-amber-700">
                  Rs. {item.price * form.quantity}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-3.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 active:scale-[0.98] transition-all shadow-md shadow-amber-200/50 text-base"
              >
                Confirm Order
              </button>
            </div>

            {/* Success Message */}
            {submitted && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                <p className="text-orange-800 font-medium">
                  Order placed.. we'll have your <span className="font-bold">{item.name}</span>, ready for pick up
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
export default function Restaurant() {
  const [itemsPerView, setItemsPerView] = useState(4);
  const [mealsIndex, setMealsIndex] = useState(0);
  const [softdrinkIndex, setSoftdrinkIndex] = useState(0);
  const [freshJuiceIndex, setFreshJuiceIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);

  const mainmeals = mealData.filter((meal) => meal.category === "Main Meals");
  const softdrinks = mealData.filter((meal) => meal.category === "Soft Drinks");
  const freshJuice = mealData.filter((meal) => meal.category === "Fresh Juice");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOrder = (item) => {
    setSelectedItem(item);
  };

  const handlePrevMeals = () => setMealsIndex(Math.max(0, mealsIndex - 1));
  const handleNextMeals = () =>
    setMealsIndex(Math.min(mainmeals.length - itemsPerView, mealsIndex + 1));

  const handlePrevSoftdrinks = () => setSoftdrinkIndex(Math.max(0, softdrinkIndex - 1));
  const handleNextSoftdrinks = () =>
    setSoftdrinkIndex(Math.min(softdrinks.length - itemsPerView, softdrinkIndex + 1));

  const handlePrevFreshJuice = () => setFreshJuiceIndex(Math.max(0, freshJuiceIndex - 1));
  const handleNextFreshJuice = () =>
    setFreshJuiceIndex(Math.min(freshJuice.length - itemsPerView, freshJuiceIndex + 1));

  const MenuSection = ({ title, items, index, onPrev, onNext, onOrder }) => (
    <div className="mb-16">
      <h3 className="text-2xl font-bold text-neutral-900 mb-6">{title}</h3>
      <div className="relative">
        {index > 0 && (
          <button
            onClick={onPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
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
              <div
                key={item.id}
                className="flex-shrink-0"
                style={{
                  width: `calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * (itemsPerView === 1 ? 16 : 24)) / itemsPerView
                    }px)`,
                }}
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-100 h-full flex flex-col hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded">
                        {item.label}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h4 className="text-xl font-bold text-neutral-900 mb-1">{item.name}</h4>
                    <p className="text-sm text-neutral-500 mb-3">{item.ingredients.join(", ")}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-lg font-bold text-amber-600">Rs. {item.price}</span>
                      <button
                        onClick={() => onOrder(item)}
                        className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {index < items.length - itemsPerView && (
          <button
            onClick={onNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white hover:bg-neutral-100 rounded-full shadow-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[650px] overflow-hidden">
        <img
          src={resturantImg}
          alt="Restaurant"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <h1 className="absolute inset-0 flex items-center justify-center 
               text-center font-serif font-bold text-white 
               text-2xl md:text-5xl lg:text-6xl 
               drop-shadow-[2px_2px_8px_rgba(0,0,0,0.7)]">
          Eat well, laugh often, enjoy life
        </h1>
      </div>

      {/* Menu Header Section */}
      <div className="px-4 py-8 md:py-12">
        <div className="mx-auto max-w-6xl border border-gray-300 bg-gray-50 rounded-lg px-6 py-10 md:py-12 text-center shadow-sm">
          <h1 className="text-5xl sm:text-6xl font-serif font-normal text-gray-800 mb-6">Menu</h1>
          <p className="text-gray-700 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-light">
            We believe good food starts with good ingredients. Our menu includes fresh, balanced dishes made using simple cooking methods to keep flavors natural and satisfying.
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {mainmeals.length > 0 && (
          <MenuSection
            title="Main Meals"
            items={mainmeals}
            index={mealsIndex}
            onPrev={handlePrevMeals}
            onNext={handleNextMeals}
            onOrder={handleOrder}
          />
        )}
        {softdrinks.length > 0 && (
          <MenuSection
            title="Soft Drinks"
            items={softdrinks}
            index={softdrinkIndex}
            onPrev={handlePrevSoftdrinks}
            onNext={handleNextSoftdrinks}
            onOrder={handleOrder}
          />
        )}
        {freshJuice.length > 0 && (
          <MenuSection
            title="Fresh Juice"
            items={freshJuice}
            index={freshJuiceIndex}
            onPrev={handlePrevFreshJuice}
            onNext={handleNextFreshJuice}
            onOrder={handleOrder}
          />
        )}
      </div>

      {selectedItem && (
        <OrderModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
