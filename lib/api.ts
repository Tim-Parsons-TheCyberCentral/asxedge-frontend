const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function fetchAPI(endpoint: string) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    next: { revalidate: 60 }, // cache for 60 seconds
  })
  if (!res.ok) throw new Error(`API error: ${endpoint}`)
  return res.json()
}

export async function getSignals(days = 1, direction?: string) {
  const params = new URLSearchParams({ days: String(days) })
  if (direction) params.append('direction', direction)
  return fetchAPI(`/api/signals/?${params}`)
}

export async function getSignalsSummary() {
  return fetchAPI('/api/signals/summary')
}

export async function getWatchlist() {
  return fetchAPI('/api/watchlist/')
}

export async function getMacroSnapshot() {
  return fetchAPI('/api/macro/')
}

export async function getNews(days = 7, limit = 20) {
  return fetchAPI(`/api/news/?days=${days}&limit=${limit}`)
}

export async function getPriceHistory(ticker: string, days = 30) {
  return fetchAPI(`/api/prices/${ticker}?days=${days}`)
}

export async function getPriceSummary(ticker: string) {
  return fetchAPI(`/api/prices/${ticker}/summary`)
}

export async function getForecasts(horizon?: string, direction?: string) {
  const params = new URLSearchParams()
  if (horizon) params.append('horizon', horizon)
  if (direction) params.append('direction', direction)
  return fetchAPI(`/api/forecasts/?${params}`)
}

export async function getTickerForecast(ticker: string) {
  return fetchAPI(`/api/forecasts/${ticker}`)
}

export async function getSentimentSummary() {
  return fetchAPI('/api/news/sentiment-summary')
}

export async function queryAgent(query: string) {
  const res = await fetch(`${API_URL}/api/agent/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  if (!res.ok) throw new Error('Agent query failed')
  return res.json()
}
