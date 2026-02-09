import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function HeaderComponent() {
  return (

    <header className="w-full bg-black border border-cyan-400">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-24">

          {/* Left Section */}
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="New Sirini Hotel"
              className="w-14 h-14 object-contain"
            />
            <h1 className="text-white text-2xl font-serif tracking-wide">
              New Sirini Hotel
            </h1>
          </div>

          {/* Navigation */}
          <nav>
            <ul className="flex items-center gap-10 text-lg font-medium">
  <li>
    <Link
      to="/homepage"
      className="text-white hover:text-orange-400 cursor-pointer no-underline " //hover:text-orange-400 cursor-pointer no-underline
    >
      Home
    </Link>
  </li>

  <li>
    <Link
      to="/receptionhall"
      className="text-white no-underline hover:text-yellow-400 cursor-pointer"
    >
      Reception Hall
    </Link>
  </li>

  <li>
    <Link
      to="/resturant"
      className="text-white no-underline hover:text-yellow-400 cursor-pointer"
    >
      Resturant
    </Link>
  </li>

  <li>
    <Link
      to="/rooms"
      className="text-white no-underline hover:text-yellow-400 cursor-pointer"
    >
      Rooms
    </Link>
  </li>

  <li>
    <Link
      to="/LiquorShop"
      className="text-white no-underline hover:text-yellow-400 cursor-pointer"
    >
      Liquor Shop
    </Link>
  </li>
</ul>

          </nav>

        </div>
      </div>
    </header>
  )
}
