import { useState, useEffect } from 'react'
import { 
  FolderOpen, 
  Award, 
  Users, 
  TrendingUp,
  Eye,
  MessageSquare,
  Calendar,
  Activity
} from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 12,
    skills: 25,
    visitors: 1247,
    messages: 8
  })

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'project',
      title: 'Nouveau projet ajouté',
      description: 'Site e-commerce React',
      time: '2 heures',
      icon: FolderOpen
    },
    {
      id: 2,
      type: 'skill',
      title: 'Compétence mise à jour',
      description: 'Next.js niveau expert',
      time: '1 jour',
      icon: Award
    },
    {
      id: 3,
      type: 'message',
      title: 'Nouveau message',
      description: 'Demande de collaboration',
      time: '2 jours',
      icon: MessageSquare
    }
  ])

  const statsCards = [
    {
      title: 'Projets',
      value: stats.projects,
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+2 ce mois'
    },
    {
      title: 'Compétences',
      value: stats.skills,
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+3 récemment'
    },
    {
      title: 'Visiteurs',
      value: stats.visitors,
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+15% ce mois'
    },
    {
      title: 'Messages',
      value: stats.messages,
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '3 non lus'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Dashboard</h1>
          <p className="text-base-content/70 mt-1">
            Vue d'ensemble de votre portfolio
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-base-content/70">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base-content/70 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-base-content mt-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-success mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activités récentes */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="card-title">Activités récentes</h2>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-base-200 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-base-content text-sm">
                        {activity.title}
                      </p>
                      <p className="text-base-content/70 text-xs mt-1">
                        {activity.description}
                      </p>
                      <p className="text-base-content/50 text-xs mt-1">
                        Il y a {activity.time}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-ghost btn-sm">
                Voir tout
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-success" />
              <h2 className="card-title">Aperçu des performances</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/70">Projets complétés</span>
                <div className="flex items-center gap-2">
                  <progress className="progress progress-primary w-20" value="85" max="100"></progress>
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/70">Compétences maîtrisées</span>
                <div className="flex items-center gap-2">
                  <progress className="progress progress-success w-20" value="92" max="100"></progress>
                  <span className="text-sm font-medium">92%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/70">Satisfaction client</span>
                <div className="flex items-center gap-2">
                  <progress className="progress progress-warning w-20" value="98" max="100"></progress>
                  <span className="text-sm font-medium">98%</span>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">4.9</p>
                <p className="text-xs text-base-content/70">Note moyenne</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">100%</p>
                <p className="text-xs text-base-content/70">Projets livrés</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn btn-primary btn-outline">
              <FolderOpen className="w-4 h-4" />
              Nouveau projet
            </button>
            <button className="btn btn-secondary btn-outline">
              <Award className="w-4 h-4" />
              Ajouter une compétence
            </button>
            <button className="btn btn-accent btn-outline">
              <MessageSquare className="w-4 h-4" />
              Voir les messages
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
