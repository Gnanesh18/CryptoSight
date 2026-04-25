import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTopCoins } from '../services/coingecko';
import type { Coin } from '../types/coin';

const POLLING_INTERVAL_MS = 60_000; // 60 seconds per CoinGecko rate limits
const PER_PAGE = 100;

export interface UseMarketDataResult {
  coins: Coin[];
  isLoading: boolean;    // True only on first load (skeleton state)
  isRefreshing: boolean; // True on background refresh
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => void;
  secondsUntilRefresh: number;
}

/**
 * Fetches top coins and polls every 60 seconds using TanStack Query.
 * - Caches data across navigations (no re-fetch on back)
 * - Automatically pauses refetch when tab is hidden
 * - Deduplicates concurrent requests
 * - Retries failed requests with exponential backoff
 */
export function useMarketData(page: number): UseMarketDataResult {
  const queryClient = useQueryClient();

  const {
    data: coins = [],
    isLoading,
    isFetching,
    error,
    dataUpdatedAt,
    refetch,
  } = useQuery<Coin[], Error>({
    queryKey: ['market', 'coins', page],
    queryFn: () => fetchTopCoins(page, PER_PAGE),
    refetchInterval: POLLING_INTERVAL_MS,
    refetchIntervalInBackground: false, // Pause polling when tab is hidden
  });

  // Compute seconds until next refetch based on last update time
  const now = Date.now();
  const elapsed = dataUpdatedAt ? Math.floor((now - dataUpdatedAt) / 1000) : 0;
  const secondsUntilRefresh = Math.max(0, Math.floor(POLLING_INTERVAL_MS / 1000) - elapsed);

  return {
    coins,
    isLoading,
    isRefreshing: isFetching && !isLoading,
    error: error?.message ?? null,
    lastUpdated: dataUpdatedAt ? new Date(dataUpdatedAt) : null,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['market', 'coins', page] });
      refetch();
    },
    secondsUntilRefresh,
  };
}
