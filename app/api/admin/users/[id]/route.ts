import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import { authClient } from '@/lib/auth-client'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const session = await authClient.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can update users
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can update users' }, { status: 403 })
    }

    const body = await request.json()

    const user = await User.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Remove password from response
    const userResponse = user.toObject()
    delete userResponse.password

    return NextResponse.json({ user: userResponse })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const session = await authClient.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can delete users
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can delete users' }, { status: 403 })
    }

    // Don't allow deleting self
    if (session.user.id === params.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }

    const user = await User.findByIdAndDelete(params.id)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
