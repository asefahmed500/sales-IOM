'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FileUpload } from '@/components/FileUpload'
import { formatCurrency } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'
import { LogOut, User, Mail, Phone, Target, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface User {
  _id: string
  name: string
  email: string
  role: string
  employeeId: string
  assignedTarget: number
  phone?: string
  profilePicture?: string
  createdAt: string
  assignedManager?: {
    name: string
    employeeId: string
  }
}

export default function ExecutiveProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    phone: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      if (data.length > 0) {
        const userData = data[0]
        setUser(userData)
        setEditData({
          name: userData.name,
          phone: userData.phone || ''
        })
        setProfilePictureUrl(userData.profilePicture || '')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editData,
          profilePicture: profilePictureUrl
        }),
      })

      if (response.ok) {
        await fetchUserData()
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setPasswordSuccess('Password updated successfully')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        setPasswordError(data.error || 'Failed to update password')
      }
    } catch (error) {
      console.error('Error updating password:', error)
      setPasswordError('Failed to update password')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await authClient.signOut()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">User not found</p>
          <Button onClick={() => router.push('/executive/dashboard')}>
            Back to Dashboard
          </Button>
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
              <Link href="/executive/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-600">Manage your account information</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{user.role?.toUpperCase()}</Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profilePictureUrl || user.profilePicture} />
                    <AvatarFallback className="text-2xl">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.employeeId}</p>
                    <Badge variant="secondary" className="mt-2">{user.role}</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatCurrency(user.assignedTarget)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {user.assignedManager && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-sm mb-2">Manager</h4>
                    <p className="text-sm">{user.assignedManager.name}</p>
                    <p className="text-xs text-muted-foreground">{user.assignedManager.employeeId}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Edit Profile */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <FileUpload
                        onFileSelect={setProfilePicture}
                        onUploadComplete={setProfilePictureUrl}
                        label="Profile Picture"
                        accept="image/*"
                        maxSize={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        value={user.email}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed. Contact admin for email updates.
                      </p>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Full Name</Label>
                      <p className="text-sm text-muted-foreground">{user.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email Address</Label>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone Number</Label>
                      <p className="text-sm text-muted-foreground">{user.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Employee ID</Label>
                      <p className="text-sm text-muted-foreground">{user.employeeId}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Assigned Target</Label>
                      <p className="text-sm text-muted-foreground">{formatCurrency(user.assignedTarget)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Role</Label>
                      <p className="text-sm text-muted-foreground">{user.role}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Member Since</Label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                  {passwordError && (
                    <div className="text-red-500 text-sm">{passwordError}</div>
                  )}
                  {passwordSuccess && (
                    <div className="text-green-500 text-sm">{passwordSuccess}</div>
                  )}
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}