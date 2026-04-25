import { useMemo, useState, useCallback } from 'react';
import type { Coin, SortField, SortDirection, Tab } from '../../types/coin';
import { CoinRow } from './CoinRow';
import { CoinRowSkeleton } from '../molecules/CoinRowSkeleton';
import { SortableHeader } from '../molecules/SortableHeader';
import { ErrorBanner } from '../molecules/ErrorBanner';
import { EmptyState } from '../molecules/EmptyState';
import { Pagination } from '../molecules/Pagination';
import { useDebounce } from '../../hooks/useDebounce';
import { useWatchlistStore } from '../../store/useWatchlistStore';
import { cn } from '../../utils/cn';

interface MarketTableProps {
  coins: Coin[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
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
  searchQuery,
  onCoinSelect,
  onRetry,
  activeTab,
  isDark = true,
}: MarketTableProps) {
  const [sortField, setSortField] = useState<SortField>('market_cap_rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState(1);
  const { watchedIds } = useWatchlistStore();
  const debouncedQuery = useDebounce(searchQuery, 300);

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
      result = result.filter((c) => c.price_change_percentage_24h > 0)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    } else if (activeTab === 'losers') {
      result = result.filter((c) => c.price_change_percentage_24h < 0)
        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
    }

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      );
    }

    // Skip re-sort for tabs that already sort
    if (activeTab !== 'gainers' && activeTab !== 'losers') {
      result.sort((a, b) => {
        const aVal = a[sortField as keyof Coin] ?? 0;
        const bVal = b[sortField as keyof Coin] ?? 0;
        let cmp;
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          cmp = aVal.localeCompare(bVal);
        } else {
          cmp = (aVal as number) - (bVal as number);
        }
        return sortDirection === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  }, [coins, debouncedQuery, sortField, sortDirection, activeTab, watchedIds]);

  const totalPages = Math.max(1, Math.ceil(processedCoins.length / PAGE_SIZE));
  const paginatedCoins = useMemo(
    () => processedCoins.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [processedCoins, page]
  );

  if (error && !isLoading) return <ErrorBanner message={error} onRetry={onRetry} isDark={isDark} />;
  const isEmpty = !isLoading && processedCoins.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className={cn('overflow-x-auto rounded-xl border', isDark ? 'border-white/8' : 'border-gray-200')}>
        <table className="w-full border-collapse" aria-label="Cryptocurrency market data">
          <thead>
            <tr className={cn('border-b', isDark ? 'border-white/10' : 'border-gray-200')}>
              <th className="py-3 pl-4 pr-2 text-left w-12">
                <SortableHeader field="market_cap_rank" label="#" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} isDark={isDark} />
              </th>
              <th className="py-3 px-3 text-left">
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
              <th className="py-3 px-3 text-right hidden sm:table-cell">
                <SortableHeader field="market_cap" label="Market Cap" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} align="right" isDark={isDark} />
              </th>
              <th className="py-3 px-3 text-right hidden lg:table-cell">
                <SortableHeader field="total_volume" label="Volume (24h)" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} align="right" isDark={isDark} />
              </th>
              <th className="py-3 px-3 text-right hidden lg:table-cell">
                <span className={cn('text-xs font-semibold uppercase tracking-wider', isDark ? 'text-gray-500' : 'text-gray-400')}>Last 7 Days</span>
              </th>
              <th className="py-3 pl-3 pr-4 w-10" aria-label="Watchlist" />
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
        {isEmpty && !isLoading && (
          activeTab === 'watchlist'
            ? <EmptyState type="watchlist" isDark={isDark} />
            : <EmptyState type="search" query={debouncedQuery} isDark={isDark} />
        )}
      </div>

      {!isLoading && !isEmpty && totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} isDark={isDark} />
      )}
    </div>
  );
}
