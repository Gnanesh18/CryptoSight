import { useEffect, useRef, useState } from 'react';
import { fetchTopCoins } from '../services/coingecko';
import type { Coin } from '../types/coin';

const POLLING_INTERVAL_MS = 60_000; // 60 seconds per CoinGecko rate limits
const PER_PAGE = 100;

export interface UseMarketDataResult {
  coins: Coin[];
  isLoading: boolean;   // True only on first load (skeleton state)
  isRefreshing: boolean; // True on background refresh
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => void;
  secondsUntilRefresh: number;
}

/**
 * Fetches top coins and polls every 60 seconds.
 * Pauses polling when the tab is in the background (Page Visibility API).
 * Distinguishes between first-load (isLoading) and background refresh (isRefreshing).
 */
export function useMarketData(page: number): UseMarketDataResult {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(POLLING_INTERVAL_MS / 1000);

  // Refs to avoid stale closure issues in intervals
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFirstLoad = useRef(true);

  const clearPolling = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const startCountdown = () => {
    setSecondsUntilRefresh(POLLING_INTERVAL_MS / 1000);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setSecondsUntilRefresh((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const fetchData = async (isBackground = false) => {
    if (isBackground) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await fetchTopCoins(page, PER_PAGE);
      setCoins(data);
      setLastUpdated(new Date());
      startCountdown();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch market data.';
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const refetch = () => {
    clearPolling();
    void fetchData(false);
    // restart polling after manual refetch
    intervalRef.current = setInterval(() => {
      if (!document.hidden) {
        void fetchData(true);
      }
    }, POLLING_INTERVAL_MS);
  };

  useEffect(() => {
    // Initial fetch
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      void fetchData(false);
    } else {
      void fetchData(true);
    }

    // Setup polling interval
    intervalRef.current = setInterval(() => {
      // Page Visibility API: skip refresh if tab is in the background
      if (!document.hidden) {
        void fetchData(true);
      }
    }, POLLING_INTERVAL_MS);

    // Handle visibility change: resume polling when tab becomes active
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        void fetchData(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return { coins, isLoading, isRefreshing, error, lastUpdated, refetch, secondsUntilRefresh };
}
