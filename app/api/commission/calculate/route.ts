import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Sale from '@/models/Sale'
import User from '@/models/User'
import CommissionRule from '@/models/CommissionRule'
import CommissionRecord from '@/models/CommissionRecord'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only managers and admins can calculate commissions
    if (session.user.role === 'executive') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { executiveId } = await request.json()

    if (!executiveId) {
      return NextResponse.json({ error: 'Executive ID is required' }, { status: 400 })
    }

    // Get executive details
    const executive = await User.findById(executiveId)
    if (!executive) {
      return NextResponse.json({ error: 'Executive not found' }, { status: 404 })
    }

    // Check if manager can calculate for this executive
    if (session.user.role === 'manager' && executive.assignedManager?.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get executive's sales
    const sales = await Sale.find({ salesExecutive: executiveId })
    const totalSales = sales.reduce((sum, sale) => sum + sale.saleAmount, 0)

    // Get commission rules
    const commissionRules = await CommissionRule.find().sort({ targetFrom: 1 })

    // Calculate target achievement
    const target = executive.assignedTarget || 10000
    const achievement = target > 0 ? (totalSales / target) * 100 : 0

    // Find applicable commission rule
    let applicableRule = commissionRules.find(rule => 
      achievement >= rule.targetFrom && 
      (rule.targetTo === null || achievement <= rule.targetTo)
    )

    // If no rule found, use the highest rule (100%+)
    if (!applicableRule) {
      applicableRule = commissionRules[commissionRules.length - 1]
    }

    const commissionRate = applicableRule?.commissionRate || 0
    const commissionAmount = totalSales * (commissionRate / 100)

    // Save commission record with pending status
    const commissionRecord = new CommissionRecord({
      salesExecutive: executiveId,
      amount: commissionAmount,
      calculatedBy: session.user.id,
      salesTotal: totalSales,
      targetAchievement: achievement,
      commissionRate: commissionRate,
      status: 'pending' // Set initial status to pending
    })

    await commissionRecord.save()

    return NextResponse.json({
      executive: {
        id: executive._id,
        name: executive.name,
        employeeId: executive.employeeId,
        target: target
      },
      sales: {
        total: totalSales,
        count: sales.length,
        breakdown: sales.map(sale => ({
          productName: sale.productName,
          amount: sale.saleAmount,
          quantity: sale.quantity,
          date: sale.saleDate
        }))
      },
      calculation: {
        achievement: achievement,
        commissionRate: commissionRate,
        commissionAmount: commissionAmount,
        applicableRule: applicableRule
      }
    })
  } catch (error) {
    console.error('Error calculating commission:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}