import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Blog = () => {
  const { isDark } = useTheme();
  return (
    <div 
      className="min-h-screen py-8 transition-colors duration-300"
      style={{ backgroundColor: isDark ? '#000000' : '#ffffff' }}
    >
      <h1 
        className="text-2xl md:text-3xl font-semibold text-center mx-auto px-4"
        style={{ color: isDark ? '#ffffff' : '#000000' }}
      >
        Latest Blog
      </h1>
      <p 
        className="text-sm text-center mt-2 max-w-lg mx-auto px-4"
        style={{ color: isDark ? '#cccccc' : '#64748b' }}
      >
        Stay ahead of the curve with fresh content on code, design, startups, and everything in between.
      </p>
      
      <div className="max-w-7xl mx-auto px-4 pt-8 md:pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          <div className="w-full hover:-translate-y-0.5 transition duration-300">
            <img className="rounded-xl w-full h-48 object-cover" src="https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=1200&h=800&auto=format&fit=crop&q=60" alt="Color Psychology in UI" />
            <h3 
              className="text-sm md:text-base font-medium mt-3"
              style={{ color: isDark ? '#ffffff' : '#1e293b' }}
            >
              Color Psychology in UI: How to Choose the Right Palette
            </h3>
            <p 
              className="text-xs font-medium mt-1"
              style={{ color: isDark ? '#a78bfa' : '#4f46e5' }}
            >
              UI/UX design
            </p>
          </div>
          <div className="w-full hover:-translate-y-0.5 transition duration-300">
            <img className="rounded-xl w-full h-48 object-cover" src="https://images.unsplash.com/photo-1714974528646-ea024a3db7a7?w=1200&h=800&auto=format&fit=crop&q=60" alt="Modern Web Development" />
            <h3 
              className="text-sm md:text-base font-medium mt-3"
              style={{ color: isDark ? '#ffffff' : '#1e293b' }}
            >
              Modern Web Development: React Best Practices
            </h3>
            <p 
              className="text-xs font-medium mt-1"
              style={{ color: isDark ? '#a78bfa' : '#4f46e5' }}
            >
              Development
            </p>
          </div>
          <div className="w-full hover:-translate-y-0.5 transition duration-300">
            <img className="rounded-xl w-full h-48 object-cover" src="https://images.unsplash.com/photo-1713947501966-34897f21162e?w=1200&h=800&auto=format&fit=crop&q=60" alt="JavaScript Tips" />
            <h3 
              className="text-sm md:text-base font-medium mt-3"
              style={{ color: isDark ? '#ffffff' : '#1e293b' }}
            >
              JavaScript Tips for Better Performance
            </h3>
            <p 
              className="text-xs font-medium mt-1"
              style={{ color: isDark ? '#a78bfa' : '#4f46e5' }}
            >
              JavaScript
            </p>
          </div>
          <div className="w-full hover:-translate-y-0.5 transition duration-300">
            <img className="rounded-xl w-full h-48 object-cover" src="https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=1200&h=800&auto=format&fit=crop&q=60" alt="CSS Grid Layout" />
            <h3 
              className="text-sm md:text-base font-medium mt-3"
              style={{ color: isDark ? '#ffffff' : '#1e293b' }}
            >
              Mastering CSS Grid Layout in 2024
            </h3>
            <p 
              className="text-xs font-medium mt-1"
              style={{ color: isDark ? '#a78bfa' : '#4f46e5' }}
            >
              CSS
            </p>
          </div>
          <div className="w-full hover:-translate-y-0.5 transition duration-300">
            <img className="rounded-xl w-full h-48 object-cover" src="https://images.unsplash.com/photo-1714974528646-ea024a3db7a7?w=1200&h=800&auto=format&fit=crop&q=60" alt="Node.js Backend" />
            <h3 
              className="text-sm md:text-base font-medium mt-3"
              style={{ color: isDark ? '#ffffff' : '#1e293b' }}
            >
              Building Scalable APIs with Node.js
            </h3>
            <p 
              className="text-xs font-medium mt-1"
              style={{ color: isDark ? '#a78bfa' : '#4f46e5' }}
            >
              Backend
            </p>
          </div>
          <div className="w-full hover:-translate-y-0.5 transition duration-300">
            <img className="rounded-xl w-full h-48 object-cover" src="https://images.unsplash.com/photo-1713947501966-34897f21162e?w=1200&h=800&auto=format&fit=crop&q=60" alt="Database Design" />
            <h3 
              className="text-sm md:text-base font-medium mt-3"
              style={{ color: isDark ? '#ffffff' : '#1e293b' }}
            >
              Database Design Patterns for Web Apps
            </h3>
            <p 
              className="text-xs font-medium mt-1"
              style={{ color: isDark ? '#a78bfa' : '#4f46e5' }}
            >
              Database
            </p>
          </div>
          <div className="w-full hover:-translate-y-0.5 transition duration-300">
            <img className="rounded-xl w-full h-48 object-cover" src="https://images.unsplash.com/photo-1713947501966-34897f21162e?w=1200&h=800&auto=format&fit=crop&q=60" alt="TypeScript Guide" />
            <h3 
              className="text-sm md:text-base font-medium mt-3"
              style={{ color: isDark ? '#ffffff' : '#1e293b' }}
            >
              TypeScript: From Beginner to Advanced
            </h3>
            <p 
              className="text-xs font-medium mt-1"
              style={{ color: isDark ? '#a78bfa' : '#4f46e5' }}
            >
              TypeScript
            </p>
          </div>
          <div className="w-full hover:-translate-y-0.5 transition duration-300">
            <img className="rounded-xl w-full h-48 object-cover" src="https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=1200&h=800&auto=format&fit=crop&q=60" alt="Web Performance" />
            <h3 
              className="text-sm md:text-base font-medium mt-3"
              style={{ color: isDark ? '#ffffff' : '#1e293b' }}
            >
              Optimizing Web Performance in 2024
            </h3>
            <p 
              className="text-xs font-medium mt-1"
              style={{ color: isDark ? '#a78bfa' : '#4f46e5' }}
            >
              Performance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;