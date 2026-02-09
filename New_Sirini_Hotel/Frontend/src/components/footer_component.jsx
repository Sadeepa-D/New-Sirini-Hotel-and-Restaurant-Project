import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { MdLocationOn, MdEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { Link } from "react-router-dom"; // <-- Import Link
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-10 py-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

        <div>
          <h2 className="text-4xl font-serif leading-tight mb-4">
            New Sirini<br />Hotel
          </h2>

          <p className="text-gray-300 text-m leading-relaxed mb-4">
            New Sirini Hotel in Kamburupitiya, Sri Lanka offers
            comfortable rooms, quality dining, liquor services,
            and event spaces for weddings and celebrations.
          </p>

          <div className="flex gap-4 text-orange-500 text-lg">
            <FaFacebookF className="cursor-pointer hover:text-white" />
            <FaInstagram className="cursor-pointer hover:text-white" />
          </div>
        </div>

        {/* Discover */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Discover</h3>
          <ul className="space-y-2 text-gray-300 text-m">
            <li>
              <Link to="/receptionhall" className="hover:text-orange-400 cursor-pointer no-underline">
                Reception
              </Link>
            </li>
            <li>
              <Link to="/rooms" className="hover:text-orange-400 cursor-pointer no-underline">
                Rooms
              </Link>
            </li>
            <li>
              <Link to="/resturant" className="hover:text-orange-400 cursor-pointer no-underline">
                Restaurant
              </Link>
            </li>
            <li>
              <Link to="/LiquorShop" className="hover:text-orange-400 cursor-pointer no-underline">
                Liquor
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact us */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-gray-300 text-m">

            <li className="flex items-start gap-3">
              <MdLocationOn className="text-orange-500 text-lg mt-1" />
              Kamburupitiya, Matara, Sri Lanka.
            </li>

            <li className="flex items-start gap-3">
              <FiPhone className="text-orange-500 text-lg mt-1" />
              041-05684726
            </li>

            <li className="flex items-start gap-3">
              <MdEmail className="text-orange-500 text-lg mt-1" />
              newsirini@gmail.com
            </li>

          </ul>
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-m text-gray-400">
        © 2026 New Sirini Hotel. All rights reserved.
      </div>
    </footer>
  );
}
