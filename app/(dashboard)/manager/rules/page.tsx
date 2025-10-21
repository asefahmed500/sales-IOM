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
import { formatCurrency } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'
import { LogOut, Plus, Settings, ArrowLeft, Trash2, Edit } from 'lucide-react'

interface CommissionRule {
  _id: string
  targetFrom: number
  targetTo: number | null
  commissionRate: number
  createdAt: string
  updatedAt: string
}

interface User {
  _id: string
  name: string
  email: string
  role: string
  employeeId: string
}

export default function CommissionRulesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [rules, setRules] = useState<CommissionRule[]>([])
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false)
  const [isEditRuleOpen, setIsEditRuleOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<CommissionRule | null>(null)
  const [newRule, setNewRule] = useState({
    targetFrom: '',
    targetTo: '',
    commissionRate: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
    fetchRules()
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

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/commission/rules')
      const data = await response.json()
      setRules(data)
    } catch (error) {
      console.error('Error fetching rules:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/commission/rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetFrom: parseFloat(newRule.targetFrom),
          targetTo: newRule.targetTo ? parseFloat(newRule.targetTo) : null,
          commissionRate: parseFloat(newRule.commissionRate)
        }),
      })

      if (response.ok) {
        await fetchRules()
        setNewRule({ targetFrom: '', targetTo: '', commissionRate: '' })
        setIsAddRuleOpen(false)
      }
    } catch (error) {
      console.error('Error adding rule:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditRule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingRule) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/commission/rules/${editingRule._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetFrom: parseFloat(newRule.targetFrom),
          targetTo: newRule.targetTo ? parseFloat(newRule.targetTo) : null,
          commissionRate: parseFloat(newRule.commissionRate)
        }),
      })

      if (response.ok) {
        await fetchRules()
        setEditingRule(null)
        setIsEditRuleOpen(false)
      }
    } catch (error) {
      console.error('Error updating rule:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return

    try {
      const response = await fetch(`/api/commission/rules/${ruleId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchRules()
      }
    } catch (error) {
      console.error('Error deleting rule:', error)
    }
  }

  const openEditRule = (rule: CommissionRule) => {
    setEditingRule(rule)
    setNewRule({
      targetFrom: rule.targetFrom.toString(),
      targetTo: rule.targetTo ? rule.targetTo.toString() : '',
      commissionRate: rule.commissionRate.toString()
    })
    setIsEditRuleOpen(true)
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
          <p className="mt-4 text-muted-foreground">Loading commission rules...</p>
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
              <Link href="/manager/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Commission Rules</h1>
                <p className="text-sm text-gray-600">Manage commission calculation rules</p>
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
                  <Settings className="h-5 w-5 mr-2" />
                  Commission Rules
                </CardTitle>
                <CardDescription>
                  Configure commission rates based on target achievement
                </CardDescription>
              </div>
              <Dialog open={isAddRuleOpen} onOpenChange={setIsAddRuleOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Commission Rule</DialogTitle>
                    <DialogDescription>
                      Create a new commission rule based on target achievement
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddRule} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="targetFrom">Target % From</Label>
                        <Input
                          id="targetFrom"
                          type="number"
                          step="1"
                          value={newRule.targetFrom}
                          onChange={(e) => setNewRule({ ...newRule, targetFrom: e.target.value })}
                          required
                          placeholder="e.g., 80"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="targetTo">Target % To</Label>
                        <Input
                          id="targetTo"
                          type="number"
                          step="1"
                          value={newRule.targetTo}
                          onChange={(e) => setNewRule({ ...newRule, targetTo: e.target.value })}
                          placeholder="e.g., 89 (leave empty for 100%+)"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                      <Input
                        id="commissionRate"
                        type="number"
                        step="0.1"
                        value={newRule.commissionRate}
                        onChange={(e) => setNewRule({ ...newRule, commissionRate: e.target.value })}
                        required
                        placeholder="e.g., 1"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddRuleOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add Rule'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {rules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No commission rules configured</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Target % From</TableHead>
                    <TableHead>Target % To</TableHead>
                    <TableHead>Commission Rate</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule._id}>
                      <TableCell className="font-medium">{rule.targetFrom}%</TableCell>
                      <TableCell>{rule.targetTo ? `${rule.targetTo}%` : '∞'}</TableCell>
                      <TableCell>
                        <Badge variant="default">{rule.commissionRate}%</Badge>
                      </TableCell>
                      <TableCell>{new Date(rule.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditRule(rule)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteRule(rule._id)}
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

        {/* Edit Rule Dialog */}
        <Dialog open={isEditRuleOpen} onOpenChange={setIsEditRuleOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Commission Rule</DialogTitle>
              <DialogDescription>
                Update the commission rule settings
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditRule} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editTargetFrom">Target % From</Label>
                  <Input
                    id="editTargetFrom"
                    type="number"
                    step="1"
                    value={newRule.targetFrom}
                    onChange={(e) => setNewRule({ ...newRule, targetFrom: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editTargetTo">Target % To</Label>
                  <Input
                    id="editTargetTo"
                    type="number"
                    step="1"
                    value={newRule.targetTo}
                    onChange={(e) => setNewRule({ ...newRule, targetTo: e.target.value })}
                    placeholder="Leave empty for 100%+"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCommissionRate">Commission Rate (%)</Label>
                <Input
                  id="editCommissionRate"
                  type="number"
                  step="0.1"
                  value={newRule.commissionRate}
                  onChange={(e) => setNewRule({ ...newRule, commissionRate: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditRuleOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Rule'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
