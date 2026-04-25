import { SearchX, Star } from 'lucide-react';
import { cn } from '../../utils/cn';

type EmptyStateType = 'search' | 'watchlist';

interface EmptyStateProps {
  type: EmptyStateType;
  query?: string;
  isDark?: boolean;
}

/**
 * Meaningful empty state for search results and empty watchlist.
 * Shows an icon, message, and helpful hint — never a blank screen.
 */
export function EmptyState({ type, query, isDark = true }: EmptyStateProps) {
  if (type === 'search') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center py-20 px-4 text-center"
      >
        <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-4', isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200')}>
          <SearchX className={cn('w-7 h-7', isDark ? 'text-gray-500' : 'text-gray-400')} aria-hidden="true" />
        </div>
        <h3 className={cn('text-base font-semibold mb-1', isDark ? 'text-white' : 'text-gray-900')}>No results found</h3>
        <p className={cn('text-sm max-w-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>
          No coins match <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>"{query}"</span>.
          Try searching by full name (e.g. "Bitcoin") or ticker symbol (e.g. "BTC").
        </p>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-warning-400/10 border border-warning-400/20 flex items-center justify-center mb-4">
        <Star className="w-7 h-7 text-warning-400" aria-hidden="true" />
      </div>
      <h3 className={cn('text-base font-semibold mb-1', isDark ? 'text-white' : 'text-gray-900')}>Your watchlist is empty</h3>
      <p className={cn('text-sm max-w-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>
        Star any coin from the <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>All Coins</span> tab
        to track it here. Your watchlist is saved locally.
      </p>
    </div>
  );
}
