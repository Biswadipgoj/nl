'use client'

import ShortenForm from '@/components/ShortenForm'
import Link from 'next/link'

const features = [
  {
    iconClass: 'feature-icon-indigo',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: 'Actionable Analytics',
    description: 'Make data-driven decisions with real-time tracking of click rates, geographic distribution, and referrers.',
  },
  {
    iconClass: 'feature-icon-emerald',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Secure Access Control',
    description: 'Enforce enterprise security policies with bcrypt-hashed passwords and precise link expiration rules.',
  },
  {
    iconClass: 'feature-icon-violet',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: 'Brand Trust & Customization',
    description: 'Elevate your brand presence with custom aliases and fully tailored, trustworthy short URLs.',
  },
]

export default function Home() {
  return (
    <section className="hero-section">
      {/* 3D Fluid Mesh Background */}
      <div className="fluid-mesh-bg">
        <div className="fluid-mesh-orb orb-1"></div>
        <div className="fluid-mesh-orb orb-2"></div>
        <div className="fluid-mesh-orb orb-3"></div>
        <div className="fluid-mesh-orb orb-4"></div>
      </div>
      <div className="fluid-mesh-overlay"></div>

      <div className="hero-content relative z-10 w-full flex flex-col items-center">
        {/* Badge */}
        <div className="hero-badge glass-panel">
          <span className="hero-badge-dot" />
          Enterprise-Grade Link Management
        </div>

        {/* Title */}
        <h1 className="hero-title">
          Scale your impact with<br />
          <span className="hero-title-gradient">intelligent routing</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Secure, branded, and actionable short links designed for modern businesses. Streamline your audience engagement with powerful infrastructure.
        </p>

        {/* Form */}
        <div className="hero-form-wrapper glass-panel shadow-3d">
          <ShortenForm />
        </div>

        {/* CTA */}
        <Link href="/dashboard" className="hero-cta-link glass-panel">
          Access Command Center
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>

        {/* Feature cards */}
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card glass-panel shadow-3d-hover">
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
