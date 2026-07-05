import React from 'react';
import { Lock, LogIn, X, UserPlus, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginMessage = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ animation: 'fadeIn 0.25s ease-out' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div
        className="relative w-full sm:max-w-sm md:max-w-md bg-[#111111] border border-white/10 shadow-2xl overflow-hidden"
        style={{
          borderRadius: '28px 28px 0 0',
          animation: 'slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* --- decorative amber glow top --- */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-500/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Desktop rounded on all corners */}
        <style>{`
          @media (min-width: 640px) {
            .login-msg-card { border-radius: 24px !important; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)   scale(1);    }
          }
        `}</style>

        <div className="login-msg-card relative p-6 sm:p-8 flex flex-col items-center text-center gap-5">

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 text-white/30 hover:text-white hover:bg-white/10 transition-all"
            style={{ borderRadius: '50%' }}
          >
            <X size={18} />
          </button>

          {/* Lock icon badge */}
          <div
            className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-amber-500/10 border border-amber-500/25 shadow-lg"
            style={{
              borderRadius: '50%',
              boxShadow: '0 0 40px rgba(245,158,11,0.15)',
            }}
          >
            <Lock className="text-amber-400" size={28} strokeWidth={2} />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
              Login Required
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
              Please{' '}
              <span className="text-amber-400 font-semibold">sign in</span>{' '}
              to your account to complete this action and unlock exclusive hotel features.
            </p>
          </div>

          {/* Trust badge */}
          <div
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium"
            style={{ borderRadius: '999px' }}
          >
            <ShieldCheck size={14} />
            <span>Your data is safe &amp; secure</span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col w-full gap-3 mt-1">
            {/* Primary – Sign In */}
            <button
              onClick={() => { navigate('/login'); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-amber-500 text-black font-bold text-sm tracking-wide hover:bg-amber-400 active:scale-95 transition-all shadow-lg group"
              style={{
                borderRadius: '14px',
                boxShadow: '0 8px 24px rgba(245,158,11,0.25)',
              }}
            >
              <LogIn size={16} />
              Sign In to Continue
            </button>

            {/* Secondary – Create account */}
            <button
              onClick={() => { navigate('/register'); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 border border-white/15 text-white/80 font-medium text-sm hover:bg-white/8 hover:text-white hover:border-white/30 active:scale-95 transition-all"
              style={{ borderRadius: '14px' }}
            >
              <UserPlus size={16} />
              Create Account
            </button>

            {/* Ghost – dismiss */}
            <button
              onClick={onClose}
              className="w-full py-2.5 text-gray-500 text-xs font-medium hover:text-gray-300 transition-colors"
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