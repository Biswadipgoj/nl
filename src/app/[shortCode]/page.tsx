import { redirect, notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import PasswordPrompt from '@/components/PasswordPrompt'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ shortCode: string }>
}

// Status page shown when a link cannot be accessed
function LinkStatusPage({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <div className="notfound-top-bar" />
        <div className="notfound-body">
          <div className="notfound-icon">{icon}</div>
          <div className="notfound-404" style={{ fontSize: '2rem' }}>Oops</div>
          <h1 className="notfound-title">{title}</h1>
          <p className="notfound-desc">{description}</p>
          <div className="notfound-btns">
            <Link href="/" className="btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
              </svg>
              Create a New Link
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const warningIcon = (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

export default async function RedirectPage({ params }: PageProps) {
  const { shortCode } = await params

  // Exclude built-in Next.js and app paths to avoid false database lookups
  const excludedPrefixes = ['favicon', '_next', 'api', 'dashboard', 'login', 'auth', 'icon']
  if (excludedPrefixes.some((p) => shortCode === p || shortCode.startsWith(p + '.'))) {
    return notFound()
  }

  const link = await prisma.link.findFirst({
    where: {
      OR: [{ shortCode }, { customAlias: shortCode }],
    },
  })

  if (!link) {
    return notFound()
  }

  // Check if link is active
  if (!link.isActive) {
    return (
      <LinkStatusPage
        title="Link Disabled"
        description="This link has been disabled by its creator."
        icon={warningIcon}
      />
    )
  }

  // Check expiration
  if (link.expiresAt && new Date() > link.expiresAt) {
    return (
      <LinkStatusPage
        title="Link Expired"
        description="This link has expired and is no longer accessible."
        icon={warningIcon}
      />
    )
  }

  // Check password — hand off to client component for interactive prompt
  if (link.password) {
    return <PasswordPrompt shortCode={shortCode} />
  }

  // Fire-and-forget analytics update — never block the redirect on a DB write
  prisma.link
    .update({
      where: { id: link.id },
      data: {
        clicks: { increment: 1 },
        lastVisited: new Date(),
        // Disable one-time links after first access
        isActive: link.oneTimeUse ? false : link.isActive,
      },
    })
    .catch((err) => console.error('[analytics] failed to update link:', err))

  redirect(link.originalUrl)
}
