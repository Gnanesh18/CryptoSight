import { memo, useRef, useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import type { Coin } from '../../types/coin';
import { useWatchlistStore } from '../../store/useWatchlistStore';
import { formatCurrency, formatLargeNumber, formatPercent } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import { SparklineChart } from '../molecules/SparklineChart';

interface CoinRowProps {
  coin: Coin;
  onSelect: (coin: Coin) => void;
  isDark?: boolean;
}

export const CoinRow = memo(function CoinRow({ coin, onSelect, isDark = true }: CoinRowProps) {
  const { toggle, isWatched } = useWatchlistStore();
  const watched = isWatched(coin.id);
  const isPositive = coin.price_change_percentage_24h >= 0;
  const is1hPositive = (coin.price_change_percentage_1h_in_currency ?? 0) >= 0;
  const is7dPositive = (coin.price_change_percentage_7d_in_currency ?? 0) >= 0;

  const [flashClass, setFlashClass] = useState('');
  const prevPriceRef = useRef(coin.current_price);

  useEffect(() => {
    if (prevPriceRef.current !== coin.current_price) {
      setFlashClass(coin.current_price > prevPriceRef.current ? 'animate-flash-green' : 'animate-flash-red');
      const t = setTimeout(() => setFlashClass(''), 900);
      prevPriceRef.current = coin.current_price;
      return () => clearTimeout(t);
    }
  }, [coin.current_price]);

  return (
    <tr
      onClick={() => onSelect(coin)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(coin)}
      tabIndex={0}
      aria-label={`View details for ${coin.name}`}
      className={cn(
        'group cursor-pointer border-b last:border-none transition-colors duration-150',
        isDark ? 'border-white/5 hover:bg-white/[0.03]' : 'border-gray-100 hover:bg-gray-50/70',
        flashClass
      )}
    >
      {/* Rank */}
      <td className="py-4 pl-5 pr-3 w-10">
        <span className={cn('text-xs font-mono tabular-nums', isDark ? 'text-gray-500' : 'text-gray-400')}>
          {coin.market_cap_rank}
        </span>
      </td>

      {/* Asset */}
      <td className="py-4 px-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={coin.image}
            alt={`${coin.name} logo`}
            loading="lazy"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/32x32/1e293b/94a3b8?text=${coin.symbol[0]}`;
            }}
          />
          <div className="min-w-0">
            <p className={cn('text-sm font-semibold leading-tight truncate', isDark ? 'text-white' : 'text-gray-900')}>
              {coin.name}
            </p>
            <p className={cn('text-xs uppercase font-mono tracking-wide', isDark ? 'text-gray-500' : 'text-gray-400')}>
              {coin.symbol}
            </p>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="py-4 px-3 text-right">
        <span className={cn('text-sm font-bold tabular-nums', isDark ? 'text-white' : 'text-gray-900')}>
          {formatCurrency(coin.current_price)}
        </span>
      </td>

      {/* 1h */}
      <td className="py-4 px-3 text-right hidden xl:table-cell">
        <span className={cn('text-xs font-semibold tabular-nums', is1hPositive ? 'text-success-400' : 'text-danger-400')}>
          {coin.price_change_percentage_1h_in_currency != null
            ? formatPercent(coin.price_change_percentage_1h_in_currency)
            : '—'}
        </span>
      </td>

      {/* 24h */}
      <td className="py-4 px-3 text-right">
        <span className={cn(
          'inline-flex items-center gap-1 text-xs font-semibold tabular-nums px-2 py-0.5 rounded-full',
          isPositive
            ? isDark ? 'text-success-400 bg-success-500/10' : 'text-emerald-700 bg-emerald-50'
            : isDark ? 'text-danger-400 bg-danger-500/10' : 'text-red-700 bg-red-50'
        )}>
          {isPositive
            ? <TrendingUp className="w-2.5 h-2.5" aria-hidden="true" />
            : <TrendingDown className="w-2.5 h-2.5" aria-hidden="true" />
          }
          {formatPercent(coin.price_change_percentage_24h)}
        </span>
      </td>

      {/* 7d */}
      <td className="py-4 px-3 text-right hidden lg:table-cell">
        <span className={cn('text-xs font-semibold tabular-nums', is7dPositive ? 'text-success-400' : 'text-danger-400')}>
          {coin.price_change_percentage_7d_in_currency != null
            ? formatPercent(coin.price_change_percentage_7d_in_currency)
            : '—'}
        </span>
      </td>

      {/* Market Cap */}
      <td className="py-4 px-3 text-right">
        <span className={cn('text-sm tabular-nums font-medium', isDark ? 'text-gray-300' : 'text-gray-600')}>
          {formatLargeNumber(coin.market_cap, '$')}
        </span>
      </td>

      {/* Volume */}
      <td className="py-4 px-3 text-right hidden lg:table-cell">
        <span className={cn('text-sm tabular-nums', isDark ? 'text-gray-400' : 'text-gray-500')}>
          {formatLargeNumber(coin.total_volume, '$')}
        </span>
      </td>

      {/* Sparkline */}
      <td className="py-4 px-3 hidden lg:table-cell">
        {coin.sparkline_in_7d?.price && (
          <SparklineChart prices={coin.sparkline_in_7d.price} positive={is7dPositive} width={96} height={32} />
        )}
      </td>

      {/* Star */}
      <td className="py-4 pl-3 pr-5 w-10">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggle(coin.id); }}
          aria-label={watched ? `Remove ${coin.name} from watchlist` : `Add ${coin.name} to watchlist`}
          aria-pressed={watched}
          className={cn(
            'p-1.5 rounded-full transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
            watched
              ? 'text-warning-400'
              : isDark
                ? 'text-gray-600 opacity-0 group-hover:opacity-100 hover:text-gray-300 hover:bg-white/8'
                : 'text-gray-300 opacity-0 group-hover:opacity-100 hover:text-gray-600 hover:bg-gray-100'
          )}
        >
          <Star className="w-3.5 h-3.5" fill={watched ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
});
