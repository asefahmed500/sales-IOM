import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { authClient } from '@/lib/auth-client'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const session = await authClient.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can create users
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can create users' }, { status: 403 })
    }

    const { name, email, password, role, phone, assignedTarget, assignedManager } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Name, email, password, and role are required' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    // Generate employee ID
    const employeeId = await generateEmployeeId(role)

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      employeeId,
      phone,
      assignedTarget,
      assignedManager: assignedManager || undefined,
      isActive: true
    })

    await user.save()

    // Remove password from response
    const userResponse = user.toObject()
    delete userResponse.password

    return NextResponse.json({ user: userResponse }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateEmployeeId(role: string): Promise<string> {
  const prefix = role === 'executive' ? 'E' : role === 'manager' ? 'M' : 'A'
  
  // Find the highest existing employee ID with this prefix
  const lastUser = await User.findOne(
    { employeeId: { $regex: `^${prefix}` } },
    { employeeId: 1 }
  ).sort({ employeeId: -1 })

  if (!lastUser) {
    return `${prefix}001`
  }

  // Extract number and increment
  const lastNumber = parseInt(lastUser.employeeId.substring(1))
  const newNumber = lastNumber + 1
  
  return `${prefix}${newNumber.toString().padStart(3, '0')}`
}
