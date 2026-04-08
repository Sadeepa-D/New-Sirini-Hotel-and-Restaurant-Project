import React from "react";
import { ArrowRight, Heart, Cake, Briefcase } from "lucide-react";
import {
  UtensilsCrossed,
  Music2,
  Flower2,
  Camera,
  ParkingCircle,
} from "lucide-react";
import BookingForm from "../Components/BookingForm";
import ServiceCard from "../Components/ServiceCard";
import PackageCard from "../Components/PackageCard";

const services = [
  {
    id: 'catering',
    title: 'Catering',
    description: 'World-class chefs for every occasion',
    icon: UtensilsCrossed,
    img: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80',
    color: '#f59e0b',
  },
  {
    id: 'sounds',
    title: 'Sounds',
    description: 'Premium audio & live entertainment',
    icon: Music2,
    img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
    color: '#f59e0b',
  },
  {
    id: 'decorations',
    title: 'Decorations',
    description: 'Stunning floral & themed setups',
    icon: Flower2,
    img: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400&q=80',
    color: '#f59e0b',
  },
  {
    id: 'photography',
    title: 'Photography',
    description: 'Capture every precious moment',
    icon: Camera,
    img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
    color: '#f59e0b',
  },
  {
    id: 'parking',
    title: 'Parking',
    description: 'Valet & managed parking solutions',
    icon: ParkingCircle,
    img: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&q=80',
    color: '#f59e0b',
  },
]

const packages = [
  {
    id: "wedding",
    title: "Wedding Packages",
    icon: Heart,
    gradient: "from-rose-900/80 via-rose-800/60 to-transparent",
    accent: "#f59e0b",
    bg: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    tag: "Most Popular",
  },
  {
    id: "birthday",
    title: "Birthday Packages",
    icon: Cake,
    gradient: "from-amber-900/80 via-amber-800/60 to-transparent",
    accent: "#f59e0b",
    bg: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
    tag: "Fan Favourite",
  },
  {
    id: "business",
    title: "Business Packages",
    icon: Briefcase,
    gradient: "from-slate-900/80 via-slate-800/60 to-transparent",
    accent: "#f59e0b",
    bg: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
    tag: "Corporate",
  },
];

function Reception() {
  return (
    <>
      <section
        className="w-full py-20 px-6"
        style={{
          background: "linear-gradient(135deg, #fdfcfb 0%, #f5f0e8 100%)",
          fontFamily: "'Georgia', 'Times New Roman', serif",
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <p
              className="uppercase tracking-[0.3em] text-sm font-semibold mb-3"
              style={{ color: "#f59e0b" }}
            >
              Tailored for Every Celebration
            </p>
            <h2
              className="text-5xl md:text-6xl font-normal"
              style={{ color: "#1a1209", letterSpacing: "-0.02em" }}
            >
              Our Packages
            </h2>
            <div
              className="mx-auto mt-5 h-0.5 w-20 rounded-full"
              style={{ backgroundColor: "#f59e0b" }}
            />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="w-full py-10 px-6"
        style={{
          background: "linear-gradient(135deg, #fdfcfb 0%, #f5f0e8 100%)",
          fontFamily: "'Georgia', 'Times New Roman', serif",
        }}
      >
        <div className="max-w-7xl max-h-full mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p
              className="uppercase tracking-[0.3em] text-xs font-semibold mb-3"
              style={{ color: "#f59e0b" }}
            >
              Everything You Need
            </p>
            <h2
              className="text-5xl md:text-6xl font-normal"
              style={{ color: "#1a1209", letterSpacing: "-0.02em" }}
            >
              Our Services
            </h2>
            <div
              className="mx-auto mt-5 h-0.5 w-20 rounded-full"
              style={{ backgroundColor: "#f59e0b" }}
            />
          </div>

          {/* Services Grid Container */}
          <div
            className="rounded-3xl p-8"
            style={{
              background: "linear-gradient(135deg, #e8e0d4 0%, #d9d0c4 100%)",
              boxShadow:
                "inset 0 2px 12px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.08)",
            }}
          >
            {/* Top row - 3 items */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {services.slice(0, 3).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Bottom row - 2 items centered */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:w-2/3">
              {services.slice(3).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <BookingForm />
      </section>
    </>
  );
}

export default Reception;
