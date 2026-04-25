import { useMemo, useState, useCallback } from 'react';
import type { Coin, SortField, SortDirection, Tab } from '../../types/coin';
import { CoinRow } from './CoinRow';
import { CoinRowSkeleton } from '../molecules/CoinRowSkeleton';
import { SortableHeader } from '../molecules/SortableHeader';
import { ErrorBanner } from '../molecules/ErrorBanner';
import { EmptyState } from '../molecules/EmptyState';
import { Pagination } from '../molecules/Pagination';
import { useWatchlistStore } from '../../store/useWatchlistStore';
import { cn } from '../../utils/cn';

interface MarketTableProps {
  coins: Coin[];
  isLoading: boolean;
  error: string | null;
  onCoinSelect: (coin: Coin) => void;
  onRetry: () => void;
  activeTab: Tab;
  isDark?: boolean;
}

const PAGE_SIZE = 20;

export function MarketTable({
  coins,
  isLoading,
  error,
  onCoinSelect,
  onRetry,
  activeTab,
  isDark = true,
}: MarketTableProps) {
  const [sortField, setSortField] = useState<SortField>('market_cap_rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState(1);
  const { watchedIds } = useWatchlistStore();

  const handleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDirection((dir) => (dir === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortDirection('asc');
      return field;
    });
    setPage(1);
  }, []);

  const processedCoins = useMemo(() => {
    let result = [...coins];

    if (activeTab === 'watchlist') {
      result = result.filter((c) => watchedIds.includes(c.id));
    } else if (activeTab === 'gainers') {
      result = result
        .filter((c) => c.price_change_percentage_24h > 0)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    } else if (activeTab === 'losers') {
      result = result
        .filter((c) => c.price_change_percentage_24h < 0)
        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
    }

    if (activeTab !== 'gainers' && activeTab !== 'losers') {
      result.sort((a, b) => {
        const aVal = a[sortField as keyof Coin] ?? 0;
        const bVal = b[sortField as keyof Coin] ?? 0;
        let cmp: number;
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          cmp = aVal.localeCompare(bVal);
        } else {
          cmp = (aVal as number) - (bVal as number);
        }
        return sortDirection === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  }, [coins, sortField, sortDirection, activeTab, watchedIds]);

  const totalPages = Math.max(1, Math.ceil(processedCoins.length / PAGE_SIZE));
  const paginatedCoins = useMemo(
    () => processedCoins.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [processedCoins, page]
  );

  if (error && !isLoading) return <ErrorBanner message={error} onRetry={onRetry} isDark={isDark} />;
  const isEmpty = !isLoading && processedCoins.length === 0;

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* ── Desktop table (hidden on mobile) ── */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse" aria-label="Cryptocurrency market data">
          <thead>
            <tr className={cn('border-b', isDark ? 'border-white/8' : 'border-gray-100')}>
              <th className="py-3 pl-5 pr-3 text-left w-10">
                <SortableHeader field="market_cap_rank" label="#" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} isDark={isDark} />
              </th>
              <th className="py-3 px-3 text-left min-w-[180px]">
                <SortableHeader field="name" label="Asset" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} isDark={isDark} />
              </th>
              <th className="py-3 px-3 text-right">
                <SortableHeader field="current_price" label="Price" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} align="right" isDark={isDark} />
              </th>
              <th className="py-3 px-3 text-right hidden xl:table-cell">
                <SortableHeader field="price_change_percentage_1h_in_currency" label="1h %" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} align="right" isDark={isDark} />
              </th>
              <th className="py-3 px-3 text-right">
                <SortableHeader field="price_change_percentage_24h" label="24h %" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} align="right" isDark={isDark} />
              </th>
              <th className="py-3 px-3 text-right hidden lg:table-cell">
                <SortableHeader field="price_change_percentage_7d_in_currency" label="7d %" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} align="right" isDark={isDark} />
              </th>
              <th className="py-3 px-3 text-right">
                <SortableHeader field="market_cap" label="Mkt Cap" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} align="right" isDark={isDark} />
              </th>
              <th className="py-3 px-3 text-right hidden lg:table-cell">
                <SortableHeader field="total_volume" label="Volume" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} align="right" isDark={isDark} />
              </th>
              <th className="py-3 px-3 text-right hidden lg:table-cell">
                <span className={cn('text-xs font-semibold uppercase tracking-wider', isDark ? 'text-gray-500' : 'text-gray-400')}>7D Chart</span>
              </th>
              <th className="py-3 pl-3 pr-5 w-10" aria-label="Watchlist" />
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => <CoinRowSkeleton key={i} isDark={isDark} />)
              : paginatedCoins.map((coin) => (
                  <CoinRow key={coin.id} coin={coin} onSelect={onCoinSelect} isDark={isDark} />
                ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile card list (shown only on mobile) ── */}
      <div className="sm:hidden">
        {isLoading ? (
          <div className="divide-y divide-white/5">
            {Array.from({ length: 8 }).map((_, i) => (
              <MobileCardSkeleton key={i} isDark={isDark} />
            ))}
          </div>
        ) : (
          <div className={cn('divide-y', isDark ? 'divide-white/5' : 'divide-gray-100')}>
            {paginatedCoins.map((coin, idx) => (
              <MobileCoinCard
                key={coin.id}
                coin={coin}
                rank={(page - 1) * PAGE_SIZE + idx + 1}
                onSelect={onCoinSelect}
                isDark={isDark}
              />
            ))}
          </div>
        )}
      </div>

      {isEmpty && !isLoading && (
        activeTab === 'watchlist'
          ? <EmptyState type="watchlist" isDark={isDark} />
          : <EmptyState type="search" isDark={isDark} />
      )}

      {!isLoading && !isEmpty && totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} isDark={isDark} />
      )}
    </div>
  );
}

/* ─── Mobile Card ─────────────────────────────────────────── */
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { useWatchlistStore as useWL } from '../../store/useWatchlistStore';
import { SparklineChart } from '../molecules/SparklineChart';

function MobileCoinCard({
  coin,
  rank,
  onSelect,
  isDark,
}: {
  coin: Coin;
  rank: number;
  onSelect: (coin: Coin) => void;
  isDark: boolean;
}) {
  const { toggle, isWatched } = useWL();
  const watched = isWatched(coin.id);
  const isPositive = coin.price_change_percentage_24h >= 0;
  const is7dPositive = (coin.price_change_percentage_7d_in_currency ?? 0) >= 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(coin)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(coin)}
      aria-label={`View details for ${coin.name}`}
      className={cn(
        'flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors active:scale-[0.99]',
        isDark ? 'hover:bg-white/4 active:bg-white/6' : 'hover:bg-gray-50 active:bg-gray-100'
      )}
    >
      {/* Rank + Icon */}
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
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/36x36/1e293b/94a3b8?text=${coin.symbol[0]}`;
          }}
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

      {/* Sparkline mini */}
      {coin.sparkline_in_7d?.price && (
        <div className="flex-shrink-0 hidden xs:block">
          <SparklineChart prices={coin.sparkline_in_7d.price} positive={is7dPositive} width={52} height={28} />
        </div>
      )}

      {/* Price + Change */}
      <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
        <p className={cn('text-sm font-bold tabular-nums', isDark ? 'text-white' : 'text-gray-900')}>
          {formatCurrency(coin.current_price)}
        </p>
        <span className={cn(
          'inline-flex items-center gap-0.5 text-xs font-semibold',
          isPositive ? 'text-success-400' : 'text-danger-400'
        )}>
          {isPositive
            ? <TrendingUp className="w-3 h-3" />
            : <TrendingDown className="w-3 h-3" />
          }
          {formatPercent(coin.price_change_percentage_24h)}
        </span>
      </div>

      {/* Star */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); toggle(coin.id); }}
        aria-label={watched ? `Remove ${coin.name} from watchlist` : `Add ${coin.name} to watchlist`}
        aria-pressed={watched}
        className={cn(
          'p-1.5 rounded-full flex-shrink-0 transition-colors',
          watched
            ? 'text-warning-400'
            : isDark ? 'text-gray-600' : 'text-gray-300'
        )}
      >
        <Star className="w-4 h-4" fill={watched ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}

function MobileCardSkeleton({ isDark }: { isDark: boolean }) {
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
