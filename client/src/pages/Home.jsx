import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <section className="bg-white w-full bg-no-repeat bg-cover bg-center text-sm h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
        {/* Main Hero Section */}
        <div className="text-center max-w-[850px] mx-auto px-4">
          {/* Avatar */}
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 relative">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden border-4 border-gray-200 hover:border-black transition-colors">
              {/* Avatar placeholder - you can replace this with an actual image */}
              <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-4xl">👨‍💻</span>
              </div>
            </div>
          </div>

          {/* Name */}
          <h2 className="text-lg md:text-xl font-medium text-black mb-8">
            Salut, c'est Evrard 👋
          </h2>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-7xl font-medium text-black leading-tight">
            Développeur Full Stack
            <br />
            <span className="text-black">JavaScript</span>
          </h1>

          {/* Description */}
          <p className="text-sm md:text-base mx-auto max-w-2xl text-center mt-6 text-gray-700 max-md:px-2">
            Je crée des sites web et applications modernes, rapides et fiables. 
            Spécialisé en React, Node.js et les technologies web de pointe pour transformer vos idées en solutions digitales performantes.
          </p>

          {/* CTA Buttons */}
          <div className="mx-auto w-full flex items-center justify-center gap-3 mt-8 flex-wrap">
            <Link
              to="/contact"
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium transition"
            >
              Commencer un projet
            </Link>
            <Link
              to="/apropos"
              className="flex items-center gap-2 border border-gray-300 hover:bg-gray-100 rounded-full px-6 py-3 text-black"
            >
              <span>Découvrir mon profil</span>
              <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.25.5 4.75 4l-3.5 3.5" stroke="#000000" strokeOpacity=".6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;