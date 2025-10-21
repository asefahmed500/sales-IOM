import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Sale from '@/models/Sale'
import { auth } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only executives can update their own sales
    if (session.user.role !== 'executive') {
      return NextResponse.json({ error: 'Only executives can update sales' }, { status: 403 })
    }

    const saleId = params.id
    const body = await request.json()
    const { productName, saleAmount, quantity, saleDate, status, productImage } = body

    // Check if the sale belongs to the current user
    const sale = await Sale.findOne({ _id: saleId, salesExecutive: session.user.id })
    if (!sale) {
      return NextResponse.json({ error: 'Sale not found or unauthorized' }, { status: 404 })
    }

    // Update the sale
    sale.productName = productName || sale.productName
    sale.saleAmount = saleAmount ? parseFloat(saleAmount) : sale.saleAmount
    sale.quantity = quantity ? parseInt(quantity) : sale.quantity
    sale.saleDate = saleDate ? new Date(saleDate) : sale.saleDate
    sale.status = status || sale.status
    sale.productImage = productImage !== undefined ? productImage : sale.productImage

    await sale.save()

    return NextResponse.json(sale)
  } catch (error) {
    console.error('Error updating sale:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only executives can delete their own sales
    if (session.user.role !== 'executive') {
      return NextResponse.json({ error: 'Only executives can delete sales' }, { status: 403 })
    }

    const saleId = params.id

    // Check if the sale belongs to the current user
    const sale = await Sale.findOne({ _id: saleId, salesExecutive: session.user.id })
    if (!sale) {
      return NextResponse.json({ error: 'Sale not found or unauthorized' }, { status: 404 })
    }

    // Delete the sale
    await Sale.deleteOne({ _id: saleId })

    return NextResponse.json({ message: 'Sale deleted successfully' })
  } catch (error) {
    console.error('Error deleting sale:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}