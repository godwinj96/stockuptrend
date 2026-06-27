export type InstrumentCategory = 'forex' | 'crypto' | 'stocks' | 'commodities'

export interface Instrument {
  id: string
  symbol: string
  displaySymbol: string
  name: string
  category: InstrumentCategory
  spread: string
  leverage: string
  minTradeSize: string
  description: string
  slug: string
  tradingViewSymbol: string
}

export const INSTRUMENT_CATEGORIES: Record<
  InstrumentCategory,
  { label: string; description: string; count: string; iconName: string }
> = {
  forex: {
    label: 'Forex',
    description: 'Major, minor, and exotic currency pairs',
    count: '40+ pairs',
    iconName: 'TrendingUp',
  },
  crypto: {
    label: 'Cryptocurrencies',
    description: 'Bitcoin, Ethereum, and top altcoins',
    count: '20+ assets',
    iconName: 'Zap',
  },
  stocks: {
    label: 'Stocks & Indices',
    description: 'US, EU, and global equity markets',
    count: '100+ equities',
    iconName: 'BarChart2',
  },
  commodities: {
    label: 'Commodities',
    description: 'Gold, oil, silver and natural gas',
    count: '15+ markets',
    iconName: 'Layers',
  },
}

export const INSTRUMENTS: Instrument[] = [
  // Forex — Major pairs
  {
    id: 'eurusd',
    symbol: 'EURUSD',
    displaySymbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    category: 'forex',
    spread: 'From 0.8 pips',
    leverage: 'Up to 1:500',
    minTradeSize: '0.01 lots',
    description: 'The most traded currency pair in the world, representing the euro vs the US dollar.',
    slug: 'eur-usd',
    tradingViewSymbol: 'FOREXCOM:EURUSD',
  },
  {
    id: 'gbpusd',
    symbol: 'GBPUSD',
    displaySymbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    category: 'forex',
    spread: 'From 1.0 pips',
    leverage: 'Up to 1:500',
    minTradeSize: '0.01 lots',
    description: 'Cable — one of the most liquid and widely traded currency pairs globally.',
    slug: 'gbp-usd',
    tradingViewSymbol: 'FOREXCOM:GBPUSD',
  },
  {
    id: 'usdjpy',
    symbol: 'USDJPY',
    displaySymbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    category: 'forex',
    spread: 'From 0.9 pips',
    leverage: 'Up to 1:500',
    minTradeSize: '0.01 lots',
    description: 'A major safe-haven pair closely watched by global investors.',
    slug: 'usd-jpy',
    tradingViewSymbol: 'FOREXCOM:USDJPY',
  },
  {
    id: 'audusd',
    symbol: 'AUDUSD',
    displaySymbol: 'AUD/USD',
    name: 'Australian Dollar / US Dollar',
    category: 'forex',
    spread: 'From 1.0 pips',
    leverage: 'Up to 1:500',
    minTradeSize: '0.01 lots',
    description: 'A commodity-linked currency pair with high liquidity and tight spreads.',
    slug: 'aud-usd',
    tradingViewSymbol: 'FOREXCOM:AUDUSD',
  },
  // Crypto
  {
    id: 'btcusd',
    symbol: 'BTCUSD',
    displaySymbol: 'BTC/USD',
    name: 'Bitcoin / US Dollar',
    category: 'crypto',
    spread: 'From $15',
    leverage: 'Up to 1:10',
    minTradeSize: '0.001 BTC',
    description: "The world's largest cryptocurrency by market capitalisation.",
    slug: 'btc-usd',
    tradingViewSymbol: 'BITSTAMP:BTCUSD',
  },
  {
    id: 'ethusd',
    symbol: 'ETHUSD',
    displaySymbol: 'ETH/USD',
    name: 'Ethereum / US Dollar',
    category: 'crypto',
    spread: 'From $2',
    leverage: 'Up to 1:10',
    minTradeSize: '0.01 ETH',
    description: 'The leading smart contract platform with the largest DeFi ecosystem.',
    slug: 'eth-usd',
    tradingViewSymbol: 'BITSTAMP:ETHUSD',
  },
  // Stocks
  {
    id: 'aapl',
    symbol: 'AAPL',
    displaySymbol: 'AAPL',
    name: 'Apple Inc.',
    category: 'stocks',
    spread: 'From $0.05',
    leverage: 'Up to 1:20',
    minTradeSize: '0.1 shares',
    description: "The world's most valuable company and Nasdaq flagship.",
    slug: 'aapl',
    tradingViewSymbol: 'NASDAQ:AAPL',
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    displaySymbol: 'TSLA',
    name: 'Tesla Inc.',
    category: 'stocks',
    spread: 'From $0.10',
    leverage: 'Up to 1:20',
    minTradeSize: '0.1 shares',
    description: 'The leading electric vehicle and clean energy company.',
    slug: 'tsla',
    tradingViewSymbol: 'NASDAQ:TSLA',
  },
  {
    id: "Spcx",
    symbol: "SPCX",
    displaySymbol:"SPCX",
    name:"Space Exploration Technologies Corp",
    category:"stocks",
    spread:"from $0.10",
    leverage:"up to 1.20",
    minTradeSize:"0.1 shares",
    description:"Provider of commercial launch services and satellite-based Starlink broadband internet" ,
    slug: 'spcx', 
    tradingViewSymbol: "NASDAQ:SPCX"
  },
  // Commodities
  {
    id: 'gold',
    symbol: 'XAUUSD',
    displaySymbol: 'XAU/USD',
    name: 'Gold / US Dollar',
    category: 'commodities',
    spread: 'From $0.25',
    leverage: 'Up to 1:100',
    minTradeSize: '0.01 oz',
    description: 'The ultimate safe-haven asset and store of value.',
    slug: 'xau-usd',
    tradingViewSymbol: 'TVC:GOLD',
  },
  {
    id: 'crude-oil',
    symbol: 'USOIL',
    displaySymbol: 'WTI Crude',
    name: 'WTI Crude Oil',
    category: 'commodities',
    spread: 'From $0.05',
    leverage: 'Up to 1:100',
    minTradeSize: '1 barrel',
    description: 'West Texas Intermediate — the US benchmark crude oil contract.',
    slug: 'wti-crude-oil',
    tradingViewSymbol: 'NYMEX:CL1!',
  },
]

export const FEATURED_TRADINGVIEW_SYMBOLS = [
  { proName: 'FOREXCOM:EURUSD', title: 'EUR/USD' },
  { proName: 'FOREXCOM:GBPUSD', title: 'GBP/USD' },
  { proName: 'FOREXCOM:USDJPY', title: 'USD/JPY' },
  { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
  { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
  { proName: 'NASDAQ:AAPL', title: 'Apple' },
  { proName: 'NASDAQ:TSLA', title: 'Tesla' },
  {proName: 'NASDAQ:SPCX', title: 'SpaceXcondition'},
  { proName: 'TVC:GOLD', title: 'Gold' },
  { proName: 'NYMEX:CL1!', title: 'Crude Oil' },
]
