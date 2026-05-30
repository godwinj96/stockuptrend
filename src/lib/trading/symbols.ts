export type SymbolId =
  | 'EURUSD'
  | 'GBPUSD'
  | 'USDJPY'
  | 'AUDUSD'
  | 'USDCAD'
  | 'XAUUSD'
  | 'BTCUSD'
  | 'ETHUSD'
  | 'AAPL'
  | 'MSFT'
  | 'AMZN'
  | 'SPX500'

export interface SymbolConfig {
  id: SymbolId
  displayName: string
  category: 'forex' | 'crypto' | 'stock' | 'index' | 'commodity'
  basePrice: number
  pipDecimalPlaces: number
  minVolume: number
  maxVolume: number
  volumeStep: number
}

export const SYMBOL_POOL: SymbolConfig[] = [
  { id: 'EURUSD',  displayName: 'EUR/USD',   category: 'forex',     basePrice: 1.0850,  pipDecimalPlaces: 5, minVolume: 0.01, maxVolume: 5.0,  volumeStep: 0.01 },
  { id: 'GBPUSD',  displayName: 'GBP/USD',   category: 'forex',     basePrice: 1.2650,  pipDecimalPlaces: 5, minVolume: 0.01, maxVolume: 5.0,  volumeStep: 0.01 },
  { id: 'USDJPY',  displayName: 'USD/JPY',   category: 'forex',     basePrice: 149.50,  pipDecimalPlaces: 3, minVolume: 0.01, maxVolume: 5.0,  volumeStep: 0.01 },
  { id: 'AUDUSD',  displayName: 'AUD/USD',   category: 'forex',     basePrice: 0.6520,  pipDecimalPlaces: 5, minVolume: 0.01, maxVolume: 5.0,  volumeStep: 0.01 },
  { id: 'USDCAD',  displayName: 'USD/CAD',   category: 'forex',     basePrice: 1.3650,  pipDecimalPlaces: 5, minVolume: 0.01, maxVolume: 5.0,  volumeStep: 0.01 },
  { id: 'XAUUSD',  displayName: 'XAU/USD',   category: 'commodity', basePrice: 2350.00, pipDecimalPlaces: 2, minVolume: 0.01, maxVolume: 2.0,  volumeStep: 0.01 },
  { id: 'BTCUSD',  displayName: 'BTC/USD',   category: 'crypto',    basePrice: 67000.0, pipDecimalPlaces: 1, minVolume: 0.001,maxVolume: 0.5,  volumeStep: 0.001},
  { id: 'ETHUSD',  displayName: 'ETH/USD',   category: 'crypto',    basePrice: 3500.00, pipDecimalPlaces: 2, minVolume: 0.01, maxVolume: 5.0,  volumeStep: 0.01 },
  { id: 'AAPL',    displayName: 'Apple',      category: 'stock',     basePrice: 189.00,  pipDecimalPlaces: 2, minVolume: 0.1,  maxVolume: 50.0, volumeStep: 0.1  },
  { id: 'MSFT',    displayName: 'Microsoft',  category: 'stock',     basePrice: 415.00,  pipDecimalPlaces: 2, minVolume: 0.1,  maxVolume: 50.0, volumeStep: 0.1  },
  { id: 'AMZN',    displayName: 'Amazon',     category: 'stock',     basePrice: 182.00,  pipDecimalPlaces: 2, minVolume: 0.1,  maxVolume: 50.0, volumeStep: 0.1  },
  { id: 'SPX500',  displayName: 'S&P 500',    category: 'index',     basePrice: 5200.00, pipDecimalPlaces: 1, minVolume: 0.01, maxVolume: 5.0,  volumeStep: 0.01 },
]

export function getSymbolById(id: string): SymbolConfig {
  const sym = SYMBOL_POOL.find((s) => s.id === id)
  if (!sym) throw new Error(`Unknown symbol: ${id}`)
  return sym
}

export function pickDistinctSymbols(count: number, exclude: string[] = []): SymbolConfig[] {
  const available = SYMBOL_POOL.filter((s) => !exclude.includes(s.id))
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
