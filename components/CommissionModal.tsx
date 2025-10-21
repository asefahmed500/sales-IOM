'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPercentage } from '@/lib/utils'

interface CommissionModalProps {
  isOpen: boolean
  onClose: () => void
  commissionData: any
  onSave?: () => void
}

export function CommissionModal({ isOpen, onClose, commissionData, onSave }: CommissionModalProps) {
  if (!commissionData) return null

  const { executive, sales, calculation } = commissionData

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Commission Calculation</DialogTitle>
          <DialogDescription>
            Detailed commission calculation for {executive.name} ({executive.employeeId})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Executive Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Executive Details</h3>
              <p className="text-sm text-muted-foreground">{executive.name}</p>
              <p className="text-sm text-muted-foreground">ID: {executive.employeeId}</p>
            </div>
            <div>
              <h3 className="font-semibold">Target</h3>
              <p className="text-lg font-bold">{formatCurrency(executive.target)}</p>
            </div>
          </div>

          {/* Sales Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold">Total Sales</h3>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(sales.total)}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold">Achievement</h3>
              <p className="text-2xl font-bold text-blue-600">{formatPercentage(calculation.achievement)}</p>
              <Badge variant={calculation.achievement >= 100 ? "default" : "secondary"}>
                {calculation.achievement >= 100 ? "Target Met" : "Below Target"}
              </Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold">Commission Rate</h3>
              <p className="text-2xl font-bold text-purple-600">{calculation.commissionRate}%</p>
            </div>
          </div>

          {/* Commission Calculation */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Commission Calculation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Sales Total:</span>
                <span>{formatCurrency(sales.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Commission Rate:</span>
                <span>{calculation.commissionRate}%</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold">
                <span>Commission Amount:</span>
                <span className="text-green-600">{formatCurrency(calculation.commissionAmount)}</span>
              </div>
            </div>
          </div>

          {/* Products Breakdown */}
          <div>
            <h3 className="font-semibold mb-3">Products Sold</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {sales.breakdown.map((sale: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{sale.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {sale.quantity} • {new Date(sale.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(sale.amount)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Commission Rule */}
          {calculation.applicableRule && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Applied Commission Rule</h3>
              <p className="text-sm">
                {calculation.applicableRule.targetFrom}% - {calculation.applicableRule.targetTo || '∞'}% 
                → {calculation.applicableRule.commissionRate}% commission
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {onSave && (
            <Button onClick={onSave}>
              Save Commission
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}