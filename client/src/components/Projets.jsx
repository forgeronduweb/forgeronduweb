import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Projets = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
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
      github: "https://github.com/forgeronduweb/saas-portfolio.git",
      date: "Septembre 2024"
    },
    {
      id: 2,
      title: "AfriLance",
      description: "Plateforme de freelancing africaine avec paiements sécurisés via Mobile Money, accompagnement personnalisé et visibilité garantie",
      image: "/projet_2.png",
      technologies: ["React", "Node.js", "MongoDB", "Mobile Money API"],
      category: "Full Stack",
      link: "https://saas-freelance.onrender.com/",
      date: "Août 2024"
    },
    {
      id: 3,
      title: "Planify",
      description: "Application web complète de gestion de tâches avec authentification sécurisée",
      image: "public/planify/image_1.png", // Utilise temporairement projet_1.png
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
      category: "Full-Stack",
      date: "Septembre 2024"
    },
    {
      id: 4,
      title: "Portfolio Moderne",
      description: "Site portfolio responsive avec animations et design moderne",
      image: "/projet_2.png", // Utilise temporairement projet_2.png
      technologies: ["React", "Tailwind CSS", "Framer Motion"],
      category: "Frontend",
      date: "Juin 2024"
    },
    {
      id: 5,
      title: "Task Manager",
      description: "Application de gestion de tâches avec collaboration en équipe",
      image: "/projet_1.png", // Utilise temporairement projet_1.png
      technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
      category: "Full Stack",
      date: "Mai 2024"
    },
    {
      id: 6,
      title: "Landing Page",
      description: "Page d'atterrissage optimisée pour la conversion avec A/B testing",
      image: "/projet_2.png", // Utilise temporairement projet_2.png
      technologies: ["Next.js", "Tailwind CSS", "Vercel Analytics"],
      category: "Frontend",
      date: "Avril 2024"
    }
  ];

  return (
    <div 
      className="min-h-screen overflow-y-auto py-4 transition-colors duration-300 lg:h-screen lg:overflow-hidden lg:flex lg:flex-col"
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
      <div className="max-w-7xl mx-auto px-4 lg:flex-1 lg:overflow-hidden w-full">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:h-full">
          
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
                  onClick={() => navigate(`/projet/${project.id}`)}
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
                    <div className="flex items-start justify-between mb-0">
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
                        {project.date && (
                          <p 
                            className="hidden sm:block text-xs leading-snug mt-3"
                            style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                          >
                            Publié: {project.date}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
                        <span 
                          className="hidden sm:inline-flex text-[10px] md:text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: isDark ? '#111827' : '#eef2ff',
                            color: isDark ? '#c7d2fe' : '#4338ca',
                            border: `1px solid ${isDark ? '#374151' : '#c7d2fe'}`
                          }}
                        >
                          {project.category}
                        </span>
                        <span 
                          className="text-xs font-medium px-2 py-1 rounded-full min-w-[2rem] text-center"
                          style={{
                            backgroundColor: isDark ? '#374151' : '#e5e7eb',
                            color: isDark ? '#e5e7eb' : '#374151'
                          }}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {/* Date retirée ici sur mobile; déplacée en bas avec la catégorie */}
                      </div>
                    </div>


                    {/* Catégorie et date en bas sur mobile, sur la même ligne (date alignée à droite) */}
                    <div className="sm:hidden mt-3 flex items-center w-full">
                      <span 
                        className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: isDark ? '#111827' : '#eef2ff',
                          color: isDark ? '#c7d2fe' : '#4338ca',
                          border: `1px solid ${isDark ? '#374151' : '#c7d2fe'}`
                        }}
                      >
                        {project.category}
                      </span>
                      {project.date && (
                        <span className="text-[10px] ml-auto text-right" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                          Publié: {project.date}
                        </span>
                      )}
                    </div>

                    {/* Liens supprimés: la carte est cliquable */}
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
