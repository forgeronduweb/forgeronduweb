import React, { useState } from "react";
import { Link } from "react-router-dom";
import StatusIndicator from "./StatusIndicator";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header 
      className="flex items-center justify-between px-4 md:px-16 py-3 md:py-4 w-full mt-1 md:mt-2 relative z-50 transition-colors duration-300"
      style={{ backgroundColor: isDark ? '#000000' : '#ffffff' }}
    >
      <Link 
        to="/" 
        className="text-xl font-bold"
        style={{ color: isDark ? '#ffffff' : '#000000' }}
      >
      F⚒W
      </Link>
      
      <div className="flex items-center space-x-4">
        <nav 
          className={`max-md:fixed max-md:top-0 max-md:left-0 max-md:h-full max-md:pt-20 items-center justify-start max-md:justify-center transition-all duration-300 ease-in-out backdrop-blur-md flex-col md:flex-row flex gap-8 text-sm font-normal z-40 ${
            isMenuOpen ? 'max-md:w-full max-md:opacity-100' : 'max-md:w-0 max-md:opacity-0'
          } max-md:overflow-hidden`}
          style={{ 
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            color: isDark ? '#ffffff' : '#000000'
          }}
        >
          <Link 
            className="hover:text-indigo-600 transition-colors max-md:text-lg max-md:font-medium max-md:py-3 max-md:px-6 max-md:rounded-lg max-md:hover:bg-gray-100 dark:max-md:hover:bg-gray-800" 
            to="/projets"
            onClick={closeMenu}
          >
            Projets
          </Link>
          <Link 
            className="hover:text-indigo-600 transition-colors max-md:text-lg max-md:font-medium max-md:py-3 max-md:px-6 max-md:rounded-lg max-md:hover:bg-gray-100 dark:max-md:hover:bg-gray-800" 
            to="/apropos"
            onClick={closeMenu}
          >
            Apropos
          </Link>
          <Link 
            className="hover:text-indigo-600 transition-colors max-md:text-lg max-md:font-medium max-md:py-3 max-md:px-6 max-md:rounded-lg max-md:hover:bg-gray-100 dark:max-md:hover:bg-gray-800" 
            to="/contact"
            onClick={closeMenu}
          >
            Contact
          </Link>
          <Link 
            className="hover:text-indigo-600 transition-colors max-md:text-lg max-md:font-medium max-md:py-3 max-md:px-6 max-md:rounded-lg max-md:hover:bg-gray-100 dark:max-md:hover:bg-gray-800" 
            to="/blog"
            onClick={closeMenu}
          >
            Blog
          </Link>
          
          <button onClick={closeMenu} className="md:hidden text-black dark:text-white p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </nav>
        
        <button 
          onClick={toggleTheme}
          className="size-8 flex items-center justify-center transition-all duration-300 rounded-lg border-2"
          style={{ 
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderColor: isDark ? '#4b5563' : '#d1d5db',
            color: isDark ? '#fbbf24' : '#1f2937'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = isDark ? '#374151' : '#f9fafb';
            e.target.style.borderColor = isDark ? '#6b7280' : '#9ca3af';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = isDark ? '#1f2937' : '#ffffff';
            e.target.style.borderColor = isDark ? '#4b5563' : '#d1d5db';
          }}
        >
          {isDark ? (
            // Sun icon for light mode
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="m12 2 0 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="m12 20 0 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="m4.93 4.93 1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="m17.66 17.66 1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="m2 12 2 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="m20 12 2 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="m6.34 17.66-1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="m19.07 4.93-1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            // Moon icon for dark mode
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
                fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
        
        <button 
          onClick={toggleMenu} 
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ 
            color: isDark ? '#ffffff' : '#000000',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = isDark ? '#374151' : '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
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