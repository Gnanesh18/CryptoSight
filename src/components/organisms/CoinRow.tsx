import { memo, useRef, useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import type { Coin } from '../../types/coin';
import { Badge } from '../atoms/Badge';
import { useWatchlistStore } from '../../store/useWatchlistStore';
import { formatCurrency, formatLargeNumber, formatPercent } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import { SparklineChart } from '../molecules/SparklineChart';

interface CoinRowProps {
  coin: Coin;
  onSelect: (coin: Coin) => void;
}

export const CoinRow = memo(function CoinRow({ coin, onSelect }: CoinRowProps) {
  const { toggle, isWatched } = useWatchlistStore();
  const watched = isWatched(coin.id);
  const isPositive = coin.price_change_percentage_24h >= 0;
  const is1hPositive = (coin.price_change_percentage_1h_in_currency ?? 0) >= 0;
  const is7dPositive = (coin.price_change_percentage_7d_in_currency ?? 0) >= 0;

  const [flashClass, setFlashClass] = useState('');
  const prevPriceRef = useRef(coin.current_price);

  useEffect(() => {
    if (prevPriceRef.current !== coin.current_price) {
      const direction = coin.current_price > prevPriceRef.current ? 'flash-green' : 'flash-red';
      setFlashClass(`animate-${direction}`);
      const timer = setTimeout(() => setFlashClass(''), 900);
      prevPriceRef.current = coin.current_price;
      return () => clearTimeout(timer);
    }
  }, [coin.current_price]);

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle(coin.id);
  };

  return (
    <tr
      onClick={() => onSelect(coin)}
      className={cn(
        'group relative cursor-pointer',
        'border-b border-white/5 last:border-none',
        'transition-colors duration-150',
        'hover:bg-white/4',
        flashClass
      )}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(coin)}
      aria-label={`View details for ${coin.name}`}
    >
      {/* Rank */}
      <td className="py-4 pl-4 pr-2 w-12">
        <span className="text-xs text-gray-500 font-mono">{coin.market_cap_rank}</span>
      </td>

      {/* Asset */}
      <td className="py-4 px-3">
        <div className="flex items-center gap-3">
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
          <div>
            <p className="text-sm font-semibold text-white leading-tight">{coin.name}</p>
            <p className="text-xs text-gray-500 uppercase font-mono">{coin.symbol}</p>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="py-4 px-3 text-right">
        <span className="text-sm font-semibold text-white tabular-nums">
          {formatCurrency(coin.current_price)}
        </span>
      </td>

      {/* 1h Change */}
      <td className="py-4 px-3 text-right hidden xl:table-cell">
        <span className={cn('text-xs font-medium', is1hPositive ? 'text-success-400' : 'text-danger-400')}>
          {coin.price_change_percentage_1h_in_currency != null
            ? formatPercent(coin.price_change_percentage_1h_in_currency)
            : '—'}
        </span>
      </td>

      {/* 24h Change */}
      <td className="py-4 px-3 text-right">
        <Badge variant={isPositive ? 'success' : 'danger'}>
          {isPositive
            ? <TrendingUp className="w-3 h-3" aria-hidden="true" />
            : <TrendingDown className="w-3 h-3" aria-hidden="true" />
          }
          {formatPercent(coin.price_change_percentage_24h)}
        </Badge>
      </td>

      {/* 7d Change */}
      <td className="py-4 px-3 text-right hidden lg:table-cell">
        <span className={cn('text-xs font-medium', is7dPositive ? 'text-success-400' : 'text-danger-400')}>
          {coin.price_change_percentage_7d_in_currency != null
            ? formatPercent(coin.price_change_percentage_7d_in_currency)
            : '—'}
        </span>
      </td>

      {/* Market Cap */}
      <td className="py-4 px-3 text-right hidden sm:table-cell">
        <span className="text-sm text-gray-300 tabular-nums">
          {formatLargeNumber(coin.market_cap, '$')}
        </span>
      </td>

      {/* 24h Volume */}
      <td className="py-4 px-3 text-right hidden lg:table-cell">
        <span className="text-sm text-gray-400 tabular-nums">
          {formatLargeNumber(coin.total_volume, '$')}
        </span>
      </td>

      {/* Sparkline */}
      <td className="py-4 px-3 hidden lg:table-cell">
        {coin.sparkline_in_7d?.price && (
          <SparklineChart
            prices={coin.sparkline_in_7d.price}
            positive={is7dPositive}
            width={100}
            height={36}
          />
        )}
      </td>

      {/* Star / Watchlist */}
      <td className="py-4 pl-3 pr-4 w-10">
        <button
          type="button"
          onClick={handleStarClick}
          aria-label={watched ? `Remove ${coin.name} from watchlist` : `Add ${coin.name} to watchlist`}
          aria-pressed={watched}
          className={cn(
            'p-1.5 rounded-full transition-all duration-150',
            'hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
            watched ? 'text-warning-400' : 'text-gray-600 hover:text-gray-400 opacity-0 group-hover:opacity-100'
          )}
        >
          <Star className="w-4 h-4" fill={watched ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
});
