'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="notfound-page">
      <div className="auth-blob-1" />
      <div className="auth-blob-2" />
      <div className="notfound-card">
        <div className="notfound-top-bar" />
        <div className="notfound-body">
          <div className="notfound-icon text-red-500">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2 className="notfound-title">Something went wrong!</h2>
          <p className="notfound-desc">
            We encountered a critical error. Our team has been notified.
          </p>
          <div className="notfound-btns">
            <button
              onClick={() => reset()}
              className="btn-primary w-full"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
