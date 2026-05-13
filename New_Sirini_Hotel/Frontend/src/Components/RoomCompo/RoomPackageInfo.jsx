import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon, Clock, Info } from "lucide-react";

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
      className={`bg-white rounded-2xl p-6 shadow-sm border border-orange-100 mb-10 mt-4 relative overflow-hidden group hover:shadow-md transition-all duration-2000 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
    >
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none transition-transform group-hover:scale-110 duration-700" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none transition-transform group-hover:scale-110 duration-700" />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 rounded-xl shadow-sm border border-orange-100/50">
          <Info size={22} />
        </div>
        <div>
          <h2 className="text-xl font-serif italic text-gray-900 tracking-tight">
            Our Rooms Packages
          </h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">
            Available booking options
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Short Stay Package */}
        <div className="flex items-start gap-4 p-5 rounded-[1.25rem] bg-gradient-to-br from-orange-50/50 to-white border border-orange-100/60 hover:border-orange-200 hover:shadow-sm transition-all duration-300">
          <div className="p-3 bg-white text-orange-500 rounded-2xl shadow-sm border border-orange-50">
            <Sun size={24} className="drop-shadow-sm" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Short Stay
            </h3>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              A quick rest or layover during the day.
            </p>
            <div className="flex items-center gap-2 text-orange-600 bg-orange-100/50 w-fit px-3 py-1.5 rounded-lg border border-orange-100/50">
              <Clock size={14} />
              <span className="text-xs font-bold tracking-wide">
                12:00 PM - 3:00 PM
              </span>
            </div>
          </div>
        </div>

        {/* Overnight Stay Package */}
        <div className="flex items-start gap-4 p-5 rounded-[1.25rem] bg-gradient-to-br from-blue-50/50 to-white border border-blue-100/60 hover:border-blue-200 hover:shadow-sm transition-all duration-300">
          <div className="p-3 bg-white text-blue-500 rounded-2xl shadow-sm border border-blue-50">
            <Moon size={24} className="drop-shadow-sm" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Overnight Stay
            </h3>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              Full accommodation for a relaxing night.
            </p>
            <div className="flex items-center gap-2 text-blue-600 bg-blue-100/50 w-fit px-3 py-1.5 rounded-lg border border-blue-100/50">
              <Clock size={14} />
              <span className="text-xs font-bold tracking-wide">
                4:00 PM - 10:00 AM{" "}
                <span className="text-[10px] uppercase opacity-80 ml-1">
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
