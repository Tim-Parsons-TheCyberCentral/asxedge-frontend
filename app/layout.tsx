import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ASX Edge — AI-Powered Market Intelligence',
  description: 'Real-time ASX signals, trend forecasts and AI market analysis for Australian investors.',
  keywords: 'ASX, Australian stocks, market signals, stock forecasts, AI trading',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-edge-black text-edge-text font-body antialiased">
        {children}
      </body>
    </html>
  )
}
