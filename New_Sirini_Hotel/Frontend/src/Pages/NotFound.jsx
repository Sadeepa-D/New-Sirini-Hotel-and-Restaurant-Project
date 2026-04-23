import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Map, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-neutral-900 to-amber-950 px-4 overflow-hidden">
      
      {/* Decorative Background Grid (Matching your Login page) */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 pointer-events-none"></div>

      {/* Floating Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-[120px]"></div>

      <div className="max-w-2xl w-full text-center relative z-10">
        
        {/* Large 404 Header */}
        <div className="relative inline-block mb-8">
          <h1 className="text-[12rem] md:text-[16rem] font-black text-white/5 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex flex-col items-center justify-center mt-8 md:mt-12">
            <div className="bg-amber-500/10 p-4 rounded-3xl backdrop-blur-md border border-amber-500/20 mb-4 animate-bounce">
              <Search size={48} className="text-amber-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-white tracking-wide">
              Lost in the Corridor?
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 max-w-md mx-auto">
          <p className="text-amber-100/60 text-lg">
            It seems the room you are looking for has been moved or doesn't exist in the <span className="text-amber-400 font-semibold">New Sirini Hotel</span> registry.
          </p>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-amber-900/20"
            >
              <Home size={20} />
              Return Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-amber-100/80 border border-amber-900/30 font-bold py-4 px-8 rounded-2xl backdrop-blur-md transition-all"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>

          {/* Sitemaps / Help Link */}
          <div className="pt-12 flex items-center justify-center gap-6 text-amber-100/30 text-sm">
            <Link to="/support" className="hover:text-amber-400 transition-colors flex items-center gap-2">
              <Map size={14} /> Concierge Support
            </Link>
            <span className="w-1 h-1 bg-amber-900/50 rounded-full"></span>
            <p>© 2026 New Sirini Hotel</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;