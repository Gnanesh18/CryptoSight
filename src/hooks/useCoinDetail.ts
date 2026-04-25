import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchCoinDetail, fetchCoinChart } from '../services/coingecko';
import type { CoinDetail, CoinChartData, ChartRange } from '../types/coin';

export function useCoinDetail(coinId: string | null) {
  const [detail, setDetail] = useState<CoinDetail | null>(null);
  const [chartData, setChartData] = useState<CoinChartData | null>(null);
  const [chartRange, setChartRange] = useState<ChartRange>('1');
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  // Fetch coin detail when coinId changes
  useEffect(() => {
    mountedRef.current = true;
    if (!coinId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDetail(null);
      setChartData(null);
      return;
    }
    setIsLoadingDetail(true);
    setError(null);
    fetchCoinDetail(coinId)
      .then((d) => { if (mountedRef.current) { setDetail(d); setError(null); } })
      .catch((e) => { if (mountedRef.current) setError((e as Error).message); })
      .finally(() => { if (mountedRef.current) setIsLoadingDetail(false); });
    return () => { mountedRef.current = false; };
  }, [coinId]);

  // Fetch chart data when coinId or range changes
  useEffect(() => {
    mountedRef.current = true;
    if (!coinId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoadingChart(true);
    fetchCoinChart(coinId, chartRange)
      .then((d) => { if (mountedRef.current) { setChartData(d); } })
      .catch(() => { /* chart errors are non-fatal */ })
      .finally(() => { if (mountedRef.current) setIsLoadingChart(false); });
    return () => { mountedRef.current = false; };
  }, [coinId, chartRange]);

  const changeRange = useCallback((range: ChartRange) => {
    setChartRange(range);
  }, []);

  return { detail, chartData, chartRange, changeRange, isLoadingDetail, isLoadingChart, error };
}
