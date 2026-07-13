'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { motion, AnimatePresence } from 'framer-motion'

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export default function ShortenForm() {
  const [url, setUrl] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [customAlias, setCustomAlias] = useState('')
  const [password, setPassword] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [oneTimeUse, setOneTimeUse] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalUrl: url.trim(),
          customAlias: customAlias || undefined,
          password: password || undefined,
          expiresAt: expiresAt || undefined,
          oneTimeUse,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult(data)
        setUrl('')
        setCustomAlias('')
        setPassword('')
        setExpiresAt('')
        setOneTimeUse(false)
        setShowSettings(false)
        setShowQR(false)
        setError('')
      } else {
        setError(data.error || 'Failed to shorten URL')
        triggerShake()
      }
    } catch {
      setError('Network error. Please check your connection.')
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(`${getBaseUrl()}/${result.shortCode}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shortUrl = result ? `${getBaseUrl()}/${result.shortCode}` : ''

  return (
    <motion.div 
      style={{ width: '100%' }}
      animate={shake ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <div className="form-card">
        {/* Main input row */}
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-input-wrap">
                <svg className="form-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                </svg>
                <input
                  type="text"
                  required
                  placeholder="biswadip.in or https://example.com..."
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setError('') }}
                  className="form-input"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className={`form-options-btn${showSettings ? ' active' : ''}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 1 0 4.93 19.07 10 10 0 0 0 19.07 4.93z"/>
                </svg>
                Options
                <motion.svg 
                  animate={{ rotate: showSettings ? 180 : 0 }} 
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </motion.svg>
              </button>

              <button type="submit" disabled={loading || !url} className="form-submit-btn">
                {loading ? (
                  <div className="spinner" />
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    Shorten
                  </>
                )}
              </button>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  style={{ marginTop: '14px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', fontSize: '0.85rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Advanced Settings */}
            <AnimatePresence>
              {showSettings && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="settings-panel">
                    <div className="settings-grid">
                      <div>
                        <label className="settings-label">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                          </svg>
                          Custom Alias
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. my-launch"
                          value={customAlias}
                          onChange={(e) => setCustomAlias(e.target.value)}
                          className="settings-input"
                        />
                      </div>

                      <div>
                        <label className="settings-label">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                          Password Protect
                        </label>
                        <input
                          type="password"
                          placeholder="Enter a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="settings-input"
                        />
                      </div>

                      <div>
                        <label className="settings-label">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          Expires At
                        </label>
                        <input
                          type="datetime-local"
                          value={expiresAt}
                          onChange={(e) => setExpiresAt(e.target.value)}
                          className="settings-input"
                        />
                      </div>

                      <div className="toggle-row">
                        <button
                          type="button"
                          className={`toggle-track${oneTimeUse ? ' on' : ''}`}
                          onClick={() => setOneTimeUse(!oneTimeUse)}
                        >
                          <div className="toggle-thumb" />
                        </button>
                        <div>
                          <div className="toggle-label">Burn after reading</div>
                          <div className="toggle-desc">Self-destructs after first click</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="result-panel"
            >
              <div className="result-inner">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="result-label">Your short link is ready</div>
                  <a href={`/${result.shortCode}`} target="_blank" rel="noreferrer" className="result-url">
                    {shortUrl}
                  </a>
                  <div className="result-original">↳ {result.originalUrl}</div>
                  <div className="result-badges">
                    {result.password && (
                      <span className="badge badge-amber">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        Password
                      </span>
                    )}
                    {result.expiresAt && (
                      <span className="badge badge-red">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Expires {new Date(result.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                    {result.oneTimeUse && (
                      <span className="badge badge-orange">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>
                        One-time
                      </span>
                    )}
                  </div>
                </div>
                <div className="result-actions">
                  <button onClick={() => setShowQR(!showQR)} className="icon-btn" type="button">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                      <line x1="14" y1="14" x2="14" y2="14"/><line x1="17" y1="14" x2="17" y2="14"/><line x1="20" y1="14" x2="20" y2="14"/>
                      <line x1="14" y1="17" x2="14" y2="17"/><line x1="17" y1="17" x2="17" y2="17"/><line x1="20" y1="17" x2="20" y2="17"/>
                      <line x1="14" y1="20" x2="14" y2="20"/><line x1="17" y1="20" x2="17" y2="20"/><line x1="20" y1="20" x2="20" y2="20"/>
                    </svg>
                    QR Code
                  </button>
                  <button onClick={handleCopy} className="icon-btn icon-btn-primary" type="button">
                    {copied ? (
                      <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Copied!
                      </motion.div>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showQR && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="qr-panel">
                      <div className="qr-box" style={{ display: 'inline-block' }}>
                        <QRCodeSVG value={shortUrl} size={160} level="H" fgColor="#000" />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '12px' }}>Scan to open this link</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trust row */}
      <div className="trust-row">
        {[
          { icon: '🔒', text: 'No signup required' },
          { icon: '⚡', text: 'Instant redirect' },
          { icon: '🛡️', text: 'Optional password protection' },
        ].map((t) => (
          <span key={t.text} className="trust-item">
            <span>{t.icon}</span>
            {t.text}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
