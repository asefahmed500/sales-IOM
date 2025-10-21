'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { DashboardCard } from '@/components/DashboardCard'
import { CommissionModal } from '@/components/CommissionModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { Users, DollarSign, TrendingUp, Calculator, Settings, Check, X } from 'lucide-react'

interface User {
  _id: string
  name: string
  email: string
  role: string
  employeeId: string
  assignedTarget: number
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
  status: 'pending' | 'approved' | 'paid'
}

export default function ManagerDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [commissionRecords, setCommissionRecords] = useState<CommissionRecord[]>([])
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)

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

      setUsers(usersData.filter((user: User) => user.role === 'executive'))
      setSales(salesData)
      setCommissionRecords(commissionsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCalculateCommission = async (user: User) => {
    setCalculating(true)
    try {
      const response = await fetch('/api/commission/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ executiveId: user._id }),
      })

      if (response.ok) {
        const data = await response.json()
        setSelectedUser(user)
        setIsCommissionModalOpen(true)
        // Refresh commission records
        fetchData()
      }
    } catch (error) {
      console.error('Error calculating commission:', error)
    } finally {
      setCalculating(false)
    }
  }

  const handleApproveCommission = async (commissionId: string) => {
    try {
      const response = await fetch(`/api/commission/approve/${commissionId}`, {
        method: 'POST',
      })

      if (response.ok) {
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error('Error approving commission:', error)
    }
  }

  const handleRejectCommission = async (commissionId: string) => {
    try {
      const response = await fetch(`/api/commission/reject/${commissionId}`, {
        method: 'POST',
      })

      if (response.ok) {
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error('Error rejecting commission:', error)
    }
  }

  const teamSales = sales.reduce((sum, sale) => sum + sale.saleAmount, 0)
  const teamMembers = users.length
  const totalCommission = commissionRecords
    .filter(record => record.status === 'approved' || record.status === 'paid')
    .reduce((sum, record) => sum + record.amount, 0)

  return (
    <DashboardLayout 
      title="Manager Dashboard" 
      subtitle="Team Performance Overview"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Team Sales"
          value={teamSales}
          format="currency"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Team Members"
          value={teamMembers}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Total Commission"
          value={totalCommission}
          format="currency"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          subtitle="Approved commissions"
        />
        <DashboardCard
          title="Commission Rules"
          value={3}
          icon={<Settings className="h-4 w-4 text-muted-foreground" />}
          subtitle="3 tiers configured"
        />
      </div>

      {/* Team Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Individual performance metrics for your team</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading team data...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No team members assigned yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Sales Amount</TableHead>
                    <TableHead>Target Achievement</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const userSales = sales.filter(sale => sale.salesExecutive === user._id)
                    const totalSales = userSales.reduce((sum, sale) => sum + sale.saleAmount, 0)
                    const achievement = user.assignedTarget > 0 ? (totalSales / user.assignedTarget) * 100 : 0
                    const userCommission = commissionRecords
                      .filter(record => record.salesExecutive === user._id && record.status === 'approved')
                      .reduce((sum, record) => sum + record.amount, 0)

                    return (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.employeeId}</TableCell>
                        <TableCell>{formatCurrency(totalSales)}</TableCell>
                        <TableCell>
                          <Badge variant={achievement >= 100 ? 'default' : achievement >= 80 ? 'secondary' : 'destructive'}>
                            {formatPercentage(achievement)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {userCommission > 0 ? (
                            <span className="text-green-600 font-semibold">
                              {formatCurrency(userCommission)}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">Not calculated</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleCalculateCommission(user)}
                            disabled={calculating}
                          >
                            <Calculator className="h-4 w-4 mr-2" />
                            {calculating ? 'Calculating...' : 'Calculate'}
                          </Button>
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
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your team and commissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Commission Rules
            </Button>
            <Button className="w-full" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Team Management
            </Button>
            <Button className="w-full" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Commission Records */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Commission Records</CardTitle>
          <CardDescription>Recent commission calculations for your team</CardDescription>
        </CardHeader>
        <CardContent>
          {commissionRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No commission records found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Executive</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Achievement</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissionRecords.map((record) => {
                  const executive = users.find(user => user._id === record.salesExecutive)
                  return (
                    <TableRow key={record._id}>
                      <TableCell>
                        <div className="font-medium">{executive?.name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">{executive?.employeeId}</div>
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(record.amount)}</TableCell>
                      <TableCell>{formatPercentage(record.targetAchievement)}</TableCell>
                      <TableCell>{record.commissionRate}%</TableCell>
                      <TableCell>{new Date(record.calculationDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          record.status === 'pending' ? 'secondary' : 
                          record.status === 'approved' ? 'default' : 'outline'
                        }>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApproveCommission(record._id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectCommission(record._id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Commission Modal */}
      {selectedUser && (
        <CommissionModal
          isOpen={isCommissionModalOpen}
          onClose={() => setIsCommissionModalOpen(false)}
          commissionData={null}
        />
      )}
    </DashboardLayout>
  )
}