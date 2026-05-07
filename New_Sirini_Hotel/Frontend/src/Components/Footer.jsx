import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer id="contact" className="bg-black text-white px-8 py-1">
      <div className="max-w-7xl mx-auto">
        {/* main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-4 mt-4">
          {/* About Section */}
          <div>
            <h2 className="text-white font-serif text-4xl mb-4 leading-tight">
              New Sirini
              <br />
              Hotel
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              New Sirni Hotel in Kamburupitiya, Sri Lanka offers comfortable
              rooms, quality dining, liquor services, and event spaces for
              weddings and celebrations
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/share/1CrEf5Ksbq/"
                className="bg-transparent border border-white rounded-full p-2 hover:bg-yellow-500 transition-all duration-300 hover:scale-110 group"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-4 h-4 text-white group-hover:!text-yellow-500" />
              </a>
              <a
                href="#"
                className="bg-transparent border border-white rounded-full p-2 hover:bg-yellow-500 transition-all duration-300 hover:scale-110 group"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4 text-white group-hover:!text-yellow-500" />
              </a>
            </div>
          </div>

          {/* Discover Section */}
          <div className="md:ml-25">
            <h3 className="text-white font-bold text-xl mb-6">Discover</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/reception"
                  className="!text-gray-300 !no-underline hover:!text-yellow-500 transition-all duration-300 text-base inline-block hover:scale-110"
                >
                  Reception
                </Link>
              </li>
              <li>
                <Link
                  to="/rooms"
                  className="!text-gray-300 !no-underline hover:!text-yellow-500 transition-all duration-300 text-base inline-block hover:scale-110"
                >
                  Rooms
                </Link>
              </li>
              <li>
                <Link
                  to="/restaurant"
                  className="!text-gray-300 !no-underline hover:!text-yellow-500 transition-all duration-300 text-base inline-block hover:scale-110"
                >
                  Restaurant
                </Link>
              </li>
              <li>
                <Link
                  to="/liquor"
                  className="!text-gray-300 !no-underline hover:!text-yellow-500 transition-all duration-300 text-base inline-block hover:scale-110"
                >
                  Liquor
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-white font-bold text-xl mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MdLocationOn className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <span className="text-gray-300 text-base">
                  Kirinda road,New Sirini Hotel Kamburupitiya
                </span>
              </li>
              <li className="flex items-center gap-3">
                <MdPhone className="w-5 h-5 text-yellow-500 shrink-0" />
                <a
                  href="tel:0770161835"
                  className="!text-gray-300 !no-underline hover:!text-yellow-500 transition-colors text-base"
                >
                  0770161835
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MdEmail className="w-5 h-5 text-yellow-500 shrink-0" />
                <a
                  href="mailto:newsirini@gmail.com"
                  className="!text-gray-300 !no-underline hover:!text-yellow-500 transition-colors text-base"
                >
                  newsirini@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider line */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Copyright Section */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © 2026 New Sirini Hotel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
