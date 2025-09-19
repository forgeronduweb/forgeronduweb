import { useState } from 'react'
import { Save, User, Lock, Globe, Bell, Palette, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState({
    // Profile
    name: 'Administrateur',
    email: 'admin@forgeron.dev',
    bio: 'Développeur web passionné par les technologies modernes',
    website: 'https://forgeron.dev',
    location: 'France',
    
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    
    // Notifications
    emailNotifications: true,
    projectUpdates: true,
    securityAlerts: true,
    marketingEmails: false,
    
    // Appearance
    theme: 'light',
    language: 'fr',
    
    // Site
    siteTitle: 'Forgeron du Web',
    siteDescription: 'Portfolio de développeur web',
    maintenanceMode: false,
    analyticsEnabled: true
  })

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'security', name: 'Sécurité', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Apparence', icon: Palette },
    { id: 'site', name: 'Site', icon: Globe }
  ]

  const handleSave = (section) => {
    // Ici vous pourriez envoyer les données à votre API
    toast.success(`Paramètres ${section} sauvegardés avec succès`)
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    
    if (settings.newPassword !== settings.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    
    if (settings.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    
    // Ici vous pourriez envoyer la demande de changement de mot de passe
    toast.success('Mot de passe modifié avec succès')
    setSettings({
      ...settings,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">
                  <span className="label-text">Nom complet</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={settings.name}
                  onChange={(e) => setSettings({...settings, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text">Biographie</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full h-24"
                value={settings.bio}
                onChange={(e) => setSettings({...settings, bio: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">
                  <span className="label-text">Site web</span>
                </label>
                <input
                  type="url"
                  className="input input-bordered w-full"
                  value={settings.website}
                  onChange={(e) => setSettings({...settings, website: e.target.value})}
                />
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Localisation</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={settings.location}
                  onChange={(e) => setSettings({...settings, location: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                className="btn btn-primary"
                onClick={() => handleSave('du profil')}
              >
                <Save className="w-4 h-4" />
                Sauvegarder
              </button>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div className="card bg-base-100 border border-base-300">
              <div className="card-body">
                <h3 className="card-title">Changer le mot de passe</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Mot de passe actuel</span>
                    </label>
                    <input
                      type="password"
                      className="input input-bordered w-full"
                      value={settings.currentPassword}
                      onChange={(e) => setSettings({...settings, currentPassword: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="label">
                      <span className="label-text">Nouveau mot de passe</span>
                    </label>
                    <input
                      type="password"
                      className="input input-bordered w-full"
                      value={settings.newPassword}
                      onChange={(e) => setSettings({...settings, newPassword: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="label">
                      <span className="label-text">Confirmer le nouveau mot de passe</span>
                    </label>
                    <input
                      type="password"
                      className="input input-bordered w-full"
                      value={settings.confirmPassword}
                      onChange={(e) => setSettings({...settings, confirmPassword: e.target.value})}
                    />
                  </div>
                  
                  <button type="submit" className="btn btn-primary">
                    Changer le mot de passe
                  </button>
                </form>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-300">
              <div className="card-body">
                <h3 className="card-title">Authentification à deux facteurs</h3>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Activer l'authentification à deux facteurs</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={settings.twoFactorEnabled}
                      onChange={(e) => setSettings({...settings, twoFactorEnabled: e.target.checked})}
                    />
                  </label>
                </div>
                <p className="text-sm text-base-content/70 mt-2">
                  Ajoutez une couche de sécurité supplémentaire à votre compte
                </p>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="card bg-base-100 border border-base-300">
              <div className="card-body">
                <h3 className="card-title">Préférences de notification</h3>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Notifications par email</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                      />
                    </label>
                  </div>
                  
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Mises à jour des projets</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={settings.projectUpdates}
                        onChange={(e) => setSettings({...settings, projectUpdates: e.target.checked})}
                      />
                    </label>
                  </div>
                  
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Alertes de sécurité</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={settings.securityAlerts}
                        onChange={(e) => setSettings({...settings, securityAlerts: e.target.checked})}
                      />
                    </label>
                  </div>
                  
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Emails marketing</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={settings.marketingEmails}
                        onChange={(e) => setSettings({...settings, marketingEmails: e.target.checked})}
                      />
                    </label>
                  </div>
                </div>
                
                <div className="card-actions justify-end mt-6">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleSave('de notification')}
                  >
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="card bg-base-100 border border-base-300">
              <div className="card-body">
                <h3 className="card-title">Apparence</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Thème</span>
                    </label>
                    <select
                      className="select select-bordered w-full max-w-xs"
                      value={settings.theme}
                      onChange={(e) => setSettings({...settings, theme: e.target.value})}
                    >
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="auto">Automatique</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="label">
                      <span className="label-text">Langue</span>
                    </label>
                    <select
                      className="select select-bordered w-full max-w-xs"
                      value={settings.language}
                      onChange={(e) => setSettings({...settings, language: e.target.value})}
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
                
                <div className="card-actions justify-end mt-6">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleSave('d\'apparence')}
                  >
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'site':
        return (
          <div className="space-y-6">
            <div className="card bg-base-100 border border-base-300">
              <div className="card-body">
                <h3 className="card-title">Configuration du site</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Titre du site</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={settings.siteTitle}
                      onChange={(e) => setSettings({...settings, siteTitle: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="label">
                      <span className="label-text">Description du site</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Mode maintenance</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-warning"
                        checked={settings.maintenanceMode}
                        onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                      />
                    </label>
                  </div>
                  
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Analytics activé</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={settings.analyticsEnabled}
                        onChange={(e) => setSettings({...settings, analyticsEnabled: e.target.checked})}
                      />
                    </label>
                  </div>
                </div>
                
                <div className="card-actions justify-end mt-6">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleSave('du site')}
                  >
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-base-content">Paramètres</h1>
        <p className="text-base-content/70 mt-1">
          Configurez votre compte et vos préférences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-64">
          <div className="menu bg-base-100 rounded-box shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <li key={tab.id}>
                  <button
                    className={`flex items-center gap-3 ${
                      activeTab === tab.id ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                </li>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
