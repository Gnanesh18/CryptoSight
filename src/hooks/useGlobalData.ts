import { useQuery } from '@tanstack/react-query';
import { fetchGlobalData } from '../services/coingecko';
import type { GlobalData } from '../types/coin';

/**
 * Fetches global crypto market data.
 * Cached and automatically revalidated by React Query.
 */
export function useGlobalData() {
  const { data, isLoading, error } = useQuery<GlobalData, Error>({
    queryKey: ['market', 'global'],
    queryFn: fetchGlobalData,
    staleTime: 60_000, // Global data changes slowly — stay fresh longer
  });

  return {
    data: data ?? null,
    isLoading,
    error: error?.message ?? null,
  };
}
