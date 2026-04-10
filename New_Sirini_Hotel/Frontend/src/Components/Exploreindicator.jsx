import React from "react";
import { ChevronsDown } from "lucide-react";

const Exploreindicator = () => {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer animate-bounce z-20 group">
      <span className="font-cormorant text-base sm:text-lg uppercase tracking-[0.3em] mb-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-colors group-hover:text-amber-200">
        Explore
      </span>
      <ChevronsDown
        size={36}
        strokeWidth={1}
        className="text-white transition-colors group-hover:text-amber-400"
      />
    </div>
  );
};
export default Exploreindicator;
