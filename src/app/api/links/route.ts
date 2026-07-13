import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

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

export async function POST(req: Request) {
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

    const newLink = await prisma.link.create({
      data: {
        originalUrl: normalizedUrl,
        shortCode,
        customAlias: parsed.customAlias || null,
        password: hashedPassword,
        expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
        oneTimeUse: parsed.oneTimeUse,
      },
    })

    return NextResponse.json(newLink, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Validation error' }, { status: 400 })
    }
    console.error('Error creating link:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const links = await prisma.link.findMany({
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
