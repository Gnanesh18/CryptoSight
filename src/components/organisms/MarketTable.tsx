import { useMemo, useState, useCallback } from 'react';
import type { Coin, SortField, SortDirection, Tab } from '../../types/coin';
import { CoinRow } from './CoinRow';
import { CoinRowSkeleton } from '../molecules/CoinRowSkeleton';
import { SortableHeader } from '../molecules/SortableHeader';
import { ErrorBanner } from '../molecules/ErrorBanner';
import { EmptyState } from '../molecules/EmptyState';
import { Pagination } from '../molecules/Pagination';
import { MobileCoinCard, MobileCardSkeleton } from '../molecules/MobileCoinCard';
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
      {/* desktop version */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
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
              <th className="py-3 pl-3 pr-5 w-10" />
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

      {/* mobile version */}
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
