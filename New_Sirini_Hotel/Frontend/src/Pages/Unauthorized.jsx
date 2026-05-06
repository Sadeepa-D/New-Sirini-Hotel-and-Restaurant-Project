import React from "react";
import { ShieldAlert, ArrowLeft, Home, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Illustration Area */}
        <div className="relative flex justify-center">
          {/* Animated Background Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-red-100 rounded-full animate-ping opacity-20"></div>
          </div>

          {/* Main Icon Hub */}
          <div className="relative bg-white p-6 rounded-[2.5rem] shadow-xl shadow-red-100 border border-red-50">
            <div className="bg-red-500 p-4 rounded-3xl">
              <ShieldAlert size={48} className="text-white" />
            </div>
            {/* Small Lock Badge */}
            <div className="absolute -bottom-2 -right-2 bg-slate-800 p-2 rounded-xl border-4 border-slate-50 shadow-lg text-white">
              <Lock size={16} />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Access Denied
          </h1>
          <p className="text-slate-500 font-medium px-4">
            You don't have the required permissions to view this department's
            dashboard. Please contact the Hotel Admin if you believe this is an
            error.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            <Home size={18} />
            Home
          </button>
        </div>

        {/* Footer info */}
        <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">
          Sirini Hotel Security Protocol
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
