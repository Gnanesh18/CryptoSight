// Shared TypeScript interfaces for the entire application

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  sparkline_in_7d?: { price: number[] };
}

export type SortField =
  | 'market_cap_rank'
  | 'name'
  | 'current_price'
  | 'price_change_percentage_24h'
  | 'price_change_percentage_1h_in_currency'
  | 'price_change_percentage_7d_in_currency'
  | 'market_cap'
  | 'total_volume';

export type SortDirection = 'asc' | 'desc';

export type Tab = 'all' | 'watchlist' | 'gainers' | 'losers' | 'trending';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface MarketState {
  coins: Coin[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  searchQuery: string;
  sort: SortState;
  page: number;
  selectedCoinId: string | null;
  activeTab: Tab;
  lastUpdated: Date | null;
}

export interface WatchlistState {
  watchedIds: Set<string>;
}

// ─── Global Market Data ───────────────────────────────────────────────────────
export interface GlobalData {
  data: {
    active_cryptocurrencies: number;
    markets: number;
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: { btc: number; eth: number };
    market_cap_change_percentage_24h_usd: number;
  };
}

// ─── Trending ─────────────────────────────────────────────────────────────────
export interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    market_cap_rank: number;
    data?: {
      price: number;
      price_change_percentage_24h?: { usd: number };
      sparkline?: string;
    };
  };
}

export interface TrendingData {
  coins: TrendingCoin[];
}

// ─── Coin Detail ──────────────────────────────────────────────────────────────
export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  hashing_algorithm: string | null;
  genesis_date: string | null;
  categories: string[];
  description: { en: string };
  links: {
    homepage: string[];
    whitepaper: string;
    blockchain_site: string[];
    official_forum_url: string[];
    twitter_screen_name: string;
    subreddit_url: string;
    repos_url: { github: string[] };
  };
  image: { thumb: string; small: string; large: string };
  sentiment_votes_up_percentage: number | null;
  sentiment_votes_down_percentage: number | null;
  watchlist_portfolio_users: number;
  market_cap_rank: number;
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    fully_diluted_valuation: { usd: number } | null;
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_14d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    ath: { usd: number };
    ath_change_percentage: { usd: number };
    ath_date: { usd: string };
    atl: { usd: number };
    atl_change_percentage: { usd: number };
    atl_date: { usd: string };
  };
  tickers: Array<{
    base: string;
    target: string;
    market: { name: string; identifier: string };
    last: number;
    volume: number;
    converted_last: { usd: number };
    converted_volume: { usd: number };
    bid_ask_spread_percentage: number;
    trust_score: string | null;
    trade_url: string | null;
  }>;
}

// ─── Chart Data ───────────────────────────────────────────────────────────────
export type ChartRange = '1' | '7' | '30' | '90' | '365' | 'max';

export interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface CoinChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// ─── Search ───────────────────────────────────────────────────────────────────
export interface SearchResult {
  coins: Array<{
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    market_cap_rank: number | null;
  }>;
}
