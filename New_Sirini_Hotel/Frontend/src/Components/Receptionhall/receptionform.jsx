import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function BookingForm() {
  const VITE_URL = import.meta.env.VITE_API_URL;

  const inputClass =
    "w-full border border-gray-300 px-4 py-3 text-lg text-gray-700 focus:border-amber-400 outline-none transition-colors";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [noOfGuests, setNoOfGuests] = useState("");
  const [eventType, setEventType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to submit a booking request.");
      return;
    }
    const bookingdata = {
      name,
      email,
      phone,
      date,
      noOfGuests,
      eventType,
    };
    try {
      const response = await axios.post(
        `${VITE_URL}/api/receptionhall/appointment/add`,
        bookingdata,
        {
          headers: {
            Authorization: `Bearer ${token}`, // CRITICAL: Send the JWT here
          },
        },
      );
      if (response.status === 201) {
        toast.success(
          "Booking request submitted successfully! We will contact you soon.",
        );
        setName("");
        setEmail("");
        setPhone("");
        setDate("");
        setNoOfGuests("");
        setEventType("");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Failed to submit booking request. Please try again.");
    }
  };

  return (
    <section className="bg-white py-16 px-4 sm:px-8 border-t border-gray-100">
      <div className="text-center mb-10">
        <h2 className="font-cormorant italic text-4xl sm:text-5xl text-amber-500 font-semibold mb-2">
          Book Your Reception Hall
        </h2>
        <p className="text-gray-400 text-sm uppercase tracking-widest">
          plan your visit
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Name :
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Event Type :
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g., Wedding, Birthday"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Mobile No :
              </label>
              <input
                type="tel"
                className={inputClass}
                placeholder="077 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Email Address:
              </label>
              <input
                type="email"
                className={inputClass}
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Event Date :
              </label>
              <input
                type="date"
                className={inputClass}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                No of Guests :
              </label>
              <input
                type="number"
                className={inputClass}
                placeholder="100"
                value={noOfGuests}
                onChange={(e) => setNoOfGuests(e.target.value)}
              />
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-black text-lg font-bold px-16 py-3.5 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Submit Booking
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
