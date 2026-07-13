'use client'

import { useState } from 'react'

export default function PasswordPrompt({ shortCode }: { shortCode: string }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shortCode, password }),
      })
      if (res.ok) {
        const { url } = await res.json()
        window.location.href = url
      } else {
        const data = await res.json()
        setError(data.error || 'Incorrect password')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-blob-1" />
      <div className="auth-blob-2" />

      <div className="auth-card">
        <div className="auth-top-bar" />
        <div className="auth-body">
          <div className="auth-icon-box">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 className="auth-title">Protected Link</h1>
          <p className="auth-desc">
            This link is password protected. Enter the password to continue.
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              required
              className="auth-input"
            />
            {error && <div className="auth-error">{error}</div>}
            <button type="submit" disabled={loading || !password} className="auth-submit">
              {loading ? (
                <div style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              ) : (
                <>
                  Unlock Link
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="auth-footer">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
        </svg>
        Protected by NanoLink
      </div>
    </div>
  )
}
