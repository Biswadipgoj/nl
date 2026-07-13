import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'

const updateLinkSchema = z.object({
  isActive: z.boolean().optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const validatedData = updateLinkSchema.parse(body)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existingLink = await prisma.link.findUnique({ where: { id } })
    if (!existingLink) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    if (existingLink.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updatedLink = await prisma.link.update({
      where: { id },
      data: {
        isActive: validatedData.isActive,
      },
    })

    const { password, ...safeLink } = updatedLink
    return NextResponse.json(safeLink, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || 'Validation error' }, { status: 400 })
    }
    console.error('Error updating link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existingLink = await prisma.link.findUnique({ where: { id } })
    if (!existingLink) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    if (existingLink.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.link.delete({
      where: { id },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error deleting link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
