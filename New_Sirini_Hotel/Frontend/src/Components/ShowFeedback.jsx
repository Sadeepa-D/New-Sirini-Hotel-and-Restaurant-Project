import React, { useEffect, useState } from "react";
import {
  Star,
  Calendar,
  Quote,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const ShowFeedback = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const scrollContainerRef = React.useRef(null);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(`${VITE_API_URL}/api/feedback/all`);
        setTestimonials(response.data.feedbacks || []);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    // Fetch user profile to check if admin
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(
            `${VITE_API_URL}/api/users/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          setUserRole(response.data.Role || null);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchTestimonials();
    fetchUserRole();
  }, [VITE_API_URL]);

  const handleDeleteFeedback = async (feedbackId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this feedback? This action cannot be undone.",
    );
    if (!confirmed) return;

    setDeletingId(feedbackId);
    const toastId = toast.loading("Deleting feedback...");

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${VITE_API_URL}/api/feedback/${feedbackId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove deleted feedback from list
      setTestimonials((prev) =>
        prev.filter((testimonial) => testimonial._id !== feedbackId),
      );

      toast.success("Feedback deleted successfully", { id: toastId });
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete feedback",
        { id: toastId },
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleScroll = (e) => {
    setScrollPosition(e.target.scrollLeft);
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 360; // Width of card + gap
      const newPosition =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;
      container.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-6 bg-gray-50 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null; // Hide section if no testimonials
  }

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Quote size={24} className="text-amber-500" />
            <h2 className="text-3xl md:text-4xl font-serif italic text-gray-900">
              Guest Experiences
            </h2>
          </div>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Discover what our valued guests have to say about their
            unforgettable stays at New Sirini Hotel.
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white/90 hover:bg-white text-amber-600 rounded-full shadow-lg border border-amber-200 transition-all duration-300 hover:scale-110 active:scale-95"
            title="Scroll left"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* Cards Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-6 pb-4 px-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth snap-x snap-mandatory"
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial._id || index}
                className="group/card bg-white rounded-2xl border border-gray-200 hover:border-amber-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-6 flex flex-col flex-shrink-0 w-80 sm:w-96 snap-start"
              >
                {/* Stars & Room Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`transition-colors ${
                          i < Math.round(testimonial.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-semibold border border-amber-100 font-mono">
                      Room {testimonial.roomNumber}
                    </span>
                    {userRole === "Admin" && (
                      <button
                        onClick={() => handleDeleteFeedback(testimonial._id)}
                        disabled={deletingId === testimonial._id}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete feedback"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-gray-700 text-sm leading-relaxed mb-5 flex-grow italic">
                  "{testimonial.comment}"
                </p>

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 mb-4" />

                {/* User Info & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-900 text-sm leading-none mb-1">
                      {testimonial.userName}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Calendar size={12} />
                      <span>{testimonial.timestamp}</span>
                    </div>
                  </div>
                  {/* Rating Badge */}
                  <div className="text-right">
                    <div className="text-lg font-black text-amber-600">
                      {testimonial.rating}
                    </div>
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">
                      Stars
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white/90 hover:bg-white text-amber-600 rounded-full shadow-lg border border-amber-200 transition-all duration-300 hover:scale-110 active:scale-95"
            title="Scroll right"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-sm mb-4">
            Share your experience and help us improve
          </p>
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default ShowFeedback;
