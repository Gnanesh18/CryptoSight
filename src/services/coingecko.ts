import type { Coin, GlobalData, TrendingData, CoinDetail, CoinChartData, SearchResult, ChartRange } from '../types/coin';

const BASE_URL =
  import.meta.env.VITE_COINGECKO_BASE_URL ?? 'https://api.coingecko.com/api/v3';

// Use API key from env
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY || '';

// Track in-flight requests to prevent duplicates
const inflightRequests = new Map<string, Promise<unknown>>();

function buildUrl(path: string, params: Record<string, string | number | boolean> = {}): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, String(value));
  }
  if (API_KEY) {
    searchParams.set('x_cg_demo_api_key', API_KEY);
  }
  return `${BASE_URL}${path}?${searchParams.toString()}`;
}

async function apiFetch<T>(path: string, params: Record<string, string | number | boolean> = {}): Promise<T> {
  const url = buildUrl(path, params);

  // Deduplicate identical in-flight requests
  const existing = inflightRequests.get(url);
  if (existing) return existing as Promise<T>;

  const request = (async () => {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitSecs = retryAfter ? parseInt(retryAfter, 10) : 60;
        throw new Error(`Rate limit exceeded. Please wait ${waitSecs}s before refreshing.`);
      }
      if (response.status === 401 || response.status === 403) throw new Error('API authentication failed.');
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  })();

  inflightRequests.set(url, request);

  try {
    return await request;
  } finally {
    inflightRequests.delete(url);
  }
}

/**
 * Fetches the top N cryptocurrencies by market cap with sparkline + multi-period price change.
 */
export async function fetchTopCoins(page = 1, perPage = 100): Promise<Coin[]> {
  const data = await apiFetch<unknown[]>('/coins/markets', {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: perPage,
    page,
    sparkline: true,
    price_change_percentage: '1h,24h,7d',
  });
  if (!Array.isArray(data)) throw new Error('Unexpected API response format.');
  return data as Coin[];
}

/**
 * Fetches global crypto market data (total market cap, volume, dominance).
 */
export async function fetchGlobalData(): Promise<GlobalData> {
  return apiFetch<GlobalData>('/global');
}

/**
 * Fetches trending coins (top searched in last 24h).
 */
export async function fetchTrending(): Promise<TrendingData> {
  return apiFetch<TrendingData>('/search/trending');
}

/**
 * Fetches full coin detail by ID including metadata, market data, tickers.
 */
export async function fetchCoinDetail(id: string): Promise<CoinDetail> {
  return apiFetch<CoinDetail>(`/coins/${id}`, {
    localization: false,
    tickers: true,
    market_data: true,
    community_data: false,
    developer_data: false,
    sparkline: false,
  });
}

/**
 * Fetches historical price/volume/market cap chart data.
 * @param id   - Coin ID
 * @param days - '1', '7', '30', '90', '365', or 'max'
 */
export async function fetchCoinChart(id: string, days: ChartRange): Promise<CoinChartData> {
  return apiFetch<CoinChartData>(`/coins/${id}/market_chart`, {
    vs_currency: 'usd',
    days,
  });
}

/**
 * Searches for coins by query string.
 */
export async function searchCoins(query: string): Promise<SearchResult> {
  return apiFetch<SearchResult>('/search', { query });
}
