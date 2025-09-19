import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectForm from './pages/ProjectForm'
import Messages from './pages/Messages'
import Settings from './pages/Settings'
import Articles from './pages/Articles'
import ArticleForm from './pages/ArticleForm'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Route publique */}
            <Route path="/login" element={<Login />} />
            
            {/* Routes protégées */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/new" element={<ProjectForm />} />
              <Route path="/projects/:id/edit" element={<ProjectForm />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/new" element={<ArticleForm />} />
              <Route path="/articles/:id/edit" element={<ArticleForm />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Pages à implémenter plus tard */}
              <Route path="stats" element={
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Statistiques
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Cette page sera bientôt disponible
                  </p>
                </div>
              } />
              
              <Route path="settings" element={
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Paramètres
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Cette page sera bientôt disponible
                  </p>
                </div>
              } />
              
              {/* Formulaires de création/édition (à implémenter) */}
              <Route path="projects/new" element={
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Nouveau projet
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Formulaire de création de projet à implémenter
                  </p>
                </div>
              } />
              
              <Route path="projects/:id/edit" element={
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Modifier le projet
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Formulaire d'édition de projet à implémenter
                  </p>
                </div>
              } />
              
              <Route path="articles/new" element={
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Nouvel article
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Formulaire de création d'article à implémenter
                  </p>
                </div>
              } />
              
              <Route path="articles/:id/edit" element={
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Modifier l'article
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Formulaire d'édition d'article à implémenter
                  </p>
                </div>
              } />
            </Route>
            
            {/* Redirection par défaut */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Notifications Toast */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
