import { redirect, notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import PasswordPrompt from '@/components/PasswordPrompt'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

interface PageProps {
  params: Promise<{ shortCode: string }>
}

export default async function RedirectPage({ params }: PageProps) {
  const { shortCode } = await params

  // Exclude built-in Next.js and app paths to avoid false database lookups
  const excludedPaths = ['favicon.ico', '_next', 'api', 'dashboard']
  if (excludedPaths.some(p => shortCode === p || shortCode.startsWith(p))) {
    return notFound()
  }

  const link = await prisma.link.findFirst({
    where: {
      OR: [
        { shortCode },
        { customAlias: shortCode }
      ]
    }
  })

  if (!link) {
    return notFound()
  }

  // Check if link is active
  if (!link.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Link Inactive</h2>
          <p className="text-zinc-400 mb-6">This link has been disabled by its creator.</p>
          <Link href="/" className="inline-block bg-white text-black px-6 py-2 rounded-xl font-medium hover:bg-zinc-200 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  // Check expiration
  if (link.expiresAt && new Date() > link.expiresAt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Link Expired</h2>
          <p className="text-zinc-400 mb-6">This link has expired and is no longer accessible.</p>
          <Link href="/" className="inline-block bg-white text-black px-6 py-2 rounded-xl font-medium hover:bg-zinc-200 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  // Check password
  if (link.password) {
    return <PasswordPrompt shortCode={shortCode} />
  }

  // Update analytics before redirect
  await prisma.link.update({
    where: { id: link.id },
    data: {
      clicks: { increment: 1 },
      lastVisited: new Date(),
      isActive: link.oneTimeUse ? false : link.isActive, // Disable if one-time use
    }
  })

  redirect(link.originalUrl)
}
