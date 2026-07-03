import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon, Clock, Info, Sparkles, Star, Cloud } from "lucide-react";

const RoomPackageInfo = () => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      setIsVisible(entries[0].isIntersecting);
    }, { threshold: 0.1 });
    
    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div 
      ref={domRef}
      className={`bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 mb-10 mt-4 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(251,146,60,0.08)] hover:border-orange-200/50 transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
    >
      {/* Decorative animated background blobs */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-50/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-orange-100/80 rounded-full blur-[40px] opacity-60 pointer-events-none transition-transform group-hover:scale-125 duration-1000 ease-in-out" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-100/80 rounded-full blur-[40px] opacity-60 pointer-events-none transition-transform group-hover:scale-125 duration-1000 ease-in-out" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-50/50 rounded-full blur-[50px] opacity-40 pointer-events-none" />

      {/* Floating Icons */}
      <Star size={12} className="absolute top-10 right-32 text-orange-300 opacity-60 animate-pulse pointer-events-none" />
      <Sparkles size={16} className="absolute bottom-12 left-1/3 text-blue-300 opacity-60 animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
      <Cloud size={20} className="absolute top-1/3 left-8 text-blue-200 opacity-30 animate-pulse pointer-events-none" style={{ animationDelay: '0.5s' }} />

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 rounded-2xl shadow-sm border border-orange-100/50 relative overflow-hidden group-hover:shadow-md transition-shadow">
          <div className="absolute inset-0 bg-white/40 blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <Info size={24} className="relative z-10" />
        </div>
        <div>
          <h2 className="text-2xl font-serif italic text-gray-900 tracking-tight flex items-center gap-2">
            Our Rooms Packages
            <Sparkles size={18} className="text-orange-400" />
          </h2>
          <p className="text-[10px] text-orange-500 uppercase tracking-[0.2em] font-bold mt-1">
            Available booking options in our hotel
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Day Package */}
        <div className="flex items-start gap-4 p-6 rounded-[1.5rem] bg-gradient-to-br from-orange-50/80 to-white border border-orange-100/60 hover:border-orange-300/60 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-500 group/card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover/card:scale-150 duration-700" />
          
          <div className="p-3.5 bg-white text-orange-500 rounded-2xl shadow-sm border border-orange-50 relative z-10 group-hover/card:rotate-12 transition-transform duration-500">
            <Sun size={26} className="drop-shadow-sm" />
          </div>
          <div className="flex-1 relative z-10 mt-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover/card:text-orange-600 transition-colors">
              Day Package
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed font-medium">
              A quick rest or layover during the day.
            </p>
            <div className="flex items-center gap-2 text-orange-600 bg-orange-100/60 w-fit px-3.5 py-2 rounded-xl border border-orange-100/50 shadow-sm">
              <Clock size={14} className="animate-pulse" />
              <span className="text-xs font-bold tracking-wide">
                12:00 PM - 3:00 PM
              </span>
            </div>
          </div>
        </div>

        {/* Night Package */}
        <div className="flex items-start gap-4 p-6 rounded-[1.5rem] bg-gradient-to-br from-blue-50/80 to-white border border-blue-100/60 hover:border-blue-300/60 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-500 group/card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover/card:scale-150 duration-700" />
          
          <div className="p-3.5 bg-white text-blue-500 rounded-2xl shadow-sm border border-blue-50 relative z-10 group-hover/card:-rotate-12 transition-transform duration-500">
            <Moon size={26} className="drop-shadow-sm" />
          </div>
          <div className="flex-1 relative z-10 mt-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover/card:text-blue-600 transition-colors">
              Night Package
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed font-medium">
              Full accommodation for a relaxing night.
            </p>
            <div className="flex items-center gap-2 text-blue-600 bg-blue-100/60 w-fit px-3.5 py-2 rounded-xl border border-blue-100/50 shadow-sm">
              <Clock size={14} className="animate-pulse" />
              <span className="text-xs font-bold tracking-wide">
                4:00 PM - 10:00 AM{" "}
                <span className="text-[10px] uppercase opacity-80 ml-1 bg-blue-200/50 px-1.5 py-0.5 rounded-md">
                  Next Day
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPackageInfo;
