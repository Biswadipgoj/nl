'use client'

import { useEffect, useRef, useState } from 'react'
import ShortenForm from '@/components/ShortenForm'
import Link from 'next/link'

// Animated counter hook
function useCounter(end: number, duration = 1800, started = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!started) return
    let start = 0
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setVal(end); clearInterval(timer) }
      else setVal(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [end, duration, started])
  return val
}

const stats = [
  { value: 2400000, label: 'Links Shortened', suffix: '+' },
  { value: 99.9, label: 'Uptime SLA', suffix: '%', decimals: 1 },
  { value: 12, label: 'ms Avg Redirect', suffix: '' },
]

const features = [
  {
    iconClass: 'feature-icon-indigo',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
    title: 'Real-time Analytics',
    description: 'Click-through rates, geographic data, referral sources — all tracked in real time.',
  },
  {
    iconClass: 'feature-icon-violet',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Secure by Default',
    description: 'Password protection, link expiry, and burn-after-reading — all built in.',
  },
  {
    iconClass: 'feature-icon-emerald',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
    ),
    title: 'Custom Aliases',
    description: 'Branded short links like nano.ly/product-launch instead of random codes.',
  },
]

function formatStat(val: number, suffix: string, decimals = 0) {
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'M' + suffix
  if (val >= 1_000) return (val / 1_000).toFixed(0) + 'K' + suffix
  return decimals > 0 ? val.toFixed(decimals) + suffix : val + suffix
}

export default function Home() {
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const count0 = useCounter(stats[0].value, 2000, statsVisible)
  const count1 = useCounter(stats[1].value * 10, 1600, statsVisible) // ×10 for decimals
  const count2 = useCounter(stats[2].value, 1200, statsVisible)

  return (
    <section className="hero-section">
      {/* Animated ambient orbs */}
      <div className="fluid-mesh-bg">
        <div className="fluid-mesh-orb orb-1" />
        <div className="fluid-mesh-orb orb-2" />
        <div className="fluid-mesh-orb orb-3" />
        <div className="fluid-mesh-orb orb-4" />
      </div>
      <div className="fluid-mesh-overlay" />

      <div className="hero-content">

        {/* Badge */}
        <div className="hero-badge">
          <span className="hero-badge-inner">
            <span className="hero-badge-dot" />
            APEX
          </span>
          <span className="hero-badge-text">Enterprise Link Intelligence</span>
        </div>

        {/* Headline */}
        <h1 className="hero-title">
          The last URL shortener<br />
          <span className="hero-title-gradient">you&apos;ll ever need</span>
        </h1>

        {/* Subheadline */}
        <p className="hero-subtitle">
          Secure, branded, and actionable short links with sub-20ms redirects. 
          Built for companies that care about every click.
        </p>

        {/* Shortening form */}
        <div className="hero-form-wrapper glass-panel shadow-3d" style={{ borderRadius: 20 }}>
          <ShortenForm />
        </div>

        {/* Soft CTA to dashboard */}
        <Link href="/dashboard" className="hero-cta-link" style={{ marginTop: '1.5rem' }}>
          View your link dashboard
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>

        {/* Social proof stats */}
        <div
          ref={statsRef}
          style={{
            display: 'flex', gap: '0px', marginTop: '4rem', width: '100%',
            maxWidth: '560px', borderRadius: '16px', overflow: 'hidden',
            border: '1px solid var(--border-faint)',
            background: 'var(--bg-elevated)',
          }}
        >
          {[
            { count: formatStat(count0, '+'), label: stats[0].label },
            { count: count1 / 10 >= 99.9 ? '99.9%' : `${(count1 / 10).toFixed(1)}%`, label: stats[1].label },
            { count: count2 > 0 ? `${count2}ms` : '—', label: stats[2].label },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                flex: 1, textAlign: 'center', padding: '1.25rem 1rem',
                borderRight: i < 2 ? '1px solid var(--border-faint)' : 'none',
              }}
            >
              <div style={{ fontSize: '1.625rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)', lineHeight: 1 }}>
                {s.count}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Feature grid */}
        <div className="features-grid" style={{ marginTop: '5rem' }}>
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className={`feature-icon-box ${f.iconClass}`}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
