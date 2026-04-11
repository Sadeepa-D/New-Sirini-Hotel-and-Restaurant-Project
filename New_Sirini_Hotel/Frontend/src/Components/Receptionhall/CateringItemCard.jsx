import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const CateringItemCard = () => {
  const [cateringItems, setCateringItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const VITE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCateringItems = async () => {
      try {
        const response = await fetch(
          `${VITE_URL}/api/receptionhall/catering/view`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setCateringItems(data.items || []);
        console.log("Catering API response:", data); // 👈 check browser console
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
        // toast.error("Failed to load catering items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCateringItems();
  }, []);

  if (loading)
    return <p className="text-center py-16">Loading catering items...</p>;
  if (error) return <p className="text-center py-16 text-red-500">{error}</p>;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cateringItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col"
          >
            <div className="relative h-48 sm:h-56 w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-amber-500 text-amber-900 text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow">
                Rs. {item.price}
              </div>
            </div>

            <div className="p-4 sm:p-5 flex flex-col flex-1">
              <h3 className="font-cinzel text-base sm:text-lg font-semibold text-gray-800 mb-3">
                {item.name}
              </h3>
              <div className="w-10 h-0.5 bg-amber-400 mb-3 rounded-full" />
              <div className="mt-auto">
                <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-widest mb-2 font-medium">
                  Ingredients
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(item.ingredients)
                    ? item.ingredients
                    : [item.ingredients]
                  ).map((ing, i) => (
                    <span
                      key={i}
                      className="bg-amber-50 text-amber-800 text-xs px-2.5 py-1 rounded-full border border-amber-200"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default CateringItemCard;
