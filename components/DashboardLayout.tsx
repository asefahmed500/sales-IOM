'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  requiredRole?: 'admin' | 'manager' | 'executive'
}

interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'executive'
  employeeId: string
  profilePicture?: string
}

export function DashboardLayout({ children, title, subtitle, requiredRole }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // First validate the session
      const validationResponse = await fetch('/api/auth/validate')
      if (!validationResponse.ok) {
        router.push('/login')
        return
      }

      const validationData = await validationResponse.json()
      
      // Check if role matches required role
      if (requiredRole && validationData.role !== requiredRole) {
        router.push(`/${validationData.role}/dashboard`)
        return
      }

      // Fetch user data
      const response = await fetch('/api/users')
      const data = await response.json()
      if (data.length > 0) {
        setUser(data[0])
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
      router.push('/login')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500">User not found</p>
          <Button onClick={() => router.push('/login')}>
            Back to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full z-40 lg:relative lg:z-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-transform duration-300 ease-in-out
      `}>
        <Sidebar user={user} onLogout={handleLogout} />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 flex-1">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}