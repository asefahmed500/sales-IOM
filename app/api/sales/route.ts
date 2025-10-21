import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Sale from '@/models/Sale'
import User from '@/models/User'
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

    let sales

    if (session.user.role === 'admin') {
      // Admin can see all sales
      sales = await Sale.find().populate('salesExecutive', 'name employeeId')
    } else if (session.user.role === 'manager') {
      // Manager can see sales of their team
      const executives = await User.find({ 
        assignedManager: session.user.id 
      }).select('_id')
      
      const executiveIds = executives.map(exec => exec._id)
      sales = await Sale.find({ 
        salesExecutive: { $in: executiveIds } 
      }).populate('salesExecutive', 'name employeeId')
    } else {
      // Executive can only see their own sales
      sales = await Sale.find({ 
        salesExecutive: session.user.id 
      }).populate('salesExecutive', 'name employeeId')
    }

    return NextResponse.json(sales)
  } catch (error) {
    console.error('Error fetching sales:', error)
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

    // Only executives can create sales
    if (session.user.role !== 'executive') {
      return NextResponse.json({ error: 'Only executives can create sales' }, { status: 403 })
    }

    const body = await request.json()
    const { productName, saleAmount, quantity, saleDate, status, productImage } = body

    if (!productName || !saleAmount || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const sale = new Sale({
      salesExecutive: session.user.id,
      productName,
      saleAmount: parseFloat(saleAmount),
      quantity: parseInt(quantity),
      saleDate: saleDate ? new Date(saleDate) : new Date(),
      status: status || 'sold',
      productImage: productImage || undefined
    })

    await sale.save()

    return NextResponse.json(sale, { status: 201 })
  } catch (error) {
    console.error('Error creating sale:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
