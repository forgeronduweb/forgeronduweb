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
    // Ajouter des headers personnalisés si nécessaire
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
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Services API
export const apiService = {
  // Projets
  getProjects: () => api.get('/projects'),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),

  // Compétences
  getSkills: () => api.get('/skills'),
  getSkill: (id) => api.get(`/skills/${id}`),
  createSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),

  // Contact
  sendContactMessage: (data) => api.post('/contact', data),

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

  getApiUrl: () => API_URL,
  getApiBaseUrl: () => API_BASE_URL,
}

export default api
