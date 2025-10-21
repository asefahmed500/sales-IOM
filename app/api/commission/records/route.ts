import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import CommissionRecord from '@/models/CommissionRecord'
import User from '@/models/User'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let records

    if (session.user.role === 'admin') {
      // Admin can see all commission records
      records = await CommissionRecord.find()
        .populate('salesExecutive', 'name employeeId')
        .populate('calculatedBy', 'name employeeId')
        .sort({ calculationDate: -1 })
    } else if (session.user.role === 'manager') {
      // Manager can see commission records for their team
      const executives = await User.find({ 
        assignedManager: session.user.id 
      }).select('_id')
      
      const executiveIds = executives.map(exec => exec._id)
      records = await CommissionRecord.find({ 
        salesExecutive: { $in: executiveIds } 
      })
        .populate('salesExecutive', 'name employeeId')
        .populate('calculatedBy', 'name employeeId')
        .sort({ calculationDate: -1 })
    } else {
      // Executive can only see their own commission records
      records = await CommissionRecord.find({ 
        salesExecutive: session.user.id 
      })
        .populate('salesExecutive', 'name employeeId')
        .populate('calculatedBy', 'name employeeId')
        .sort({ calculationDate: -1 })
    }

    return NextResponse.json(records)
  } catch (error) {
    console.error('Error fetching commission records:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import CommissionRecord from '@/models/CommissionRecord'
import User from '@/models/User'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let records

    if (session.user.role === 'admin') {
      // Admin can see all commission records
      records = await CommissionRecord.find()
        .populate('salesExecutive', 'name employeeId')
        .populate('calculatedBy', 'name employeeId')
        .sort({ calculationDate: -1 })
    } else if (session.user.role === 'manager') {
      // Manager can see commission records for their team
      const executives = await User.find({ 
        assignedManager: session.user.id 
      }).select('_id')
      
      const executiveIds = executives.map(exec => exec._id)
      records = await CommissionRecord.find({ 
        salesExecutive: { $in: executiveIds } 
      })
        .populate('salesExecutive', 'name employeeId')
        .populate('calculatedBy', 'name employeeId')
        .sort({ calculationDate: -1 })
    } else {
      // Executive can only see their own commission records
      records = await CommissionRecord.find({ 
        salesExecutive: session.user.id 
      })
        .populate('salesExecutive', 'name employeeId')
        .populate('calculatedBy', 'name employeeId')
        .sort({ calculationDate: -1 })
    }

    return NextResponse.json(records)
  } catch (error) {
    console.error('Error fetching commission records:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}