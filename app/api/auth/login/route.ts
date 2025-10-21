import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // Remove password from response
    const userResponse = user.toObject()
    delete userResponse.password

    return NextResponse.json({ 
      user: userResponse, 
      token,
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}