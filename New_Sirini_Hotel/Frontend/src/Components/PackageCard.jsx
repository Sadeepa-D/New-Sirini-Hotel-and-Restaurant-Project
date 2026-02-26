import React,{ useState } from 'react'
import { ArrowRight} from 'lucide-react'

function PackageCard({ pkg }) {
  const [hovered, setHovered] = useState(false)
  const Icon = pkg.icon

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{ height: '320px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background Image */}
      <img
        src={pkg.bg}
        alt={pkg.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${pkg.gradient} transition-opacity duration-300`} />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />

      {/* Tag badge */}
      <div
        className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest"
        style={{ backgroundColor: pkg.accent, color: '#1a1a1a' }}
      >
        {pkg.tag}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${pkg.accent}22`, border: `1.5px solid ${pkg.accent}66` }}
        >
          <Icon size={22} color={pkg.accent} />
        </div>

        {/* Bottom content */}
        <div>
          <h3 className="text-white font-bold text-2xl mb-4 drop-shadow-lg tracking-tight">
            {pkg.title}
          </h3>
          <button
            className="flex items-center gap-2 font-bold text-sm px-5 py-3 rounded-xl transition-all duration-300 group-hover:gap-3 active:scale-95"
            style={{
              backgroundColor: pkg.accent,
              color: '#1a1a1a',
              boxShadow: hovered ? `0 0 24px ${pkg.accent}88` : 'none',
            }}
          >
            View Details
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  )
}
export default PackageCard