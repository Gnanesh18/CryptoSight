import { SearchX, Star } from 'lucide-react';

type EmptyStateType = 'search' | 'watchlist';

interface EmptyStateProps {
  type: EmptyStateType;
  query?: string;
}

/**
 * Meaningful empty state for search results and empty watchlist.
 * Shows an icon, message, and helpful hint — never a blank screen.
 */
export function EmptyState({ type, query }: EmptyStateProps) {
  if (type === 'search') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center py-20 px-4 text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <SearchX className="w-7 h-7 text-gray-500" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-white mb-1">No results found</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          No coins match <span className="text-gray-300">"{query}"</span>.
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
      <h3 className="text-base font-semibold text-white mb-1">Your watchlist is empty</h3>
      <p className="text-sm text-gray-500 max-w-xs">
        Star any coin from the <span className="text-gray-300">All Coins</span> tab
        to track it here. Your watchlist is saved locally.
      </p>
    </div>
  );
}
