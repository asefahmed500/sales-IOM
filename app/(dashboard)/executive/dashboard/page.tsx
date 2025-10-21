'use client'

import { useState, useEffect, useMemo } from 'react'
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
import { Plus, TrendingUp, Package, Target, DollarSign, Edit, Trash2, Download, Search, Filter } from 'lucide-react'

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

export default function ExecutiveDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false)
  const [isEditSaleOpen, setIsEditSaleOpen] = useState(false)
  const [editingSale, setEditingSale] = useState<Sale | null>(null)
  const [commissionRecords, setCommissionRecords] = useState<CommissionRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'sold' | 'not_sold'>('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  
  const [newSale, setNewSale] = useState({
    productName: '',
    saleAmount: '',
    quantity: '',
    saleDate: new Date().toISOString().split('T')[0],
    status: 'sold' as 'sold' | 'not_sold'
  })
  const [editSale, setEditSale] = useState({
    productName: '',
    saleAmount: '',
    quantity: '',
    saleDate: '',
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

  // Filter and search sales
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      // Search filter
      const matchesSearch = sale.productName.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || sale.status === statusFilter
      
      // Date range filter
      const saleDate = new Date(sale.saleDate)
      const matchesDateRange = (
        (!dateRange.start || saleDate >= new Date(dateRange.start)) &&
        (!dateRange.end || saleDate <= new Date(dateRange.end))
      )
      
      return matchesSearch && matchesStatus && matchesDateRange
    })
  }, [sales, searchTerm, statusFilter, dateRange])

  useEffect(() => {
    fetchUserData()
    fetchCommissionRecords()
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

  const fetchCommissionRecords = async () => {
    try {
      const response = await fetch('/api/commission/records')
      const data = await response.json()
      setCommissionRecords(data)
    } catch (error) {
      console.error('Error fetching commission records:', error)
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

  const handleEditSale = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/sales/${editingSale?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editSale,
          productImage: productImageUrl || editingSale?.productImage
        }),
      })

      if (response.ok) {
        await refreshSales()
        setIsEditSaleOpen(false)
        setEditingSale(null)
        setProductImage(null)
        setProductImageUrl('')
      }
    } catch (error) {
      console.error('Error updating sale:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSale = async (saleId: string) => {
    if (!confirm('Are you sure you want to delete this sale?')) return

    try {
      const response = await fetch(`/api/sales/${saleId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await refreshSales()
      }
    } catch (error) {
      console.error('Error deleting sale:', error)
    }
  }

  const handleDownloadCommissionStatement = async (commissionId: string) => {
    try {
      const response = await fetch(`/api/commission/download/${commissionId}`)
      if (response.ok) {
        const data = await response.json()
        // In a real application, this would generate a PDF
        // For now, we'll just show an alert
        alert(`Commission statement for ${data.executive.name} downloaded successfully!`)
      }
    } catch (error) {
      console.error('Error downloading commission statement:', error)
    }
  }

  const openEditModal = (sale: Sale) => {
    setEditingSale(sale)
    setEditSale({
      productName: sale.productName,
      saleAmount: sale.saleAmount.toString(),
      quantity: sale.quantity.toString(),
      saleDate: new Date(sale.saleDate).toISOString().split('T')[0],
      status: sale.status
    })
    setProductImageUrl(sale.productImage || '')
    setIsEditSaleOpen(true)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setDateRange({ start: '', end: '' })
  }

  const totalSales = sales.reduce((sum, sale) => sum + sale.saleAmount, 0)
  const target = user?.assignedTarget || 10000
  const achievement = target > 0 ? (totalSales / target) * 100 : 0
  const totalCommission = commissionRecords
    .filter(record => record.status === 'approved' || record.status === 'paid')
    .reduce((sum, record) => sum + record.amount, 0)

  return (
    <DashboardLayout 
      title="Executive Dashboard" 
      subtitle={`Welcome back, ${user?.name} (${user?.employeeId})`}
      requiredRole="executive"
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
          title="Total Commission"
          value={totalCommission}
          format="currency"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          subtitle="Approved commissions"
        />
      </div>

      {/* Sales Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Sales History</CardTitle>
                <CardDescription>Your recent sales transactions</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Dialog open={isAddSaleOpen} onOpenChange={setIsAddSaleOpen}>
                  <DialogTrigger asChild>
                    <Button>
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
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search" className="text-sm">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Product name..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="status" className="text-sm">Status</Label>
                  <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="not_sold">Not Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate" className="text-sm">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-sm">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  />
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>

            {filteredSales.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sales found matching your criteria</p>
                {searchTerm || statusFilter !== 'all' || dateRange.start || dateRange.end ? (
                  <Button variant="outline" className="mt-2" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                ) : (
                  <p>Add your first sale to get started</p>
                )}
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
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
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(sale)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteSale(sale._id)}
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your sales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Edit Sale Modal */}
            <Dialog open={isEditSaleOpen} onOpenChange={setIsEditSaleOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Sale</DialogTitle>
                  <DialogDescription>
                    Update sale transaction details
                  </DialogDescription>
                </DialogHeader>
                {editingSale && (
                  <form onSubmit={handleEditSale} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="editProductName">Product Name</Label>
                      <Input
                        id="editProductName"
                        value={editSale.productName}
                        onChange={(e) => setEditSale({ ...editSale, productName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editStatus">Sale Status</Label>
                      <Select
                        value={editSale.status}
                        onValueChange={(value: 'sold' | 'not_sold') => setEditSale({ ...editSale, status: value })}
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
                      <Label htmlFor="editSaleAmount">Sale Amount</Label>
                      <Input
                        id="editSaleAmount"
                        type="number"
                        step="0.01"
                        value={editSale.saleAmount}
                        onChange={(e) => setEditSale({ ...editSale, saleAmount: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editQuantity">Quantity</Label>
                      <Input
                        id="editQuantity"
                        type="number"
                        value={editSale.quantity}
                        onChange={(e) => setEditSale({ ...editSale, quantity: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editSaleDate">Sale Date</Label>
                      <Input
                        id="editSaleDate"
                        type="date"
                        value={editSale.saleDate}
                        onChange={(e) => setEditSale({ ...editSale, saleDate: e.target.value })}
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
                      <Button type="button" variant="outline" onClick={() => setIsEditSaleOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Updating...' : 'Update Sale'}
                      </Button>
                    </div>
                  </form>
                )}
              </DialogContent>
            </Dialog>

            {/* Commission Records */}
            <Card>
              <CardHeader>
                <CardTitle>Commission Records</CardTitle>
                <CardDescription>Your commission history</CardDescription>
              </CardHeader>
              <CardContent>
                {commissionRecords.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No commission records found</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {commissionRecords.map((record) => (
                      <div key={record._id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-medium">{formatCurrency(record.amount)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(record.calculationDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            record.status === 'pending' ? 'secondary' : 
                            record.status === 'approved' ? 'default' : 
                            record.status === 'paid' ? 'outline' : 'destructive'
                          }>
                            {record.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadCommissionStatement(record._id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}