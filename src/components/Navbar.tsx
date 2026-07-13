'use client'

import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Initial user check
    supabase.auth
      .getUser()
      .then((res: any) => {
        setUser(res?.data?.user ?? null)
      })
      .catch(() => setUser(null))

    // Subscribe to auth state changes
    const { data } = (supabase.auth as any).onAuthStateChange(
      (_event: string, session: any) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      try {
        data?.subscription?.unsubscribe?.()
      } catch {
        // no-op for stub client
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

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
            <>
              <Link href="/dashboard" className="nav-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                </svg>
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="nav-btn"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#a1a1aa' }}
                id="btn-signout"
              >
                Sign Out
              </button>
            </>
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
