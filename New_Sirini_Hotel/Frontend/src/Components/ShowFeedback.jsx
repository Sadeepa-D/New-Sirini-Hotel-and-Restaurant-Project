import React, { useEffect, useState } from "react";
import { Star, Calendar, Quote } from "lucide-react";
import axios from "axios";

const ShowFeedback = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
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

    fetchTestimonials();
  }, [VITE_API_URL]);

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

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial._id || index}
              className="group bg-white rounded-2xl border border-gray-200 hover:border-amber-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-6 flex flex-col"
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
                <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-semibold border border-amber-100 font-mono">
                  Room {testimonial.roomNumber}
                </span>
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
