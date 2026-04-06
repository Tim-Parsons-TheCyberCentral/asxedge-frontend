'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-edge-border bg-edge-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-edge-green rounded flex items-center justify-center">
            <Zap size={14} className="text-edge-black fill-edge-black" />
          </div>
          <span className="font-display text-2xl tracking-wider text-white">
            ASX<span className="text-edge-green">EDGE</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/signals',   label: 'Signals' },
            { href: '/forecasts', label: 'Forecasts' },
            { href: '/watchlist', label: 'Watchlist' },
            { href: '/agent',     label: 'AI Agent' },
            { href: '/accuracy',  label: 'Accuracy' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-mono text-xs tracking-widest text-edge-muted hover:text-edge-green transition-colors uppercase"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Live indicator */}
        <div className="hidden md:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-edge-green animate-pulse-green" />
          <span className="font-mono text-xs text-edge-green tracking-widest">LIVE</span>
        </div>

        {/* Mobile menu */}
        <button
          className="md:hidden text-edge-muted hover:text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-edge-border bg-edge-dark px-4 py-4 flex flex-col gap-4">
          {[
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/signals',   label: 'Signals' },
            { href: '/forecasts', label: 'Forecasts' },
            { href: '/watchlist', label: 'Watchlist' },
            { href: '/agent',     label: 'AI Agent' },
            { href: '/accuracy',  label: 'Accuracy' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="font-mono text-sm tracking-widest text-edge-muted hover:text-edge-green uppercase"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
