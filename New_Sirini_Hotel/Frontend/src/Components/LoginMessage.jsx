import React from 'react';
import { Lock, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginMessage = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md" 
        onClick={onClose}
      ></div>

      {/* Content Card */}
      <div className="relative w-full sm:max-w-md bg-[#0c0c0c] border border-white/10 rounded-t-[2.5rem] sm:rounded-[2rem] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Icon Decoration */}
          <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
            <Lock className="text-orange-500" size={32} strokeWidth={2.5} />
          </div>

          {/* Text Content */}
          <h3 className="text-2xl font-serif font-black text-white uppercase italic tracking-tighter mb-3">
            Access Restricted
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 font-sans">
            To ensure the security of your bookings, please <span className="text-white font-bold">Login</span> to complete this action and explore exclusive features.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col w-full gap-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-orange-500 text-black py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20 hover:bg-orange-400 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              Go to Login Page <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-4 text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginMessage;