import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-neutral-900 to-amber-950 px-4 overflow-hidden">
      
      {/* Decorative Background Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 pointer-events-none"></div>

      {/* Massive 404 Background Text */}
     <h1 
  style={{ fontSize: 'clamp(15rem, 40vw, 65rem)' }} 
  className="absolute inset-0 flex items-center justify-center font-black text-white/[0.02] leading-none select-none tracking-tighter z-0 pointer-events-none transition-all duration-700"
>
  404
</h1>
      {/* Floating Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[150px]"></div>

      <div className="max-w-3xl w-full text-center relative z-10">
        
        {/* Central Icon Section */}
        <div className="mb-10 flex flex-col items-center">
            <div className="bg-amber-500/10 p-6 rounded-3xl backdrop-blur-md border border-amber-500/20 mb-6 animate-bounce shadow-2xl">
              <Search size={50} className="text-amber-500" />
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-wide font-bold">
              Lost in the Corridor?
            </h2>
        </div>

        {/* Content Section */}
        <div className="space-y-10 max-w-2xl mx-auto">
         
          <p className="text-amber-100/60 text-lg md:text-xl leading-relaxed">
            We couldn't find the room you're looking for in the{" "}
            <span className="text-amber-400 font-semibold whitespace-nowrap">
              New Sirini Hotel registry.
            </span>
          </p>

          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-amber-900/20"
            >
              <Home size={20} />
              Return Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-amber-100/80 border border-amber-900/30 font-bold py-4 px-10 rounded-2xl backdrop-blur-md transition-all duration-300 transform hover:scale-[1.02]"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>

          {/* Footer */}
          <div className="pt-16 flex items-center justify-center gap-6 text-amber-100/10 text-[10px] uppercase tracking-[0.4em] font-bold">
            <p>© 2026 New Sirini Hotel & Restaurant</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;