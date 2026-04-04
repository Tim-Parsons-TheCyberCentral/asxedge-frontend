import Navbar from '@/components/ui/Navbar'
import { getForecasts } from '@/lib/api'
import { TrendingUp, TrendingDown, Minus, Target } from 'lucide-react'

export const revalidate = 300


async function getData() {
  try {
    const [d5, d20, d63, d252] = await Promise.all([
      getForecasts('5d'),
      getForecasts('20d'),
      getForecasts('63d'),
      getForecasts('252d'),
    ])
    return { d5, d20, d63, d252 }
  } catch {
    return { d5: null, d20: null, d63: null, d252: null }
  }
}

function ForecastRow({ forecast }: { forecast: any }) {
  const pred = forecast.prediction
  const isBull = pred.direction === 'bullish'
  const isBear = pred.direction === 'bearish'

  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-edge-border hover:bg-white/2 transition-colors">
      <div className="w-16">
        <span className="font-display text-lg text-white tracking-wider">
          {forecast.ticker}
        </span>
      </div>

      <div className="flex items-center gap-1.5 w-24">
        {isBull ? (
          <TrendingUp size={14} className="text-edge-green" />
        ) : isBear ? (
          <TrendingDown size={14} className="text-edge-red" />
        ) : (
          <Minus size={14} className="text-edge-amber" />
        )}
        <span className={`font-mono text-xs font-medium ${
          isBull ? 'text-edge-green' : isBear ? 'text-edge-red' : 'text-edge-amber'
        }`}>
          {pred.pct_change > 0 ? '+' : ''}{pred.pct_change}%
        </span>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-edge-muted">
            ${pred.current_price?.toFixed(2)} →
          </span>
          <span className="font-mono text-sm text-edge-text font-medium">
            ${pred.target_price?.toFixed(2)}
          </span>
        </div>
        <div className="font-mono text-xs text-edge-muted/60 mt-0.5">
          ${pred.lower_bound?.toFixed(2)} – ${pred.upper_bound?.toFixed(2)}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded font-mono text-xs ${
          pred.confidence === 'high' ? 'signal-bullish' :
          pred.confidence === 'medium' ? 'signal-neutral' : 'signal-bearish'
        }`}>
          {pred.confidence?.toUpperCase()}
        </span>
        <span className="font-mono text-xs text-edge-muted hidden md:block">
          {pred.sector?.replace('_', ' ')}
        </span>
      </div>
    </div>
  )
}

function ForecastTable({ title, data, description }: {
  title: string
  data: any[]
  description: string
}) {
  const bullish = data.filter(f => f.prediction?.direction === 'bullish')
  const bearish = data.filter(f => f.prediction?.direction === 'bearish')

  return (
    <div className="panel overflow-hidden">
      <div className="px-5 py-4 border-b border-edge-border">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-white tracking-wider">{title}</h2>
          <div className="flex gap-3">
            <span className="font-mono text-xs text-edge-green">▲ {bullish.length}</span>
            <span className="font-mono text-xs text-edge-red">▼ {bearish.length}</span>
          </div>
        </div>
        <p className="font-mono text-xs text-edge-muted mt-1">{description}</p>
      </div>

      <div className="px-4 py-2 bg-edge-dark border-b border-edge-border grid grid-cols-4 gap-4">
        <span className="font-mono text-xs text-edge-muted tracking-widest">TICKER</span>
        <span className="font-mono text-xs text-edge-muted tracking-widest">CHANGE</span>
        <span className="font-mono text-xs text-edge-muted tracking-widest">TARGET</span>
        <span className="font-mono text-xs text-edge-muted tracking-widest">CONF</span>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {data.slice(0, 30).map((f: any) => (
          <ForecastRow key={`${f.ticker}-${f.horizon}`} forecast={f} />
        ))}
      </div>
    </div>
  )
}

export default async function ForecastsPage() {
  const { d5, d20, d63, d252 } = await getData()

  return (
    <div className="min-h-screen bg-edge-black grid-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">

        <div className="mb-8">
          <div className="font-mono text-xs text-edge-green tracking-widest mb-2 uppercase">
            AI Trend Forecasts
          </div>
          <h1 className="font-display text-5xl text-white tracking-wider">
            PRICE FORECASTS
          </h1>
          <p className="text-edge-muted font-mono text-sm mt-2">
            Prophet time-series models with dynamic macro regressors.
            Not financial advice.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="panel px-5 py-3 mb-8 border-edge-amber/30 bg-edge-amber/5">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-edge-amber flex-shrink-0" />
            <p className="font-mono text-xs text-edge-amber">
              Forecasts are generated by machine learning models using historical price data and macro indicators.
              They are probabilistic estimates, not guaranteed outcomes. Always do your own research.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {d5?.data && (
            <ForecastTable
              title="5-DAY FORECAST"
              data={d5.data}
              description="Short-term price direction — next trading week"
            />
          )}
          {d20?.data && (
            <ForecastTable
              title="20-DAY FORECAST"
              data={d20.data}
              description="Medium-term trend — next trading month"
            />
          )}
          {d63?.data && (
            <ForecastTable
              title="QUARTERLY FORECAST"
              data={d63.data}
              description="63 trading days — approximately one quarter"
            />
          )}
          {d252?.data && (
            <ForecastTable
              title="ANNUAL FORECAST"
              data={d252.data}
              description="252 trading days — full year outlook"
            />
          )}
        </div>
      </div>
    </div>
  )
}
