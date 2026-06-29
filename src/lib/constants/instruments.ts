export type InstrumentCategory = 'forex' | 'crypto' | 'stocks' | 'commodities' | 'indices'

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
    label: 'Stocks',
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
  indices: {
    label: 'Indices',
    description: 'Major global stock market indices',
    count: '10+ indices',
    iconName: 'Activity',
  },
}

export const INSTRUMENTS: Instrument[] = [
  // ─── Forex — Major pairs ──────────────────────────────────────────────────
  {
    id: 'eurusd', symbol: 'EURUSD', displaySymbol: 'EUR/USD', name: 'Euro / US Dollar',
    category: 'forex', spread: 'From 0.8 pips', leverage: 'Up to 1:500', minTradeSize: '0.01 lots',
    description: 'The most traded currency pair in the world, representing the euro vs the US dollar.',
    slug: 'eur-usd', tradingViewSymbol: 'FOREXCOM:EURUSD',
  },
  {
    id: 'gbpusd', symbol: 'GBPUSD', displaySymbol: 'GBP/USD', name: 'British Pound / US Dollar',
    category: 'forex', spread: 'From 1.0 pips', leverage: 'Up to 1:500', minTradeSize: '0.01 lots',
    description: 'Cable — one of the most liquid and widely traded currency pairs globally.',
    slug: 'gbp-usd', tradingViewSymbol: 'FOREXCOM:GBPUSD',
  },
  {
    id: 'usdjpy', symbol: 'USDJPY', displaySymbol: 'USD/JPY', name: 'US Dollar / Japanese Yen',
    category: 'forex', spread: 'From 0.9 pips', leverage: 'Up to 1:500', minTradeSize: '0.01 lots',
    description: 'A major safe-haven pair closely watched by global investors.',
    slug: 'usd-jpy', tradingViewSymbol: 'FOREXCOM:USDJPY',
  },
  {
    id: 'audusd', symbol: 'AUDUSD', displaySymbol: 'AUD/USD', name: 'Australian Dollar / US Dollar',
    category: 'forex', spread: 'From 1.0 pips', leverage: 'Up to 1:500', minTradeSize: '0.01 lots',
    description: 'A commodity-linked currency pair with high liquidity and tight spreads.',
    slug: 'aud-usd', tradingViewSymbol: 'FOREXCOM:AUDUSD',
  },
  {
    id: 'usdcad', symbol: 'USDCAD', displaySymbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar',
    category: 'forex', spread: 'From 1.1 pips', leverage: 'Up to 1:500', minTradeSize: '0.01 lots',
    description: 'Closely correlated with crude oil prices, making it a commodity pair.',
    slug: 'usd-cad', tradingViewSymbol: 'FOREXCOM:USDCAD',
  },
  {
    id: 'eurjpy', symbol: 'EURJPY', displaySymbol: 'EUR/JPY', name: 'Euro / Japanese Yen',
    category: 'forex', spread: 'From 1.2 pips', leverage: 'Up to 1:500', minTradeSize: '0.01 lots',
    description: 'A high-volatility cross pair driven by eurozone and Japanese economic data.',
    slug: 'eur-jpy', tradingViewSymbol: 'FOREXCOM:EURJPY',
  },
  {
    id: 'eurgbp', symbol: 'EURGBP', displaySymbol: 'EUR/GBP', name: 'Euro / British Pound',
    category: 'forex', spread: 'From 0.9 pips', leverage: 'Up to 1:500', minTradeSize: '0.01 lots',
    description: 'Measures the relative strength of the eurozone vs the UK economy.',
    slug: 'eur-gbp', tradingViewSymbol: 'FOREXCOM:EURGBP',
  },
  {
    id: 'gbpjpy', symbol: 'GBPJPY', displaySymbol: 'GBP/JPY', name: 'British Pound / Japanese Yen',
    category: 'forex', spread: 'From 1.5 pips', leverage: 'Up to 1:500', minTradeSize: '0.01 lots',
    description: 'Known as the "Dragon" — one of the most volatile and exciting pairs to trade.',
    slug: 'gbp-jpy', tradingViewSymbol: 'FOREXCOM:GBPJPY',
  },
  {
    id: 'nzdusd', symbol: 'NZDUSD', displaySymbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar',
    category: 'forex', spread: 'From 1.3 pips', leverage: 'Up to 1:500', minTradeSize: '0.01 lots',
    description: 'The kiwi — linked to New Zealand dairy exports and commodity prices.',
    slug: 'nzd-usd', tradingViewSymbol: 'FOREXCOM:NZDUSD',
  },
  {
    id: 'usdchf', symbol: 'USDCHF', displaySymbol: 'USD/CHF', name: 'US Dollar / Swiss Franc',
    category: 'forex', spread: 'From 1.0 pips', leverage: 'Up to 1:500', minTradeSize: '0.01 lots',
    description: 'The Swiss franc is a top safe-haven currency in times of global uncertainty.',
    slug: 'usd-chf', tradingViewSymbol: 'FOREXCOM:USDCHF',
  },
  {
    id: 'eurchf', symbol: 'EURCHF', displaySymbol: 'EUR/CHF', name: 'Euro / Swiss Franc',
    category: 'forex', spread: 'From 1.2 pips', leverage: 'Up to 1:500', minTradeSize: '0.01 lots',
    description: 'A cross pair closely tied to eurozone economic health.',
    slug: 'eur-chf', tradingViewSymbol: 'FOREXCOM:EURCHF',
  },

  // ─── Crypto ──────────────────────────────────────────────────────────────
  {
    id: 'btcusd', symbol: 'BTCUSD', displaySymbol: 'BTC/USD', name: 'Bitcoin',
    category: 'crypto', spread: 'From $15', leverage: 'Up to 1:10', minTradeSize: '0.001 BTC',
    description: "The world's largest cryptocurrency by market capitalisation.",
    slug: 'btc-usd', tradingViewSymbol: 'BITSTAMP:BTCUSD',
  },
  {
    id: 'ethusd', symbol: 'ETHUSD', displaySymbol: 'ETH/USD', name: 'Ethereum',
    category: 'crypto', spread: 'From $2', leverage: 'Up to 1:10', minTradeSize: '0.01 ETH',
    description: 'The leading smart contract platform with the largest DeFi ecosystem.',
    slug: 'eth-usd', tradingViewSymbol: 'BITSTAMP:ETHUSD',
  },
  {
    id: 'solusd', symbol: 'SOLUSD', displaySymbol: 'SOL/USD', name: 'Solana',
    category: 'crypto', spread: 'From $0.50', leverage: 'Up to 1:5', minTradeSize: '0.1 SOL',
    description: 'A high-speed blockchain designed for decentralised apps and DeFi.',
    slug: 'sol-usd', tradingViewSymbol: 'BINANCE:SOLUSDT',
  },
  {
    id: 'bnbusd', symbol: 'BNBUSD', displaySymbol: 'BNB/USD', name: 'BNB',
    category: 'crypto', spread: 'From $1', leverage: 'Up to 1:5', minTradeSize: '0.01 BNB',
    description: 'The native token of the BNB Chain and Binance ecosystem.',
    slug: 'bnb-usd', tradingViewSymbol: 'BINANCE:BNBUSDT',
  },
  {
    id: 'xrpusd', symbol: 'XRPUSD', displaySymbol: 'XRP/USD', name: 'XRP',
    category: 'crypto', spread: 'From $0.002', leverage: 'Up to 1:5', minTradeSize: '10 XRP',
    description: 'A digital payment protocol designed for fast, low-cost international transfers.',
    slug: 'xrp-usd', tradingViewSymbol: 'BITSTAMP:XRPUSD',
  },
  {
    id: 'adausd', symbol: 'ADAUSD', displaySymbol: 'ADA/USD', name: 'Cardano',
    category: 'crypto', spread: 'From $0.002', leverage: 'Up to 1:5', minTradeSize: '10 ADA',
    description: 'A proof-of-stake blockchain platform with a strong academic foundation.',
    slug: 'ada-usd', tradingViewSymbol: 'BINANCE:ADAUSDT',
  },
  {
    id: 'avaxusd', symbol: 'AVAXUSD', displaySymbol: 'AVAX/USD', name: 'Avalanche',
    category: 'crypto', spread: 'From $0.10', leverage: 'Up to 1:5', minTradeSize: '0.1 AVAX',
    description: 'A fast, low-cost, and eco-friendly layer-1 blockchain platform.',
    slug: 'avax-usd', tradingViewSymbol: 'BINANCE:AVAXUSDT',
  },
  {
    id: 'linkusd', symbol: 'LINKUSD', displaySymbol: 'LINK/USD', name: 'Chainlink',
    category: 'crypto', spread: 'From $0.05', leverage: 'Up to 1:5', minTradeSize: '1 LINK',
    description: 'The leading decentralised oracle network connecting smart contracts to real-world data.',
    slug: 'link-usd', tradingViewSymbol: 'BINANCE:LINKUSDT',
  },
  {
    id: 'dotusd', symbol: 'DOTUSD', displaySymbol: 'DOT/USD', name: 'Polkadot',
    category: 'crypto', spread: 'From $0.05', leverage: 'Up to 1:5', minTradeSize: '1 DOT',
    description: 'A multichain network enabling different blockchains to transfer messages and value.',
    slug: 'dot-usd', tradingViewSymbol: 'BINANCE:DOTUSDT',
  },
  {
    id: 'maticusd', symbol: 'MATICUSD', displaySymbol: 'MATIC/USD', name: 'Polygon',
    category: 'crypto', spread: 'From $0.003', leverage: 'Up to 1:5', minTradeSize: '10 MATIC',
    description: "Ethereum's leading Layer 2 scaling solution for fast, cheap transactions.",
    slug: 'matic-usd', tradingViewSymbol: 'BINANCE:MATICUSDT',
  },

  // ─── Stocks ──────────────────────────────────────────────────────────────
  {
    id: 'spcx', symbol: 'SPCX', displaySymbol: 'SPCX', name: 'SpaceX',
    category: 'stocks', spread: 'From $0.10', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'Space Exploration Technologies Corp — rockets, Starlink broadband, and the future of space travel. Recently IPO\'d on Nasdaq.',
    slug: 'spcx', tradingViewSymbol: 'NASDAQ:SPCX',
  },
  {
    id: 'aapl', symbol: 'AAPL', displaySymbol: 'AAPL', name: 'Apple Inc.',
    category: 'stocks', spread: 'From $0.05', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: "The world's most valuable company and Nasdaq flagship.",
    slug: 'aapl', tradingViewSymbol: 'NASDAQ:AAPL',
  },
  {
    id: 'msft', symbol: 'MSFT', displaySymbol: 'MSFT', name: 'Microsoft',
    category: 'stocks', spread: 'From $0.08', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'Global technology leader in cloud computing, software, and AI.',
    slug: 'msft', tradingViewSymbol: 'NASDAQ:MSFT',
  },
  {
    id: 'amzn', symbol: 'AMZN', displaySymbol: 'AMZN', name: 'Amazon',
    category: 'stocks', spread: 'From $0.05', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'The world\'s largest e-commerce and cloud computing company.',
    slug: 'amzn', tradingViewSymbol: 'NASDAQ:AMZN',
  },
  {
    id: 'nvda', symbol: 'NVDA', displaySymbol: 'NVDA', name: 'NVIDIA',
    category: 'stocks', spread: 'From $0.15', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'The dominant force in AI chips and GPU computing technology.',
    slug: 'nvda', tradingViewSymbol: 'NASDAQ:NVDA',
  },
  {
    id: 'googl', symbol: 'GOOGL', displaySymbol: 'GOOGL', name: 'Alphabet (Google)',
    category: 'stocks', spread: 'From $0.05', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: "Google's parent company — search, cloud, YouTube, and AI pioneer.",
    slug: 'googl', tradingViewSymbol: 'NASDAQ:GOOGL',
  },
  {
    id: 'meta', symbol: 'META', displaySymbol: 'META', name: 'Meta Platforms',
    category: 'stocks', spread: 'From $0.10', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'Owner of Facebook, Instagram, and WhatsApp — the social media giant.',
    slug: 'meta', tradingViewSymbol: 'NASDAQ:META',
  },
  {
    id: 'tsla', symbol: 'TSLA', displaySymbol: 'TSLA', name: 'Tesla',
    category: 'stocks', spread: 'From $0.10', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'The leading electric vehicle and clean energy company.',
    slug: 'tsla', tradingViewSymbol: 'NASDAQ:TSLA',
  },
  {
    id: 'nflx', symbol: 'NFLX', displaySymbol: 'NFLX', name: 'Netflix',
    category: 'stocks', spread: 'From $0.15', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: "The world's leading streaming entertainment service.",
    slug: 'nflx', tradingViewSymbol: 'NASDAQ:NFLX',
  },
  {
    id: 'v', symbol: 'V', displaySymbol: 'V', name: 'Visa Inc.',
    category: 'stocks', spread: 'From $0.08', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: "The world's largest payment technology company.",
    slug: 'v', tradingViewSymbol: 'NYSE:V',
  },
  {
    id: 'ma', symbol: 'MA', displaySymbol: 'MA', name: 'Mastercard',
    category: 'stocks', spread: 'From $0.10', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'Global payment giant connecting billions of consumers and merchants.',
    slug: 'ma', tradingViewSymbol: 'NYSE:MA',
  },
  {
    id: 'jpm', symbol: 'JPM', displaySymbol: 'JPM', name: 'JPMorgan Chase',
    category: 'stocks', spread: 'From $0.05', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: "America's largest bank by assets — investment banking, retail, and asset management.",
    slug: 'jpm', tradingViewSymbol: 'NYSE:JPM',
  },
  {
    id: 'bac', symbol: 'BAC', displaySymbol: 'BAC', name: 'Bank of America',
    category: 'stocks', spread: 'From $0.02', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'One of the largest US banks serving millions of retail and institutional clients.',
    slug: 'bac', tradingViewSymbol: 'NYSE:BAC',
  },
  {
    id: 'gs', symbol: 'GS', displaySymbol: 'GS', name: 'Goldman Sachs',
    category: 'stocks', spread: 'From $0.15', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'Premier global investment banking and securities firm.',
    slug: 'gs', tradingViewSymbol: 'NYSE:GS',
  },
  {
    id: 'wmt', symbol: 'WMT', displaySymbol: 'WMT', name: 'Walmart',
    category: 'stocks', spread: 'From $0.03', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: "The world's largest retailer by revenue.",
    slug: 'wmt', tradingViewSymbol: 'NYSE:WMT',
  },
  {
    id: 'ko', symbol: 'KO', displaySymbol: 'KO', name: 'Coca-Cola',
    category: 'stocks', spread: 'From $0.02', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'The iconic global beverage brand — a dividend aristocrat.',
    slug: 'ko', tradingViewSymbol: 'NYSE:KO',
  },
  {
    id: 'dis', symbol: 'DIS', displaySymbol: 'DIS', name: 'Disney',
    category: 'stocks', spread: 'From $0.05', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'The entertainment giant behind Disney+, parks, and iconic studios.',
    slug: 'dis', tradingViewSymbol: 'NYSE:DIS',
  },
  {
    id: 'jnj', symbol: 'JNJ', displaySymbol: 'JNJ', name: 'Johnson & Johnson',
    category: 'stocks', spread: 'From $0.05', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'A diversified healthcare giant in pharmaceuticals, medtech, and consumer health.',
    slug: 'jnj', tradingViewSymbol: 'NYSE:JNJ',
  },
  {
    id: 'pfe', symbol: 'PFE', displaySymbol: 'PFE', name: 'Pfizer',
    category: 'stocks', spread: 'From $0.02', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'One of the world\'s leading biopharmaceutical companies.',
    slug: 'pfe', tradingViewSymbol: 'NYSE:PFE',
  },
  {
    id: 'xom', symbol: 'XOM', displaySymbol: 'XOM', name: 'ExxonMobil',
    category: 'stocks', spread: 'From $0.05', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: "The world's largest publicly traded international oil and gas company.",
    slug: 'xom', tradingViewSymbol: 'NYSE:XOM',
  },
  {
    id: 'cvx', symbol: 'CVX', displaySymbol: 'CVX', name: 'Chevron',
    category: 'stocks', spread: 'From $0.08', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'A leading integrated energy company with global operations.',
    slug: 'cvx', tradingViewSymbol: 'NYSE:CVX',
  },
  {
    id: 'intc', symbol: 'INTC', displaySymbol: 'INTC', name: 'Intel',
    category: 'stocks', spread: 'From $0.02', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'The pioneering semiconductor company investing in its next-generation foundry business.',
    slug: 'intc', tradingViewSymbol: 'NASDAQ:INTC',
  },
  {
    id: 'amd', symbol: 'AMD', displaySymbol: 'AMD', name: 'Advanced Micro Devices',
    category: 'stocks', spread: 'From $0.05', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'CPU, GPU, and AI accelerator innovator competing at the forefront of silicon.',
    slug: 'amd', tradingViewSymbol: 'NASDAQ:AMD',
  },
  {
    id: 'crm', symbol: 'CRM', displaySymbol: 'CRM', name: 'Salesforce',
    category: 'stocks', spread: 'From $0.08', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'The global leader in CRM software and enterprise cloud solutions.',
    slug: 'crm', tradingViewSymbol: 'NYSE:CRM',
  },
  {
    id: 'adbe', symbol: 'ADBE', displaySymbol: 'ADBE', name: 'Adobe',
    category: 'stocks', spread: 'From $0.15', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'Creator of Photoshop, Illustrator, and the leading digital media platform.',
    slug: 'adbe', tradingViewSymbol: 'NASDAQ:ADBE',
  },
  {
    id: 'orcl', symbol: 'ORCL', displaySymbol: 'ORCL', name: 'Oracle',
    category: 'stocks', spread: 'From $0.05', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'Enterprise database, ERP, and cloud infrastructure giant.',
    slug: 'orcl', tradingViewSymbol: 'NYSE:ORCL',
  },
  {
    id: 'pypl', symbol: 'PYPL', displaySymbol: 'PYPL', name: 'PayPal',
    category: 'stocks', spread: 'From $0.03', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'The pioneer of online payments and digital wallets globally.',
    slug: 'pypl', tradingViewSymbol: 'NASDAQ:PYPL',
  },
  {
    id: 'uber', symbol: 'UBER', displaySymbol: 'UBER', name: 'Uber',
    category: 'stocks', spread: 'From $0.03', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'Global leader in ride-hailing, food delivery, and freight logistics.',
    slug: 'uber', tradingViewSymbol: 'NYSE:UBER',
  },
  {
    id: 'ba', symbol: 'BA', displaySymbol: 'BA', name: 'Boeing',
    category: 'stocks', spread: 'From $0.08', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'The world\'s largest aerospace company and leading defence contractor.',
    slug: 'ba', tradingViewSymbol: 'NYSE:BA',
  },
  {
    id: 'pltr', symbol: 'PLTR', displaySymbol: 'PLTR', name: 'Palantir',
    category: 'stocks', spread: 'From $0.02', leverage: 'Up to 1:20', minTradeSize: '0.1 shares',
    description: 'AI and big data analytics platform serving government and enterprise clients.',
    slug: 'pltr', tradingViewSymbol: 'NYSE:PLTR',
  },

  // ─── Commodities ─────────────────────────────────────────────────────────
  {
    id: 'gold', symbol: 'XAUUSD', displaySymbol: 'XAU/USD', name: 'Gold',
    category: 'commodities', spread: 'From $0.25', leverage: 'Up to 1:100', minTradeSize: '0.01 oz',
    description: 'The ultimate safe-haven asset and store of value.',
    slug: 'xau-usd', tradingViewSymbol: 'TVC:GOLD',
  },
  {
    id: 'silver', symbol: 'XAGUSD', displaySymbol: 'XAG/USD', name: 'Silver',
    category: 'commodities', spread: 'From $0.02', leverage: 'Up to 1:100', minTradeSize: '1 oz',
    description: 'Both a precious metal safe haven and an industrial commodity.',
    slug: 'xag-usd', tradingViewSymbol: 'TVC:SILVER',
  },
  {
    id: 'crude-oil', symbol: 'USOIL', displaySymbol: 'WTI Crude', name: 'WTI Crude Oil',
    category: 'commodities', spread: 'From $0.05', leverage: 'Up to 1:100', minTradeSize: '1 barrel',
    description: 'West Texas Intermediate — the US benchmark crude oil contract.',
    slug: 'wti-crude-oil', tradingViewSymbol: 'NYMEX:CL1!',
  },
  {
    id: 'natgas', symbol: 'NATGAS', displaySymbol: 'Natural Gas', name: 'Natural Gas',
    category: 'commodities', spread: 'From $0.003', leverage: 'Up to 1:100', minTradeSize: '1 MMBtu',
    description: 'A key energy commodity heavily influenced by weather and global LNG demand.',
    slug: 'natural-gas', tradingViewSymbol: 'NYMEX:NG1!',
  },

  // ─── Indices ─────────────────────────────────────────────────────────────
  {
    id: 'spx500', symbol: 'SPX500', displaySymbol: 'S&P 500', name: 'S&P 500 Index',
    category: 'indices', spread: 'From $0.50', leverage: 'Up to 1:100', minTradeSize: '0.01 contracts',
    description: 'The benchmark index of the 500 largest US publicly traded companies.',
    slug: 'spx500', tradingViewSymbol: 'FOREXCOM:SPXUSD',
  },
  {
    id: 'nas100', symbol: 'NAS100', displaySymbol: 'NASDAQ 100', name: 'NASDAQ 100 Index',
    category: 'indices', spread: 'From $1.00', leverage: 'Up to 1:100', minTradeSize: '0.01 contracts',
    description: 'Tracks the 100 largest non-financial companies listed on the NASDAQ exchange.',
    slug: 'nas100', tradingViewSymbol: 'FOREXCOM:NSXUSD',
  },
  {
    id: 'dow30', symbol: 'DOW30', displaySymbol: 'Dow Jones', name: 'Dow Jones 30',
    category: 'indices', spread: 'From $2.00', leverage: 'Up to 1:100', minTradeSize: '0.01 contracts',
    description: 'The oldest US stock market index tracking 30 blue-chip industrial companies.',
    slug: 'dow30', tradingViewSymbol: 'FOREXCOM:DJUSD',
  },
]

export const FEATURED_TRADINGVIEW_SYMBOLS = [
  { proName: 'NASDAQ:SPCX',     title: 'SpaceX'    },
  { proName: 'FOREXCOM:EURUSD', title: 'EUR/USD'   },
  { proName: 'FOREXCOM:GBPUSD', title: 'GBP/USD'   },
  { proName: 'FOREXCOM:USDJPY', title: 'USD/JPY'   },
  { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin'   },
  { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum'  },
  { proName: 'NASDAQ:AAPL',     title: 'Apple'     },
  { proName: 'NASDAQ:NVDA',     title: 'NVIDIA'    },
  { proName: 'NASDAQ:TSLA',     title: 'Tesla'     },
  { proName: 'TVC:GOLD',        title: 'Gold'      },
  { proName: 'NYMEX:CL1!',      title: 'Crude Oil' },
]
