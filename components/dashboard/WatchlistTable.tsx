import { TrendingUp, TrendingDown } from 'lucide-react'

interface WatchlistEntry {
  ticker: string
  score: number
  signal_count: number
  signals: string[]
}

function ScoreBar({ score }: { score: number }) {
  const pct = ((score + 100) / 200) * 100
  const color = score > 20 ? '#00ff88' : score < -20 ? '#ff3b5c' : '#ffb800'

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-edge-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span
        className="font-mono text-xs w-10 text-right"
        style={{ color }}
      >
        {score > 0 ? '+' : ''}{score}
      </span>
    </div>
  )
}

export default function WatchlistTable({ entries }: { entries: WatchlistEntry[] }) {
  return (
    <div className="panel overflow-hidden">
      <div className="px-5 py-4 border-b border-edge-border flex items-center justify-between">
        <h2 className="font-display text-xl tracking-wider text-white">
          WATCHLIST RANKINGS
        </h2>
        <span className="font-mono text-xs text-edge-muted">TODAY</span>
      </div>

      <div className="divide-y divide-edge-border">
        {entries.slice(0, 15).map((entry, i) => (
          <div
            key={entry.ticker}
            className="px-5 py-3 flex items-center gap-4 hover:bg-white/2 transition-colors"
          >
            <span className="font-mono text-xs text-edge-muted w-5">{i + 1}</span>

            <div className="w-16">
              <span className="font-display text-lg text-white tracking-wider">
                {entry.ticker}
              </span>
            </div>

            <div className="flex-1">
              <ScoreBar score={entry.score} />
            </div>

            <div className="flex gap-1 w-24 justify-end flex-wrap">
              {entry.signals.slice(0, 2).map((sig, j) => {
                const isBull = sig.includes('bullish')
                const isBear = sig.includes('bearish')
                return (
                  <span
                    key={j}
                    className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                      isBull ? 'signal-bullish' : isBear ? 'signal-bearish' : 'signal-neutral'
                    }`}
                  >
                    {sig.split('/')[0].replace('_', ' ').slice(0, 6).toUpperCase()}
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
