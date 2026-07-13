'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <span><span className="logo-nano">Nano</span><span className="logo-link">Link</span></span>
        </Link>

        <nav className="navbar-nav">
          <Link href="/dashboard" className="nav-link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </Link>
          <Link href="/dashboard" className="nav-btn">
            My Links
          </Link>
        </nav>
      </div>
    </header>
  )
}
