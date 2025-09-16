import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-16 py-3 md:py-4 w-full bg-white mt-1 md:mt-2 relative z-50">
      <Link to="/" className="text-xl font-bold text-gray-900">
      F⚒W
      </Link>
      
      <div className="flex items-center space-x-4">
        <nav className={`max-md:fixed max-md:top-0 max-md:left-0 max-md:h-full max-md:pt-20 items-center justify-start max-md:justify-center transition-all duration-300 ease-in-out bg-white/95 backdrop-blur-md flex-col md:flex-row flex gap-8 text-gray-900 text-sm font-normal z-40 ${
          isMenuOpen ? 'max-md:w-full max-md:opacity-100' : 'max-md:w-0 max-md:opacity-0'
        } max-md:overflow-hidden`}>
          <Link 
            className="hover:text-indigo-600 transition-colors max-md:text-lg max-md:font-medium max-md:py-3 max-md:px-6 max-md:rounded-lg max-md:hover:bg-gray-100" 
            to="/projets"
            onClick={closeMenu}
          >
            Projets
          </Link>
          <Link 
            className="hover:text-indigo-600 transition-colors max-md:text-lg max-md:font-medium max-md:py-3 max-md:px-6 max-md:rounded-lg max-md:hover:bg-gray-100" 
            to="/apropos"
            onClick={closeMenu}
          >
            Apropos
          </Link>
          <Link 
            className="hover:text-indigo-600 transition-colors max-md:text-lg max-md:font-medium max-md:py-3 max-md:px-6 max-md:rounded-lg max-md:hover:bg-gray-100" 
            to="/contact"
            onClick={closeMenu}
          >
            Contact
          </Link>
          <Link 
            className="hover:text-indigo-600 transition-colors max-md:text-lg max-md:font-medium max-md:py-3 max-md:px-6 max-md:rounded-lg max-md:hover:bg-gray-100" 
            to="/blog"
            onClick={closeMenu}
          >
            Blog
          </Link>
          <button onClick={closeMenu} className="md:hidden text-gray-600 mt-8 p-3 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </nav>
        
        <button className="size-8 flex items-center justify-center hover:bg-gray-100 transition">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 10.39a2.889 2.889 0 1 0 0-5.779 2.889 2.889 0 0 0 0 5.778M7.5 1v.722m0 11.556V14M1 7.5h.722m11.556 0h.723m-1.904-4.596-.511.51m-8.172 8.171-.51.511m-.001-9.192.51.51m8.173 8.171.51.511"
              stroke="#353535" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        
        <button onClick={toggleMenu} className="md:hidden text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;