import { useState, useEffect, useRef } from 'react';
import { fetchTrending } from '../services/coingecko';
import type { TrendingData } from '../types/coin';

export function useTrending() {
  const [data, setData] = useState<TrendingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    fetchTrending()
      .then((d) => { if (mountedRef.current) { setData(d); setError(null); } })
      .catch((e) => { if (mountedRef.current) setError((e as Error).message); })
      .finally(() => { if (mountedRef.current) setIsLoading(false); });
    return () => { mountedRef.current = false; };
  }, []);

  return { data, isLoading, error };
}
