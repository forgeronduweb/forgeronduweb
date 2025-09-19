import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Eye, X, Plus, Hash, Image as ImageIcon } from 'lucide-react'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

const ArticleForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: {
      url: '',
      alt: ''
    },
    category: 'Développement Web',
    tags: [],
    status: 'draft',
    featured: false,
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    }
  })
  const [newTag, setNewTag] = useState('')
  const [newKeyword, setNewKeyword] = useState('')

  const categories = [
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

  const statusOptions = [
    { value: 'draft', label: 'Brouillon', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
    { value: 'published', label: 'Publié', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
    { value: 'archived', label: 'Archivé', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' }
  ]

  useEffect(() => {
    if (isEditing) {
      loadArticle()
    }
  }, [id, isEditing])

  const loadArticle = async () => {
    try {
      setIsLoading(true)
      const response = await apiService.getArticle(id)
      const article = response.data.data
      
      setFormData({
        title: article.title || '',
        slug: article.slug || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        featuredImage: article.featuredImage || { url: '', alt: '' },
        category: article.category || 'Développement Web',
        tags: article.tags || [],
        status: article.status || 'draft',
        featured: article.featured || false,
        seo: article.seo || { metaTitle: '', metaDescription: '', keywords: [] }
      })
    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error)
      toast.error('Erreur lors du chargement de l\'article')
      navigate('/articles')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
    
    // Générer le slug automatiquement à partir du titre
    if (name === 'title' && !isEditing) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !formData.seo.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, newKeyword.trim()]
        }
      }))
      setNewKeyword('')
    }
  }

  const handleRemoveKeyword = (keywordToRemove) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter(keyword => keyword !== keywordToRemove)
      }
    }))
  }

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      action()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Le titre et le contenu sont requis')
      return
    }

    try {
      setIsSaving(true)
      
      if (isEditing) {
        await apiService.updateArticle(id, formData)
        toast.success('Article mis à jour avec succès')
      } else {
        await apiService.createArticle(formData)
        toast.success('Article créé avec succès')
      }
      
      navigate('/articles')
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      const message = error.response?.data?.error || 'Erreur lors de la sauvegarde'
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    // Ouvrir un aperçu de l'article (à implémenter)
    toast.info('Aperçu à venir')
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-30 pb-4 mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/articles')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="w-48 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-64 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Chargement de l'article...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header fixe */}
      <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-30 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/articles')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditing ? 'Modifier l\'article' : 'Nouvel article'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isEditing ? 'Modifiez les informations de l\'article' : 'Créez un nouvel article pour votre blog'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePreview}
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Aperçu
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Mettre à jour' : 'Créer'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations de base */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Informations de base
                </h3>
                
                <div className="space-y-4">
                  {/* Titre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Titre de l'article *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Ex: Les meilleures pratiques React en 2024"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Slug (URL)
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="les-meilleures-pratiques-react-2024"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      URL de l'article : /blog/{formData.slug || 'slug-de-l-article'}
                    </p>
                  </div>

                  {/* Extrait */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Extrait *
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      maxLength={300}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      placeholder="Résumé de l'article qui apparaîtra dans la liste des articles..."
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formData.excerpt.length}/300 caractères
                    </p>
                  </div>

                  {/* Contenu */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contenu de l'article *
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                      rows={15}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      placeholder="Rédigez le contenu de votre article ici..."
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Vous pouvez utiliser du HTML ou du Markdown
                    </p>
                  </div>
                </div>
              </div>

              {/* SEO */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Optimisation SEO
                </h3>
                
                <div className="space-y-4">
                  {/* Meta titre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta titre
                    </label>
                    <input
                      type="text"
                      name="seo.metaTitle"
                      value={formData.seo.metaTitle}
                      onChange={handleInputChange}
                      maxLength={60}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Titre optimisé pour les moteurs de recherche"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formData.seo.metaTitle.length}/60 caractères
                    </p>
                  </div>

                  {/* Meta description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta description
                    </label>
                    <textarea
                      name="seo.metaDescription"
                      value={formData.seo.metaDescription}
                      onChange={handleInputChange}
                      maxLength={160}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      placeholder="Description qui apparaîtra dans les résultats de recherche"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formData.seo.metaDescription.length}/160 caractères
                    </p>
                  </div>

                  {/* Mots-clés SEO */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mots-clés SEO
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, handleAddKeyword)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Ex: react, javascript, développement..."
                      />
                      <button
                        type="button"
                        onClick={handleAddKeyword}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.seo.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-sm rounded-full"
                        >
                          <Hash className="w-3 h-3 mr-1" />
                          {keyword}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(keyword)}
                            className="ml-2 text-purple-500 hover:text-purple-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publication */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Publication
                </h3>
                
                <div className="space-y-4">
                  {/* Statut */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Statut
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Catégorie
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Article mis en avant */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      id="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Article mis en avant
                    </label>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tags
                </h3>
                
                <div className="space-y-4">
                  {/* Ajouter un tag */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleAddTag)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Ex: react, tutorial..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Liste des tags */}
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Image mise en avant */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Image mise en avant
                </h3>
                
                <div className="space-y-4">
                  {/* URL de l'image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      URL de l'image
                    </label>
                    <input
                      type="url"
                      name="featuredImage.url"
                      value={formData.featuredImage.url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* Alt text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Texte alternatif
                    </label>
                    <input
                      type="text"
                      name="featuredImage.alt"
                      value={formData.featuredImage.alt}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Description de l'image"
                    />
                  </div>

                  {/* Aperçu de l'image */}
                  {formData.featuredImage.url && (
                    <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={formData.featuredImage.url}
                        alt={formData.featuredImage.alt || 'Aperçu'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ArticleForm
