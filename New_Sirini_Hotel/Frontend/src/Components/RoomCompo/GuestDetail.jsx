import React from "react";
import { User, Mail, Phone, Users, ShieldCheck, ChevronLeftCircle, X, CreditCard, Sparkles } from "lucide-react";

const GuestDetail = ({ formData, setFormData, maxCapacity, totalPrice, onBack, onSubmit, loading, onClose, bookingMode, selectedPkg }) => {
  let calculatedDays = 1;
  if (bookingMode === "fullday" && formData.checkInDate && formData.checkOutDate) {
    const [y1, m1, d1] = formData.checkInDate.split("-").map(Number);
    const [y2, m2, d2] = formData.checkOutDate.split("-").map(Number);
    calculatedDays = Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="relative w-full max-w-[380px] bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 border border-gray-100 animate-in slide-in-from-right-8 duration-700 ease-out overflow-hidden">
      
      {/* Decorative Glow - පසුබිම් අලංකරණය */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-50 rounded-full blur-3xl opacity-50" />
      
      {/* Close Button */}
      <button 
        onClick={onClose} 
        className="absolute top-7 right-7 text-gray-300 hover:text-gray-900 hover:bg-gray-50 p-1.5 rounded-full transition-all duration-300 z-10"
      >
        <X size={18} />
      </button>

      {/* Back Button */}
      <button 
        onClick={onBack} 
        className="group text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:text-orange-500 transition-colors mb-6"
      >
        <ChevronLeftCircle size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
        Back to Calendar
      </button>

      {/* Header Section */}
      <div className="mb-8 relative">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={12} className="text-orange-400" />
          <span className="text-orange-500 text-[8px] font-black uppercase tracking-[0.3em]">Step 02</span>
        </div>
        <h2 className="text-gray-900 text-2xl font-serif italic font-medium leading-tight">Guest Details</h2>
        <p className="text-gray-400 text-[10px] mt-1 font-medium">Please provide your contact information</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 relative">
        <div className="space-y-3.5">
          {/* Full Name Input */}
          <div className="group relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={15} />
            <input 
              type="text" 
              placeholder="Your Full Name" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-xs text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500/30 focus:bg-white transition-all" 
            />
          </div>
          
          {/* Guests Selector */}
          <div className="group relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={15} />
            <select 
              value={formData.guests} 
              onChange={(e) => setFormData({...formData, guests: e.target.value})} 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-10 py-3.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500/30 focus:bg-white appearance-none cursor-pointer transition-all"
            >
              {[...Array(maxCapacity)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1} {i === 0 ? "Guest" : "Guests"}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          {/* Email Input */}
          <div className="group relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={15} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-xs text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500/30 focus:bg-white transition-all" 
            />
          </div>

          {/* Phone Input */}
          <div className="group relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={15} />
            <input 
              type="tel" 
              placeholder="Phone Number" 
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              required 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-xs text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500/30 focus:bg-white transition-all" 
            />
          </div>
        </div>

        {/* Package Summary Card */}
        <div className="relative overflow-hidden bg-gray-900 rounded-[2rem] p-6 text-center shadow-2xl shadow-gray-200 group transition-all duration-500">
          {selectedPkg && (
            <div className="mb-3">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-1">
                <span className="text-base">{selectedPkg.icon}</span>
                <span className="text-white/70 text-[8px] font-black uppercase tracking-widest">{selectedPkg.label}</span>
              </div>
              <p className="text-orange-400 text-[9px] font-black uppercase tracking-widest">{selectedPkg.timeRange}</p>
              {bookingMode === "fullday" && formData.checkInDate && formData.checkOutDate && (
                <>
                  <p className="text-white/60 text-[9px] mt-1">
                    {formData.checkInDate} → {formData.checkOutDate}
                  </p>
                  <p className="text-orange-400/80 text-[9px] font-bold mt-0.5">
                    {calculatedDays} {calculatedDays === 1 ? "day" : "days"}
                  </p>
                </>
              )}
              {bookingMode === "day" && formData.checkInDate && (
                <p className="text-white/60 text-[9px] mt-1">{formData.checkInDate}</p>
              )}
            </div>
          )}
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Your Total</p>
          <p className="text-3xl font-bold font-mono text-white tracking-tighter leading-none">Rs.{totalPrice.toLocaleString()}</p>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading} 
          className="relative w-full py-4 rounded-[2rem] bg-orange-500 text-black font-black uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-orange-500/20 hover:bg-orange-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Processing
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Complete Booking
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default GuestDetail;