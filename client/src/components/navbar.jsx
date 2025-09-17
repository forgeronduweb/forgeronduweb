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
          className={`max-md:fixed max-md:top-0 max-md:left-0 max-md:h-full max-md:pt-20 max-md:pl-8 items-center justify-start max-md:justify-start max-md:items-start transition-all duration-300 ease-in-out backdrop-blur-md flex-col md:flex-row flex gap-8 text-sm font-normal z-40 ${
            isMenuOpen ? 'max-md:w-full max-md:opacity-100' : 'max-md:w-0 max-md:opacity-0'
          } max-md:overflow-hidden`}
          style={{ 
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            color: isDark ? '#ffffff' : '#000000'
          }}
        >
          <Link 
            className="relative transition-all duration-300 max-md:text-lg max-md:font-medium max-md:py-3 max-md:px-6 max-md:w-screen max-md:mb-2 max-md:-ml-8 max-md:pl-10 md:hover:scale-105 md:hover:-translate-y-0.5" 
            to="/projets"
            onClick={closeMenu}
            style={{ 
              color: isDark ? '#ffffff' : '#000000',
              textShadow: '0 0 0 transparent'
            }}
            onMouseEnter={(e) => {
              if (window.innerWidth >= 768) {
                e.target.style.textShadow = isDark ? '0 0 8px rgba(255, 255, 255, 0.3)' : '0 0 8px rgba(0, 0, 0, 0.3)';
                e.target.style.color = isDark ? '#ffffff' : '#000000';
                
                // Créer l'élément de trait progressif
                const underline = document.createElement('div');
                underline.className = 'progressive-underline';
                underline.style.cssText = `
                  position: absolute;
                  bottom: -2px;
                  left: 0;
                  height: 2px;
                  width: 0;
                  background-color: ${isDark ? '#ffffff' : '#000000'};
                  transition: width 0.3s ease-out;
                `;
                e.target.appendChild(underline);
                
                // Animer la largeur
                setTimeout(() => {
                  underline.style.width = '100%';
                }, 10);
              } else {
                e.target.style.transform = 'translateX(8px)';
                
                // Créer l'élément de trait progressif pour mobile
                const underline = document.createElement('div');
                underline.className = 'progressive-underline-mobile';
                underline.style.cssText = `
                  position: absolute;
                  bottom: 8px;
                  left: 32px;
                  height: 2px;
                  width: 0;
                  background-color: ${isDark ? '#ffffff' : '#000000'};
                  transition: width 0.3s ease-out;
                `;
                e.target.appendChild(underline);
                
                // Animer la largeur
                setTimeout(() => {
                  underline.style.width = 'calc(100% - 64px)';
                }, 10);
              }
            }}
            onMouseLeave={(e) => {
              if (window.innerWidth >= 768) {
                e.target.style.textShadow = '0 0 0 transparent';
                
                // Supprimer le trait progressif
                const underline = e.target.querySelector('.progressive-underline');
                if (underline) {
                  underline.style.width = '0';
                  setTimeout(() => {
                    if (underline.parentNode) {
                      underline.parentNode.removeChild(underline);
                    }
                  }, 300);
                }
              } else {
                e.target.style.transform = 'translateX(0)';
                
                // Supprimer le trait progressif mobile
                const underline = e.target.querySelector('.progressive-underline-mobile');
                if (underline) {
                  underline.style.width = '0';
                  setTimeout(() => {
                    if (underline.parentNode) {
                      underline.parentNode.removeChild(underline);
                    }
                  }, 300);
                }
              }
            }}
          >
            Projets
          </Link>
          <Link 
            className="relative transition-all duration-300 max-md:text-lg max-md:font-medium max-md:py-3 max-md:px-6 max-md:w-screen max-md:mb-2 max-md:-ml-8 max-md:pl-10 md:hover:scale-105 md:hover:-translate-y-0.5" 
            to="/apropos"
            onClick={closeMenu}
            style={{ 
              color: isDark ? '#ffffff' : '#000000',
              textShadow: '0 0 0 transparent'
            }}
            onMouseEnter={(e) => {
              if (window.innerWidth >= 768) {
                e.target.style.textShadow = isDark ? '0 0 8px rgba(255, 255, 255, 0.3)' : '0 0 8px rgba(0, 0, 0, 0.3)';
                e.target.style.color = isDark ? '#ffffff' : '#000000';
                
                // Créer l'élément de trait progressif
                const underline = document.createElement('div');
                underline.className = 'progressive-underline';
                underline.style.cssText = `
                  position: absolute;
                  bottom: -2px;
                  left: 0;
                  height: 2px;
                  width: 0;
                  background-color: ${isDark ? '#ffffff' : '#000000'};
                  transition: width 0.3s ease-out;
                `;
                e.target.appendChild(underline);
                
                // Animer la largeur
                setTimeout(() => {
                  underline.style.width = '100%';
                }, 10);
              } else {
                e.target.style.transform = 'translateX(8px)';
                
                // Créer l'élément de trait progressif pour mobile
                const underline = document.createElement('div');
                underline.className = 'progressive-underline-mobile';
                underline.style.cssText = `
                  position: absolute;
                  bottom: 8px;
                  left: 32px;
                  height: 2px;
                  width: 0;
                  background-color: ${isDark ? '#ffffff' : '#000000'};
                  transition: width 0.3s ease-out;
                `;
                e.target.appendChild(underline);
                
                // Animer la largeur
                setTimeout(() => {
                  underline.style.width = 'calc(100% - 64px)';
                }, 10);
              }
            }}
            onMouseLeave={(e) => {
              if (window.innerWidth >= 768) {
                e.target.style.textShadow = '0 0 0 transparent';
                
                // Supprimer le trait progressif
                const underline = e.target.querySelector('.progressive-underline');
                if (underline) {
                  underline.style.width = '0';
                  setTimeout(() => {
                    if (underline.parentNode) {
                      underline.parentNode.removeChild(underline);
                    }
                  }, 300);
                }
              } else {
                e.target.style.transform = 'translateX(0)';
                
                // Supprimer le trait progressif mobile
                const underline = e.target.querySelector('.progressive-underline-mobile');
                if (underline) {
                  underline.style.width = '0';
                  setTimeout(() => {
                    if (underline.parentNode) {
                      underline.parentNode.removeChild(underline);
                    }
                  }, 300);
                }
              }
            }}
          >
            Apropos
          </Link>
          <Link 
            className="relative transition-all duration-300 max-md:text-lg max-md:font-medium max-md:py-3 max-md:px-6 max-md:w-screen max-md:mb-2 max-md:-ml-8 max-md:pl-10 md:hover:scale-105 md:hover:-translate-y-0.5" 
            to="/contact"
            onClick={closeMenu}
            style={{ 
              color: isDark ? '#ffffff' : '#000000',
              textShadow: '0 0 0 transparent'
            }}
            onMouseEnter={(e) => {
              if (window.innerWidth >= 768) {
                e.target.style.textShadow = isDark ? '0 0 8px rgba(255, 255, 255, 0.3)' : '0 0 8px rgba(0, 0, 0, 0.3)';
                e.target.style.color = isDark ? '#ffffff' : '#000000';
                
                // Créer l'élément de trait progressif
                const underline = document.createElement('div');
                underline.className = 'progressive-underline';
                underline.style.cssText = `
                  position: absolute;
                  bottom: -2px;
                  left: 0;
                  height: 2px;
                  width: 0;
                  background-color: ${isDark ? '#ffffff' : '#000000'};
                  transition: width 0.3s ease-out;
                `;
                e.target.appendChild(underline);
                
                // Animer la largeur
                setTimeout(() => {
                  underline.style.width = '100%';
                }, 10);
              } else {
                e.target.style.transform = 'translateX(8px)';
                
                // Créer l'élément de trait progressif pour mobile
                const underline = document.createElement('div');
                underline.className = 'progressive-underline-mobile';
                underline.style.cssText = `
                  position: absolute;
                  bottom: 8px;
                  left: 32px;
                  height: 2px;
                  width: 0;
                  background-color: ${isDark ? '#ffffff' : '#000000'};
                  transition: width 0.3s ease-out;
                `;
                e.target.appendChild(underline);
                
                // Animer la largeur
                setTimeout(() => {
                  underline.style.width = 'calc(100% - 64px)';
                }, 10);
              }
            }}
            onMouseLeave={(e) => {
              if (window.innerWidth >= 768) {
                e.target.style.textShadow = '0 0 0 transparent';
                
                // Supprimer le trait progressif
                const underline = e.target.querySelector('.progressive-underline');
                if (underline) {
                  underline.style.width = '0';
                  setTimeout(() => {
                    if (underline.parentNode) {
                      underline.parentNode.removeChild(underline);
                    }
                  }, 300);
                }
              } else {
                e.target.style.transform = 'translateX(0)';
                
                // Supprimer le trait progressif mobile
                const underline = e.target.querySelector('.progressive-underline-mobile');
                if (underline) {
                  underline.style.width = '0';
                  setTimeout(() => {
                    if (underline.parentNode) {
                      underline.parentNode.removeChild(underline);
                    }
                  }, 300);
                }
              }
            }}
          >
            Contact
          </Link>
          <Link 
            className="relative transition-all duration-300 max-md:text-lg max-md:font-medium max-md:py-3 max-md:px-6 max-md:w-screen max-md:mb-2 max-md:-ml-8 max-md:pl-10 md:hover:scale-105 md:hover:-translate-y-0.5" 
            to="/blog"
            onClick={closeMenu}
            style={{ 
              color: isDark ? '#ffffff' : '#000000',
              textShadow: '0 0 0 transparent'
            }}
            onMouseEnter={(e) => {
              if (window.innerWidth >= 768) {
                e.target.style.textShadow = isDark ? '0 0 8px rgba(255, 255, 255, 0.3)' : '0 0 8px rgba(0, 0, 0, 0.3)';
                e.target.style.color = isDark ? '#ffffff' : '#000000';
                
                // Créer l'élément de trait progressif
                const underline = document.createElement('div');
                underline.className = 'progressive-underline';
                underline.style.cssText = `
                  position: absolute;
                  bottom: -2px;
                  left: 0;
                  height: 2px;
                  width: 0;
                  background-color: ${isDark ? '#ffffff' : '#000000'};
                  transition: width 0.3s ease-out;
                `;
                e.target.appendChild(underline);
                
                // Animer la largeur
                setTimeout(() => {
                  underline.style.width = '100%';
                }, 10);
              } else {
                e.target.style.transform = 'translateX(8px)';
                
                // Créer l'élément de trait progressif pour mobile
                const underline = document.createElement('div');
                underline.className = 'progressive-underline-mobile';
                underline.style.cssText = `
                  position: absolute;
                  bottom: 8px;
                  left: 32px;
                  height: 2px;
                  width: 0;
                  background-color: ${isDark ? '#ffffff' : '#000000'};
                  transition: width 0.3s ease-out;
                `;
                e.target.appendChild(underline);
                
                // Animer la largeur
                setTimeout(() => {
                  underline.style.width = 'calc(100% - 64px)';
                }, 10);
              }
            }}
            onMouseLeave={(e) => {
              if (window.innerWidth >= 768) {
                e.target.style.textShadow = '0 0 0 transparent';
                
                // Supprimer le trait progressif
                const underline = e.target.querySelector('.progressive-underline');
                if (underline) {
                  underline.style.width = '0';
                  setTimeout(() => {
                    if (underline.parentNode) {
                      underline.parentNode.removeChild(underline);
                    }
                  }, 300);
                }
              } else {
                e.target.style.transform = 'translateX(0)';
                
                // Supprimer le trait progressif mobile
                const underline = e.target.querySelector('.progressive-underline-mobile');
                if (underline) {
                  underline.style.width = '0';
                  setTimeout(() => {
                    if (underline.parentNode) {
                      underline.parentNode.removeChild(underline);
                    }
                  }, 300);
                }
              }
            }}
          >
            Blog
          </Link>
          
          <button 
            onClick={closeMenu} 
            className="md:hidden p-3 rounded-full transition-colors"
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