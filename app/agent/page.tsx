'use client'

import Navbar from '@/components/ui/Navbar'
import { useState, useRef, useEffect } from 'react'
import { Send, Brain, User, Loader2, ChevronRight } from 'lucide-react'

const SUGGESTED = [
  "How is BHP performing and what's driving it?",
  "Which ASX sectors are performing best this week?",
  "What is the current macro environment for Australian stocks?",
  "Give me a summary of the materials sector",
  "What are the top bullish signals today?",
  "How is CBA positioned given current RBA rates?",
]

interface Message {
  role: 'user' | 'assistant'
  content: string
  loading?: boolean
}

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "G'day! I'm the ASX Edge AI analyst. I have access to live price data, signals, macro indicators and news for 217 ASX stocks. What would you like to know about the Australian market today?",
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(query: string) {
    if (!query.trim() || loading) return

    const userMsg: Message = { role: 'user', content: query }
    const loadingMsg: Message = { role: 'assistant', content: '', loading: true }

    setMessages(prev => [...prev, userMsg, loadingMsg])
    setInput('')
    setLoading(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${API_URL}/api/agent/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      const data = await res.json()

      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: data.response || 'Sorry, I encountered an error.' }
      ])
    } catch {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: 'Unable to connect to the agent. Please check the API is running.' }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-edge-black grid-bg flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-20 pb-4 flex flex-col">

        {/* Header */}
        <div className="mb-6">
          <div className="font-mono text-xs text-edge-green tracking-widest mb-2 uppercase">
            AI Market Analyst
          </div>
          <h1 className="font-display text-4xl text-white tracking-wider">
            ASX INTELLIGENCE AGENT
          </h1>
          <p className="text-edge-muted font-mono text-xs mt-2">
            Powered by Claude · Live data from 217 ASX tickers
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 panel overflow-y-auto mb-4 p-4 space-y-4 min-h-[400px] max-h-[500px]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                msg.role === 'assistant'
                  ? 'bg-edge-green/20 border border-edge-green/30'
                  : 'bg-edge-border'
              }`}>
                {msg.role === 'assistant'
                  ? <Brain size={14} className="text-edge-green" />
                  : <User size={14} className="text-edge-muted" />
                }
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] rounded px-4 py-3 font-mono text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-edge-border text-edge-text'
                  : 'bg-edge-panel border border-edge-border text-edge-text'
              }`}>
                {msg.loading ? (
                  <div className="flex items-center gap-2 text-edge-muted">
                    <Loader2 size={14} className="animate-spin" />
                    <span>Analysing market data...</span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Suggested queries */}
        {messages.length <= 1 && (
          <div className="mb-4">
            <p className="font-mono text-xs text-edge-muted mb-2 tracking-widest">
              SUGGESTED QUERIES
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-1.5 rounded border border-edge-border text-edge-muted font-mono text-xs hover:border-edge-green hover:text-edge-green transition-all flex items-center gap-1"
                >
                  {q.slice(0, 40)}...
                  <ChevronRight size={10} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask anything about ASX stocks, sectors, or market conditions..."
            disabled={loading}
            className="flex-1 bg-edge-panel border border-edge-border rounded px-4 py-3 font-mono text-sm text-edge-text placeholder-edge-muted focus:outline-none focus:border-edge-green transition-colors disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-edge-green text-edge-black rounded font-mono text-sm font-medium hover:bg-edge-green-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? <Loader2 size={16} className="animate-spin" />
              : <Send size={16} />
            }
          </button>
        </div>

        <p className="font-mono text-xs text-edge-muted/50 mt-2 text-center">
          Not financial advice. For informational purposes only.
        </p>
      </div>
    </div>
  )
}
