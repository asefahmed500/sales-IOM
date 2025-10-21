'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'
import { LogOut, Plus, Users, ArrowLeft, Edit, Trash2, UserCheck, UserX } from 'lucide-react'

interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'executive'
  employeeId: string
  assignedManager?: {
    _id: string
    name: string
    employeeId: string
  }
  assignedTarget?: number
  phone?: string
  isActive?: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'executive' as 'admin' | 'manager' | 'executive',
    phone: '',
    assignedTarget: '',
    assignedManager: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filterRole, setFilterRole] = useState<string>('all')
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
    fetchUsers()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      if (data.length > 0) {
        setUser(data[0])
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
          phone: newUser.phone,
          assignedTarget: newUser.assignedTarget ? parseFloat(newUser.assignedTarget) : undefined,
          assignedManager: newUser.assignedManager || undefined
        }),
      })

      if (response.ok) {
        await fetchUsers()
        setNewUser({
          name: '',
          email: '',
          password: '',
          role: 'executive',
          phone: '',
          assignedTarget: '',
          assignedManager: ''
        })
        setIsAddUserOpen(false)
      }
    } catch (error) {
      console.error('Error adding user:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        await fetchUsers()
      }
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchUsers()
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const handleLogout = async () => {
    await authClient.signOut()
    router.push('/login')
  }

  const filteredUsers = filterRole === 'all' 
    ? users 
    : users.filter(u => u.role === filterRole)

  const managers = users.filter(u => u.role === 'manager')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-600">Manage system users and permissions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{user?.role?.toUpperCase()}</Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  System Users
                </CardTitle>
                <CardDescription>
                  Manage all users in the system
                </CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                    <SelectItem value="manager">Managers</SelectItem>
                    <SelectItem value="executive">Executives</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddUser} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select
                            value={newUser.role}
                            onValueChange={(value: 'admin' | 'manager' | 'executive') => setNewUser({ ...newUser, role: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="executive">Executive</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={newUser.phone}
                            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assignedTarget">Target (for executives)</Label>
                          <Input
                            id="assignedTarget"
                            type="number"
                            value={newUser.assignedTarget}
                            onChange={(e) => setNewUser({ ...newUser, assignedTarget: e.target.value })}
                          />
                        </div>
                      </div>
                      {newUser.role === 'executive' && (
                        <div className="space-y-2">
                          <Label htmlFor="assignedManager">Assigned Manager</Label>
                          <Select
                            value={newUser.assignedManager}
                            onValueChange={(value) => setNewUser({ ...newUser, assignedManager: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select manager" />
                            </SelectTrigger>
                            <SelectContent>
                              {managers.map((manager) => (
                                <SelectItem key={manager._id} value={manager._id}>
                                  {manager.name} ({manager.employeeId})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Adding...' : 'Add User'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No users found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((userData) => (
                    <TableRow key={userData._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{userData.name}</p>
                          <p className="text-sm text-muted-foreground">{userData.email}</p>
                          <p className="text-xs text-muted-foreground">{userData.employeeId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          userData.role === 'admin' ? 'destructive' :
                          userData.role === 'manager' ? 'default' : 'secondary'
                        }>
                          {userData.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {userData.assignedManager ? (
                          <div>
                            <p className="text-sm">{userData.assignedManager.name}</p>
                            <p className="text-xs text-muted-foreground">{userData.assignedManager.employeeId}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {userData.assignedTarget ? formatCurrency(userData.assignedTarget) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={userData.isActive ? 'default' : 'secondary'}>
                          {userData.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleUserStatus(userData._id, userData.isActive || true)}
                          >
                            {userData.isActive ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(userData._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
