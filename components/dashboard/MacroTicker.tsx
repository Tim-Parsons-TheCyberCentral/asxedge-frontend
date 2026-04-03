'use client'

interface MacroItem {
  name: string
  value: number
  unit: string
}

const DISPLAY_NAMES: Record<string, string> = {
  AUD_USD:      'AUD/USD',
  GOLD_USD:     'GOLD',
  OIL_WTI_USD:  'WTI OIL',
  SP500:        'S&P 500',
  ASX200:       'ASX 200',
  VIX:          'VIX',
  US_10Y_YIELD: 'US 10Y',
  COPPER_USD:   'COPPER',
  RBA_CASH_RATE:'RBA RATE',
  AUD_CNY:      'AUD/CNY',
}

export default function MacroTicker({ items }: { items: MacroItem[] }) {
  const displayed = items.filter(i => DISPLAY_NAMES[i.name])
  const doubled = [...displayed, ...displayed] // duplicate for seamless loop

  return (
    <div className="border-y border-edge-border bg-edge-dark overflow-hidden">
      <div className="flex animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <div key={i} className="inline-flex items-center gap-3 px-8 py-2">
            <span className="font-mono text-xs tracking-widest text-edge-muted uppercase">
              {DISPLAY_NAMES[item.name] || item.name}
            </span>
            <span className="font-mono text-sm font-medium text-edge-text">
              {item.name === 'AUD_USD' || item.name === 'AUD_CNY'
                ? item.value.toFixed(4)
                : item.name === 'RBA_CASH_RATE' || item.name === 'US_10Y_YIELD'
                ? item.value.toFixed(2) + '%'
                : item.value.toLocaleString('en-AU', { maximumFractionDigits: 2 })}
            </span>
            <span className="text-edge-border">·</span>
          </div>
        ))}
      </div>
    </div>
  )
}
