import type { GlobalData } from '../../types/coin';
import { formatLargeNumber } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface GlobalStatsBarProps {
  data: GlobalData | null;
  isLoading: boolean;
  isDark: boolean;
}

import { Skeleton } from '../atoms/Skeleton';

export function GlobalStatsBar({ data, isLoading, isDark }: GlobalStatsBarProps) {
  const d = data?.data;
  const change = d?.market_cap_change_percentage_24h_usd ?? 0;
  const isPositive = change >= 0;

  if (isLoading || !d) {
    return (
      <div className={cn(
        'rounded-2xl border mb-6 overflow-hidden transition-colors duration-300',
        isDark ? 'bg-white/3 border-white/8' : 'bg-white border-gray-200 shadow-sm'
      )}>
        {/* Title bar skeleton */}
        <div className={cn('px-5 py-3 border-b flex items-center gap-2 h-11', isDark ? 'border-white/8' : 'border-gray-100')}>
          <h2 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Cryptocurrency Prices by Market Cap
          </h2>
          <Skeleton variant="text" width={200} className="hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/8">
          {/* Market Cap Skeleton */}
          <div className="px-5 py-4 flex items-center gap-4 h-[104px]">
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width={80} />
              <Skeleton variant="text" width={140} height={28} />
              <Skeleton variant="text" width={100} />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton variant="rectangular" width={64} height={20} className="rounded-full" />
              <Skeleton variant="rectangular" width={64} height={20} className="rounded-full" />
            </div>
          </div>

          {/* 24h Volume Skeleton */}
          <div className="px-5 py-4 h-[104px] space-y-2">
            <Skeleton variant="text" width={120} />
            <Skeleton variant="text" width={140} height={28} />
            <Skeleton variant="text" width={120} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'rounded-2xl border mb-6 overflow-hidden transition-colors duration-300',
      isDark ? 'bg-white/3 border-white/8' : 'bg-white border-gray-200 shadow-sm'
    )}>
      {/* Title bar */}
      <div className={cn('px-5 py-3 border-b flex items-center gap-2', isDark ? 'border-white/8' : 'border-gray-100')}>
        <h2 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
          Cryptocurrency Prices by Market Cap
        </h2>
        <span className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>
          — {d.active_cryptocurrencies.toLocaleString()} coins tracked across {d.markets.toLocaleString()} markets
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/8">
        {/* Market Cap */}
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="flex-1">
            <p className={cn('text-xs uppercase tracking-wider font-medium mb-1', isDark ? 'text-gray-500' : 'text-gray-400')}>
              Market Cap
            </p>
            <p className="text-2xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>
              {formatLargeNumber(d.total_market_cap.usd, '$')}
            </p>
            <div className={cn('flex items-center gap-1 mt-1 text-xs font-medium', isPositive ? 'text-success-400' : 'text-danger-400')}>
              {isPositive
                ? <TrendingUp className="w-3 h-3" />
                : <TrendingDown className="w-3 h-3" />
              }
              {isPositive ? '+' : ''}{change.toFixed(2)}%
              <span className={cn('font-normal', isDark ? 'text-gray-500' : 'text-gray-400')}>24h</span>
            </div>
          </div>
          {/* BTC/ETH dominance pills */}
          <div className="flex flex-col gap-1">
            <div className={cn('text-xs px-2 py-0.5 rounded-full font-mono', isDark ? 'bg-warning-400/10 text-warning-400' : 'bg-orange-50 text-orange-600')}>
              BTC {d.market_cap_percentage.btc.toFixed(1)}%
            </div>
            <div className={cn('text-xs px-2 py-0.5 rounded-full font-mono', isDark ? 'bg-brand-400/10 text-brand-400' : 'bg-blue-50 text-blue-600')}>
              ETH {d.market_cap_percentage.eth.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* 24h Volume */}
        <div className="px-5 py-4">
          <p className={cn('text-xs uppercase tracking-wider font-medium mb-1', isDark ? 'text-gray-500' : 'text-gray-400')}>
            24h Trading Volume
          </p>
          <p className="text-2xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>
            {formatLargeNumber(d.total_volume.usd, '$')}
          </p>
          <p className={cn('text-xs mt-1', isDark ? 'text-gray-500' : 'text-gray-400')}>
            Across all exchanges
          </p>
        </div>
      </div>
    </div>
  );
}
