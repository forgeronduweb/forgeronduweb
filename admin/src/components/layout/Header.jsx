import { Menu, Bell, User, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="navbar bg-base-100 shadow-sm border-b border-base-300">
      <div className="flex-none lg:hidden">
        <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost">
          <Menu className="w-5 h-5" />
        </label>
      </div>
      
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-base-content ml-4 lg:ml-0">
          Administration
        </h1>
      </div>
      
      <div className="flex-none gap-2">
        {/* Notifications */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <Bell className="w-5 h-5" />
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </div>
          <div tabIndex={0} className="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-base-100">
            <div className="card-body">
              <h3 className="font-bold">Notifications</h3>
              <span className="text-info">Aucune nouvelle notification</span>
            </div>
          </div>
        </div>

        {/* Profile Menu */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li className="menu-title">
              <span>{user?.name || 'Administrateur'}</span>
            </li>
            <li>
              <a className="text-sm text-base-content/70">
                {user?.email || 'admin@forgeron.dev'}
              </a>
            </li>
            <div className="divider my-1"></div>
            <li>
              <button onClick={logout} className="text-error">
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
