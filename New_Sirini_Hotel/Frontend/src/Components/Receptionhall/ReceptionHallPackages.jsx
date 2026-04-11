import React, { useState, useEffect, use } from "react";

export default function ReceptionHallPackages() {

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const VITE_URL = import.meta.env.VITE_API_URL;
 useEffect(() => {
   const fetchoccasionpackages=async()=>{
try {
  const response = await fetch(`${VITE_URL}/api/receptionhall/package/view`);
  if (!response) {
    setError("Failed to fetch data");
    return;
  }
  const data = await response.json();
 setPackages(data.packages);
  console.log(data);
}catch (error) {
  console.error("Error fetching data:", error);
  setError("An error occurred while fetching data");
  }
  finally {
    setLoading(false);
  }
    }
    fetchoccasionpackages();
 }, []);
 
 if (loading) return <p className="text-center py-16">Loading packages...</p>;
  if (error) return <p className="text-center py-16 text-red-500">{error}</p>;

  return (
    <section className="bg-neutral-200 py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">

        {packages.map((card, index) => (
          <div key={index} className="rounded-lg overflow-hidden shadow-md">

            {/* Image */}
            <div className="h-64">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Content */}
            <div className="bg-neutral-700 text-center px-6 py-8">

              {/* Title pill */}
              <div className="flex justify-center mb-4">
                <span className="bg-amber-500 text-black px-6 py-2 rounded-full text-sm font-semibold">
                  {card.name}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-200 italic text-sm leading-relaxed">
                {card.description}
              </p>

            </div>
          </div>
        ))}

      </div>
    </section>
  );
}