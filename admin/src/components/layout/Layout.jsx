import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="drawer lg:drawer-open">
        <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />
        
        <div className="drawer-content flex flex-col">
          {/* Header */}
          <Header />
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
        
        {/* Sidebar */}
        <div className="drawer-side">
          <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
