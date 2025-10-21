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
import { Users, DollarSign, TrendingUp, Calculator, Settings } from 'lucide-react'

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

export default function ManagerDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [usersResponse, salesResponse] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/sales')
      ])

      const usersData = await usersResponse.json()
      const salesData = await salesResponse.json()

      setUsers(usersData.filter((user: User) => user.role === 'executive'))
      setSales(salesData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCalculateCommission = (user: User) => {
    setSelectedUser(user)
    setIsCommissionModalOpen(true)
  }

  const teamSales = sales.reduce((sum, sale) => sum + sale.saleAmount, 0)
  const teamMembers = users.length

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
          title="Avg Performance"
          value={teamMembers > 0 ? teamSales / teamMembers : 0}
          format="currency"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          subtitle="Per team member"
        />
        <DashboardCard
          title="Commission Rules"
          value="Active"
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
                          <span className="text-sm text-muted-foreground">Calculated</span>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleCalculateCommission(user)}
                          >
                            <Calculator className="h-4 w-4 mr-2" />
                            Calculate
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

      {/* Commission Modal */}
      {selectedUser && (
        <CommissionModal
          user={selectedUser}
          isOpen={isCommissionModalOpen}
          onClose={() => setIsCommissionModalOpen(false)}
        />
      )}
    </DashboardLayout>
  )
}