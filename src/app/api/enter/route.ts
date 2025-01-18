// app/api/login/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { password } = await request.json()
  const correctPassword = process.env.CORRECT_PASSWORD

  const success = password === correctPassword
  
  if (success) {
    const response = NextResponse.json({ success: true })
    
    // Set the cookie
    response.cookies.set('authenticated', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600
    })

    return response
  }

  return NextResponse.json({ success: false })
}