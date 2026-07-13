import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { shortCode, password } = await req.json()

    if (!shortCode || !password) {
      return NextResponse.json({ error: 'Missing shortCode or password' }, { status: 400 })
    }

    const link = await prisma.link.findFirst({
      where: {
        OR: [
          { shortCode },
          { customAlias: shortCode }
        ]
      }
    })

    if (!link || !link.password) {
      return NextResponse.json({ error: 'Invalid link' }, { status: 404 })
    }

    const isMatch = await bcrypt.compare(password, link.password)
    
    if (!isMatch) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    return NextResponse.json({ url: link.originalUrl }, { status: 200 })
  } catch (error) {
    console.error('Error verifying password:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
