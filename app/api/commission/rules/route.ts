import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import CommissionRule from '@/models/CommissionRule'
import { authClient } from '@/lib/auth-client'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const session = await authClient.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only managers and admins can view commission rules
    if (session.user.role === 'executive') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const rules = await CommissionRule.find().sort({ targetFrom: 1 })

    return NextResponse.json(rules)
  } catch (error) {
    console.error('Error fetching commission rules:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const session = await authClient.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only managers and admins can create commission rules
    if (session.user.role === 'executive') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { targetFrom, targetTo, commissionRate } = await request.json()

    if (!targetFrom || !commissionRate) {
      return NextResponse.json({ error: 'Target from and commission rate are required' }, { status: 400 })
    }

    const rule = new CommissionRule({
      targetFrom,
      targetTo,
      commissionRate
    })

    await rule.save()

    return NextResponse.json(rule, { status: 201 })
  } catch (error) {
    console.error('Error creating commission rule:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
