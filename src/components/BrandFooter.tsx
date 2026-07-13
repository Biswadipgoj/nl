'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BrandFooter() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <footer className="brand-footer">
      <div className="brand-footer-content">
        <span className="brand-footer-text">Created by </span>
        <div 
          className="brand-footer-interactive"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="brand-footer-name">Biswodip goj</span>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                className="brand-footer-popover glass-panel shadow-3d"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <a 
                  href="https://biswadip.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="brand-logo-link"
                >
                  {/* Since no specific logo was provided, we use a sleek typography logo design */}
                  <div className="brand-logo-icon">B</div>
                  <div className="brand-logo-text">
                    <span className="brand-logo-title">biswadip.in</span>
                    <span className="brand-logo-subtitle">Visit Portfolio</span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="brand-logo-arrow">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </footer>
  )
}
