const TV_LOGO = 'https://s3-symbol-logo.tradingview.com'

// Convenience helpers so call-sites don't concatenate strings
function stockLogo(slug: string) { return `${TV_LOGO}/${slug}--big.svg` }
function cryptoLogo(sym: string) { return `${TV_LOGO}/crypto/XTVC${sym}--big.svg` }

export type SymbolId =
  // Forex
  | 'EURUSD' | 'GBPUSD' | 'USDJPY' | 'AUDUSD' | 'USDCAD'
  | 'EURJPY' | 'EURGBP' | 'GBPJPY' | 'NZDUSD' | 'USDCHF' | 'EURCHF'
  // Crypto
  | 'BTCUSD' | 'ETHUSD' | 'SOLUSD' | 'BNBUSD' | 'XRPUSD'
  | 'ADAUSD' | 'AVAXUSD' | 'LINKUSD' | 'DOTUSD' | 'MATICUSD'
  // Stocks
  | 'AAPL' | 'MSFT' | 'AMZN' | 'NVDA' | 'GOOGL' | 'META' | 'TSLA' | 'NFLX'
  | 'SPCX' | 'V' | 'MA' | 'JPM' | 'BAC' | 'WMT' | 'KO' | 'JNJ' | 'PFE'
  | 'XOM' | 'CVX' | 'INTC' | 'AMD' | 'CRM' | 'ADBE' | 'PYPL' | 'ORCL'
  | 'UBER' | 'DIS' | 'BA' | 'PLTR' | 'GS'
  // Commodities
  | 'XAUUSD' | 'XAGUSD' | 'USOIL' | 'NATGAS'
  // Indices
  | 'SPX500' | 'NAS100' | 'DOW30'

export interface SymbolConfig {
  id: SymbolId
  displayName: string
  category: 'forex' | 'crypto' | 'stock' | 'index' | 'commodity'
  basePrice: number
  pipDecimalPlaces: number
  minVolume: number
  maxVolume: number
  volumeStep: number
  logoUrl?: string
  featured?: boolean
}

export const SYMBOL_POOL: SymbolConfig[] = [
  // ─── Forex ───────────────────────────────────────────────────────────────
  { id: 'EURUSD',  displayName: 'EUR/USD',    category: 'forex',     basePrice: 1.0850,   pipDecimalPlaces: 5, minVolume: 0.01, maxVolume: 5.0,   volumeStep: 0.01  },
  { id: 'GBPUSD',  displayName: 'GBP/USD',    category: 'forex',     basePrice: 1.2650,   pipDecimalPlaces: 5, minVolume: 0.01, maxVolume: 5.0,   volumeStep: 0.01  },
  { id: 'USDJPY',  displayName: 'USD/JPY',    category: 'forex',     basePrice: 149.50,   pipDecimalPlaces: 3, minVolume: 0.01, maxVolume: 5.0,   volumeStep: 0.01  },
  { id: 'AUDUSD',  displayName: 'AUD/USD',    category: 'forex',     basePrice: 0.6520,   pipDecimalPlaces: 5, minVolume: 0.01, maxVolume: 5.0,   volumeStep: 0.01  },
  { id: 'USDCAD',  displayName: 'USD/CAD',    category: 'forex',     basePrice: 1.3650,   pipDecimalPlaces: 5, minVolume: 0.01, maxVolume: 5.0,   volumeStep: 0.01  },
  { id: 'EURJPY',  displayName: 'EUR/JPY',    category: 'forex',     basePrice: 160.50,   pipDecimalPlaces: 3, minVolume: 0.01, maxVolume: 5.0,   volumeStep: 0.01  },
  { id: 'EURGBP',  displayName: 'EUR/GBP',    category: 'forex',     basePrice: 0.8580,   pipDecimalPlaces: 5, minVolume: 0.01, maxVolume: 5.0,   volumeStep: 0.01  },
  { id: 'GBPJPY',  displayName: 'GBP/JPY',    category: 'forex',     basePrice: 189.20,   pipDecimalPlaces: 3, minVolume: 0.01, maxVolume: 5.0,   volumeStep: 0.01  },
  { id: 'NZDUSD',  displayName: 'NZD/USD',    category: 'forex',     basePrice: 0.6080,   pipDecimalPlaces: 5, minVolume: 0.01, maxVolume: 5.0,   volumeStep: 0.01  },
  { id: 'USDCHF',  displayName: 'USD/CHF',    category: 'forex',     basePrice: 0.9010,   pipDecimalPlaces: 5, minVolume: 0.01, maxVolume: 5.0,   volumeStep: 0.01  },
  { id: 'EURCHF',  displayName: 'EUR/CHF',    category: 'forex',     basePrice: 0.9780,   pipDecimalPlaces: 5, minVolume: 0.01, maxVolume: 5.0,   volumeStep: 0.01  },

  // ─── Crypto ──────────────────────────────────────────────────────────────
  { id: 'BTCUSD',  displayName: 'Bitcoin',    category: 'crypto',    basePrice: 67000.0,  pipDecimalPlaces: 1, minVolume: 0.001, maxVolume: 0.5,  volumeStep: 0.001, logoUrl: cryptoLogo('BTC')  },
  { id: 'ETHUSD',  displayName: 'Ethereum',   category: 'crypto',    basePrice: 3500.00,  pipDecimalPlaces: 2, minVolume: 0.01,  maxVolume: 5.0,  volumeStep: 0.01,  logoUrl: cryptoLogo('ETH')  },
  { id: 'SOLUSD',  displayName: 'Solana',     category: 'crypto',    basePrice: 145.00,   pipDecimalPlaces: 2, minVolume: 0.1,   maxVolume: 50.0, volumeStep: 0.1,   logoUrl: cryptoLogo('SOL')  },
  { id: 'BNBUSD',  displayName: 'BNB',        category: 'crypto',    basePrice: 580.00,   pipDecimalPlaces: 2, minVolume: 0.01,  maxVolume: 5.0,  volumeStep: 0.01,  logoUrl: cryptoLogo('BNB')  },
  { id: 'XRPUSD',  displayName: 'XRP',        category: 'crypto',    basePrice: 0.52,     pipDecimalPlaces: 4, minVolume: 10.0,  maxVolume: 5000, volumeStep: 1.0,   logoUrl: cryptoLogo('XRP')  },
  { id: 'ADAUSD',  displayName: 'Cardano',    category: 'crypto',    basePrice: 0.45,     pipDecimalPlaces: 4, minVolume: 10.0,  maxVolume: 5000, volumeStep: 1.0,   logoUrl: cryptoLogo('ADA')  },
  { id: 'AVAXUSD', displayName: 'Avalanche',  category: 'crypto',    basePrice: 35.00,    pipDecimalPlaces: 2, minVolume: 0.1,   maxVolume: 50.0, volumeStep: 0.1,   logoUrl: cryptoLogo('AVAX') },
  { id: 'LINKUSD', displayName: 'Chainlink',  category: 'crypto',    basePrice: 14.50,    pipDecimalPlaces: 3, minVolume: 1.0,   maxVolume: 200,  volumeStep: 1.0,   logoUrl: cryptoLogo('LINK') },
  { id: 'DOTUSD',  displayName: 'Polkadot',   category: 'crypto',    basePrice: 7.20,     pipDecimalPlaces: 3, minVolume: 1.0,   maxVolume: 200,  volumeStep: 1.0,   logoUrl: cryptoLogo('DOT')  },
  { id: 'MATICUSD',displayName: 'Polygon',    category: 'crypto',    basePrice: 0.85,     pipDecimalPlaces: 4, minVolume: 10.0,  maxVolume: 5000, volumeStep: 1.0,   logoUrl: cryptoLogo('MATIC')},

  // ─── Stocks ──────────────────────────────────────────────────────────────
  // Featured first
  { id: 'SPCX',    displayName: 'SpaceX',              category: 'stock', basePrice: 195.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('spacex'),                    featured: true  },
  // Big Tech
  { id: 'AAPL',    displayName: 'Apple',               category: 'stock', basePrice: 189.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('apple')                     },
  { id: 'MSFT',    displayName: 'Microsoft',           category: 'stock', basePrice: 415.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('microsoft')                 },
  { id: 'AMZN',    displayName: 'Amazon',              category: 'stock', basePrice: 182.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('amazon')                    },
  { id: 'NVDA',    displayName: 'NVIDIA',              category: 'stock', basePrice: 875.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('nvidia')                    },
  { id: 'GOOGL',   displayName: 'Alphabet',            category: 'stock', basePrice: 175.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('alphabet')                  },
  { id: 'META',    displayName: 'Meta',                category: 'stock', basePrice: 510.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('meta-platforms')            },
  { id: 'TSLA',    displayName: 'Tesla',               category: 'stock', basePrice: 248.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('tesla')                     },
  { id: 'NFLX',    displayName: 'Netflix',             category: 'stock', basePrice: 645.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('netflix')                   },
  // Finance
  { id: 'V',       displayName: 'Visa',                category: 'stock', basePrice: 272.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('visa')                      },
  { id: 'MA',      displayName: 'Mastercard',          category: 'stock', basePrice: 465.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('mastercard')                },
  { id: 'JPM',     displayName: 'JPMorgan',            category: 'stock', basePrice: 198.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('jpmorgan-chase')            },
  { id: 'BAC',     displayName: 'Bank of America',     category: 'stock', basePrice: 38.50,  pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('bank-of-america')           },
  { id: 'GS',      displayName: 'Goldman Sachs',       category: 'stock', basePrice: 485.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('goldman-sachs')             },
  // Consumer
  { id: 'WMT',     displayName: 'Walmart',             category: 'stock', basePrice: 68.50,  pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('walmart')                   },
  { id: 'KO',      displayName: 'Coca-Cola',           category: 'stock', basePrice: 62.00,  pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('coca-cola')                 },
  { id: 'DIS',     displayName: 'Disney',              category: 'stock', basePrice: 92.00,  pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('disney')                    },
  // Healthcare
  { id: 'JNJ',     displayName: 'Johnson & Johnson',   category: 'stock', basePrice: 158.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('johnson-johnson')           },
  { id: 'PFE',     displayName: 'Pfizer',              category: 'stock', basePrice: 28.50,  pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('pfizer')                    },
  // Energy
  { id: 'XOM',     displayName: 'ExxonMobil',          category: 'stock', basePrice: 115.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('exxon-mobil')               },
  { id: 'CVX',     displayName: 'Chevron',             category: 'stock', basePrice: 155.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('chevron')                   },
  // Semiconductors & software
  { id: 'INTC',    displayName: 'Intel',               category: 'stock', basePrice: 31.50,  pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('intel')                     },
  { id: 'AMD',     displayName: 'AMD',                 category: 'stock', basePrice: 165.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('advanced-micro-devices')    },
  { id: 'CRM',     displayName: 'Salesforce',          category: 'stock', basePrice: 270.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('salesforce')                },
  { id: 'ADBE',    displayName: 'Adobe',               category: 'stock', basePrice: 445.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('adobe')                     },
  { id: 'ORCL',    displayName: 'Oracle',              category: 'stock', basePrice: 128.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('oracle')                    },
  // Payments & platform
  { id: 'PYPL',    displayName: 'PayPal',              category: 'stock', basePrice: 68.00,  pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('paypal')                    },
  { id: 'UBER',    displayName: 'Uber',                category: 'stock', basePrice: 72.00,  pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('uber')                      },
  // Aerospace & Defence
  { id: 'BA',      displayName: 'Boeing',              category: 'stock', basePrice: 178.00, pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('boeing')                    },
  { id: 'PLTR',    displayName: 'Palantir',            category: 'stock', basePrice: 25.00,  pipDecimalPlaces: 2, minVolume: 0.1, maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('palantir-technologies')      },

  // ─── Commodities ─────────────────────────────────────────────────────────
  { id: 'XAUUSD',  displayName: 'Gold',        category: 'commodity', basePrice: 2350.00, pipDecimalPlaces: 2, minVolume: 0.01, maxVolume: 2.0,  volumeStep: 0.01, logoUrl: stockLogo('gold')   },
  { id: 'XAGUSD',  displayName: 'Silver',      category: 'commodity', basePrice: 27.50,   pipDecimalPlaces: 2, minVolume: 0.1,  maxVolume: 50.0, volumeStep: 0.1,  logoUrl: stockLogo('silver') },
  { id: 'USOIL',   displayName: 'Crude Oil',   category: 'commodity', basePrice: 78.50,   pipDecimalPlaces: 2, minVolume: 0.1,  maxVolume: 20.0, volumeStep: 0.1,  logoUrl: stockLogo('oil-wti')},
  { id: 'NATGAS',  displayName: 'Natural Gas', category: 'commodity', basePrice: 2.65,    pipDecimalPlaces: 3, minVolume: 1.0,  maxVolume: 100,  volumeStep: 1.0,  logoUrl: stockLogo('natural-gas') },

  // ─── Indices ─────────────────────────────────────────────────────────────
  { id: 'SPX500',  displayName: 'S&P 500',     category: 'index',     basePrice: 5200.00, pipDecimalPlaces: 1, minVolume: 0.01, maxVolume: 5.0,  volumeStep: 0.01, logoUrl: stockLogo('indices/s-p-500') },
  { id: 'NAS100',  displayName: 'NASDAQ 100',  category: 'index',     basePrice: 18500.0, pipDecimalPlaces: 1, minVolume: 0.01, maxVolume: 5.0,  volumeStep: 0.01, logoUrl: stockLogo('indices/nasdaq-100') },
  { id: 'DOW30',   displayName: 'Dow Jones',   category: 'index',     basePrice: 39500.0, pipDecimalPlaces: 1, minVolume: 0.01, maxVolume: 5.0,  volumeStep: 0.01, logoUrl: stockLogo('indices/dow-30') },
]

// ─── Lookups ──────────────────────────────────────────────────────────────────

export function getSymbolById(id: string): SymbolConfig {
  const sym = SYMBOL_POOL.find((s) => s.id === id)
  if (!sym) throw new Error(`Unknown symbol: ${id}`)
  return sym
}

export function getSymbolCategory(id: string): SymbolConfig['category'] {
  return SYMBOL_POOL.find((s) => s.id === id)?.category ?? 'stock'
}

export function getContractMultiplier(id: string): number {
  const cat = getSymbolCategory(id)
  return cat === 'forex' ? 10_000 : 1
}

export function pickDistinctSymbols(
  count: number,
  exclude: string[] = [],
  preferred: string[] = [],
): SymbolConfig[] {
  const available = SYMBOL_POOL.filter((s) => !exclude.includes(s.id))

  if (preferred.length === 0) {
    const shuffled = [...available].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, shuffled.length))
  }

  const preferredAvailable = available.filter((s) => preferred.includes(s.id))
  const nonPreferred = available.filter((s) => !preferred.includes(s.id))

  const preferredCount = Math.min(
    Math.max(1, Math.floor(count * 0.65)),
    preferredAvailable.length,
  )
  const remainderCount = Math.min(count - preferredCount, nonPreferred.length)

  const shuffledPreferred = [...preferredAvailable].sort(() => Math.random() - 0.5)
  const shuffledRemainder = [...nonPreferred].sort(() => Math.random() - 0.5)

  return [
    ...shuffledPreferred.slice(0, preferredCount),
    ...shuffledRemainder.slice(0, remainderCount),
  ].sort(() => Math.random() - 0.5)
}
