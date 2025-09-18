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
      title: "API Mobile",
      description: "API robuste pour application mobile avec authentification JWT",
      image: "/projet_1.png", // Utilise temporairement projet_1.png
      technologies: ["Node.js", "Express", "PostgreSQL", "JWT"],
      category: "Backend"
    },
    {
      id: 4,
      title: "Portfolio Moderne",
      description: "Site portfolio responsive avec animations et design moderne",
      image: "/projet_2.png", // Utilise temporairement projet_2.png
      technologies: ["React", "Tailwind CSS", "Framer Motion"],
      category: "Frontend"
    },
    {
      id: 5,
      title: "Task Manager",
      description: "Application de gestion de tâches avec collaboration en équipe",
      image: "/projet_1.png", // Utilise temporairement projet_1.png
      technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
      category: "Full Stack"
    },
    {
      id: 6,
      title: "Landing Page",
      description: "Page d'atterrissage optimisée pour la conversion avec A/B testing",
      image: "/projet_2.png", // Utilise temporairement projet_2.png
      technologies: ["Next.js", "Tailwind CSS", "Vercel Analytics"],
      category: "Frontend"
    }
  ];

  return (
    <div 
      className="min-h-screen overflow-y-auto py-4 transition-colors duration-300"
      style={{ backgroundColor: isDark ? '#000000' : '#ffffff' }}
    >
      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
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
          <span className="hidden lg:inline">Découvrez mes réalisations en survolant les noms des projets.</span>
          <span className="lg:hidden">Découvrez mes réalisations et projets techniques.</span>
          <span className="font-medium" style={{ color: isDark ? '#ffffff' : '#1f2937' }}>
            {" "}Chaque projet reflète ma passion pour l'innovation technique.
          </span>
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:h-[calc(100vh-12rem)]">
          
          {/* Zone d'affichage des images - Gauche (masquée sur mobile) */}
          <div className="hidden lg:block lg:w-1/2">
            <div className="h-full">
              <div 
                className="relative w-full h-96 rounded-xl overflow-hidden border-2 transition-all duration-500"
                style={{
                  backgroundColor: isDark ? '#1a1a1a' : '#f8fafc',
                  borderColor: isDark ? '#333333' : '#e2e8f0'
                }}
              >
                {hoveredProject ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={hoveredProject.image} 
                      alt={hoveredProject.title}
                      className="w-full h-full object-cover transition-all duration-500 transform scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: isDark ? '#0f3460' : '#6366f1',
                            color: '#ffffff'
                          }}
                        >
                          {hoveredProject.category}
                        </span>
                        {hoveredProject.link && (
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: '#22c55e',
                              color: '#ffffff'
                            }}
                          >
                            En ligne
                          </span>
                        )}
                      </div>
                      <h3 className="text-white text-xl font-bold mb-2">
                        {hoveredProject.title}
                      </h3>
                      <p className="text-gray-200 text-sm line-clamp-2">
                        {hoveredProject.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div 
                        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: isDark ? '#333333' : '#e2e8f0' }}
                      >
                        <svg 
                          className="w-8 h-8" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          style={{ color: isDark ? '#666666' : '#94a3b8' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p 
                        className="text-sm font-medium"
                        style={{ color: isDark ? '#666666' : '#94a3b8' }}
                      >
                        Survolez un projet pour voir son aperçu
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Liste des projets - Droite (pleine largeur sur mobile) */}
          <div className="w-full lg:w-1/2 lg:overflow-y-auto lg:h-full scrollbar-hide">
            <div className="space-y-4 px-3 py-1">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="group cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredProject(project)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div 
                    className="p-4 md:p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                    style={{
                      backgroundColor: hoveredProject?.id === project.id 
                        ? (isDark ? '#1f2937' : '#f1f5f9')
                        : (isDark ? '#1a1a1a' : '#ffffff'),
                      borderColor: hoveredProject?.id === project.id
                        ? (isDark ? '#4f46e5' : '#6366f1')
                        : (isDark ? '#333333' : '#e2e8f0'),
                      borderWidth: hoveredProject?.id === project.id ? '2px' : '1px'
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 
                          className="text-lg md:text-xl font-bold transition-colors duration-300"
                          style={{ 
                            color: hoveredProject?.id === project.id 
                              ? (isDark ? '#ffffff' : '#1f2937')
                              : (isDark ? '#e5e7eb' : '#374151')
                          }}
                        >
                          {project.title}
                        </h3>
                      </div>
                      <div className="ml-4 text-right">
                        <span 
                          className="text-xs font-medium px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: isDark ? '#374151' : '#e5e7eb',
                            color: isDark ? '#d1d5db' : '#374151'
                          }}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: hoveredProject?.id === project.id
                              ? (isDark ? '#4f46e5' : '#6366f1')
                              : (isDark ? '#374151' : '#f1f5f9'),
                            color: hoveredProject?.id === project.id
                              ? '#ffffff'
                              : (isDark ? '#d1d5db' : '#6b7280')
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-medium transition-colors duration-300"
                          style={{
                            color: hoveredProject?.id === project.id 
                              ? (isDark ? '#60a5fa' : '#3b82f6')
                              : (isDark ? '#9ca3af' : '#6b7280')
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Voir le site</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      {project.github && (
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-medium transition-colors duration-300"
                          style={{
                            color: hoveredProject?.id === project.id 
                              ? (isDark ? '#60a5fa' : '#3b82f6')
                              : (isDark ? '#9ca3af' : '#6b7280')
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Code source</span>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projets;