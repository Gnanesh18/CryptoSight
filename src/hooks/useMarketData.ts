import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTopCoins } from '../services/coingecko';
import type { Coin } from '../types/coin';

const POLLING_INTERVAL_MS = 60_000;
const PER_PAGE = 100;

export interface UseMarketDataResult {
  coins: Coin[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => void;
}

// hook to get crypto market data
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
    refetchIntervalInBackground: false,
  });

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
  };
}
