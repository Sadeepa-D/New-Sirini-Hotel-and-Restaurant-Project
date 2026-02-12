import React from "react";
import logo from "../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-black py-5">
      <div className="w-full px-4 flex items-center gap-2">
        <img
          src={logo}
          alt="New Sirini Hotel Logo"
          className="h-20 object-contain"
        />
        <h1 className="text-white font-serif text-2xl italic">
          New Sirini Hotel
        </h1>

        <nav className="ml-auto flex items-center gap-12">
          <Link
            to="/main"
            className="text-white hover:text-yellow-500 transition-colors hover:scale-110"
          >
            Home
          </Link>
          <Link
            to="/services"
            className="text-white hover:text-yellow-600 transition-colors hover:scale-110"
          >
            Services
          </Link>
          <Link
            to="/gallery"
            className="text-white hover:text-yellow-600 transition-colors hover:scale-110"
          >
            Gallery
          </Link>
          <Link
            to="/about"
            className="text-white hover:text-yellow-600 transition-colors hover:scale-110"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-white hover:text-yellow-600 transition-colors hover:scale-110"
          >
            Contact Us
          </Link>
        </nav>

        <div className="ml-20 flex items-center gap-5">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-1.5 border border-white text-white rounded hover:bg-orange-400 hover:text-black transition-colors hover:border-orange-400"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-1.5 border border-white text-white rounded hover:bg-orange-400 hover:text-black transition-colors hover:border-orange-400"
          >
            Sign up
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
