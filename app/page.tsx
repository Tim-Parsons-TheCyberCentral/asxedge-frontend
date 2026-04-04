import Navbar from '@/components/ui/Navbar'
import MacroTicker from '@/components/dashboard/MacroTicker'
import SignalCard from '@/components/signals/SignalCard'
import WatchlistTable from '@/components/dashboard/WatchlistTable'
import { getSignals, getMacroSnapshot, getWatchlist, getSignalsSummary } from '@/lib/api'
import DataStats from '@/components/dashboard/DataStats'
import { TrendingUp, TrendingDown, Zap, Brain, BarChart2, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = "force-dynamic"


async function getData() {
  try {
    const [signals, macro, watchlist, summary, statsRes] = await Promise.all([
      getSignals(1),
      getMacroSnapshot(),
      getWatchlist(),
      getSignalsSummary(),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/stats/`, { next: { revalidate: 300 } }).then(r => r.json()).catch(() => null),
    ])
    return { signals, macro, watchlist, summary, stats: statsRes }
  } catch {
    return { signals: null, macro: null, watchlist: null, summary: null, stats: null }
  }
}

export default async function HomePage() {
  const { signals, macro, watchlist, summary, stats } = await getData()

  const signalData = signals?.data || []
  const macroData  = macro?.data || []
  const watchlistScores = watchlist?.data?.scores || []

  const bullishCount = summary?.data?.filter((s: any) => s.direction === 'bullish')
    .reduce((a: number, b: any) => a + b.count, 0) || 0
  const bearishCount = summary?.data?.filter((s: any) => s.direction === 'bearish')
    .reduce((a: number, b: any) => a + b.count, 0) || 0
  const totalSignals = summary?.data?.reduce((a: number, b: any) => a + b.count, 0) || 0

  const asx200 = macroData.find((m: any) => m.name === 'ASX200')
  const audUsd  = macroData.find((m: any) => m.name === 'AUD_USD')

  return (
    <div className="min-h-screen bg-edge-black grid-bg">
      <Navbar />

      {/* Macro ticker strip */}
      <div className="pt-14">
        {macroData.length > 0 && <MacroTicker items={macroData} />}
      </div>

      {/* Hero section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10">
        <div className="mb-2">
          <span className="font-mono text-xs tracking-widest text-edge-green uppercase">
            AI-Powered · ASX Market Intelligence
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-6xl md:text-8xl text-white tracking-wider leading-none">
              ASX<br />
              <span className="text-edge-green glow-green">EDGE</span>
            </h1>
            <p className="mt-4 text-edge-muted font-body max-w-lg">
              Real-time signals, AI-driven forecasts and market intelligence
              for Australian equities. Powered by Claude.
            </p>
          </div>

          {/* Live stats */}
          <div className="flex gap-4">
            <div className="panel px-5 py-4 text-center min-w-[100px]">
              <div className="font-display text-4xl text-edge-green glow-green">
                {totalSignals}
              </div>
              <div className="font-mono text-xs text-edge-muted mt-1 tracking-widest">
                SIGNALS TODAY
              </div>
            </div>
            <div className="panel px-5 py-4 text-center min-w-[100px]">
              <div className="font-display text-4xl text-edge-green">
                {bullishCount}
              </div>
              <div className="font-mono text-xs text-edge-muted mt-1 tracking-widest">
                BULLISH
              </div>
            </div>
            <div className="panel px-5 py-4 text-center min-w-[100px]">
              <div className="font-display text-4xl text-edge-red">
                {bearishCount}
              </div>
              <div className="font-mono text-xs text-edge-muted mt-1 tracking-widest">
                BEARISH
              </div>
            </div>
          </div>
        </div>

        {/* Market status bar */}
        {asx200 && (
          <div className="mt-8 panel px-5 py-3 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-edge-green animate-pulse-green" />
              <span className="font-mono text-xs text-edge-muted tracking-widest">ASX 200</span>
              <span className="font-mono text-lg text-white">
                {asx200.value.toLocaleString('en-AU', { maximumFractionDigits: 0 })}
              </span>
            </div>
            {audUsd && (
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-edge-muted tracking-widest">AUD/USD</span>
                <span className="font-mono text-lg text-white">
                  {audUsd.value.toFixed(4)}
                </span>
              </div>
            )}
            <div className="ml-auto">
              <span className="font-mono text-xs text-edge-muted">
                Updated {new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })} AEST
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Feature nav cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/signals',   icon: Zap,       label: 'Signals',   desc: 'Live breakouts & alerts',      color: 'text-edge-green' },
            { href: '/forecasts', icon: TrendingUp, label: 'Forecasts', desc: 'AI trend predictions',         color: 'text-edge-blue' },
            { href: '/watchlist', icon: BarChart2,  label: 'Watchlist', desc: 'Ranked by signal strength',    color: 'text-edge-amber' },
            { href: '/agent',     icon: Brain,      label: 'AI Agent',  desc: 'Ask anything about ASX',       color: 'text-edge-red' },
          ].map(({ href, icon: Icon, label, desc, color }) => (
            <Link
              key={href}
              href={href}
              className="panel p-4 hover:border-edge-green/30 transition-all group"
            >
              <Icon size={20} className={`${color} mb-3`} />
              <div className="font-display text-xl text-white tracking-wider mb-1">{label}</div>
              <div className="font-mono text-xs text-edge-muted">{desc}</div>
              <ChevronRight
                size={14}
                className="text-edge-muted mt-3 group-hover:text-edge-green group-hover:translate-x-1 transition-all"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Main content grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Signals feed — 2/3 width */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl tracking-wider text-white">
                TODAY'S SIGNALS
              </h2>
              <Link
                href="/signals"
                className="font-mono text-xs text-edge-green hover:text-white transition-colors tracking-widest flex items-center gap-1"
              >
                VIEW ALL <ChevronRight size={12} />
              </Link>
            </div>

            {signalData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {signalData.slice(0, 8).map((signal: any) => (
                  <SignalCard key={signal.id} signal={signal} />
                ))}
              </div>
            ) : (
              <div className="panel p-12 text-center">
                <Zap size={32} className="text-edge-muted mx-auto mb-3" />
                <p className="font-mono text-sm text-edge-muted">
                  No signals generated today yet.
                </p>
                <p className="font-mono text-xs text-edge-muted/60 mt-1">
                  Signals are generated after market close at 5pm AEST.
                </p>
              </div>
            )}
          </div>

          {/* Watchlist — 1/3 width */}
          <div>
            {watchlistScores.length > 0 ? (
              <WatchlistTable entries={watchlistScores} />
            ) : (
              <div className="panel p-8 text-center">
                <BarChart2 size={32} className="text-edge-muted mx-auto mb-3" />
                <p className="font-mono text-sm text-edge-muted">
                  Watchlist updates after market close.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Data stats */}
      {stats && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <DataStats stats={stats} />
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-edge-border bg-edge-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-xl tracking-wider text-white">
                ASX<span className="text-edge-green">EDGE</span>
              </span>
              <span className="font-mono text-xs text-edge-muted">
                · AI-powered market intelligence
              </span>
            </div>
            <p className="font-mono text-xs text-edge-muted text-center">
              Not financial advice. For informational purposes only.
              Always conduct your own research.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
