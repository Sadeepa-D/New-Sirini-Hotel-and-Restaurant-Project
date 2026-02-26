import React, { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'



function ServiceCard({ service }) {
  const [hovered, setHovered] = useState(false)
  const Icon = service.icon

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-400"
      style={{
        background: '#fff',
        boxShadow: hovered
          ? '0 20px 48px rgba(0,0,0,0.13)'
          : '0 2px 12px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        border: `1.5px solid ${hovered ? '#f59e0b44' : '#e8e0d4'}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image strip */}
      <div className="relative h-60 overflow-hidden">
        <img
          src={service.img}
          alt={service.title}
          className="w-full h-full object-cover"
          style={{
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.6s ease',
          }}
        />
        {/* Dark scrim */}
        <div
          className="absolute inset-0"
          style={{
            background: hovered
              ? 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.55))'
              : 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.35))',
            transition: 'all 0.35s ease',
          }}
        />

        {/* Arrow icon top right */}
        <div
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            backgroundColor: hovered ? '#f59e0b' : 'rgba(255,255,255,0.2)',
            transform: hovered ? 'rotate(0deg) scale(1.1)' : 'rotate(-45deg) scale(1)',
          }}
        >
          <ArrowUpRight size={15} color={hovered ? '#1a1209' : '#fff'} strokeWidth={2.5} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex items-start gap-3">
        {/* Icon badge */}
        <div
          className="flex-shrink-0 w-15 h-15 rounded-xl flex items-center justify-center mt-0.5 transition-all duration-300"
          style={{
            backgroundColor: hovered ? '#f59e0b' : '#f5f0e8',
            boxShadow: hovered ? '0 4px 14px rgba(245,158,11,0.35)' : 'none',
          }}
        >
          <Icon
            size={18}
            color={hovered ? '#1a1209' : '#b07d2e'}
            strokeWidth={2.2}
          />
        </div>

        <div>
          <h3
            className="font-bold text-xl leading-tight mb-1 transition-colors duration-300"
            style={{
              color: hovered ? '#b07d2e' : '#1a1209',
              fontFamily: "'Georgia', serif",
            }}
          >
            {service.title}
          </h3>
          <p
            className="text-xs leading-snug transition-colors duration-300"
            style={{ color: hovered ? '#6b5c3e' : '#9e8b72' }}
          >
            {service.description}
          </p>
        </div>
      </div>

      {/* Bottom amber bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 transition-all duration-500"
        style={{
          width: hovered ? '100%' : '0%',
          backgroundColor: '#f59e0b',
        }}
      />
    </div>
  )
}
export default ServiceCard