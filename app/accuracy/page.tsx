'use client'

import Navbar from '@/components/ui/Navbar'
import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Target, TrendingUp, TrendingDown, Minus, Filter } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

function HitRateBar({ rate, total }: { rate: number, total: number }) {
  const color = rate >= 60 ? '#00ff88' : rate >= 45 ? '#ffb800' : '#ff3b5c'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-edge-border rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${rate}%`, backgroundColor: color }} />
      </div>
      <span className="font-mono text-sm font-medium w-14 text-right" style={{ color }}>
        {rate}%
      </span>
      <span className="font-mono text-xs text-edge-muted w-16">
        {total} forecasts
      </span>
    </div>
  )
}

function AuditRow({ item }: { item: any }) {
  const pred    = item.prediction
  const outcome = item.actual_outcome
  const correct = outcome?.direction_correct

  return (
    <div className={`flex items-center gap-4 px-4 py-3 border-b border-edge-border hover:bg-white/2 transition-colors ${correct ? 'border-l-2 border-l-edge-green' : 'border-l-2 border-l-edge-red'}`}>

      {/* Result icon */}
      <div className="flex-shrink-0">
        {correct
          ? <CheckCircle size={16} className="text-edge-green" />
          : <XCircle size={16} className="text-edge-red" />
        }
      </div>

      {/* Ticker + horizon */}
      <div className="w-20">
        <span className="font-display text-lg text-white tracking-wider">{item.ticker}</span>
        <div className="font-mono text-xs text-edge-muted">{item.horizon}</div>
      </div>

      {/* Predicted */}
      <div className="flex-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          {pred.direction === 'bullish'
            ? <TrendingUp size={12} className="text-edge-green" />
            : pred.direction === 'bearish'
            ? <TrendingDown size={12} className="text-edge-red" />
            : <Minus size={12} className="text-edge-amber" />}
          <span className="font-mono text-xs text-edge-muted">Predicted:</span>
          <span className={`font-mono text-xs font-medium ${
            pred.direction === 'bullish' ? 'text-edge-green' :
            pred.direction === 'bearish' ? 'text-edge-red' : 'text-edge-amber'
          }`}>
            {pred.pct_change > 0 ? '+' : ''}{pred.pct_change}%
          </span>
          <span className={`px-1.5 py-0.5 rounded font-mono text-xs ml-1 ${
            pred.confidence === 'high' ? 'signal-bullish' :
            pred.confidence === 'medium' ? 'signal-neutral' : 'signal-bearish'
          }`}>{pred.confidence?.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs text-edge-muted">Actual:</span>
          <span className={`font-mono text-xs font-medium ${
            outcome?.actual_pct_change > 0 ? 'text-edge-green' :
            outcome?.actual_pct_change < 0 ? 'text-edge-red' : 'text-edge-amber'
          }`}>
            {outcome?.actual_pct_change > 0 ? '+' : ''}{outcome?.actual_pct_change}%
          </span>
          {outcome?.within_band && (
            <span className="font-mono text-xs text-edge-green/60">within band</span>
          )}
        </div>
      </div>

      {/* Prices */}
      <div className="hidden md:block text-right">
        <div className="font-mono text-xs text-edge-muted">
          ${outcome?.base_price?.toFixed(2)} → ${outcome?.actual_price?.toFixed(2)}
        </div>
        <div className="font-mono text-xs text-edge-muted/60">
          target: ${pred.target_price?.toFixed(2)}
        </div>
      </div>

      {/* Score */}
      <div className="w-16 text-right">
        <span className={`font-mono text-sm font-medium ${
          item.accuracy_score >= 0.7 ? 'text-edge-green' :
          item.accuracy_score >= 0.4 ? 'text-edge-amber' : 'text-edge-red'
        }`}>
          {(item.accuracy_score * 100).toFixed(0)}
        </span>
        <div className="font-mono text-xs text-edge-muted">score</div>
      </div>

      {/* Date */}
      <div className="hidden md:block w-24 text-right">
        <span className="font-mono text-xs text-edge-muted">
          {new Date(item.target_date).toLocaleDateString('en-AU', { day: '2-digit', month: 'short' })}
        </span>
      </div>
    </div>
  )
}

export default function AccuracyPage() {
  const [summary, setSummary]     = useState<any>(null)
  const [results, setResults]     = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [confidence, setConfidence] = useState('high')
  const [horizon, setHorizon]     = useState('')
  const [direction, setDirection] = useState('')

  useEffect(() => {
    // Fetch summary
    const params = new URLSearchParams()
    if (horizon) params.append('horizon', horizon)
    if (confidence) params.append('confidence', confidence)

    fetch(`${API_URL}/api/accuracy/summary?${params}`)
      .then(r => r.json())
      .then(d => setSummary(d))
      .catch(() => {})
  }, [horizon, confidence])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '200' })
    if (horizon)    params.append('horizon', horizon)
    if (confidence) params.append('confidence', confidence)
    if (direction)  params.append('direction', direction)

    fetch(`${API_URL}/api/accuracy/?${params}`)
      .then(r => r.json())
      .then(d => { setResults(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [horizon, confidence, direction])

  const correct   = results.filter(r => r.actual_outcome?.direction_correct).length
  const incorrect = results.filter(r => !r.actual_outcome?.direction_correct).length
  const hitRate   = results.length > 0 ? Math.round((correct / results.length) * 100) : 0

  return (
    <div className="min-h-screen bg-edge-black grid-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">

        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-xs text-edge-green tracking-widest mb-2 uppercase">
            Forecast Audit
          </div>
          <h1 className="font-display text-5xl text-white tracking-wider">
            ACCURACY TRACKER
          </h1>
          <p className="text-edge-muted font-mono text-sm mt-2">
            Did our forecasts actually come true? Predicted vs actual outcomes.
          </p>
        </div>

        {/* Summary stats */}
        {summary && summary.total_audited > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="panel px-5 py-4">
              <div className="font-mono text-xs text-edge-muted tracking-widest mb-1">AUDITED</div>
              <div className="font-display text-4xl text-white">{summary.total_audited}</div>
            </div>
            <div className="panel px-5 py-4">
              <div className="font-mono text-xs text-edge-muted tracking-widest mb-1">HIT RATE</div>
              <div className={`font-display text-4xl ${
                summary.overall_hit_rate >= 60 ? 'text-edge-green' :
                summary.overall_hit_rate >= 45 ? 'text-edge-amber' : 'text-edge-red'
              }`}>{summary.overall_hit_rate}%</div>
            </div>
            <div className="panel px-5 py-4">
              <div className="font-mono text-xs text-edge-muted tracking-widest mb-1">CORRECT</div>
              <div className="font-display text-4xl text-edge-green">{correct}</div>
            </div>
            <div className="panel px-5 py-4">
              <div className="font-mono text-xs text-edge-muted tracking-widest mb-1">INCORRECT</div>
              <div className="font-display text-4xl text-edge-red">{incorrect}</div>
            </div>
          </div>
        ) : (
          <div className="panel px-5 py-8 mb-8 text-center">
            <Target size={48} className="text-edge-muted mx-auto mb-4" />
            <p className="font-display text-2xl text-edge-muted tracking-wider">
              NO AUDITED FORECASTS YET
            </p>
            <p className="font-mono text-sm text-edge-muted/60 mt-2 max-w-lg mx-auto">
              Forecasts are audited automatically once their target date passes.
              No audited results match the current filters yet — try widening
              the confidence, horizon, or direction filters above.
            </p>
          </div>
        )}

        {/* Hit rate by confidence */}
        {summary?.by_confidence?.length > 0 && (
          <div className="panel overflow-hidden mb-8">
            <div className="px-5 py-4 border-b border-edge-border">
              <h2 className="font-display text-xl text-white tracking-wider">
                HIT RATE BY CONFIDENCE
              </h2>
            </div>
            <div className="divide-y divide-edge-border">
              {['high', 'medium', 'low'].map(conf => {
                const rows = summary.by_confidence.filter((r: any) => r.confidence === conf)
                const total = rows.reduce((a: number, b: any) => a + b.total, 0)
                const correct = rows.reduce((a: number, b: any) => a + b.correct, 0)
                const rate = total > 0 ? Math.round((correct / total) * 100) : 0
                if (total === 0) return null
                return (
                  <div key={conf} className="px-5 py-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded font-mono text-xs ${
                        conf === 'high' ? 'signal-bullish' :
                        conf === 'medium' ? 'signal-neutral' : 'signal-bearish'
                      }`}>{conf.toUpperCase()}</span>
                      <span className="font-mono text-xs text-edge-muted">confidence</span>
                    </div>
                    <HitRateBar rate={rate} total={total} />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="panel px-5 py-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={14} className="text-edge-muted" />
            <span className="font-mono text-xs text-edge-muted tracking-widest">FILTER</span>
          </div>
          <div className="flex flex-wrap gap-4">

            <div>
              <div className="font-mono text-xs text-edge-muted mb-2">CONFIDENCE</div>
              <div className="flex gap-2">
                {['', 'high', 'medium', 'low'].map(c => (
                  <button key={c} onClick={() => setConfidence(c)}
                    className={`px-3 py-1 rounded font-mono text-xs transition-all ${
                      confidence === c
                        ? 'bg-edge-green text-edge-black font-medium'
                        : 'border border-edge-border text-edge-muted hover:text-white'
                    }`}>
                    {c === '' ? 'ALL' : c.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="font-mono text-xs text-edge-muted mb-2">HORIZON</div>
              <div className="flex gap-2">
                {['', '5d', '20d', '63d', '252d'].map(h => (
                  <button key={h} onClick={() => setHorizon(h)}
                    className={`px-3 py-1 rounded font-mono text-xs transition-all ${
                      horizon === h
                        ? 'bg-edge-green text-edge-black font-medium'
                        : 'border border-edge-border text-edge-muted hover:text-white'
                    }`}>
                    {h === '' ? 'ALL' : h.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="font-mono text-xs text-edge-muted mb-2">DIRECTION</div>
              <div className="flex gap-2">
                {['', 'bullish', 'bearish', 'neutral'].map(d => (
                  <button key={d} onClick={() => setDirection(d)}
                    className={`px-3 py-1 rounded font-mono text-xs transition-all ${
                      direction === d
                        ? 'bg-edge-green text-edge-black font-medium'
                        : 'border border-edge-border text-edge-muted hover:text-white'
                    }`}>
                    {d === '' ? 'ALL' : d.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results table */}
        <div className="panel overflow-hidden">
          <div className="px-5 py-4 border-b border-edge-border flex items-center justify-between">
            <h2 className="font-display text-xl text-white tracking-wider">
              FORECAST RESULTS
            </h2>
            {results.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-edge-green">
                  ✓ {correct} correct
                </span>
                <span className="font-mono text-xs text-edge-red">
                  ✗ {incorrect} incorrect
                </span>
                <span className="font-mono text-xs text-edge-muted">
                  {hitRate}% hit rate
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center font-mono text-sm text-edge-muted">
              Loading audit results...
            </div>
          ) : results.length === 0 ? (
            <div className="p-12 text-center">
              <Target size={32} className="text-edge-muted mx-auto mb-3" />
              <p className="font-mono text-sm text-edge-muted">
                No audited forecasts match these filters yet.
              </p>
              <p className="font-mono text-xs text-edge-muted/60 mt-1">
                Try widening the filters above to see more results.
              </p>
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto">
              {results.map((item, i) => (
                <AuditRow key={i} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
