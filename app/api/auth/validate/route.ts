import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify session using Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return user role for client-side role checking
    return NextResponse.json({ 
      role: session.user.role,
      userId: session.user.id
    })
  } catch (error) {
    console.error('Error validating session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}