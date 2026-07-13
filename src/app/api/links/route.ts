import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { createClient } from '@/utils/supabase/server'
import { rateLimit } from '@/lib/rate-limit'

// ── URL normalizer ──────────────────────────────────────────────────────────
// Accepts bare domains like "biswadip.in", "www.google.com", or full URLs.
// Always returns a valid URL string with https:// prepended if missing.
function normalizeUrl(raw: string): string {
  const trimmed = raw.trim()
  // Already has a protocol
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  // Prepend https://
  return `https://${trimmed}`
}

const createLinkSchema = z.object({
  originalUrl: z.string().min(1, 'URL is required'),
  customAlias: z.string().optional().or(z.literal('')),
  password: z.string().optional().or(z.literal('')),
  expiresAt: z.string().optional().or(z.literal('')),
  oneTimeUse: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  // Rate-limit: 10 new links per minute per IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous'
  if (!rateLimit(`post:${ip}`, 10, 60_000)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const parsed = createLinkSchema.parse(body)

    // Normalize URL — add https:// if the user typed "biswadip.in" etc.
    const normalizedUrl = normalizeUrl(parsed.originalUrl)

    // Validate that after normalization it is a proper URL
    try {
      new URL(normalizedUrl)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL. Please enter a valid web address.' },
        { status: 400 }
      )
    }

    let shortCode = nanoid(7)

    // Custom alias
    if (parsed.customAlias) {
      const existingAlias = await prisma.link.findUnique({
        where: { customAlias: parsed.customAlias },
      })
      if (existingAlias) {
        return NextResponse.json(
          { error: 'Custom alias is already in use.' },
          { status: 400 }
        )
      }
      shortCode = parsed.customAlias
    } else {
      // Ensure uniqueness
      let isUnique = false
      while (!isUnique) {
        const existing = await prisma.link.findUnique({ where: { shortCode } })
        if (!existing) isUnique = true
        else shortCode = nanoid(7)
      }
    }

    // Hash password
    let hashedPassword = null
    if (parsed.password) {
      hashedPassword = await bcrypt.hash(parsed.password, 10)
    }

    // Get current user if any (don't let auth failure block link creation)
    let userId: string | null = null
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id || null
    } catch (authError) {
      console.error('Auth check failed (non-fatal):', authError)
    }

    const newLink = await prisma.link.create({
      data: {
        userId,
        originalUrl: normalizedUrl,
        shortCode,
        customAlias: parsed.customAlias || null,
        password: hashedPassword,
        expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
        oneTimeUse: parsed.oneTimeUse,
      },
    })

    return NextResponse.json(newLink, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || 'Validation error' }, { status: 400 })
    }
    console.error('Error creating link:', error)
    // Return real error details for debugging (safe because it's server-side)
    const message = error?.message || 'Unknown error'
    return NextResponse.json({ error: `Server error: ${message}` }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const links = await prisma.link.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })
    const safeLinks = links.map(link => {
      const { password, ...rest } = link
      return rest
    })
    return NextResponse.json(safeLinks, { status: 200 })
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
