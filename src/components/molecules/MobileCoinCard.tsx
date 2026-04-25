import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import type { Coin } from '../../types/coin';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { SparklineChart } from './SparklineChart';
import { useWatchlistStore } from '../../store/useWatchlistStore';
import { cn } from '../../utils/cn';

interface MobileCoinCardProps {
  coin: Coin;
  rank: number;
  onSelect: (coin: Coin) => void;
  isDark: boolean;
}

export function MobileCoinCard({
  coin,
  rank,
  onSelect,
  isDark,
}: MobileCoinCardProps) {
  const { toggle, isWatched } = useWatchlistStore();
  const watched = isWatched(coin.id);
  const isPositive = coin.price_change_percentage_24h >= 0;
  const is7dPositive = (coin.price_change_percentage_7d_in_currency ?? 0) >= 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(coin)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(coin)}
      className={cn(
        'flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors active:scale-[0.99]',
        isDark ? 'hover:bg-white/4 active:bg-white/6' : 'hover:bg-gray-50 active:bg-gray-100'
      )}
    >
      {/* rank and icon */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span className={cn('text-[10px] font-mono w-5 text-right flex-shrink-0', isDark ? 'text-gray-600' : 'text-gray-400')}>
          {rank}
        </span>
        <img
          src={coin.image}
          alt=""
          width={36}
          height={36}
          loading="lazy"
          className="w-9 h-9 rounded-full flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className={cn('text-sm font-semibold truncate leading-tight', isDark ? 'text-white' : 'text-gray-900')}>
            {coin.name}
          </p>
          <p className={cn('text-xs font-mono uppercase', isDark ? 'text-gray-500' : 'text-gray-400')}>
            {coin.symbol}
          </p>
        </div>
      </div>

      {/* small chart */}
      {coin.sparkline_in_7d?.price && (
        <div className="flex-shrink-0 hidden xs:block">
          <SparklineChart prices={coin.sparkline_in_7d.price} positive={is7dPositive} width={52} height={28} />
        </div>
      )}

      {/* price info */}
      <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
        <p className={cn('text-sm font-bold tabular-nums', isDark ? 'text-white' : 'text-gray-900')}>
          {formatCurrency(coin.current_price)}
        </p>
        <span className={cn(
          'inline-flex items-center gap-0.5 text-xs font-semibold',
          isPositive ? 'text-success-400' : 'text-danger-400'
        )}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {formatPercent(coin.price_change_percentage_24h)}
        </span>
      </div>

      {/* toggle favorite */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); toggle(coin.id); }}
        className={cn(
          'p-1.5 rounded-full flex-shrink-0 transition-colors',
          watched ? 'text-warning-400' : isDark ? 'text-gray-600' : 'text-gray-300'
        )}
      >
        <Star className="w-4 h-4" fill={watched ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}

export function MobileCardSkeleton({ isDark }: { isDark: boolean }) {
  const bg = isDark ? 'bg-white/8' : 'bg-gray-200';
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className={cn('w-5 h-3 rounded flex-shrink-0', bg)} />
      <div className={cn('w-9 h-9 rounded-full flex-shrink-0', bg)} />
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className={cn('h-3.5 w-24 rounded', bg)} />
        <div className={cn('h-2.5 w-10 rounded', bg)} />
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <div className={cn('h-3.5 w-16 rounded', bg)} />
        <div className={cn('h-3 w-12 rounded', bg)} />
      </div>
    </div>
  );
}
