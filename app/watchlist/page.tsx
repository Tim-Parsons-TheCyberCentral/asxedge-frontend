import Navbar from '@/components/ui/Navbar'
import { getWatchlist } from '@/lib/api'
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react'

export const dynamic = "force-dynamic"

export default async function WatchlistPage() {
  let watchlistData = null
  try {
    const res = await getWatchlist()
    watchlistData = res?.data
  } catch {}

  const scores: any[] = watchlistData?.scores || []
  const topBullish = watchlistData?.top_bullish || []
  const topBearish = watchlistData?.top_bearish || []

  function ScoreBar({ score }: { score: number }) {
    const pct = ((score + 100) / 200) * 100
    const color = score > 20 ? '#00ff88' : score < -20 ? '#ff3b5c' : '#ffb800'
    return (
      <div className="flex items-center gap-3 flex-1">
        <div className="flex-1 h-1.5 bg-edge-border rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
        <span className="font-mono text-sm w-12 text-right" style={{ color }}>
          {score > 0 ? '+' : ''}{score}
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-edge-black grid-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">

        <div className="mb-8">
          <div className="font-mono text-xs text-edge-green tracking-widest mb-2 uppercase">
            Daily Rankings
          </div>
          <h1 className="font-display text-5xl text-white tracking-wider">
            WATCHLIST
          </h1>
          <p className="text-edge-muted font-mono text-sm mt-2">
            Composite score based on technical signals and news sentiment.
            Updated after market close.
          </p>
        </div>

        {scores.length > 0 ? (
          <>
            {/* Top movers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="panel overflow-hidden">
                <div className="px-5 py-4 border-b border-edge-border flex items-center gap-2">
                  <TrendingUp size={16} className="text-edge-green" />
                  <h2 className="font-display text-xl text-white tracking-wider">
                    TOP BULLISH
                  </h2>
                </div>
                <div className="divide-y divide-edge-border">
                  {topBullish.map((entry: any, i: number) => (
                    <div key={entry.ticker} className="px-5 py-3 flex items-center gap-4">
                      <span className="font-mono text-xs text-edge-muted w-5">{i + 1}</span>
                      <span className="font-display text-xl text-white tracking-wider w-16">
                        {entry.ticker}
                      </span>
                      <ScoreBar score={entry.score} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel overflow-hidden">
                <div className="px-5 py-4 border-b border-edge-border flex items-center gap-2">
                  <TrendingDown size={16} className="text-edge-red" />
                  <h2 className="font-display text-xl text-white tracking-wider">
                    TOP BEARISH
                  </h2>
                </div>
                <div className="divide-y divide-edge-border">
                  {topBearish.map((entry: any, i: number) => (
                    <div key={entry.ticker} className="px-5 py-3 flex items-center gap-4">
                      <span className="font-mono text-xs text-edge-muted w-5">{i + 1}</span>
                      <span className="font-display text-xl text-white tracking-wider w-16">
                        {entry.ticker}
                      </span>
                      <ScoreBar score={entry.score} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Full rankings */}
            <div className="panel overflow-hidden">
              <div className="px-5 py-4 border-b border-edge-border">
                <h2 className="font-display text-2xl text-white tracking-wider">
                  FULL RANKINGS — {scores.length} TICKERS
                </h2>
              </div>
              <div className="divide-y divide-edge-border">
                {scores.map((entry: any, i: number) => (
                  <div key={entry.ticker} className="px-5 py-3 flex items-center gap-4 hover:bg-white/2">
                    <span className="font-mono text-xs text-edge-muted w-8">{i + 1}</span>
                    <span className="font-display text-lg text-white tracking-wider w-16">
                      {entry.ticker}
                    </span>
                    <ScoreBar score={entry.score} />
                    <div className="flex gap-1 w-32 justify-end flex-wrap hidden md:flex">
                      {entry.signals?.slice(0, 2).map((sig: string, j: number) => {
                        const isBull = sig.includes('bullish')
                        const isBear = sig.includes('bearish')
                        return (
                          <span key={j} className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                            isBull ? 'signal-bullish' : isBear ? 'signal-bearish' : 'signal-neutral'
                          }`}>
                            {sig.split('/')[0].replace('_', ' ').slice(0, 4).toUpperCase()}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="panel p-16 text-center">
            <BarChart2 size={48} className="text-edge-muted mx-auto mb-4" />
            <p className="font-display text-2xl text-edge-muted tracking-wider">
              WATCHLIST UPDATING
            </p>
            <p className="font-mono text-sm text-edge-muted/60 mt-2">
              Rankings are generated after market close at 5:45pm AEST, Monday–Friday.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
