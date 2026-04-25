import type { TrendingData } from '../../types/coin';
import { cn } from '../../utils/cn';
import { Flame, ChevronRight } from 'lucide-react';
import { Skeleton } from '../atoms/Skeleton';

interface TrendingPanelProps {
  data: TrendingData | null;
  isLoading: boolean;
  isDark: boolean;
  onCoinSelect: (id: string) => void;
  onViewMore?: () => void;
}

export function TrendingPanel({ data, isLoading, isDark, onCoinSelect, onViewMore }: TrendingPanelProps) {
  const coins = data?.coins?.slice(0, 3) ?? [];

  return (
    <div className={cn(
      'rounded-2xl border overflow-hidden transition-all duration-300',
      isDark ? 'bg-white/3 border-white/8' : 'bg-white border-gray-200 shadow-sm'
    )}>
      <div className={cn('flex items-center justify-between px-4 py-3 border-b', isDark ? 'border-white/8' : 'border-gray-100')}>
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-semibold">Trending</span>
        </div>
        <button
          onClick={onViewMore}
          className={cn(
            'flex items-center gap-0.5 text-xs font-medium transition-all duration-200',
            'hover:gap-1 active:scale-95',
            isDark ? 'text-brand-400 hover:text-brand-300' : 'text-brand-600 hover:text-brand-700'
          )}
        >
          View more <ChevronRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className={cn('divide-y', isDark ? 'divide-white/5' : 'divide-gray-100')}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 h-[52px]">
                <Skeleton variant="circular" width={28} height={28} className="flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton variant="text" width={80} />
                  <Skeleton variant="text" width={40} className="h-2.5" />
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <Skeleton variant="text" width={60} />
                  <Skeleton variant="text" width={40} className="h-2.5" />
                </div>
              </div>
            ))
          : coins.map(({ item }) => {
              const priceChange = item.data?.price_change_percentage_24h?.usd;
              const price = item.data?.price;
              const isPos = (priceChange ?? 0) >= 0;

              return (
                <button
                  key={item.id}
                  onClick={() => onCoinSelect(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer',
                    'transition-all duration-150 active:scale-[0.99]',
                    isDark ? 'hover:bg-white/4' : 'hover:bg-gray-50'
                  )}
                >
                  <img
                    src={item.thumb}
                    alt={item.name}
                    width={28}
                    height={28}
                    loading="lazy"
                    className="w-7 h-7 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/28x28/1e293b/94a3b8?text=${item.symbol[0]}`; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className={cn('text-xs font-mono', isDark ? 'text-gray-500' : 'text-gray-400')}>{item.symbol.toUpperCase()}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {price != null && (
                      <p className="text-sm font-semibold tabular-nums">
                        ${price < 0.01
                          ? price.toPrecision(4)
                          : price < 1
                          ? price.toFixed(4)
                          : price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    )}
                    {priceChange != null && (
                      <p className={cn('text-xs font-medium', isPos ? 'text-success-400' : 'text-danger-400')}>
                        {isPos ? '▲' : '▼'} {Math.abs(priceChange).toFixed(1)}%
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
      </div>
    </div>
  );
}
