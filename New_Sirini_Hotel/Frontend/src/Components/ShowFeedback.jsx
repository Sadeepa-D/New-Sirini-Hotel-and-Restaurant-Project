import React, { useEffect, useState } from "react";
import {
  Star,
  Calendar,
  Quote,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
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
  const [selectedRoomFilter, setSelectedRoomFilter] = useState("All");
  const scrollContainerRef = React.useRef(null);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "G";

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

  const uniqueRooms = [
    "All",
    ...Array.from(
      new Set(testimonials.map((t) => t.roomNumber).filter(Boolean))
    ).sort((a, b) =>
      String(a).localeCompare(String(b), undefined, { numeric: true })
    ),
  ];

  const showFilter = uniqueRooms.length > 2;

  const filteredTestimonials =
    selectedRoomFilter === "All"
      ? testimonials
      : testimonials.filter(
          (t) => String(t.roomNumber) === String(selectedRoomFilter)
        );

  // Reset filter to "All" if selected room no longer has testimonials (e.g. after deletion)
  useEffect(() => {
    if (
      selectedRoomFilter !== "All" &&
      !testimonials.some(
        (t) => String(t.roomNumber) === String(selectedRoomFilter)
      )
    ) {
      setSelectedRoomFilter("All");
    }
  }, [testimonials, selectedRoomFilter]);

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
    return (
      <section className="py-16 px-6 bg-linear-to-b from-gray-50 to-white font-sans">
        <div className="max-w-7xl mx-auto">
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

          <div className="max-w-2xl mx-auto rounded-[22px] border border-gray-200 bg-white shadow-sm px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500">
              <Quote size={24} />
            </div>
            <h3 className="text-lg sm:text-xl font-serif italic text-gray-900">
              No feedback yet
            </h3>
            <p className="mt-2 text-sm sm:text-base text-gray-500">
              Be the first guest to share your experience with us.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-6 bg-linear-to-b from-gray-50 to-white font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
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

        {/* Filter Section */}
        {showFilter && (
          <div className="flex flex-col items-center mb-8">
            <label htmlFor="room-filter" className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-2.5">
            Select The Room
            </label>
            <div className="relative inline-block w-48">
              <select
                id="room-filter"
                value={selectedRoomFilter}
                onChange={(e) => setSelectedRoomFilter(e.target.value)}
                className="w-full appearance-none bg-white text-gray-800 text-[11px] font-black uppercase tracking-wider pl-5 pr-10 py-2.5 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent cursor-pointer hover:border-amber-300 hover:text-amber-600 transition-all duration-300"
              >
                {uniqueRooms.map((roomNum) => (
                  <option key={roomNum} value={roomNum} className="text-gray-700 bg-white">
                    {roomNum === "All" ? "All Rooms" : `Room ${roomNum}`}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-amber-500">
                <ChevronDown size={14} className="stroke-[3]" />
              </div>
            </div>
          </div>
        )}

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
            {filteredTestimonials.map((testimonial, index) => (
              <div
                key={testimonial._id || index}
                className="group/card bg-white text-slate-900 rounded-[22px] border border-gray-200 shadow-sm hover:shadow-xl hover:border-amber-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden p-4 sm:p-5 flex flex-col shrink-0 w-80 sm:w-96 snap-start"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-amber-500 text-black flex items-center justify-center text-sm font-semibold shadow-sm shrink-0">
                    {getInitials(testimonial.userName)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h6 className="text-slate-900 text-[15px] sm:text-[17px] font-semibold leading-tight truncate">
                      {testimonial.userName}
                    </h6>
                    <p className="text-slate-500 text-[12px] sm:text-[13px] leading-tight mt-0.5">
                      Stayed in Room {testimonial.roomNumber}
                    </p>
                  </div>

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

                <div className="mt-2.5 flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.round(testimonial.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                <p className="mt-2.5 text-slate-700 text-[15px] sm:text-[16px] leading-normal font-serif font-medium">
                  {testimonial.comment}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-200 text-gray-500 text-sm">
                  {testimonial.timestamp}
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
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm mb-3">
            Share your experience and help us improve
          </p>
          <div className="h-px w-20 bg-linear-to-r from-transparent via-amber-500 to-transparent mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default ShowFeedback;
