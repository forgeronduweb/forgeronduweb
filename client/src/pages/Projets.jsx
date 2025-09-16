const Blog = () => {
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
    <>
      <h1 className="text-2xl md:text-3xl font-semibold text-center mx-auto px-4">Mes Projets</h1>
      <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto px-4">
        Découvrez une sélection de mes réalisations, des applications web modernes aux APIs robustes.
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-8 pt-8 md:pt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-black hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col h-full">
                <div className="relative">
                  <img 
                    className="w-full h-40 sm:h-48 object-cover object-center transition-all duration-300" 
                    src={project.image} 
                    alt={project.title}
                  />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <span className="bg-white text-black px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-gray-200">
                      {project.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6 flex flex-col flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base flex-1">{project.description}</p>
                  
                  <div className="mb-3 sm:mb-4">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium border">
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
                        className="flex-1 bg-black text-white py-2.5 sm:py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm text-center"
                      >
                        Voir le projet
                      </a>
                    ) : (
                      <button className="flex-1 bg-black text-white py-2.5 sm:py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm">
                        Voir le projet
                      </button>
                    )}
                    {project.github ? (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 border-2 border-black text-black py-2.5 sm:py-2 px-4 rounded-lg font-medium hover:bg-black hover:text-white transition-colors text-sm text-center"
                      >
                        Code source
                      </a>
                    ) : (
                      <button className="flex-1 border-2 border-black text-black py-2.5 sm:py-2 px-4 rounded-lg font-medium hover:bg-black hover:text-white transition-colors text-sm">
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
    </>
  );
};

export default Blog;