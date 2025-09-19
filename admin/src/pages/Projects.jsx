import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Github,
  Calendar,
  Tag,
  FolderOpen
} from 'lucide-react'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)

  // Données initiales basées sur le client
  const initialProjects = [
    {
      id: 1,
      title: "Forgeron du Web",
      description: "Site web professionnel pour services de développement web avec système de devis en ligne et présentation des services",
      image: "/projet_1.png",
      technologies: ["React.js", "Node.js", "MongoDB"],
      category: "Full Stack",
      link: "https://personal-portfolio-353x.onrender.com/",
      github: "https://github.com/forgeronduweb/saas-portfolio.git",
      date: "Septembre 2024",
      status: "published"
    },
    {
      id: 2,
      title: "AfriLance",
      description: "Plateforme de freelancing africaine avec paiements sécurisés via Mobile Money, accompagnement personnalisé et visibilité garantie",
      image: "/projet_2.png",
      technologies: ["React", "Node.js", "MongoDB", "Mobile Money API"],
      category: "Full Stack",
      link: "https://saas-freelance.onrender.com/",
      github: "",
      date: "Août 2024",
      status: "published"
    },
    {
      id: 3,
      title: "Planify",
      description: "Application web complète de gestion de tâches avec authentification sécurisée",
      image: "public/planify/image_1.png",
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
      category: "Full-Stack",
      link: "",
      github: "",
      date: "Septembre 2024",
      status: "draft"
    },
    {
      id: 4,
      title: "Portfolio Moderne",
      description: "Site portfolio responsive avec animations et design moderne",
      image: "/projet_2.png",
      technologies: ["React", "Tailwind CSS", "Framer Motion"],
      category: "Frontend",
      link: "",
      github: "",
      date: "Juin 2024",
      status: "published"
    },
    {
      id: 5,
      title: "Task Manager",
      description: "Application de gestion de tâches avec collaboration en équipe",
      image: "/projet_1.png",
      technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
      category: "Full Stack",
      link: "",
      github: "",
      date: "Mai 2024",
      status: "published"
    },
    {
      id: 6,
      title: "Landing Page",
      description: "Page d'atterrissage optimisée pour la conversion avec A/B testing",
      image: "/projet_2.png",
      technologies: ["Next.js", "Tailwind CSS", "Vercel Analytics"],
      category: "Frontend",
      link: "",
      github: "",
      date: "Avril 2024",
      status: "published"
    }
  ]

  const categories = ['all', 'Full Stack', 'Frontend', 'Full-Stack']

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchTerm, selectedCategory])

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      
      // Charger les projets depuis le backend
      const response = await apiService.getProjects()
      const backendProjects = response.data.data
      
      // Adapter les données du backend au format attendu par l'interface
      const adaptedProjects = backendProjects.map(project => {
        // Trouver l'image principale ou prendre la première
        const primaryImage = project.images?.find(img => img.isPrimary) || project.images?.[0]
        const imageUrl = primaryImage ? `http://localhost:5000${primaryImage.url}` : "/projet_1.png"
        
        return {
          id: project._id || project.id,
          title: project.title,
          description: project.description,
          image: imageUrl,
          images: project.images || [],
          technologies: project.technologies || [],
          category: project.category || 'Full Stack',
          link: project.url || "",
          github: project.github || "",
          date: new Date(project.createdAt).toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long' 
          }),
          status: project.status === 'Terminé' ? 'published' : 'draft'
        }
      })
      
      setProjects(adaptedProjects)
      setIsLoading(false)
      
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error)
      toast.error('Erreur lors du chargement des projets depuis le backend')
      
      // Fallback sur les données simulées en cas d'erreur
      setProjects(initialProjects)
      setIsLoading(false)
    }
  }

  const filterProjects = () => {
    let filtered = projects

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(tech => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory)
    }

    setFilteredProjects(filtered)
  }

  const handleDeleteProject = async (id) => {
    try {
      // Supprimer via l'API backend
      await apiService.deleteProject(id)
      
      // Mettre à jour l'état local
      setProjects(projects.filter(p => p.id !== id))
      toast.success('Projet supprimé avec succès')
      setShowDeleteModal(false)
      setProjectToDelete(null)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error('Erreur lors de la suppression du projet')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'published':
        return 'Publié'
      case 'draft':
        return 'Brouillon'
      default:
        return 'Inconnu'
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-30 pb-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="w-48 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-64 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
            </div>
            <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="flex space-x-2 mb-4">
                  <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header fixe */}
      <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-30 pb-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestion des projets
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez vos projets de portfolio
            </p>
          </div>
          <Link
            to="/projects/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau projet
          </Link>
        </div>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 space-y-6">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un projet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Toutes les catégories</option>
                {categories.filter(cat => cat !== 'all').map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredProjects.length} projet(s) trouvé(s)
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">Pas d'image</span>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3 flex flex-col space-y-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                  {project.images && project.images.length > 0 && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                      {project.images.length} image{project.images.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {project.date}
                  </div>
                  <div className="flex items-center">
                    <Tag className="w-3 h-3 mr-1" />
                    {project.category}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Voir le site"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Voir sur GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/projects/${project.id}/edit`}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => {
                        setProjectToDelete(project)
                        setShowDeleteModal(true)
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun projet trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Essayez de modifier vos critères de recherche.'
                : 'Commencez par créer votre premier projet.'
              }
            </p>
            {(!searchTerm && selectedCategory === 'all') && (
              <Link
                to="/projects/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer un projet
              </Link>
            )}
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && projectToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Supprimer le projet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Êtes-vous sûr de vouloir supprimer le projet "{projectToDelete.title}" ? 
                Cette action est irréversible.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setProjectToDelete(null)
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeleteProject(projectToDelete.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects
