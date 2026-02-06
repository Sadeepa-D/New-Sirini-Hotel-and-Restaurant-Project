import React from "react";
import logo from "../assets/logo.png";

export default function FooterComponent() {
  return (
    <footer className="bg-[#1E272C] text-white [&_*]:text-white">

      {/* Main Row */}
      <div className="flex flex-wrap justify-between gap-[5%] px-[5%] py-8">

        {/* Logo */}
        <div className="flex items-center basis-1/4 min-w-[180px] mb-5">
          <img
            src={logo}
            alt="Logo"
            className="max-w-[200px] h-auto rounded-lg"
          />
        </div>

        {/* Company */}
        <div className="flex-1 min-w-[180px] mb-5">
          <h4 className="relative text-[20px] font-medium mb-4 after:content-[''] after:absolute after:top-[30px] after:left-0 after:w-20 after:h-[2px] after:bg-white">
            Company
          </h4>

          <ul className="space-y-2">
            {[
              ["Home", "/home"],
              ["About Us", "/aboutus"],
              ["Contact Us", "/contact"],
              ["Restaurant", "/resturant"],
              ["Liquor Shop", "/LiquorShop"],
            ].map(([label, link]) => (
              <li key={label}>
                <a
                  href={link}
                  className="inline-block text-[16px] opacity-85 transition-all hover:translate-x-1 hover:scale-105 hover:opacity-100"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow Us */}
        <div className="flex-1 min-w-[180px] mb-5">
          <h4 className="relative text-[20px] font-medium mb-4 after:content-[''] after:absolute after:top-[30px] after:left-0 after:w-20 after:h-[2px] after:bg-white">
            Follow Us
          </h4>

          <div className="flex gap-3">
            {["facebook-f", "twitter", "instagram", "linkedin-in"].map(icon => (
              <a
                key={icon}
                href="#"
                className="text-xl transition-transform transition-colors hover:scale-125 hover:text-[#1da1f2]"
              >
                <i className={`fab fa-${icon}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 text-center text-[13px] py-4 px-[5%]">
        © 2026 by New Sirini Hotel & Restuarant. All rights reserved.
      </div>
    </footer>
  );
}
