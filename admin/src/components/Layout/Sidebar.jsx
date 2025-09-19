import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  FolderOpen, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut,
  BarChart3,
  User
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { logout, user } = useAuth()

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard', color: 'text-blue-500' },
    { path: '/projects', icon: FolderOpen, label: 'Projets', color: 'text-green-500' },
    { path: '/articles', icon: FileText, label: 'Articles', color: 'text-purple-500' },
    { path: '/messages', icon: MessageSquare, label: 'Messages', color: 'text-orange-500' },
    { path: '/stats', icon: BarChart3, label: 'Statistiques', color: 'text-indigo-500' },
    { path: '/settings', icon: Settings, label: 'Paramètres', color: 'text-gray-500' },
  ]

  const handleLogout = () => {
    logout()
    onClose?.()
  }

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Forgeron Admin
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Panel d'administration
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                      ${isActive 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : item.color}`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.email || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Administrateur
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
