import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FolderOpen, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Users,
  Eye,
  Calendar,
  Activity
} from 'lucide-react'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    articles: 0,
    messages: 0,
    views: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Charger les statistiques depuis le backend
      const statsResponse = await apiService.getDashboardStats()
      const dashboardStats = statsResponse.data.data
      
      setStats({
        projects: dashboardStats.projects,
        articles: dashboardStats.articles || 0,
        messages: dashboardStats.messages,
        views: dashboardStats.visitors
      })
      
      // Activité récente simulée (à remplacer par de vraies données plus tard)
      setRecentActivity([
        {
          id: 1,
          type: 'message',
          title: 'Nouveau message de contact',
          description: `${dashboardStats.unreadMessages} message(s) non lu(s)`,
          time: '2 minutes ago',
          icon: MessageSquare,
          color: 'text-blue-500'
        },
        {
          id: 2,
          type: 'project',
          title: 'Projets disponibles',
          description: `${dashboardStats.projects} projet(s) dans le portfolio`,
          time: '1 heure ago',
          icon: FolderOpen,
          color: 'text-green-500'
        },
        {
          id: 3,
          type: 'skill',
          title: 'Compétences mises à jour',
          description: `${dashboardStats.skills} compétence(s) référencées`,
          time: '3 heures ago',
          icon: FileText,
          color: 'text-purple-500'
        }
      ])
      
      setIsLoading(false)
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      toast.error('Erreur lors du chargement des données du backend')
      setIsLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, link, change }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {isLoading ? (
              <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ) : (
              value
            )}
          </p>
          {change && (
            <p className="text-sm text-green-600 mt-1">
              +{change}% ce mois
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-700`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      {link && (
        <Link 
          to={link}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-4"
        >
          Voir tout
          <TrendingUp className="w-4 h-4 ml-1" />
        </Link>
      )}
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header fixe */}
      <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-30 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tableau de bord
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Vue d'ensemble de votre portfolio
        </p>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Projets"
          value={stats.projects}
          icon={FolderOpen}
          color="text-blue-500"
          link="/projects"
          change={12}
        />
        <StatCard
          title="Articles"
          value={stats.articles}
          icon={FileText}
          color="text-purple-500"
          link="/articles"
          change={8}
        />
        <StatCard
          title="Messages"
          value={stats.messages}
          icon={MessageSquare}
          color="text-orange-500"
          link="/messages"
          change={25}
        />
        <StatCard
          title="Vues totales"
          value={stats.views}
          icon={Eye}
          color="text-green-500"
          change={15}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Activité récente
              </h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="flex-1">
                      <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                      <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {activity.description}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {activity.time}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Actions rapides
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/projects/new"
                className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <FolderOpen className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  Nouveau projet
                </span>
              </Link>
              
              <Link
                to="/articles/new"
                className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <FileText className="w-8 h-8 text-purple-500 mb-2" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                  Nouvel article
                </span>
              </Link>
              
              <Link
                to="/messages"
                className="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
              >
                <MessageSquare className="w-8 h-8 text-orange-500 mb-2" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                  Voir messages
                </span>
              </Link>
              
              <Link
                to="/stats"
                className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  Statistiques
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">
              Bienvenue dans votre administration !
            </h3>
            <p className="text-blue-100">
              Gérez facilement votre portfolio, vos articles et vos messages de contact.
            </p>
          </div>
          <Calendar className="w-12 h-12 text-blue-200" />
        </div>
      </div>
      </div>
    </div>
  )
}

export default Dashboard
