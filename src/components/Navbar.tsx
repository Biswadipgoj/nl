'use client'

import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth
      .getUser()
      .then((res: any) => { setUser(res?.data?.user ?? null) })
      .catch(() => setUser(null))

    const { data } = (supabase.auth as any).onAuthStateChange(
      (_event: string, session: any) => { setUser(session?.user ?? null) }
    )

    return () => {
      try { data?.subscription?.unsubscribe?.() } catch { }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined
  const fullName = (user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User') as string
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <span>
            <span className="logo-nano">Nano</span>
            <span className="logo-link">Link</span>
          </span>
        </Link>

        <nav className="navbar-nav">
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="nav-user-btn"
                id="btn-user-menu"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="nav-avatar"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="nav-avatar-fallback">{initials}</div>
                )}
                <span className="nav-user-name">{fullName.split(' ')[0]}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, transition: 'transform 0.2s', transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {showMenu && (
                <>
                  {/* Backdrop */}
                  <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowMenu(false)} />
                  {/* Dropdown */}
                  <div className="nav-dropdown">
                    <div className="nav-dropdown-header">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={fullName} className="nav-dropdown-avatar" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="nav-dropdown-avatar-fallback">{initials}</div>
                      )}
                      <div>
                        <div className="nav-dropdown-name">{fullName}</div>
                        <div className="nav-dropdown-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="nav-dropdown-divider" />
                    <Link href="/dashboard" className="nav-dropdown-item" onClick={() => setShowMenu(false)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                      </svg>
                      Dashboard
                    </Link>
                    <button onClick={handleSignOut} className="nav-dropdown-item nav-dropdown-signout" id="btn-signout">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" className="nav-btn" id="btn-signin">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
