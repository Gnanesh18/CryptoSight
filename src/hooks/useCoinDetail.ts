import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCoinDetail, fetchCoinChart } from '../services/coingecko';
import type { CoinDetail, CoinChartData, ChartRange } from '../types/coin';

/**
 * Fetches coin detail and chart data using React Query.
 * - Detail is cached per coin ID
 * - Chart is cached per (coin, range) pair
 * - Hooks are always called (no conditional hook calls)
 */
export function useCoinDetail(coinId: string | null) {
  const [chartRange, setChartRange] = useState<ChartRange>('1');

  const {
    data: detail,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useQuery<CoinDetail, Error>({
    queryKey: ['coin', 'detail', coinId],
    queryFn: () => fetchCoinDetail(coinId!),
    enabled: !!coinId,
  });

  const {
    data: chartData,
    isLoading: isLoadingChart,
  } = useQuery<CoinChartData, Error>({
    queryKey: ['coin', 'chart', coinId, chartRange],
    queryFn: () => fetchCoinChart(coinId!, chartRange),
    enabled: !!coinId,
  });

  const changeRange = useCallback((range: ChartRange) => {
    setChartRange(range);
  }, []);

  return {
    detail: detail ?? null,
    chartData: chartData ?? null,
    chartRange,
    changeRange,
    isLoadingDetail,
    isLoadingChart,
    error: detailError?.message ?? null,
  };
}
