import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Projets = () => {
  const { isDark } = useTheme();
  const [hoveredProject, setHoveredProject] = useState(null);
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
      className="min-h-screen overflow-y-auto py-4 transition-colors duration-300"
      style={{ backgroundColor: isDark ? '#000000' : '#ffffff' }}
    >
      <div className="text-center mb-6 md:mb-8">
        <div className="relative inline-block">
          <h1 
            className="text-2xl md:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent animate-pulse"
            style={{ 
              backgroundImage: isDark 
                ? 'linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #3b82f6 100%)' 
                : 'linear-gradient(135deg, #1f2937 0%, #7c3aed 50%, #2563eb 100%)'
            }}
          >
            Mes Projets
          </h1>
          <div 
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 rounded-full animate-pulse"
            style={{ 
              width: '50%',
              background: isDark 
                ? 'linear-gradient(90deg, #a855f7, #3b82f6)' 
                : 'linear-gradient(90deg, #7c3aed, #2563eb)'
            }}
          />
        </div>
        <p 
          className="text-xs md:text-sm text-center max-w-xl mx-auto px-4 mt-4 leading-relaxed"
          style={{ color: isDark ? '#cccccc' : '#64748b' }}
        >
          Découvrez une sélection de mes réalisations, des applications web modernes aux APIs robustes. 
          <span className="font-medium" style={{ color: isDark ? '#ffffff' : '#1f2937' }}>
            {" "}Chaque projet reflète ma passion pour l'innovation et l'excellence technique.
          </span>
        </p>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-8 pt-8 md:pt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="border rounded-lg md:rounded-xl hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl p-3 md:p-6"
                style={{
                  backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
                  borderColor: isDark ? '#404040' : '#e5e7eb'
                }}
              >
                <div className="flex flex-col md:flex-row gap-3 md:gap-6">
                  <div className="md:w-1/3 relative">
                    <img 
                      className="w-full h-32 md:h-48 object-cover rounded md:rounded-lg transition-all duration-300" 
                      src={project.image} 
                      alt={project.title}
                    />
                    <div className="absolute top-1.5 right-1.5 md:top-3 md:right-3">
                      <span 
                        className="px-1.5 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: isDark ? '#0f3460' : '#6366f1',
                          color: '#ffffff'
                        }}
                      >
                        {project.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 md:mb-3 gap-1 md:gap-2">
                        <h3 
                          className="text-base md:text-xl font-semibold"
                          style={{ color: isDark ? '#ffffff' : '#000000' }}
                        >
                          {project.title}
                        </h3>
                        {project.link && (
                          <span 
                            className="px-1.5 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-medium w-fit"
                            style={{
                              backgroundColor: isDark ? '#22c55e' : '#16a34a',
                              color: '#ffffff'
                            }}
                          >
                            Work Finished
                          </span>
                        )}
                      </div>
                      
                      <p 
                        className="mb-2 md:mb-4 leading-relaxed text-xs md:text-sm"
                        style={{ color: isDark ? '#cccccc' : '#64748b' }}
                      >
                        {project.description}
                      </p>
                      
                      <div className="mb-2 md:mb-4">
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          {project.technologies.map((tech, index) => (
                            <span 
                              key={index} 
                              className="px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: isDark ? '#374151' : '#e5e7eb',
                                color: isDark ? '#ffffff' : '#374151'
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-1.5 md:gap-3">
                      {project.link ? (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 md:px-6 py-1.5 md:py-2 rounded-full font-medium transition-all duration-200 text-xs md:text-sm border text-center"
                          style={{
                            backgroundColor: 'transparent',
                            color: isDark ? '#ffffff' : '#000000',
                            borderColor: isDark ? '#ffffff' : '#000000'
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
                          Know more →
                        </a>
                      ) : (
                        <button 
                          className="px-4 md:px-6 py-2 rounded-full font-medium transition-all duration-200 text-sm border"
                          style={{
                            backgroundColor: 'transparent',
                            color: isDark ? '#ffffff' : '#000000',
                            borderColor: isDark ? '#ffffff' : '#000000'
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
                          Know more →
                        </button>
                      )}
                      {project.github && (
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 md:px-6 py-1.5 md:py-2 rounded-full font-medium transition-all duration-200 text-xs md:text-sm border text-center"
                          style={{
                            backgroundColor: 'transparent',
                            color: isDark ? '#ffffff' : '#000000',
                            borderColor: isDark ? '#ffffff' : '#000000'
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
                      )}
                    </div>
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