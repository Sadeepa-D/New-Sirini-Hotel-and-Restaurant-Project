import React, { useState } from "react";
import { Star, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const FeedbackModal = ({ isOpen, onClose, booking, userName }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (comment.trim().length < 10) {
      toast.error("Comment must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Submitting feedback...");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${VITE_API_URL}/api/feedback/add`,
        {
          roomId: booking.roomId || booking._id,
          roomNumber: booking.roomNumber,
          userName,
          rating,
          comment: comment.trim(),
          bookingId: booking._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Thank you for your feedback!", { id: toastId });
      setRating(0);
      setComment("");
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit feedback",
        { id: toastId },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5 flex items-center justify-between border-b border-amber-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">
              Share Your Experience
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Room {booking?.roomNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
            aria-label="Close feedback modal"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Star Rating Section */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wider">
              How was your stay?
            </label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform duration-200 hover:scale-110 focus:outline-none"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    size={32}
                    className={`transition-all duration-200 ${
                      star <= (hoveredRating || rating)
                        ? "fill-amber-400 text-amber-400 drop-shadow-md"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-amber-600 font-medium">
                You rated this stay {rating} star{rating !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Comment Section */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wider">
              Tell us more <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about your stay, service, and overall experience..."
              className="w-full h-24 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none text-sm placeholder:text-gray-400 font-sans transition-all"
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-gray-400 italic">
                Minimum 10 characters required
              </p>
              <span className="text-[10px] text-gray-500 font-medium">
                {comment.length}/500
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 uppercase text-xs tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || comment.length < 10}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs tracking-wider"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
