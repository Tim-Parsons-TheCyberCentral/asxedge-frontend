import Navbar from '@/components/ui/Navbar'
import SignalCard from '@/components/signals/SignalCard'
import { getSignals, getSignalsSummary } from '@/lib/api'
import { Zap, TrendingUp, TrendingDown, Minus } from 'lucide-react'

export const revalidate = 60

async function getData() {
  try {
    const [all, bullish, bearish, summary] = await Promise.all([
      getSignals(1),
      getSignals(1, 'bullish'),
      getSignals(1, 'bearish'),
      getSignalsSummary(),
    ])
    return { all, bullish, bearish, summary }
  } catch {
    return { all: null, bullish: null, bearish: null, summary: null }
  }
}

export default async function SignalsPage() {
  const { all, bullish, bearish, summary } = await getData()

  const allSignals      = all?.data || []
  const bullishSignals  = bullish?.data || []
  const bearishSignals  = bearish?.data || []

  const signalTypeCounts: Record<string, number> = {}
  for (const s of allSignals) {
    signalTypeCounts[s.signal_type] = (signalTypeCounts[s.signal_type] || 0) + 1
  }

  return (
    <div className="min-h-screen bg-edge-black grid-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">

        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-xs text-edge-green tracking-widest mb-2 uppercase">
            Live Market Signals
          </div>
          <h1 className="font-display text-5xl text-white tracking-wider">
            TODAY'S SIGNALS
          </h1>
          <p className="text-edge-muted font-mono text-sm mt-2">
            {allSignals.length} signals detected across 217 ASX tickers
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total',    value: allSignals.length,     color: 'text-white',      icon: Zap },
            { label: 'Bullish',  value: bullishSignals.length, color: 'text-edge-green', icon: TrendingUp },
            { label: 'Bearish',  value: bearishSignals.length, color: 'text-edge-red',   icon: TrendingDown },
            { label: 'Neutral',  value: allSignals.length - bullishSignals.length - bearishSignals.length,
              color: 'text-edge-amber', icon: Minus },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="panel px-5 py-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} className={color} />
                <span className="font-mono text-xs text-edge-muted tracking-widest uppercase">
                  {label}
                </span>
              </div>
              <div className={`font-display text-4xl ${color}`}>{value}</div>
            </div>
          ))}
        </div>

        {/* Signal type breakdown */}
        {Object.keys(signalTypeCounts).length > 0 && (
          <div className="panel px-5 py-4 mb-8">
            <div className="font-mono text-xs text-edge-muted tracking-widest mb-3 uppercase">
              Signal breakdown
            </div>
            <div className="flex flex-wrap gap-3">
              {Object.entries(signalTypeCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => (
                  <div key={type} className="flex items-center gap-2">
                    <span className="font-mono text-xs text-edge-text">
                      {type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="font-display text-lg text-edge-green">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Signals grid */}
        {allSignals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allSignals.map((signal: any) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        ) : (
          <div className="panel p-16 text-center">
            <Zap size={48} className="text-edge-muted mx-auto mb-4" />
            <p className="font-display text-2xl text-edge-muted tracking-wider">
              NO SIGNALS TODAY
            </p>
            <p className="font-mono text-sm text-edge-muted/60 mt-2">
              Signals are generated after market close at 5pm AEST, Monday–Friday.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
