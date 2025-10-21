'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  DollarSign,
  Calculator,
  FileText,
  User,
  Shield,
  Menu,
  X,
  Target,
  TrendingUp,
  Package,
  UserCheck
} from 'lucide-react'

interface SidebarProps {
  user: {
    _id: string
    name: string
    email: string
    role: 'admin' | 'manager' | 'executive'
    employeeId: string
    profilePicture?: string
  }
  onLogout: () => void
}

const executiveMenuItems = [
  {
    title: 'Dashboard',
    href: '/executive/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'My Sales',
    href: '/executive/sales',
    icon: Package
  },
  {
    title: 'Profile',
    href: '/executive/profile',
    icon: User
  }
]

const managerMenuItems = [
  {
    title: 'Dashboard',
    href: '/manager/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Team Performance',
    href: '/manager/team',
    icon: Users
  },
  {
    title: 'Commission Calculator',
    href: '/manager/calculator',
    icon: Calculator
  },
  {
    title: 'Commission Rules',
    href: '/manager/rules',
    icon: Settings
  },
  {
    title: 'Reports',
    href: '/manager/reports',
    icon: FileText
  }
]

const adminMenuItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users
  },
  {
    title: 'System Analytics',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    title: 'Commission Rules',
    href: '/admin/rules',
    icon: Settings
  },
  {
    title: 'System Settings',
    href: '/admin/settings',
    icon: Shield
  }
]

export function Sidebar({ user, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const getMenuItems = () => {
    switch (user.role) {
      case 'admin':
        return adminMenuItems
      case 'manager':
        return managerMenuItems
      case 'executive':
        return executiveMenuItems
      default:
        return []
    }
  }

  const getRoleColor = () => {
    switch (user.role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'manager':
        return 'bg-blue-100 text-blue-800'
      case 'executive':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const menuItems = getMenuItems()

  return (
    <div className={cn(
      "bg-white border-r transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                IOM Sales
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profilePicture} />
            <AvatarFallback>
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.employeeId}</p>
              <Badge className={cn("text-xs mt-1", getRoleColor())}>
                {user.role.toUpperCase()}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isCollapsed ? "px-2" : "px-3",
                  isActive && "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                )}
              >
                <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                {!isCollapsed && item.title}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={onLogout}
          className={cn(
            "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
            isCollapsed ? "px-2" : "px-3"
          )}
        >
          <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </div>
  )
}
