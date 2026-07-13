'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState<'github' | 'google' | null>(null)
  const [error, setError] = useState('')

  const handleOAuth = async (provider: 'github' | 'google') => {
    try {
      setLoading(provider)
      setError('')
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setError(error.message)
        setLoading(null)
      }
      // If no error, browser will redirect to OAuth provider — don't reset loading
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(null)
    }
  }

  return (
    <div className="login-page">
      {/* Ambient orbs */}
      <div className="fluid-mesh-bg" style={{ position: 'fixed' }}>
        <div className="fluid-mesh-orb orb-1" />
        <div className="fluid-mesh-orb orb-2" />
        <div className="fluid-mesh-orb orb-3" />
        <div className="fluid-mesh-overlay" />
      </div>

      <div className="login-card">
        {/* Gradient top bar */}
        <div className="login-top-bar" />

        <div className="login-body">
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="login-logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
              </svg>
            </div>
          </div>

          <h1 className="login-title">Welcome to NanoLink</h1>
          <p className="login-subtitle">
            Sign in to manage your links, track analytics, and unlock the full experience.
          </p>

          {error && (
            <div className="login-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <div className="login-btns">
            {/* GitHub */}
            <button
              onClick={() => handleOAuth('github')}
              disabled={loading !== null}
              className="oauth-btn oauth-btn-github"
              id="btn-login-github"
            >
              {loading === 'github' ? (
                <div className="spinner" style={{ border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', width: '18px', height: '18px' }} />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              )}
              Continue with GitHub
            </button>

            {/* Google */}
            <button
              onClick={() => handleOAuth('google')}
              disabled={loading !== null}
              className="oauth-btn oauth-btn-google"
              id="btn-login-google"
            >
              {loading === 'google' ? (
                <div className="spinner" style={{ border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#333', width: '18px', height: '18px' }} />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              Continue with Google
            </button>
          </div>

          <div className="login-divider">
            <span>or</span>
          </div>

          <Link href="/" className="login-guest-btn" id="btn-login-guest">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Continue as Guest
            <span className="login-guest-limit">1 link max</span>
          </Link>

          <p className="login-terms">
            By signing in, you agree to our{' '}
            <span style={{ color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span>
            {' '}and{' '}
            <span style={{ color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
