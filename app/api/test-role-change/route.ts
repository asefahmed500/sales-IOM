import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
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

    // Only admins can change roles
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can change user roles' }, { status: 403 })
    }

    const { userId, newRole } = await request.json()

    if (!userId || !newRole) {
      return NextResponse.json({ error: 'userId and newRole are required' }, { status: 400 })
    }

    // Validate role
    const validRoles = ['admin', 'manager', 'executive']
    if (!validRoles.includes(newRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Remove password from response
    const userResponse = user.toObject()
    delete userResponse.password

    return NextResponse.json({ 
      message: 'User role updated successfully',
      user: userResponse 
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}