import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  // Gérer le thème
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setIsDark(shouldBeDark)
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('admin-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('admin-theme', 'light')
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" data-theme={isDark ? 'dark' : 'light'}>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <div className="sticky top-0 z-40">
          <Header 
            onMenuClick={toggleSidebar}
            isDark={isDark}
            onThemeToggle={toggleTheme}
          />
        </div>
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            <div className="animate-fadeIn">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
