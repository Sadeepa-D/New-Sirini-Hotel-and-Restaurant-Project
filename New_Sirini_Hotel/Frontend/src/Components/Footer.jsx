import React from "react";
import { Facebook, Instagram, MapPin, Phone, Mail, ChevronRight, Hotel } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer id="contact" className="bg-black/95 border-t border-white/10 text-white">
      {/* Main footer grid */}
      <div className="w-full px-6 sm:px-10 pt-5 pb-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

          {/* ── Brand / About ── */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <Hotel size={15} className="text-yellow-500" />
              </div>
              <h2 className="text-white font-serif text-base italic tracking-wide leading-tight">
                New Sirini Hotel
              </h2>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
              Located in Kamburupitiya, Sri Lanka — offering comfortable rooms,
              quality dining, liquor services, and event spaces for weddings and
              celebrations.
            </p>
            {/* Social links */}
            <div className="flex gap-2">
              <a
                href="https://www.facebook.com/share/1CrEf5Ksbq/"
                className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-yellow-500 hover:border-yellow-500 hover:text-black text-white transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook size={14} />
              </a>
              <a
                href="#"
                className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-yellow-500 hover:border-yellow-500 hover:text-black text-white transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={14} />
              </a>
            </div>
          </div>

          {/* ── Discover ── */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-yellow-500"></span>
              Discover
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Reception", to: "/reception" },
                { label: "Rooms", to: "/rooms" },
                { label: "Restaurant", to: "/restaurant" },
                { label: "Liquor", to: "/liquor" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors duration-200 text-sm !no-underline"
                  >
                    <ChevronRight
                      size={14}
                      className="text-yellow-500/50 group-hover:text-yellow-500 group-hover:translate-x-0.5 transition-all duration-200"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-yellow-500"></span>
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="p-1.5 bg-yellow-500/10 rounded-lg shrink-0 mt-0.5">
                  <MapPin size={14} className="text-yellow-500" />
                </div>
                <span className="text-gray-400 text-sm leading-relaxed">
                  Kirinda Road, New Sirini Hotel, Kamburupitiya
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1.5 bg-yellow-500/10 rounded-lg shrink-0">
                  <Phone size={14} className="text-yellow-500" />
                </div>
                <a
                  href="tel:0770161835"
                  className="text-gray-400 hover:text-yellow-500 transition-colors text-sm !no-underline"
                >
                  0770161835
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1.5 bg-yellow-500/10 rounded-lg shrink-0">
                  <Mail size={14} className="text-yellow-500" />
                </div>
                <a
                  href="mailto:newsirini@gmail.com"
                  className="text-gray-400 hover:text-yellow-500 transition-colors text-sm !no-underline"
                >
                  newsirini@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">
            © 2026 New Sirini Hotel. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs italic">
            Kamburupitiya, Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
