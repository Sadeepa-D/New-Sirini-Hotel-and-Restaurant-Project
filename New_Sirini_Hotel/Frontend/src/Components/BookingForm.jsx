import React, { useState } from 'react'
import { UtensilsCrossed, Music2, Flower2, Camera, CalendarDays, Send } from 'lucide-react'

const serviceFields = [
  { id: 'catering', label: 'Catering', icon: UtensilsCrossed, placeholder: 'e.g. 100 guests' },
  { id: 'sounds', label: 'Sounds', icon: Music2, placeholder: 'e.g. DJ / Live Band' },
  { id: 'decoration', label: 'Decoration', icon: Flower2, placeholder: 'e.g. Floral theme' },
  { id: 'photography', label: 'Photography', icon: Camera, placeholder: 'e.g. 8 hours' },
]

function BookingForm() {
  const [formData, setFormData] = useState({
    catering: '',
    sounds: '',
    decoration: '',
    photography: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [focused, setFocused] = useState(null)

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section
      className="w-full py-20 px-6"
      style={{
        background: 'linear-gradient(135deg, #fdfcfb 0%, #f5f0e8 100%)',
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="uppercase tracking-[0.3em] text-xs font-semibold mb-3"
            style={{ color: '#f59e0b' }}
          >
            Reserve Your Date
          </p>
          <h2
            className="text-5xl font-normal"
            style={{ color: '#1a1209', letterSpacing: '-0.02em' }}
          >
            Other Services Form
          </h2>
          <div
            className="mx-auto mt-5 h-0.5 w-20 rounded-full"
            style={{ backgroundColor: '#f59e0b' }}
          />
        </div>

        {/* Form Card */}
        <div
          className="rounded-3xl p-8 md:p-10"
          style={{
            background: 'linear-gradient(135deg, #e8e0d4 0%, #d9d0c4 100%)',
            boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.06), 0 8px 40px rgba(0,0,0,0.10)',
          }}
        >
          {/* <div className="flex rounded-xl overflow-hidden mb-8 border border-amber-300/40">
            {['Appointment', 'Services'].map((tab, i) => (
              <button
                key={tab}
                className="flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-200"
                style={{
                  backgroundColor: i === 0 ? '#f59e0b' : 'transparent',
                  color: i === 0 ? '#1a1209' : '#6b5c3e',
                }}
              >
                {tab}
              </button>
            ))}
          </div> */}
          

          <form onSubmit={handleSubmit}>
            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {serviceFields.map(({ id, label, icon: Icon, placeholder }) => (
                <div key={id}>
                  <label
                    className="flex items-center gap-2 text-sm font-bold mb-2 uppercase tracking-wider"
                    style={{ color: '#3d2f1a' }}
                  >
                    <Icon size={14} color="#f59e0b" strokeWidth={2.5} />
                    {label}
                  </label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={formData[id]}
                    onChange={(e) => handleChange(id, e.target.value)}
                    onFocus={() => setFocused(id)}
                    onBlur={() => setFocused(null)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      background: focused === id ? '#fff' : 'rgba(255,255,255,0.7)',
                      border: `1.5px solid ${focused === id ? '#f59e0b' : 'transparent'}`,
                      boxShadow: focused === id ? '0 0 0 3px rgba(245,158,11,0.15)' : 'none',
                      color: '#1a1209',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Date Picker Row */}
            <div className="mb-8">
              <label
                className="flex items-center gap-2 text-sm font-bold mb-2 uppercase tracking-wider"
                style={{ color: '#3d2f1a' }}
              >
                <CalendarDays size={14} color="#f59e0b" strokeWidth={2.5} />
                Event Date
              </label>
              <input
                type="date"
                onFocus={() => setFocused('date')}
                onBlur={() => setFocused(null)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: focused === 'date' ? '#fff' : 'rgba(255,255,255,0.7)',
                  border: `1.5px solid ${focused === 'date' ? '#f59e0b' : 'transparent'}`,
                  boxShadow: focused === 'date' ? '0 0 0 3px rgba(245,158,11,0.15)' : 'none',
                  color: '#1a1209',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base uppercase tracking-widest transition-all duration-300 active:scale-95"
              style={{
                backgroundColor: submitted ? '#22c55e' : '#f59e0b',
                color: '#1a1209',
                boxShadow: submitted
                  ? '0 0 24px rgba(34,197,94,0.4)'
                  : '0 4px 20px rgba(245,158,11,0.35)',
                transform: submitted ? 'scale(0.98)' : 'scale(1)',
              }}
            >
              <Send size={18} strokeWidth={2.5} />
              {submitted ? 'Booking Submitted!' : 'Submit Booking'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default BookingForm