import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import CommissionRecord from '@/models/CommissionRecord'
import Sale from '@/models/Sale'
import User from '@/models/User'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const commissionId = params.id

    // Get the commission record
    const commissionRecord = await CommissionRecord.findById(commissionId)
      .populate('salesExecutive', 'name employeeId assignedTarget')
      .populate('calculatedBy', 'name employeeId')

    if (!commissionRecord) {
      return NextResponse.json({ error: 'Commission record not found' }, { status: 404 })
    }

    // Check if user has access to this commission record
    if (session.user.role === 'executive' && commissionRecord.salesExecutive._id.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (session.user.role === 'manager') {
      const executive = await User.findById(commissionRecord.salesExecutive._id)
      if (executive.assignedManager?.toString() !== session.user.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    // Get sales for this executive
    const sales = await Sale.find({ salesExecutive: commissionRecord.salesExecutive._id })

    // Generate commission statement data
    const commissionStatement = {
      executive: {
        name: commissionRecord.salesExecutive.name,
        employeeId: commissionRecord.salesExecutive.employeeId,
        target: commissionRecord.salesExecutive.assignedTarget
      },
      period: {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      },
      calculation: {
        salesTotal: commissionRecord.salesTotal,
        targetAchievement: commissionRecord.targetAchievement,
        commissionRate: commissionRecord.commissionRate,
        commissionAmount: commissionRecord.amount
      },
      salesBreakdown: sales.map(sale => ({
        productName: sale.productName,
        amount: sale.saleAmount,
        quantity: sale.quantity,
        date: sale.saleDate
      })),
      calculatedBy: {
        name: commissionRecord.calculatedBy.name,
        employeeId: commissionRecord.calculatedBy.employeeId
      },
      calculationDate: commissionRecord.calculationDate,
      status: commissionRecord.status
    }

    // Return the commission statement data
    return NextResponse.json(commissionStatement)
  } catch (error) {
    console.error('Error generating commission statement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}