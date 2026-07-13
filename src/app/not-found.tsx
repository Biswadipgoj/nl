'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="auth-blob-1" />
      <div className="auth-blob-2" />

      <div className="notfound-card">
        <div className="notfound-top-bar" />
        <div className="notfound-body">
          <div className="notfound-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/><line x1="11" y1="16" x2="11.01" y2="16"/>
            </svg>
          </div>
          <div className="notfound-404">404</div>
          <h1 className="notfound-title">Link Not Found</h1>
          <p className="notfound-desc">
            The short link you're looking for doesn't exist, has expired, or has been removed.
          </p>
          <div className="notfound-btns">
            <Link href="/" className="btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
              </svg>
              Create a New Link
            </Link>
            <Link href="/" className="btn-secondary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
