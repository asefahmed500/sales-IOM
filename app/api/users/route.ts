import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
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

    let users

    if (session.user.role === 'admin') {
      // Admin can see all users
      users = await User.find().populate('assignedManager', 'name employeeId')
    } else if (session.user.role === 'manager') {
      // Manager can see their team
      users = await User.find({ 
        assignedManager: session.user.id 
      }).populate('assignedManager', 'name employeeId')
    } else {
      // Executive can only see their own profile
      users = await User.find({ _id: session.user.id }).populate('assignedManager', 'name employeeId')
    }

    // Remove password field from response
    users = users.map(user => {
      const userObj = user.toObject()
      delete userObj.password
      return userObj
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
