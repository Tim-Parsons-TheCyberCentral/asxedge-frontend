import { Database, TrendingUp, Newspaper, BarChart2, Brain, Activity } from 'lucide-react'

interface StatItem {
  icon: any
  label: string
  value: string | number
  sub: string
  color: string
}

export default function DataStats({ stats }: { stats: any }) {
  const items: StatItem[] = [
    {
      icon: TrendingUp,
      label: 'Price Records',
      value: stats.price_rows?.toLocaleString() || '—',
      sub: `${stats.tickers || 0} ASX tickers · 1 year history`,
      color: 'text-edge-green',
    },
    {
      icon: Activity,
      label: 'Macro Indicators',
      value: stats.macro_indicators || '—',
      sub: 'AUD/USD · Gold · Oil · RBA · VIX · S&P500 + more',
      color: 'text-edge-blue',
    },
    {
      icon: Newspaper,
      label: 'News Articles',
      value: stats.news_articles?.toLocaleString() || '—',
      sub: 'Yahoo Finance · NewsAPI · sentiment scored',
      color: 'text-edge-amber',
    },
    {
      icon: Brain,
      label: 'Vector Embeddings',
      value: stats.embedded_articles?.toLocaleString() || '—',
      sub: 'OpenAI 1536-dim · semantic search enabled',
      color: 'text-edge-green',
    },
    {
      icon: BarChart2,
      label: 'Signals Generated',
      value: stats.signals?.toLocaleString() || '—',
      sub: 'Breakouts · MA crosses · Volume · Momentum',
      color: 'text-edge-red',
    },
    {
      icon: Database,
      label: 'Forecasts',
      value: stats.forecasts?.toLocaleString() || '—',
      sub: '5d · 20d · 63d · 252d · dynamic regressors',
      color: 'text-edge-amber',
    },
  ]

  return (
    <div className="panel overflow-hidden">
      <div className="px-5 py-4 border-b border-edge-border flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl text-white tracking-wider">
            DATA INTELLIGENCE ENGINE
          </h2>
          <p className="font-mono text-xs text-edge-muted mt-0.5">
            Live data powering ASX Edge · updated daily after market close
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-edge-green animate-pulse-green" />
          <span className="font-mono text-xs text-edge-green tracking-widest">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-edge-border">
        {items.map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className="px-5 py-4 hover:bg-white/2 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} className={color} />
              <span className="font-mono text-xs text-edge-muted tracking-widest uppercase">
                {label}
              </span>
            </div>
            <div className={`font-display text-3xl ${color} mb-1`}>
              {value}
            </div>
            <div className="font-mono text-xs text-edge-muted/70 leading-relaxed">
              {sub}
            </div>
          </div>
        ))}
      </div>

      {/* Data sources footer */}
      <div className="px-5 py-3 border-t border-edge-border bg-edge-dark">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <span className="font-mono text-xs text-edge-muted">
            <span className="text-edge-green">●</span> yfinance (prices)
          </span>
          <span className="font-mono text-xs text-edge-muted">
            <span className="text-edge-green">●</span> Yahoo Finance (news)
          </span>
          <span className="font-mono text-xs text-edge-muted">
            <span className="text-edge-green">●</span> NewsAPI (financial news)
          </span>
          <span className="font-mono text-xs text-edge-muted">
            <span className="text-edge-green">●</span> RBA (cash rate)
          </span>
          <span className="font-mono text-xs text-edge-muted">
            <span className="text-edge-green">●</span> Prophet (forecasting)
          </span>
          <span className="font-mono text-xs text-edge-muted">
            <span className="text-edge-green">●</span> Claude AI (analysis)
          </span>
        </div>
      </div>
    </div>
  )
}
