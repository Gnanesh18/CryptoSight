import { RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RefreshCountdownProps {
  secondsRemaining: number;
  totalSeconds?: number;
  isRefreshing: boolean;
  isDark?: boolean;
}

/**
 * Shows a visual countdown bar and seconds until the next data refresh.
 * Displays a spinner when actively refreshing in the background.
 */
export function RefreshCountdown({
  secondsRemaining,
  totalSeconds = 60,
  isRefreshing,
  isDark = true,
}: RefreshCountdownProps) {
  const progress = (secondsRemaining / totalSeconds) * 100;

  return (
    <div className="flex items-center gap-3 min-w-0">
      {isRefreshing ? (
        <div className="flex items-center gap-1.5 text-brand-400">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
          <span className="text-xs font-medium">Updating…</span>
        </div>
      ) : (
        <span className={cn('text-xs tabular-nums whitespace-nowrap', isDark ? 'text-gray-500' : 'text-gray-400')}>
          Refreshes in {secondsRemaining}s
        </span>
      )}
      {/* Progress bar */}
      <div
        className={cn('h-1 w-20 rounded-full overflow-hidden flex-shrink-0', isDark ? 'bg-white/8' : 'bg-gray-200')}
        role="progressbar"
        aria-valuenow={secondsRemaining}
        aria-valuemin={0}
        aria-valuemax={totalSeconds}
        aria-label={`${secondsRemaining} seconds until next refresh`}
      >
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
