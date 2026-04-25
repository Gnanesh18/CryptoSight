import { useRef, useState, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchCoins } from '../../services/coingecko';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../utils/cn';

interface SearchBarProps {
  isDark?: boolean;
  className?: string;
  onSearchOpen?: (open: boolean) => void;
}

/**
 * Search bar with live dropdown results from CoinGecko /search API.
 * Results appear below the input — clicking navigates to coin detail page.
 */
export function SearchBar({ isDark = true, className, onSearchOpen }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const { data, isFetching } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchCoins(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 60_000,
  });

  const results = data?.coins?.slice(0, 8) ?? [];
  const showDropdown = isOpen && query.trim().length >= 2;

  const handleSelect = useCallback((coinId: string) => {
    setQuery('');
    setIsOpen(false);
    navigate(`/coin/${coinId}`);
  }, [navigate]);

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Notify parent about open state
  useEffect(() => {
    onSearchOpen?.(showDropdown);
  }, [showDropdown, onSearchOpen]);

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'relative flex items-center gap-2',
          'rounded-xl border transition-all duration-200',
          isDark
            ? 'bg-white/5 border-white/10 focus-within:border-brand-400/60'
            : 'bg-gray-100 border-gray-200 focus-within:border-brand-500/60',
          'focus-within:ring-2 focus-within:ring-brand-400/20',
        )}
      >
        <Search
          className={cn('absolute left-3.5 w-4 h-4 pointer-events-none', isDark ? 'text-gray-400' : 'text-gray-500')}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id="coin-search"
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="search-results"
          aria-label="Search cryptocurrencies by name or symbol"
          aria-autocomplete="list"
          placeholder="Search coins…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          autoComplete="off"
          spellCheck={false}
          className={cn(
            'w-full py-2.5 pl-10 pr-10',
            'bg-transparent text-sm rounded-xl',
            isDark
              ? 'text-white placeholder:text-gray-500'
              : 'text-gray-900 placeholder:text-gray-400',
            'focus:outline-none',
          )}
          style={{ fontFamily: 'var(--font-body)' }}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            className={cn(
              'absolute right-3 p-0.5 rounded-full transition-colors cursor-pointer',
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          id="search-results"
          role="listbox"
          className={cn(
            'absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-2xl z-50 overflow-hidden',
            'animate-slide-up',
            isDark
              ? 'bg-gray-900 border-white/10 shadow-black/40'
              : 'bg-white border-gray-200 shadow-gray-200/60',
          )}
        >
          {isFetching && results.length === 0 && (
            <div className="flex items-center justify-center gap-2 py-6">
              <Loader2 className={cn('w-4 h-4 animate-spin', isDark ? 'text-gray-400' : 'text-gray-500')} />
              <span className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>Searching…</span>
            </div>
          )}

          {!isFetching && results.length === 0 && debouncedQuery.trim().length >= 2 && (
            <div className="py-6 text-center">
              <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-400')}>
                No results for "{debouncedQuery}"
              </p>
            </div>
          )}

          {results.map((coin) => (
            <button
              key={coin.id}
              role="option"
              onClick={() => handleSelect(coin.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer',
                isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50',
              )}
            >
              <img
                src={coin.thumb}
                alt=""
                className="w-7 h-7 rounded-full flex-shrink-0"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/28x28/1e293b/94a3b8?text=${coin.symbol?.[0] ?? '?'}`;
                }}
              />
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium truncate', isDark ? 'text-white' : 'text-gray-900')}>
                  {coin.name}
                </p>
                <p className={cn('text-xs font-mono', isDark ? 'text-gray-500' : 'text-gray-400')}>
                  {coin.symbol?.toUpperCase()}
                </p>
              </div>
              {coin.market_cap_rank && (
                <span className={cn(
                  'text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0',
                  isDark ? 'bg-white/8 text-gray-400' : 'bg-gray-100 text-gray-500'
                )}>
                  #{coin.market_cap_rank}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
