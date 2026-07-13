'use client'

import { useRef, useState } from 'react'
import ShortenForm from '@/components/ShortenForm'
import Link from 'next/link'

const features = [
  {
    iconClass: 'feature-icon-indigo',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
    title: 'Click Analytics',
    description: 'See how many times each link was clicked and when it was last visited — right from your dashboard.',
  },
  {
    iconClass: 'feature-icon-violet',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Privacy Controls',
    description: 'Add a password, set an expiry date, or make a link self-destruct after the first click.',
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
    description: 'Use a memorable alias like /launch or /portfolio instead of a random code.',
  },
]

export default function Home() {
  return (
    <section className="hero-section">
      <div className="hero-content">

        {/* Badge */}
        <div className="hero-badge">
          <span className="hero-badge-inner">
            <span className="hero-badge-dot" />
            FREE
          </span>
          <span className="hero-badge-text">No account needed to get started</span>
        </div>

        {/* Headline */}
        <h1 className="hero-title">
          Shorten any link.<br />
          <span className="hero-title-gradient">Share it anywhere.</span>
        </h1>

        {/* Subheadline */}
        <p className="hero-subtitle">
          Paste a long URL and get a short, clean link in one click.
          Add a password, expiry, or QR code — all for free.
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
