import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import CommissionRule from '@/models/CommissionRule'
import { auth } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only managers and admins can update commission rules
    if (session.user.role === 'executive') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { targetFrom, targetTo, commissionRate } = await request.json()

    if (!targetFrom || !commissionRate) {
      return NextResponse.json({ error: 'Target from and commission rate are required' }, { status: 400 })
    }

    const rule = await CommissionRule.findByIdAndUpdate(
      params.id,
      { targetFrom, targetTo, commissionRate },
      { new: true }
    )

    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 })
    }

    return NextResponse.json(rule)
  } catch (error) {
    console.error('Error updating commission rule:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can delete commission rules
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can delete commission rules' }, { status: 403 })
    }

    const rule = await CommissionRule.findByIdAndDelete(params.id)

    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Rule deleted successfully' })
  } catch (error) {
    console.error('Error deleting commission rule:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
