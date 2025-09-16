import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Projets = () => {
  const { isDark } = useTheme();
  const projects = [
    {
      id: 1,
      title: "Forgeron du Web",
      description: "Site web professionnel pour services de développement web avec système de devis en ligne et présentation des services",
      image: "/projet_1.png",
      technologies: ["React.js", "Node.js", "MongoDB"],
      category: "Full Stack",
      link: "https://personal-portfolio-353x.onrender.com/",
      github: "https://github.com/forgeronduweb/saas-portfolio.git"
    },
    {
      id: 2,
      title: "AfriLance",
      description: "Plateforme de freelancing africaine avec paiements sécurisés via Mobile Money, accompagnement personnalisé et visibilité garantie",
      image: "/projet_2.png",
      technologies: ["React", "Node.js", "MongoDB", "Mobile Money API"],
      category: "Full Stack",
      link: "https://saas-freelance.onrender.com/"
    },
    {
      id: 3,
      title: "Projet",
      description: "API robuste pour application mobile avec authentification JWT",
      technologies: ["Node.js", "Express", "PostgreSQL", "JWT"],
      category: "Backend"
    },
    {
      id: 4,
      title: "Projet",
      description: "Site portfolio responsive avec animations et design moderne",
      technologies: ["React", "Tailwind CSS", "Framer Motion"],
      category: "Frontend"
    },
    {
      id: 5,
      title: "Projet",
      description: "Application de gestion de tâches avec collaboration en équipe",
      technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
      category: "Full Stack"
    },
    {
      id: 6,
      title: "Projet",
      description: "Page d'atterrissage optimisée pour la conversion avec A/B testing",
      technologies: ["Next.js", "Tailwind CSS", "Vercel Analytics"],
      category: "Frontend"
    }
  ];

  return (
    <div 
      className="min-h-screen overflow-y-auto py-8 transition-colors duration-300"
      style={{ backgroundColor: isDark ? '#000000' : '#ffffff' }}
    >
      <h1 
        className="text-2xl md:text-3xl font-semibold text-center mx-auto px-4"
        style={{ color: isDark ? '#ffffff' : '#000000' }}
      >
        Mes Projets
      </h1>
      <p 
        className="text-sm text-center mt-2 max-w-lg mx-auto px-4"
        style={{ color: isDark ? '#cccccc' : '#64748b' }}
      >
        Découvrez une sélection de mes réalisations, des applications web modernes aux APIs robustes.
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-8 pt-8 md:pt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="border-2 rounded-xl overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col h-full"
                style={{
                  backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
                  borderColor: isDark ? '#404040' : '#e5e7eb',
                  ':hover': {
                    borderColor: isDark ? '#ffffff' : '#000000'
                  }
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = isDark ? '#ffffff' : '#000000';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = isDark ? '#404040' : '#e5e7eb';
                }}
              >
                <div className="relative">
                  <img 
                    className="w-full h-40 sm:h-48 object-cover object-center transition-all duration-300" 
                    src={project.image} 
                    alt={project.title}
                  />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <span 
                      className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border"
                      style={{
                        backgroundColor: isDark ? '#000000' : '#ffffff',
                        color: isDark ? '#ffffff' : '#000000',
                        borderColor: isDark ? '#404040' : '#e5e7eb'
                      }}
                    >
                      {project.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6 flex flex-col flex-1">
                  <h3 
                    className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3"
                    style={{ color: isDark ? '#ffffff' : '#000000' }}
                  >
                    {project.title}
                  </h3>
                  <p 
                    className="mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base flex-1"
                    style={{ color: isDark ? '#cccccc' : '#4b5563' }}
                  >
                    {project.description}
                  </p>
                  
                  <div className="mb-3 sm:mb-4">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {project.technologies.map((tech, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 rounded text-xs font-medium border"
                          style={{
                            backgroundColor: isDark ? '#2d2d2d' : '#f3f4f6',
                            color: isDark ? '#cccccc' : '#374151',
                            borderColor: isDark ? '#404040' : '#d1d5db'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
                    {project.link ? (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 sm:py-2 px-4 rounded-lg font-medium transition-colors text-sm text-center"
                        style={{
                          backgroundColor: isDark ? '#ffffff' : '#000000',
                          color: isDark ? '#000000' : '#ffffff'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = isDark ? '#e5e5e5' : '#1f2937';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = isDark ? '#ffffff' : '#000000';
                        }}
                      >
                        Voir le projet
                      </a>
                    ) : (
                      <button 
                        className="flex-1 py-2.5 sm:py-2 px-4 rounded-lg font-medium transition-colors text-sm"
                        style={{
                          backgroundColor: isDark ? '#ffffff' : '#000000',
                          color: isDark ? '#000000' : '#ffffff'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = isDark ? '#e5e5e5' : '#1f2937';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = isDark ? '#ffffff' : '#000000';
                        }}
                      >
                        Voir le projet
                      </button>
                    )}
                    {project.github ? (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 border-2 py-2.5 sm:py-2 px-4 rounded-lg font-medium transition-colors text-sm text-center"
                        style={{
                          borderColor: isDark ? '#ffffff' : '#000000',
                          color: isDark ? '#ffffff' : '#000000',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = isDark ? '#ffffff' : '#000000';
                          e.target.style.color = isDark ? '#000000' : '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = isDark ? '#ffffff' : '#000000';
                        }}
                      >
                        Code source
                      </a>
                    ) : (
                      <button 
                        className="flex-1 border-2 py-2.5 sm:py-2 px-4 rounded-lg font-medium transition-colors text-sm"
                        style={{
                          borderColor: isDark ? '#ffffff' : '#000000',
                          color: isDark ? '#ffffff' : '#000000',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = isDark ? '#ffffff' : '#000000';
                          e.target.style.color = isDark ? '#000000' : '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = isDark ? '#ffffff' : '#000000';
                        }}
                      >
                        Code source
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projets;