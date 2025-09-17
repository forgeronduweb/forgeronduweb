import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Apropos = () => {
  const { isDark } = useTheme();
  const profileImage = "/profil.jpg";

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: isDark ? '#000000' : '#ffffff' }}
    >
      <div className="py-4">
        <div className="text-center mb-6 md:mb-8">
          <div className="relative inline-block">
            <h1 
              className="text-2xl md:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent animate-pulse"
              style={{ 
                backgroundImage: isDark 
                  ? 'linear-gradient(135deg, #ffffff 0%, #10b981 50%, #06b6d4 100%)' 
                  : 'linear-gradient(135deg, #1f2937 0%, #059669 50%, #0891b2 100%)'
              }}
            >
              À propos de moi
            </h1>
          </div>
          <p 
            className="text-xs md:text-sm text-center max-w-xl mx-auto px-4 mt-4 leading-relaxed"
            style={{ color: isDark ? '#cccccc' : '#64748b' }}
          >
            Découvrez mon parcours, mes compétences et ma passion pour le développement web.
            <span className="font-medium" style={{ color: isDark ? '#ffffff' : '#1f2937' }}>
              {" "}Une histoire de créativité, d'apprentissage continu et d'innovation.
            </span>
          </p>
        </div>
      </div>
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-16">
            <div className="text-sm md:text-base max-w-2xl h-full flex flex-col" style={{ color: isDark ? '#cccccc' : '#374151' }}>
              <h2 
                className="text-lg md:text-xl font-medium mb-6"
                style={{ color: isDark ? '#ffffff' : '#000000' }}
              >
                Salut, c'est Evrard 👋
              </h2>

              <p className="mb-4 leading-relaxed">
                Développeur Full Stack JavaScript freelance basé en Côte d'Ivoire. Je suis disponible pour la conception de solutions digitales modernes et performantes, afin de vous aider à atteindre vos objectifs.
              </p>
              <p className="mb-4 leading-relaxed">
                Spécialisé en <strong style={{ color: isDark ? '#ffffff' : '#000000' }}>React</strong>, <strong style={{ color: isDark ? '#ffffff' : '#000000' }}>Node.js</strong> et <strong style={{ color: isDark ? '#ffffff' : '#000000' }}>TypeScript</strong>, je développe des applications rapides, fiables et évolutives, avec une attention particulière portée à l'expérience utilisateur.
              </p>
              <p className="mb-4 leading-relaxed">
                Diplômé d'une <strong style={{ color: isDark ? '#ffffff' : '#000000' }}>Licence en Informatique et Sciences du Numérique</strong> (mention Bien), formé à l'<strong style={{ color: isDark ? '#ffffff' : '#000000' }}>Orange Digital Center</strong> et à <strong style={{ color: isDark ? '#ffffff' : '#000000' }}>GoMyCode</strong>, et certifié en <strong style={{ color: isDark ? '#ffffff' : '#000000' }}>Développement Web & Mobile</strong>, je dispose d'une expertise complète couvrant tout le cycle de développement, du concept à la mise en ligne.
              </p>
              <p 
                className="font-medium leading-relaxed"
                style={{ color: isDark ? '#ffffff' : '#000000' }}
              >
                👉 Si vous avez une idée ou un projet, je suis prêt à la transformer en une application web moderne et performante.
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden shrink-0">
              <img
                className="max-w-md w-full object-cover rounded-2xl"
                src={profileImage}
                alt="Photo de profil d'Evrard"
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Apropos;