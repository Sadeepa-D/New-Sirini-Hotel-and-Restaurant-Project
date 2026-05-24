import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";

const DynamicStarsDisplay = ({ roomNumber, size = "sm" }) => {
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await axios.get(
          `${VITE_API_URL}/api/feedback/room/${roomNumber}`,
        );
        setRating(response.data.averageRating || 0);
        setReviewCount(response.data.totalReviews || 0);
      } catch (error) {
        console.error("Error fetching room rating:", error);
        setRating(0);
        setReviewCount(0);
      } finally {
        setLoading(false);
      }
    };

    if (roomNumber) {
      fetchRating();
    }
  }, [roomNumber, VITE_API_URL]);

  const starSize = size === "lg" ? 14 : size === "md" ? 12 : 10;

  if (loading) {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={starSize}
            className="text-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (reviewCount === 0) {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={starSize} className="text-gray-300" />
        ))}
        <span className="text-[10px] text-gray-400 font-medium ml-1 italic">
          No reviews yet
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          const fillPercentage = Math.max(0, Math.min(1, rating - i));
          return (
            <div key={i} className="relative overflow-hidden">
              <Star size={starSize} className="text-gray-300" />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercentage * 100}%` }}
              >
                <Star
                  size={starSize}
                  className="fill-orange-400 text-orange-400"
                />
              </div>
            </div>
          );
        })}
      </div>
      <span
        className={`text-[9px] font-semibold ml-1 ${
          rating >= 4
            ? "text-green-600"
            : rating >= 3
              ? "text-yellow-600"
              : "text-orange-600"
        }`}
      >
        {rating.toFixed(1)}
      </span>
      <span className="text-[8px] text-gray-400 font-medium">
        ({reviewCount})
      </span>
    </div>
  );
};

export default DynamicStarsDisplay;
