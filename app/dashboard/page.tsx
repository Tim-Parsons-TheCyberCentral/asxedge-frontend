import Navbar from '@/components/ui/Navbar'
import MacroTicker from '@/components/dashboard/MacroTicker'
import SignalCard from '@/components/signals/SignalCard'
import { getMacroSnapshot, getSignals, getForecasts, getNews } from '@/lib/api'
import DataStats from '@/components/dashboard/DataStats'
import { TrendingUp, TrendingDown, Newspaper } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export const dynamic = "force-dynamic"


async function getData() {
  try {
    const [macro, signals, forecasts5d, news, statsRes] = await Promise.all([
      getMacroSnapshot(),
      getSignals(1),
      getForecasts('5d', 'bullish'),
      getNews(3, 10),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/stats/`, { next: { revalidate: 300 } }).then(r => r.json()).catch(() => null),
    ])
    return { macro, signals, forecasts5d, news, stats: statsRes }
  } catch {
    return { macro: null, signals: null, forecasts5d: null, news: null, stats: null }
  }
}

export default async function DashboardPage() {
  const { macro, signals, forecasts5d, news, stats } = await getData()

  const macroData    = macro?.data || []
  const signalData   = signals?.data || []
  const forecastData = forecasts5d?.data || []
  const newsData     = news?.data || []

  const KEY_INDICATORS = ['ASX200', 'AUD_USD', 'GOLD_USD', 'OIL_WTI_USD',
                          'SP500', 'VIX', 'RBA_CASH_RATE', 'US_10Y_YIELD']
  const keyMacro = macroData.filter((m: any) => KEY_INDICATORS.includes(m.name))

  return (
    <div className="min-h-screen bg-edge-black grid-bg">
      <Navbar />
      <div className="pt-14">
        {macroData.length > 0 && <MacroTicker items={macroData} />}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <div className="mb-6">
          <div className="font-mono text-xs text-edge-green tracking-widest mb-2 uppercase">
            Market Dashboard
          </div>
          <h1 className="font-display text-4xl text-white tracking-wider">
            MARKET OVERVIEW
          </h1>
        </div>

        {/* Macro grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {keyMacro.map((item: any) => {
            const LABELS: Record<string, string> = {
              ASX200: 'ASX 200', AUD_USD: 'AUD/USD', GOLD_USD: 'Gold',
              OIL_WTI_USD: 'WTI Oil', SP500: 'S&P 500', VIX: 'VIX',
              RBA_CASH_RATE: 'RBA Rate', US_10Y_YIELD: 'US 10Y',
            }
            const value = item.name === 'AUD_USD'
              ? item.value.toFixed(4)
              : item.name === 'RBA_CASH_RATE' || item.name === 'US_10Y_YIELD'
              ? item.value.toFixed(2) + '%'
              : item.value.toLocaleString('en-AU', { maximumFractionDigits: 2 })

            return (
              <div key={item.name} className="panel px-4 py-3">
                <div className="font-mono text-xs text-edge-muted tracking-widest mb-1">
                  {LABELS[item.name] || item.name}
                </div>
                <div className="font-mono text-xl text-white font-medium">{value}</div>
                <div className="font-mono text-xs text-edge-muted/60 mt-1">{item.date}</div>
              </div>
            )
          })}
        </div>

        {/* Data stats panel */}
        {stats && <DataStats stats={stats} />}

        {/* 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Signals */}
          <div>
            <h2 className="font-display text-xl text-white tracking-wider mb-4">
              LATEST SIGNALS
            </h2>
            <div className="space-y-3">
              {signalData.slice(0, 5).map((signal: any) => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
              {signalData.length === 0 && (
                <div className="panel p-6 text-center text-edge-muted font-mono text-sm">
                  No signals today yet
                </div>
              )}
            </div>
          </div>

          {/* Top 5d forecasts */}
          <div>
            <h2 className="font-display text-xl text-white tracking-wider mb-4">
              TOP 5-DAY PICKS
            </h2>
            <div className="panel overflow-hidden">
              <div className="divide-y divide-edge-border">
                {forecastData.slice(0, 8).map((f: any) => (
                  <div key={f.ticker} className="px-4 py-3 flex items-center gap-3 hover:bg-white/2">
                    <div className="w-14">
                      <span className="font-display text-lg text-white tracking-wider">
                        {f.ticker}
                      </span>
                    </div>
                    <TrendingUp size={12} className="text-edge-green flex-shrink-0" />
                    <span className="font-mono text-sm text-edge-green">
                      +{f.prediction?.pct_change}%
                    </span>
                    <span className="font-mono text-xs text-edge-muted ml-auto">
                      ${f.prediction?.target_price?.toFixed(2)}
                    </span>
                  </div>
                ))}
                {forecastData.length === 0 && (
                  <div className="p-6 text-center text-edge-muted font-mono text-sm">
                    No forecasts available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* News feed */}
          <div>
            <h2 className="font-display text-xl text-white tracking-wider mb-4">
              LATEST NEWS
            </h2>
            <div className="space-y-3">
              {newsData.slice(0, 6).map((article: any) => {
                const sentiment = article.sentiment_score || 0
                return (
                  <a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="panel p-3 block hover:border-edge-green/30 transition-all"
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <Newspaper size={12} className="text-edge-muted mt-0.5 flex-shrink-0" />
                      <p className="font-mono text-xs text-edge-text leading-relaxed line-clamp-2">
                        {article.headline}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-mono text-xs text-edge-muted">
                        {article.source}
                      </span>
                      <span className={`font-mono text-xs ${
                        sentiment > 0.1 ? 'text-edge-green' :
                        sentiment < -0.1 ? 'text-edge-red' : 'text-edge-muted'
                      }`}>
                        {sentiment > 0.1 ? '▲' : sentiment < -0.1 ? '▼' : '—'}
                      </span>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
