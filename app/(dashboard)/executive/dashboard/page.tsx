'use client'

import { useState, useEffect } from 'react'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { DashboardLayout } from '@/components/DashboardLayout'
import { DashboardCard } from '@/components/DashboardCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileUpload } from '@/components/FileUpload'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { Plus, TrendingUp, Package, Target, DollarSign } from 'lucide-react'

interface Sale {
  _id: string
  productName: string
  saleAmount: number
  quantity: number
  saleDate: string
  status: 'sold' | 'not_sold'
  productImage?: string
}

interface User {
  _id: string
  name: string
  email: string
  role: string
  employeeId: string
  assignedTarget: number
}

export default function ExecutiveDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false)
  const [newSale, setNewSale] = useState({
    productName: '',
    saleAmount: '',
    quantity: '',
    saleDate: new Date().toISOString().split('T')[0],
    status: 'sold' as 'sold' | 'not_sold'
  })
  const [productImage, setProductImage] = useState<File | null>(null)
  const [productImageUrl, setProductImageUrl] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Real-time data fetching
  const { data: sales, loading: salesLoading, refresh: refreshSales } = useRealtimeData<Sale>(
    async () => {
      const response = await fetch('/api/sales')
      if (!response.ok) throw new Error('Failed to fetch sales')
      return response.json()
    }
  )

  useEffect(() => {
    fetchUserData()
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

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newSale,
          productImage: productImageUrl
        }),
      })

      if (response.ok) {
        await refreshSales()
        setNewSale({
          productName: '',
          saleAmount: '',
          quantity: '',
          saleDate: new Date().toISOString().split('T')[0],
          status: 'sold'
        })
        setProductImage(null)
        setProductImageUrl('')
        setIsAddSaleOpen(false)
      }
    } catch (error) {
      console.error('Error adding sale:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalSales = sales.reduce((sum, sale) => sum + sale.saleAmount, 0)
  const target = user?.assignedTarget || 10000
  const achievement = target > 0 ? (totalSales / target) * 100 : 0

  return (
    <DashboardLayout 
      title="Executive Dashboard" 
      subtitle={`Welcome back, ${user?.name} (${user?.employeeId})`}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Sales This Month"
          value={totalSales}
          format="currency"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Products Sold"
          value={sales.length}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Target Achievement"
          value={achievement}
          format="percentage"
          icon={<Target className="h-4 w-4 text-muted-foreground" />}
          subtitle={achievement >= 100 ? "Target achieved!" : `${formatCurrency(target - totalSales)} to go`}
        />
        <DashboardCard
          title="Monthly Target"
          value={target}
          format="currency"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Sales Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales History</CardTitle>
            <CardDescription>Your recent sales transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {sales.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sales recorded yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale._id}>
                      <TableCell className="font-medium">{sale.productName}</TableCell>
                      <TableCell>
                        {sale.productImage ? (
                          <img
                            src={sale.productImage}
                            alt={sale.productName}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <Package className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={sale.status === 'sold' ? 'default' : 'secondary'}>
                          {sale.status === 'sold' ? 'Sold' : 'Not Sold'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(sale.saleAmount)}</TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your sales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog open={isAddSaleOpen} onOpenChange={setIsAddSaleOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Sale
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Sale</DialogTitle>
                  <DialogDescription>
                    Record a new sale transaction
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSale} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      value={newSale.productName}
                      onChange={(e) => setNewSale({ ...newSale, productName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Sale Status</Label>
                    <Select
                      value={newSale.status}
                      onValueChange={(value: 'sold' | 'not_sold') => setNewSale({ ...newSale, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="not_sold">Not Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="saleAmount">Sale Amount</Label>
                    <Input
                      id="saleAmount"
                      type="number"
                      step="0.01"
                      value={newSale.saleAmount}
                      onChange={(e) => setNewSale({ ...newSale, saleAmount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newSale.quantity}
                      onChange={(e) => setNewSale({ ...newSale, quantity: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="saleDate">Sale Date</Label>
                    <Input
                      id="saleDate"
                      type="date"
                      value={newSale.saleDate}
                      onChange={(e) => setNewSale({ ...newSale, saleDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <FileUpload
                      onFileSelect={setProductImage}
                      onUploadComplete={setProductImageUrl}
                      label="Product Image (Optional)"
                      accept="image/*"
                      maxSize={5}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddSaleOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Adding...' : 'Add Sale'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Performance Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Sales:</span>
                  <span className="font-semibold">{formatCurrency(totalSales)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Target:</span>
                  <span>{formatCurrency(target)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Achievement:</span>
                  <span className={`font-semibold ${achievement >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                    {formatPercentage(achievement)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}