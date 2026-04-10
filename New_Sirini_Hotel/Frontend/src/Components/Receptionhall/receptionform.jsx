
export default function BookingForm() {
  const inputClass =
    "w-full border border-gray-300 px-4 py-3 text-lg text-gray-700 focus:border-amber-400 outline-none transition-colors";

  return (
    <section className="bg-white py-16 px-4 sm:px-8 border-t border-gray-100">
      <div className="text-center mb-10">
        <h2 className="font-cormorant italic text-4xl sm:text-5xl text-amber-500 font-semibold mb-2">
          Book Your Reception Hall
        </h2>
        <p className="text-gray-400 text-sm uppercase tracking-widest">plan your visit</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Name :</label>
            <input type="text" className={inputClass} placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Event Type :</label>
            <input type="text" className={inputClass} placeholder="e.g., Wedding, Birthday" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Mobile No :</label>
            <input type="tel" className={inputClass} placeholder="077 123 4567" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">No of Guests :</label>
            <input type="number" className={inputClass} placeholder="100" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Event Date :</label>
            <input type="date" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Special Requests :</label>
            <input type="text" className={inputClass} placeholder="Any specific requirements..." />
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-amber-400 hover:bg-amber-500 text-black text-lg font-bold px-16 py-3.5 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]">
            Submit Booking
          </button>
        </div>
      </div>
    </section>
  );
}
