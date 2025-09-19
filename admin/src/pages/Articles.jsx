import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Tag,
  FileText,
  Clock
} from 'lucide-react'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

const Articles = () => {
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState(null)

  const categories = [
    'all',
    'Développement Web',
    'JavaScript',
    'React',
    'Node.js',
    'CSS',
    'Design',
    'Tutoriels',
    'Actualités Tech',
    'Outils',
    'Autres'
  ]

  useEffect(() => {
    loadArticles()
  }, [])

  useEffect(() => {
    filterArticles()
  }, [articles, searchTerm, selectedStatus, selectedCategory])

  const loadArticles = async () => {
    try {
      setIsLoading(true)
      const response = await apiService.getArticles()
      const articlesData = response.data.data.articles || response.data.data || []
      setArticles(articlesData)
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error)
      toast.error('Erreur lors du chargement des articles')
      setArticles([])
    } finally {
      setIsLoading(false)
    }
  }

  const filterArticles = () => {
    let filtered = articles

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags?.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(article => article.status === selectedStatus)
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    setFilteredArticles(filtered)
  }

  const handleDeleteArticle = async (id) => {
    try {
      await apiService.deleteArticle(id)
      setArticles(articles.filter(a => a._id !== id))
      toast.success('Article supprimé avec succès')
      setShowDeleteModal(false)
      setArticleToDelete(null)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error('Erreur lors de la suppression de l\'article')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'archived':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
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
      case 'archived':
        return 'Archivé'
      default:
        return 'Inconnu'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="flex space-x-2">
                      <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
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
              Gestion des articles
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez vos articles de blog
            </p>
          </div>
          <Link
            to="/articles/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel article
          </Link>
        </div>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 space-y-6">
        {/* Filtres */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Filtre par statut */}
            <div className="sm:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="published">Publié</option>
                <option value="draft">Brouillon</option>
                <option value="archived">Archivé</option>
              </select>
            </div>

            {/* Filtre par catégorie */}
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
              {filteredArticles.length} article(s) trouvé(s)
            </p>
          </div>
        </div>

        {/* Liste des articles */}
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <div
              key={article._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {article.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(article.status)}`}>
                      {getStatusText(article.status)}
                    </span>
                    {article.featured && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
                        Mis en avant
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(article.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      {article.category}
                    </div>
                    {article.readingTime && (
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {article.readingTime} min de lecture
                      </div>
                    )}
                    {article.views > 0 && (
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {article.views} vues
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                          +{article.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {article.status === 'published' && (
                    <a
                      href={`/blog/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Voir l'article"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  )}
                  <Link
                    to={`/articles/${article._id}/edit`}
                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      setArticleToDelete(article)
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
          ))}
        </div>

        {/* État vide */}
        {filteredArticles.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun article trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all'
                ? 'Essayez de modifier vos critères de recherche.'
                : 'Commencez par créer votre premier article.'
              }
            </p>
          </div>
        )}

        {/* Modal de suppression */}
        {showDeleteModal && articleToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Supprimer l'article
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Êtes-vous sûr de vouloir supprimer l'article "{articleToDelete.title}" ? 
                Cette action est irréversible.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setArticleToDelete(null)
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeleteArticle(articleToDelete._id)}
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

export default Articles
