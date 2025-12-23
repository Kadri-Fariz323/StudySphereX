import { Link } from "react-router-dom";
import logo from '../../assets/logo.png'
import { FaBars } from "react-icons/fa";
import { useRef, useState } from "react";
import { FaWindowClose } from "react-icons/fa";

export const HomeNav = () => {
  const [navMenu, setNavMenu] = useState(false);
  const menuRef = useRef();

  const handleNavMenu = () => {
    setNavMenu((prev) => !prev);
  };

  return (
    <div className="HomeNav px-4 md:px-12 lg:px-20 flex items-center bg-transparent rounded-xl justify-between md:h-[65px] lg:h-[70px]">
      {/* LOGO */}
      <div className="flex-shrink-0">
        <img src={logo} alt="Logo" className="w-30 md:w-40 lg:w-44 h-auto" />
      </div>

      {/* Nav Links */}
      <div className="w-full hidden sm:block">
        <ul className="flex items-center justify-center gap-10 text-sm font-semibold text-gray-700">
          {/* Home */}
          <li className="relative group lg:text-[16px] ">
            <Link to="/" className="hover:text-blue-600  transition-colors">
              Home
              <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>

          {/* About Us */}
          <li className="relative group lg:text-[16px]">
            <Link to="/courses" className="hover:text-blue-600 transition-colors">
             Courses
              <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>

          {/* Contact Us */}
          <li className="relative group lg:text-[16px]">
            <Link
              to="/contact"
              className="hover:text-blue-600 transition-colors"
            >
              Contact Us
              <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Links */}
      <div
        className={`${
          navMenu ? "block" : "hidden"
        } w-fit whitespace-nowrap absolute top-[80px] left-1/2 transform -translate-x-1/2 bg-white px-10 py-4 rounded-4xl shadow-lg z-50 transition-all duration-300`}
        ref={menuRef}
      >
        <ul className="flex items-center justify-center gap-10 text-sm font-semibold text-gray-700">
          {/* Home */}
          <li className="relative group ">
            <Link to="/" className="hover:text-blue-600 text transition-colors">
              Home
              <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>

          {/* About Us */}
          <li className="relative group ">
            <Link to="/about" className="hover:text-blue-600 transition-colors">
              Courses
              <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>

          {/* Contact Us */}
          <li className="relative group ">
            <Link
              to="/contact"
              className="hover:text-blue-600 transition-colors"
            >
              Contact Us
              <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sm:hidden flex items-center justify-center">
        {navMenu === false ? (
          <FaBars
            className="text-2xl transition-transform duration-300 transform hover:scale-110"
            onClick={handleNavMenu}
          />
        ) : (
          <FaWindowClose
            className="text-2xl text-red-500 filter drop-shadow-[0_0_10px_rgba(248,113,113,0.8)] hover:drop-shadow-[0_0_15px_rgba(248,113,113,1)] transition-transform duration-300 transform hover:scale-110"
            onClick={handleNavMenu}
          />
        )}
      </div>

      {/* Login Button */}
      <Link to="/login">
        <button
          className="cursor-pointer font-bold transition-all bg-blue-500 text-white px-6 py-2 rounded-lg
          border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
          active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
        >
          Login
        </button>
      </Link>
      
    </div>
  );
};
