import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const ProjetDetail = () => {
  const { isDark } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  // Données étendues des projets avec images multiples
  const projectsData = {
    1: {
      id: 1,
      title: "Forgeron du Web",
      description: "Site web professionnel pour services de développement web avec système de devis en ligne et présentation des services",
      longDescription: "Forgeron du Web est une plateforme complète dédiée aux services de développement web. Le site propose un système de devis automatisé, une présentation détaillée des services, et un portfolio interactif. L'interface utilisateur moderne et responsive garantit une expérience optimale sur tous les appareils.",
      images: ["/projet_1.png", "/projet_2.png", "/projet_1.png"],
      technologies: ["React.js", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
      category: "Full Stack",
      link: "https://personal-portfolio-353x.onrender.com/",
      github: "https://github.com/forgeronduweb/saas-portfolio.git",
      date: "Septembre 2024",
      features: [
        "Système de devis automatisé",
        "Interface d'administration",
        "Portfolio interactif",
        "Design responsive",
        "Optimisation SEO"
      ],
      challenges: "L'un des principaux défis était de créer un système de devis dynamique qui s'adapte aux différents types de projets web.",
      duration: "3 mois",
      status: "En ligne"
    },
    2: {
      id: 2,
      title: "AfriLance",
      description: "Plateforme de freelancing africaine avec paiements sécurisés via Mobile Money",
      longDescription: "AfriLance est une plateforme innovante de freelancing spécialement conçue pour le marché africain. Elle intègre les solutions de paiement Mobile Money populaires en Afrique et offre un accompagnement personnalisé aux freelances. La plateforme garantit une visibilité optimale des profils et projets.",
      images: ["/projet_2.png", "/projet_1.png", "/projet_2.png"],
      technologies: ["React", "Node.js", "MongoDB", "Mobile Money API", "Socket.io"],
      category: "Full Stack",
      link: "https://saas-freelance.onrender.com/",
      date: "Août 2024",
      features: [
        "Paiements Mobile Money",
        "Chat en temps réel",
        "Système d'évaluation",
        "Accompagnement personnalisé",
        "Tableau de bord avancé"
      ],
      challenges: "L'intégration des différentes APIs Mobile Money africaines et la gestion des devises multiples.",
      duration: "4 mois",
      status: "En ligne"
    },
    3: {
      id: 3,
      title: "Planify", 
      description: "Application web complète de gestion de tâches avec authentification sécurisée",
      longDescription: "Une application web full-stack développée avec Next.js 15 et TypeScript pour la gestion de tâches et de productivité. Elle intègre une authentification par cookies sécurisée, une base de données PostgreSQL sur Render, et une interface utilisateur moderne avec Tailwind CSS pour organiser efficacement les tâches personnelles et professionnelles.",
      images: ["/planify/image_1.png", "/planify/image_2.png", "/planify/image_3.png" , "/planify/image_4.png"],
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"],
      category: "Full-Stack",
      date: "Septembre 2024",
      features: [
        "Authentification par cookies sécurisés",
        "Base de données PostgreSQL",
        "Gestion complète des tâches",
        "Système de catégories et priorités",
        "Interface responsive moderne",
        "Dashboard avec sidebar navigation"
      ],
      challenges: "Migration de SQLite vers PostgreSQL et gestion des types Next.js 15 pour les route handlers.",
      duration: "1 mois",
      status: "Terminé"
    },
    4: {
      id: 4,
      title: "Portfolio Moderne",
      description: "Site portfolio responsive avec animations et design moderne",
      longDescription: "Un portfolio personnel moderne utilisant les dernières technologies web. Animations fluides, design responsive, et optimisations de performance pour une expérience utilisateur exceptionnelle.",
      images: ["/projet_2.png", "/projet_1.png", "/projet_2.png"],
      technologies: ["React", "Tailwind CSS", "Framer Motion", "Vite"],
      category: "Frontend",
      date: "Juin 2024",
      features: [
        "Animations Framer Motion",
        "Design responsive",
        "Mode sombre/clair",
        "Optimisations performance",
        "SEO optimisé"
      ],
      challenges: "Créer des animations fluides tout en maintenant d'excellentes performances.",
      duration: "1 mois",
      status: "Terminé"
    },
    5: {
      id: 5,
      title: "Task Manager",
      description: "Application de gestion de tâches avec collaboration en équipe",
      longDescription: "Une application complète de gestion de tâches permettant la collaboration en temps réel entre équipes. Fonctionnalités avancées de suivi de projet et notifications en temps réel.",
      images: ["/projet_1.png", "/projet_2.png", "/projet_1.png"],
      technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Material-UI"],
      category: "Full Stack",
      date: "Mai 2024",
      features: [
        "Collaboration temps réel",
        "Gestion de projets",
        "Notifications push",
        "Tableaux Kanban",
        "Rapports analytiques"
      ],
      challenges: "Synchronisation en temps réel des données entre plusieurs utilisateurs.",
      duration: "3 mois",
      status: "En développement"
    },
    6: {
      id: 6,
      title: "Landing Page",
      description: "Page d'atterrissage optimisée pour la conversion avec A/B testing",
      longDescription: "Landing page haute conversion avec système d'A/B testing intégré. Optimisée pour les performances et la conversion, avec analytics détaillés et tests multivariés.",
      images: ["/projet_2.png", "/projet_1.png", "/projet_2.png"],
      technologies: ["Next.js", "Tailwind CSS", "Vercel Analytics", "Stripe"],
      category: "Frontend",
      date: "Avril 2024",
      features: [
        "A/B Testing",
        "Analytics avancés",
        "Optimisation conversion",
        "Intégration Stripe",
        "Performance optimale"
      ],
      challenges: "Optimisation du taux de conversion tout en maintenant une expérience utilisateur fluide.",
      duration: "2 semaines",
      status: "Terminé"
    }
  };

  useEffect(() => {
    const projectData = projectsData[parseInt(id)];
    if (projectData) {
      setProject(projectData);
    } else {
      navigate('/projets');
    }
  }, [id, navigate]);

  if (!project) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: isDark ? '#000000' : '#ffffff' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
               style={{ borderColor: isDark ? '#ffffff' : '#000000' }}></div>
          <p style={{ color: isDark ? '#ffffff' : '#000000' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  // Plus de carrousel: l'image du haut est statique (première image)

  return (
    <div 
      className="min-h-screen py-8 transition-colors duration-300"
      style={{ backgroundColor: isDark ? '#000000' : '#ffffff' }}
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Bouton retour */}
        <Link 
          to="/projets"
          className="inline-flex items-center gap-2 mb-8 transition-colors duration-300 hover:opacity-70"
          style={{ color: isDark ? '#ffffff' : '#000000' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux projets
        </Link>
        {/* Image principale en haut (statique) */}
        <div className="space-y-10">
          <div className="relative">
            <div 
              className="relative w-full rounded-xl overflow-hidden border-2"
              style={{
                backgroundColor: isDark ? '#111111' : '#f3f4f6',
                borderColor: isDark ? '#333333' : '#e2e8f0'
              }}
            >
              <img 
                src={project.images && project.images.length ? project.images[0] : ''} 
                alt={`${project.title}`}
                className="block w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Infos du projet sous l'image */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span 
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: isDark ? '#0f3460' : '#6366f1',
                    color: '#ffffff'
                  }}
                >
                  {project.category}
                </span>
                {project.status && project.status !== 'En ligne' && (
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: project.status === 'Terminé' ? '#3b82f6' : '#f59e0b',
                      color: '#ffffff'
                    }}
                  >
                    {project.status}
                  </span>
                )}
              </div>

              <h1 
                className="text-3xl md:text-4xl font-bold"
                style={{ color: isDark ? '#ffffff' : '#1f2937' }}
              >
                {project.title}
              </h1>
              {project.date && (
                <p className="mt-2 text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  Date de conception: {project.date}
                </p>
              )}
            </div>

            {/* Technologies */}
            <div>
              <h3 
                className="text-xl font-semibold mb-4"
                style={{ color: isDark ? '#ffffff' : '#1f2937' }}
              >
                Technologies utilisées
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: isDark ? '#374151' : '#f1f5f9',
                      color: isDark ? '#d1d5db' : '#6b7280'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Description + Fonctionnalités côte à côte */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Fonctionnalités (à gauche) */}
              <div>
                <h3 
                  className="text-xl font-semibold mb-4"
                  style={{ color: isDark ? '#ffffff' : '#1f2937' }}
                >
                  Fonctionnalités principales
                </h3>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
                    <li 
                      key={index}
                      className="flex items-center gap-3"
                      style={{ color: isDark ? '#d1d5db' : '#4b5563' }}
                    >
                      <svg className="w-5 h-5 flex-shrink-0" style={{ color: isDark ? '#10b981' : '#059669' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Description (à droite) */}
              <div>
                <h3 
                  className="text-xl font-semibold mb-4"
                  style={{ color: isDark ? '#ffffff' : '#1f2937' }}
                >
                  Description
                </h3>
                <p 
                  className="text-lg leading-relaxed"
                  style={{ color: isDark ? '#d1d5db' : '#4b5563' }}
                >
                  {project.longDescription}
                </p>
              </div>
            </div>

            {/* Défis et durée */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 
                  className="font-semibold mb-2"
                  style={{ color: isDark ? '#ffffff' : '#1f2937' }}
                >
                  Durée du projet
                </h4>
                <p style={{ color: isDark ? '#d1d5db' : '#4b5563' }}>
                  {project.duration}
                </p>
              </div>
              {project.challenges && (
                <div>
                  <h4 
                    className="font-semibold mb-2"
                    style={{ color: isDark ? '#ffffff' : '#1f2937' }}
                  >
                    Défis techniques
                  </h4>
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: isDark ? '#d1d5db' : '#4b5563' }}
                  >
                    {project.challenges}
                  </p>
                </div>
              )}
            </div>

            {/* Liens */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
              {project.link && (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 w-full sm:w-auto"
                  style={{
                    backgroundColor: isDark ? '#ffffff' : '#000000',
                    color: isDark ? '#000000' : '#ffffff'
                  }}
                >
                  <span>Voir le site</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              {project.github && (
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium border transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                  style={{
                    borderColor: isDark ? '#4b5563' : '#d1d5db',
                    color: isDark ? '#ffffff' : '#374151',
                    backgroundColor: 'transparent'
                  }}
                >
                  <span>Code source</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              )}
            </div>

            {/* Images en bas, alignées dans la même colonne et plus hautes */}
            {project.images.length > 0 && (
              <div className="pt-6 border-t" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
                <h3 
                  className="text-xl font-semibold mb-4"
                  style={{ color: isDark ? '#ffffff' : '#1f2937' }}
                >
                  Galerie
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {project.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden border-2"
                      style={{
                        backgroundColor: isDark ? '#111111' : '#f3f4f6',
                        borderColor: isDark ? '#333333' : '#e2e8f0',
                      }}
                    >
                      <img 
                        src={image} 
                        alt={`${project.title} - Image ${index + 1}`}
                        className="block w-full h-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjetDetail;
