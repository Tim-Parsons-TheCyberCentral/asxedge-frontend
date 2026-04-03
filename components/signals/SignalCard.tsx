import { TrendingUp, TrendingDown, Minus, Zap, BarChart2, Activity } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Signal {
  id: string
  ticker: string
  signal_type: string
  direction: string
  strength: string
  generated_at: string
  details: Record<string, any>
}

const SIGNAL_ICONS: Record<string, any> = {
  breakout:    Zap,
  breakdown:   Zap,
  volume_spike: BarChart2,
  ma_crossover: Activity,
  momentum:    TrendingUp,
  sentiment:   Activity,
}

const SIGNAL_LABELS: Record<string, string> = {
  breakout:     'BREAKOUT',
  breakdown:    'BREAKDOWN',
  volume_spike: 'VOL SPIKE',
  ma_crossover: 'MA CROSS',
  momentum:     'MOMENTUM',
  sentiment:    'SENTIMENT',
}

export default function SignalCard({ signal }: { signal: Signal }) {
  const Icon = SIGNAL_ICONS[signal.signal_type] || Activity
  const isBullish = signal.direction === 'bullish'
  const isBearish = signal.direction === 'bearish'

  const directionClass = isBullish
    ? 'signal-bullish'
    : isBearish
    ? 'signal-bearish'
    : 'signal-neutral'

  const strengthDots = signal.strength === 'strong' ? 3
    : signal.strength === 'moderate' ? 2 : 1

  return (
    <div className="panel p-4 hover:border-edge-border/80 transition-all group cursor-default">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl text-white tracking-wider">
            {signal.ticker}
          </span>
          <span className={`px-2 py-0.5 rounded text-xs font-mono tracking-widest ${directionClass}`}>
            {SIGNAL_LABELS[signal.signal_type] || signal.signal_type.toUpperCase()}
          </span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-4 rounded-sm ${
                i < strengthDots
                  ? isBullish ? 'bg-edge-green' : isBearish ? 'bg-edge-red' : 'bg-edge-amber'
                  : 'bg-edge-border'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        {isBullish ? (
          <TrendingUp size={14} className="text-edge-green" />
        ) : isBearish ? (
          <TrendingDown size={14} className="text-edge-red" />
        ) : (
          <Minus size={14} className="text-edge-amber" />
        )}
        <span className={`font-mono text-xs font-medium ${
          isBullish ? 'text-edge-green' : isBearish ? 'text-edge-red' : 'text-edge-amber'
        }`}>
          {signal.direction.toUpperCase()} · {signal.strength.toUpperCase()}
        </span>
      </div>

      {/* Signal details */}
      <div className="text-edge-muted font-mono text-xs space-y-1">
        {signal.details?.pct_above && (
          <div>+{signal.details.pct_above}% above 20d high</div>
        )}
        {signal.details?.pct_below && (
          <div>{signal.details.pct_below}% below 20d low</div>
        )}
        {signal.details?.ratio && (
          <div>{signal.details.ratio}× avg volume</div>
        )}
        {signal.details?.return_5d && (
          <div>{signal.details.return_5d > 0 ? '+' : ''}{signal.details.return_5d}% 5-day return</div>
        )}
        {signal.details?.avg_sentiment && (
          <div>Sentiment: {signal.details.avg_sentiment > 0 ? '+' : ''}{signal.details.avg_sentiment}</div>
        )}
        {signal.details?.type && (
          <div>{signal.details.type === 'golden_cross' ? '🟢 Golden cross' : '🔴 Death cross'}</div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-edge-border">
        <span className="font-mono text-xs text-edge-muted/60">
          {formatDistanceToNow(new Date(signal.generated_at), { addSuffix: true })}
        </span>
      </div>
    </div>
  )
}
