import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import StatusIndicator from '../components/StatusIndicator';
import avatarImage from '../assets/avatar.png';

const Home = () => {
  const { isDark } = useTheme();
  
  return (
    <div 
      className="h-full overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: isDark ? '#000000' : '#ffffff' }}
    >
      <StatusIndicator />
      <section className="flex flex-col items-center justify-center h-full px-4 md:px-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 animate-pulse"
                style={{
                  background: isDark 
                    ? 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #f59e0b 100%)' 
                    : 'linear-gradient(135deg, #0891b2 0%, #7c3aed 50%, #d97706 100%)'
                }}
              >
                <img 
                  src={avatarImage} 
                  alt="Avatar d'Evrard" 
                  className="w-full h-full rounded-full object-cover transition-colors duration-300"
                  style={{ 
                    backgroundColor: isDark ? '#000000' : '#ffffff'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Name */}
          <h2 
            className="text-lg md:text-xl font-medium mb-8"
            style={{ color: isDark ? '#ffffff' : '#000000' }}
          >
            Salut, c'est Evrard 👋
          </h2>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-7xl font-bold leading-tight">
            <span 
              className="bg-gradient-to-r bg-clip-text text-transparent animate-pulse"
              style={{ 
                backgroundImage: isDark 
                  ? 'linear-gradient(135deg, #ffffff 0%, #06b6d4 50%, #8b5cf6 100%)' 
                  : 'linear-gradient(135deg, #1f2937 0%, #0891b2 50%, #7c3aed 100%)'
              }}
            >
              Développeur Full Stack
            </span>
            <br />
            <span 
              className="bg-gradient-to-r bg-clip-text text-transparent animate-pulse"
              style={{ 
                backgroundImage: isDark 
                  ? 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)' 
                  : 'linear-gradient(135deg, #d97706 0%, #dc2626 50%, #db2777 100%)'
              }}
            >
              JavaScript
            </span>
          </h1>

          {/* Description */}
          <p 
            className="text-sm md:text-base mx-auto max-w-2xl text-center mt-6 max-md:px-2"
            style={{ color: isDark ? '#cccccc' : '#374151' }}
          >
            Je crée des sites web et applications modernes, rapides et fiables. 
            Spécialisé en React, Node.js et les technologies web de pointe pour transformer vos idées en solutions digitales performantes.
          </p>

          {/* CTA Buttons */}
          <div className="mx-auto w-full flex items-center justify-center gap-3 mt-8 flex-wrap">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full font-medium transition"
              style={{
                backgroundColor: isDark ? '#ffffff' : '#000000',
                color: isDark ? '#000000' : '#ffffff'
              }}
            >
              Commencer un projet
            </Link>
            <Link
              to="/apropos"
              className="flex items-center gap-2 rounded-full px-6 py-3 transition border"
              style={{
                borderColor: isDark ? '#ffffff' : '#000000',
                color: isDark ? '#ffffff' : '#000000',
                backgroundColor: 'transparent'
              }}
            >
              <span>Découvrir mon profil</span>
              <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.25.5 4.75 4l-3.5 3.5" stroke="currentColor" strokeOpacity=".6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;