import { useQuery } from '@tanstack/react-query';
import { fetchTrending } from '../services/coingecko';
import type { TrendingData } from '../types/coin';

/**
 * Fetches trending coins (top searched in last 24h).
 * Cached and automatically revalidated by React Query.
 */
export function useTrending() {
  const { data, isLoading, error } = useQuery<TrendingData, Error>({
    queryKey: ['market', 'trending'],
    queryFn: fetchTrending,
    staleTime: 2 * 60_000, // Trending data is fairly stable — 2min stale time
  });

  return {
    data: data ?? null,
    isLoading,
    error: error?.message ?? null,
  };
}
