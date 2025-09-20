import axios from 'axios'

// Configuration de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Instance Axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.log('API Request:', config.method?.toUpperCase(), config.url)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.log('API Response:', response.status, response.data)
    }
    return response
  },
  (error) => {
    // Rediriger vers la page de connexion si non autorisé
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/login'
    }
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Services API
export const apiService = {
  // Authentification via le backend
  login: (credentials) => api.post('/admin/login', credentials),
  logout: () => {
    localStorage.removeItem('admin_token')
    return Promise.resolve()
  },
  
  // Projets (routes admin)
  getProjects: () => api.get('/admin/projects'),
  getProject: (id) => api.get(`/admin/projects/${id}`),
  createProject: (data) => api.post('/admin/projects', data),
  updateProject: (id, data) => api.put(`/admin/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/admin/projects/${id}`),

  // Compétences (routes admin)
  getSkills: () => api.get('/admin/skills'),
  getSkill: (id) => api.get(`/admin/skills/${id}`),
  createSkill: (data) => api.post('/admin/skills', data),
  updateSkill: (id, data) => api.put(`/admin/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/admin/skills/${id}`),

  // Articles (routes admin)
  getArticles: (params = {}) => api.get('/admin/articles', { params }),
  getArticle: (id) => api.get(`/admin/articles/${id}`),
  createArticle: (data) => api.post('/admin/articles', data),
  updateArticle: (id, data) => api.put(`/admin/articles/${id}`, data),
  deleteArticle: (id) => api.delete(`/admin/articles/${id}`),

  // Messages de contact (routes admin)
  getContactMessages: () => api.get('/admin/messages'),
  markMessageAsRead: (id) => api.patch(`/admin/messages/${id}/read`),
  deleteMessage: (id) => api.delete(`/admin/messages/${id}`),

  // Statistiques du dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),

  // Upload d'images
  uploadProjectImages: (formData) => {
    return api.post('/admin/upload/project-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Santé de l'API
  healthCheck: () => axios.get(`${API_URL}/health`),
}

// Utilitaires
export const apiUtils = {
  isApiAvailable: async () => {
    try {
      await apiService.healthCheck()
      return true
    } catch (error) {
      console.error('API non disponible:', error.message)
      return false
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('admin_token')
  },

  getApiUrl: () => API_URL,
  getApiBaseUrl: () => API_BASE_URL,
}

export default api
