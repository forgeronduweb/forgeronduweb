import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const userData = localStorage.getItem('admin_user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error)
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
      }
    }
    
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Simulation d'une authentification (à remplacer par un vrai appel API)
      if (email === 'admin@forgeron.dev' && password === 'admin123') {
        const userData = {
          id: 1,
          email: 'admin@forgeron.dev',
          name: 'Administrateur',
          role: 'admin'
        }
        
        const token = 'fake-jwt-token-' + Date.now()
        
        localStorage.setItem('admin_token', token)
        localStorage.setItem('admin_user', JSON.stringify(userData))
        
        setUser(userData)
        setIsAuthenticated(true)
        
        toast.success('Connexion réussie !')
        return { success: true }
      } else {
        toast.error('Identifiants incorrects')
        return { success: false, error: 'Identifiants incorrects' }
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      toast.error('Erreur de connexion')
      return { success: false, error: 'Erreur de connexion' }
    }
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Déconnexion réussie')
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
