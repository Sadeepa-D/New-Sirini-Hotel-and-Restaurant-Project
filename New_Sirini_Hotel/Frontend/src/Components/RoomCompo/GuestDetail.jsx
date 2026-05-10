import React from "react";
import { User, Mail, Phone, Users, ShieldCheck, ChevronLeftCircle, X } from "lucide-react";

const GuestDetail = ({ formData, setFormData, maxCapacity, totalPrice, onBack, onSubmit, loading, onClose }) => {
  return (
    <div className="relative w-full max-w-[380px] bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-100 animate-in slide-in-from-right-4 duration-500">
      <button onClick={onClose} className="absolute top-6 right-6 text-gray-300 hover:text-gray-900"><X size={20} /></button>

      <button onClick={onBack} className="text-gray-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 hover:text-orange-500 mb-4">
        <ChevronLeftCircle size={14}/> Back to Calendar
      </button>

      <div className="mb-6">
        <h2 className="text-gray-900 text-xl font-serif italic">Guest Details</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
            <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
          </div>
          
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
            <select value={formData.guests} onChange={(e) => setFormData({...formData, guests: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/50 appearance-none">
              {[...Array(maxCapacity)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1} {i === 0 ? "Guest" : "Guests"}</option>
              ))}
            </select>
          </div>

          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
          <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
        </div>

        <div className="bg-orange-500 rounded-3xl p-5 text-center text-white shadow-xl">
          <p className="text-orange-100 text-[8px] font-black uppercase mb-1">Total Stay Amount</p>
          <p className="text-2xl font-bold font-mono">Rs.{totalPrice.toLocaleString()}</p>
          <div className="mt-2 flex items-center justify-center gap-2 text-[9px] text-orange-100 font-bold uppercase opacity-60">
            <ShieldCheck size={12}/> Secure Payment
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-4 rounded-[2rem] bg-gray-900 text-white font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all">
          {loading ? "Processing..." : "Complete Booking"}
        </button>
      </form>
    </div>
  );
};

export default GuestDetail;