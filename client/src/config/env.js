// Configuration des variables d'environnement
export const config = {
  // URLs de l'API
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  
  // URLs externes
  adminUrl: import.meta.env.VITE_ADMIN_URL || 'http://localhost:3001',
  
  // Configuration de l'app
  appTitle: import.meta.env.VITE_APP_TITLE || 'Forgeron du Web',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Portfolio de développeur web',
  
  // Configuration de développement
  isDevelopment: import.meta.env.VITE_NODE_ENV === 'development',
  enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
}

// Validation de la configuration
export const validateConfig = () => {
  const errors = []
  
  if (!config.apiUrl) {
    errors.push('VITE_API_URL est requis')
  }
  
  if (!config.apiBaseUrl) {
    errors.push('VITE_API_BASE_URL est requis')
  }
  
  if (errors.length > 0) {
    console.error('Erreurs de configuration:', errors)
    throw new Error(`Configuration invalide: ${errors.join(', ')}`)
  }
  
  if (config.enableDebug) {
    console.log('Configuration chargée:', config)
  }
}

// Initialiser la validation
validateConfig()

export default config
