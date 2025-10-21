import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import CommissionRecord from '@/models/CommissionRecord'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only managers and admins can approve commissions
    if (session.user.role === 'executive') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const commissionId = params.id

    // Update the commission record status to approved
    const updatedRecord = await CommissionRecord.findByIdAndUpdate(
      commissionId,
      { 
        status: 'approved',
        approvedBy: session.user.id,
        approvedDate: new Date()
      },
      { new: true }
    )

    if (!updatedRecord) {
      return NextResponse.json({ error: 'Commission record not found' }, { status: 404 })
    }

    return NextResponse.json(updatedRecord)
  } catch (error) {
    console.error('Error approving commission:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}