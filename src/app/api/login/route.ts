import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { password } = await request.json()
  
  const correctPassword = process.env.CORRECT_PASSWORD

  return NextResponse.json({
    success: password === correctPassword
  })
}