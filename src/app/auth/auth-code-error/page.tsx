import Link from 'next/link'

export const metadata = {
  title: 'Authentication Error',
}

export default function AuthCodeError() {
  return (
    <div className="notfound-page">
      <div className="fluid-mesh-bg" style={{ position: 'fixed' }}>
        <div className="fluid-mesh-orb orb-1" style={{ opacity: 0.15 }} />
        <div className="fluid-mesh-orb orb-2" style={{ opacity: 0.1 }} />
        <div className="fluid-mesh-overlay" />
      </div>

      <div className="notfound-card">
        <div className="notfound-top-bar" style={{ background: 'linear-gradient(90deg, #ef4444, #f97316)' }} />
        <div className="notfound-body">
          <div className="notfound-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="notfound-404" style={{ fontSize: '1.5rem', color: '#f87171' }}>Auth Error</div>
          <h1 className="notfound-title">Sign‑in Failed</h1>
          <p className="notfound-desc">
            Something went wrong during authentication. This can happen if you denied access or the OAuth provider returned an error. Please try again.
          </p>
          <div className="notfound-btns">
            <Link href="/login" className="btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Try Again
            </Link>
            <Link href="/" className="btn-secondary">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
