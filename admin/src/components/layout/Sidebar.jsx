import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Award, 
  Settings, 
  Shield,
  Home
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Projets',
    href: '/projects',
    icon: FolderOpen
  },
  {
    name: 'Compétences',
    href: '/skills',
    icon: Award
  },
  {
    name: 'Paramètres',
    href: '/settings',
    icon: Settings
  }
]

export default function Sidebar() {
  return (
    <aside className="min-h-full w-64 bg-base-100 text-base-content">
      {/* Logo */}
      <div className="p-6 border-b border-base-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-content" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Forgeron du Web</h2>
            <p className="text-xs text-base-content/70">Administration</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="menu menu-lg w-full">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-content'
                        : 'hover:bg-base-200'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300">
        <div className="text-center">
          <p className="text-xs text-base-content/50">
            Version 1.0.0
          </p>
          <p className="text-xs text-base-content/50 mt-1">
            © 2024 Forgeron du Web
          </p>
        </div>
      </div>
    </aside>
  )
}
