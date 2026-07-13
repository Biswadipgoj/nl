'use client'

import { useEffect, useState, useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Link from 'next/link'

type LinkItem = {
  id: string
  originalUrl: string
  shortCode: string
  customAlias: string | null
  expiresAt: string | null
  isActive: boolean
  oneTimeUse: boolean
  clicks: number
  lastVisited: string | null
  createdAt: string
}

const IconLink = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
  </svg>
)
const IconTrend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
  </svg>
)
const IconPower = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>
  </svg>
)
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IconCopy = ({ done }: { done: boolean }) => done ? (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
) : (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)
const IconExternal = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)
const IconCalendar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IconClock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)
const IconFilter = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
)

export default function Dashboard() {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => { fetchLinks() }, [])

  const fetchLinks = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/links')
      if (res.ok) setLinks(await res.json())
    } catch { console.error('Failed to fetch') }
    finally { setLoading(false) }
  }

  const isExpired = (l: LinkItem) => l.expiresAt ? new Date(l.expiresAt) <= new Date() : false

  const toggleActive = async (id: string, cur: boolean) => {
    const res = await fetch(`/api/links/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !cur }) })
    if (res.ok) setLinks(links.map(l => l.id === id ? { ...l, isActive: !cur } : l))
  }

  const deleteLink = async (id: string) => {
    if (!confirm('Delete this link permanently?')) return
    const res = await fetch(`/api/links/${id}`, { method: 'DELETE' })
    if (res.ok) setLinks(links.filter(l => l.id !== id))
  }

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${code}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filtered = useMemo(() => {
    let r = links
    if (search) { const s = search.toLowerCase(); r = r.filter(l => l.originalUrl.toLowerCase().includes(s) || l.shortCode.toLowerCase().includes(s) || l.customAlias?.toLowerCase().includes(s)) }
    if (filter === 'active') r = r.filter(l => l.isActive && !isExpired(l))
    if (filter === 'expired') r = r.filter(l => isExpired(l))
    return r
  }, [links, search, filter])

  const totalClicks = links.reduce((s, l) => s + l.clicks, 0)
  const activeCount = links.filter(l => l.isActive && !isExpired(l)).length

  return (
    <div className="dash-page">
      {/* Header */}
      <div className="dash-header">
        <div className="dash-header-inner">
          <div className="dash-title-row">
            <div>
              <h1 className="dash-title">Link Dashboard</h1>
              <p className="dash-subtitle">Manage and monitor all your shortened links</p>
            </div>
            <Link href="/" className="nav-btn" style={{ alignSelf: 'flex-start' }}>
              <IconLink /> Create New Link
            </Link>
          </div>

          {/* Stats */}
          <div className="dash-stats">
            <div className="stat-card stat-card-indigo">
              <div className="stat-icon stat-icon-indigo"><IconLink /></div>
              <div>
                <div className="stat-val">{links.length}</div>
                <div className="stat-label">Total Links</div>
              </div>
            </div>
            <div className="stat-card stat-card-emerald">
              <div className="stat-icon stat-icon-emerald"><IconTrend /></div>
              <div>
                <div className="stat-val">{totalClicks}</div>
                <div className="stat-label">Total Clicks</div>
              </div>
            </div>
            <div className="stat-card stat-card-violet">
              <div className="stat-icon stat-icon-violet"><IconPower /></div>
              <div>
                <div className="stat-val">{activeCount}</div>
                <div className="stat-label">Active Links</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="dash-body">
        {/* Filter row */}
        <div className="filter-row">
          <div className="search-wrap">
            <span className="search-icon"><IconSearch /></span>
            <input
              type="text"
              placeholder="Search links..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-tabs">
            <span style={{ display: 'flex', alignItems: 'center', paddingLeft: '8px', color: '#9ca3af' }}><IconFilter /></span>
            {(['all', 'active', 'expired'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`filter-tab${filter === f ? ' active' : ''}`}>{f}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Loading your links...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><IconLink /></div>
            <div className="empty-title">{links.length === 0 ? 'No links yet' : 'No results found'}</div>
            <p className="empty-desc">
              {links.length === 0
                ? 'Go to the home page and create your first short link.'
                : 'Try adjusting your search or filter.'}
            </p>
            {links.length === 0 && (
              <Link href="/" className="nav-btn" style={{ marginTop: '1.25rem' }}>
                <IconLink /> Create a Link
              </Link>
            )}
          </div>
        ) : (
          <div className="links-grid">
            {filtered.map(link => {
              const expired = isExpired(link)
              const shortUrl = typeof window !== 'undefined' ? `${window.location.origin}/${link.shortCode}` : `/${link.shortCode}`
              return (
                <div key={link.id} className={`link-card${!link.isActive || expired ? ' inactive' : ''}`}>
                  <div className={`link-card-bar${!link.isActive || expired ? ' inactive' : ''}`} />
                  <div className="link-card-body">
                    <div className="link-card-header">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <a href={`/${link.shortCode}`} target="_blank" rel="noreferrer" className="link-code">
                          /{link.shortCode} <IconExternal />
                        </a>
                        <div className="link-original" title={link.originalUrl}>{link.originalUrl}</div>
                        <div className="link-badges">
                          {!link.isActive && <span className="link-badge link-badge-slate">Disabled</span>}
                          {expired && <span className="link-badge link-badge-red">Expired</span>}
                          {link.oneTimeUse && <span className="link-badge link-badge-orange">Burn</span>}
                        </div>
                      </div>
                      <button onClick={() => handleCopy(link.shortCode, link.id)} className="copy-btn">
                        <IconCopy done={copiedId === link.id} />
                      </button>
                    </div>

                    <div className="link-meta">
                      <span className="link-meta-item">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
                        </svg>
                        {link.clicks} clicks
                      </span>
                      <span className="link-meta-item"><IconCalendar />{new Date(link.createdAt).toLocaleDateString()}</span>
                      {link.lastVisited && (
                        <span className="link-meta-item"><IconClock />Last: {new Date(link.lastVisited).toLocaleDateString()}</span>
                      )}
                      {link.expiresAt && (
                        <span className="link-meta-item" style={{ color: expired ? '#dc2626' : '#f59e0b' }}>
                          <IconCalendar />
                          {expired ? 'Expired' : `Exp. ${new Date(link.expiresAt).toLocaleDateString()}`}
                        </span>
                      )}
                    </div>

                    <div className="link-footer">
                      <div className="action-btns">
                        <button
                          onClick={() => toggleActive(link.id, link.isActive)}
                          className={`action-btn ${link.isActive ? 'action-btn-slate' : 'action-btn-enable'}`}
                        >
                          {link.isActive ? (
                            <>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>
                              </svg>
                              Disable
                            </>
                          ) : (
                            <>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>
                              </svg>
                              Enable
                            </>
                          )}
                        </button>
                        <button onClick={() => deleteLink(link.id)} className="action-btn action-btn-danger">
                          <IconTrash /> Delete
                        </button>
                      </div>
                      <div className="qr-mini">
                        <QRCodeSVG value={shortUrl} size={38} level="M" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
