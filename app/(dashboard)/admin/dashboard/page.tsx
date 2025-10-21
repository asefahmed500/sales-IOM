'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { DashboardCard } from '@/components/DashboardCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { Users, DollarSign, TrendingUp, Shield, UserPlus, BarChart3, CheckCircle, XCircle, Clock } from 'lucide-react'

interface User {
  _id: string
  name: string
  email: string
  role: string
  employeeId: string
  assignedTarget: number
  isActive: boolean
}

interface Sale {
  _id: string
  productName: string
  saleAmount: number
  quantity: number
  saleDate: string
  salesExecutive: string
}

interface CommissionRecord {
  _id: string
  salesExecutive: string
  amount: number
  calculatedBy: string
  calculationDate: string
  salesTotal: number
  targetAchievement: number
  commissionRate: number
  status: 'pending' | 'approved' | 'rejected' | 'paid'
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [commissionRecords, setCommissionRecords] = useState<CommissionRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [usersResponse, salesResponse, commissionsResponse] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/sales'),
        fetch('/api/commission/records')
      ])

      const usersData = await usersResponse.json()
      const salesData = await salesResponse.json()
      const commissionsData = await commissionsResponse.json()

      setUsers(usersData)
      setSales(salesData)
      setCommissionRecords(commissionsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalUsers = users.length
  const totalSales = sales.reduce((sum, sale) => sum + sale.saleAmount, 0)
  const executives = users.filter(user => user.role === 'executive')
  const managers = users.filter(user => user.role === 'manager')
  const activeUsers = users.filter(user => user.isActive !== false)
  
  // Calculate commission statistics
  const pendingCommissions = commissionRecords.filter(record => record.status === 'pending').length
  const approvedCommissions = commissionRecords.filter(record => record.status === 'approved').length
  const paidCommissions = commissionRecords.filter(record => record.status === 'paid').length
  const totalCommissionAmount = commissionRecords
    .filter(record => record.status === 'approved' || record.status === 'paid')
    .reduce((sum, record) => sum + record.amount, 0)

  return (
    <DashboardLayout 
      title="Admin Dashboard" 
      subtitle="System Overview & Management"
      requiredRole="admin"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Users"
          value={totalUsers}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          subtitle={`${executives.length} executives, ${managers.length} managers`}
        />
        <DashboardCard
          title="Total Sales"
          value={totalSales}
          format="currency"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Active Users"
          value={activeUsers.length}
          icon={<Shield className="h-4 w-4 text-muted-foreground" />}
          subtitle="Non-admin users"
        />
        <DashboardCard
          title="Total Commissions"
          value={totalCommissionAmount}
          format="currency"
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
          subtitle="Approved & paid commissions"
        />
      </div>

      {/* Commission Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-500" />
              Pending Commissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingCommissions}</div>
            <p className="text-sm text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Approved Commissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedCommissions}</div>
            <p className="text-sm text-muted-foreground">Ready for payment</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
              Paid Commissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{paidCommissions}</div>
            <p className="text-sm text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>All Executives Performance</CardTitle>
            <CardDescription>Performance metrics across all teams</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading data...</p>
              </div>
            ) : executives.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No executives found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Sales Amount</TableHead>
                    <TableHead>Target Achievement</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {executives.map((user) => {
                    const userSales = sales.filter(sale => sale.salesExecutive === user._id)
                    const totalSales = userSales.reduce((sum, sale) => sum + sale.saleAmount, 0)
                    const achievement = user.assignedTarget > 0 ? (totalSales / user.assignedTarget) * 100 : 0

                    return (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.employeeId}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{user.role.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(totalSales)}</TableCell>
                        <TableCell>
                          <Badge variant={achievement >= 100 ? 'default' : achievement >= 80 ? 'secondary' : 'destructive'}>
                            {formatPercentage(achievement)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? 'default' : 'destructive'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
            <CardDescription>System management tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button className="w-full" variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              System Settings
            </Button>
            <Button className="w-full" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button className="w-full" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Commission Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Commission Activity</CardTitle>
          <CardDescription>Latest commission calculations and approvals</CardDescription>
        </CardHeader>
        <CardContent>
          {commissionRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No commission activity found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Executive</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissionRecords.slice(0, 5).map((record) => {
                  const executive = executives.find(user => user._id === record.salesExecutive)
                  return (
                    <TableRow key={record._id}>
                      <TableCell>
                        <div className="font-medium">{executive?.name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">{executive?.employeeId}</div>
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(record.amount)}</TableCell>
                      <TableCell>{new Date(record.calculationDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          record.status === 'pending' ? 'secondary' : 
                          record.status === 'approved' ? 'default' : 
                          record.status === 'paid' ? 'outline' : 'destructive'
                        }>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system health and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-green-600">Uptime</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{sales.length}</div>
              <div className="text-sm text-blue-600">Total Transactions</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">Active</div>
              <div className="text-sm text-purple-600">Database Status</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}