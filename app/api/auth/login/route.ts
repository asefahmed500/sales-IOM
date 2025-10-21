import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/db'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    // Use Better Auth to handle the login
    const response = await auth.api.signInEmail(request, {
      body: await request.json(),
      headers: request.headers,
    })
    
    // If login was successful, set the user role cookie
    if (response.status === 200) {
      const data = await response.json()
      
      if (data && data.user) {
        // Create a new response with the role cookie
        const newResponse = new NextResponse(
          JSON.stringify(data),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        
        // Set the user role cookie
        newResponse.cookies.set('user_role', data.user.role, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/',
        })
        
        return newResponse
      }
    }
    
    // Return the original response if login failed
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}