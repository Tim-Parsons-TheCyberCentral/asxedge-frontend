'use client'

import Navbar from '@/components/ui/Navbar'
import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, Target, ArrowUpDown } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

function ForecastRow({ forecast }: { forecast: any }) {
  const pred = forecast.prediction
  const isBull = pred.direction === 'bullish'
  const isBear = pred.direction === 'bearish'

  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-edge-border hover:bg-white/2 transition-colors">
      <div className="w-16">
        <span className="font-display text-lg text-white tracking-wider">{forecast.ticker}</span>
      </div>
      <div className="flex items-center gap-1.5 w-24">
        {isBull ? <TrendingUp size={14} className="text-edge-green" />
          : isBear ? <TrendingDown size={14} className="text-edge-red" />
          : <Minus size={14} className="text-edge-amber" />}
        <span className={`font-mono text-xs font-medium ${isBull ? 'text-edge-green' : isBear ? 'text-edge-red' : 'text-edge-amber'}`}>
          {pred.pct_change > 0 ? '+' : ''}{pred.pct_change}%
        </span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-edge-muted">${pred.current_price?.toFixed(2)} →</span>
          <span className="font-mono text-sm text-edge-text font-medium">${pred.target_price?.toFixed(2)}</span>
        </div>
        <div className="font-mono text-xs text-edge-muted/60 mt-0.5">
          ${pred.lower_bound?.toFixed(2)} – ${pred.upper_bound?.toFixed(2)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded font-mono text-xs ${
          pred.confidence === 'high' ? 'signal-bullish' :
          pred.confidence === 'medium' ? 'signal-neutral' : 'signal-bearish'
        }`}>{pred.confidence?.toUpperCase()}</span>
        <span className="font-mono text-xs text-edge-muted hidden md:block">
          {pred.sector?.replace('_', ' ')}
        </span>
      </div>
    </div>
  )
}

function ForecastTable({ title, horizon, description, sort }: {
  title: string, horizon: string, description: string, sort: string
}) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [direction, setDirection] = useState<string>('')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ horizon, sort })
    if (direction) params.append('direction', direction)
    fetch(`${API_URL}/api/forecasts/?${params}`)
      .then(r => r.json())
      .then(d => { setData(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [horizon, sort, direction])

  const bullish = data.filter(f => f.prediction?.direction === 'bullish')
  const bearish = data.filter(f => f.prediction?.direction === 'bearish')

  return (
    <div className="panel overflow-hidden">
      <div className="px-5 py-4 border-b border-edge-border">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-display text-2xl text-white tracking-wider">{title}</h2>
            <p className="font-mono text-xs text-edge-muted mt-1">{description}</p>
          </div>
          <div className="flex gap-2">
            <span className="font-mono text-xs text-edge-green">▲ {bullish.length}</span>
            <span className="font-mono text-xs text-edge-red">▼ {bearish.length}</span>
          </div>
        </div>
        {/* Direction filter */}
        <div className="flex gap-2 mt-3">
          {['', 'bullish', 'bearish', 'neutral'].map(d => (
            <button
              key={d}
              onClick={() => setDirection(d)}
              className={`px-3 py-1 rounded font-mono text-xs transition-all ${
                direction === d
                  ? d === 'bullish' ? 'signal-bullish' : d === 'bearish' ? 'signal-bearish' : d === 'neutral' ? 'signal-neutral' : 'bg-edge-border text-white'
                  : 'border border-edge-border text-edge-muted hover:text-white'
              }`}
            >
              {d === '' ? 'ALL' : d.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-2 bg-edge-dark border-b border-edge-border grid grid-cols-4 gap-4">
        <span className="font-mono text-xs text-edge-muted tracking-widest">TICKER</span>
        <span className="font-mono text-xs text-edge-muted tracking-widest">CHANGE</span>
        <span className="font-mono text-xs text-edge-muted tracking-widest">TARGET</span>
        <span className="font-mono text-xs text-edge-muted tracking-widest">CONF</span>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center font-mono text-sm text-edge-muted">Loading...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center font-mono text-sm text-edge-muted">No forecasts available</div>
        ) : (
          data.map((f: any) => <ForecastRow key={`${f.ticker}-${f.horizon}`} forecast={f} />)
        )}
      </div>
    </div>
  )
}

export default function ForecastsPage() {
  const [sort, setSort] = useState('pct_change_desc')

  return (
    <div className="min-h-screen bg-edge-black grid-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <div className="mb-6">
          <div className="font-mono text-xs text-edge-green tracking-widest mb-2 uppercase">AI Trend Forecasts</div>
          <h1 className="font-display text-5xl text-white tracking-wider">PRICE FORECASTS</h1>
          <p className="text-edge-muted font-mono text-sm mt-2">
            Prophet models with dynamic macro regressors. Not financial advice.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="panel px-5 py-3 mb-6 border-edge-amber/30 bg-edge-amber/5">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-edge-amber flex-shrink-0" />
            <p className="font-mono text-xs text-edge-amber">
              Probabilistic estimates only. Always do your own research before making investment decisions.
            </p>
          </div>
        </div>

        {/* Sort controls */}
        <div className="flex items-center gap-3 mb-6">
          <ArrowUpDown size={14} className="text-edge-muted" />
          <span className="font-mono text-xs text-edge-muted tracking-widest">SORT BY:</span>
          {[
            { value: 'pct_change_desc', label: 'Highest Change' },
            { value: 'pct_change_asc',  label: 'Lowest Change' },
            { value: 'confidence',       label: 'Confidence' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSort(value)}
              className={`px-3 py-1.5 rounded font-mono text-xs transition-all ${
                sort === value
                  ? 'bg-edge-green text-edge-black font-medium'
                  : 'border border-edge-border text-edge-muted hover:text-white hover:border-edge-green'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ForecastTable title="5-DAY FORECAST"      horizon="5d"   sort={sort} description="Short-term — next trading week" />
          <ForecastTable title="20-DAY FORECAST"     horizon="20d"  sort={sort} description="Medium-term — next trading month" />
          <ForecastTable title="QUARTERLY FORECAST"  horizon="63d"  sort={sort} description="63 trading days — one quarter" />
          <ForecastTable title="ANNUAL FORECAST"     horizon="252d" sort={sort} description="252 trading days — full year outlook" />
        </div>
      </div>
    </div>
  )
}
