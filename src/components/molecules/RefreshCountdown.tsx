import { RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useState, useEffect } from 'react';

interface RefreshCountdownProps {
  isRefreshing: boolean;
  isDark?: boolean;
}

// countdown timer for the next refresh
export function RefreshCountdown({
  isRefreshing,
  isDark = true,
}: RefreshCountdownProps) {
  const [seconds, setSeconds] = useState(60);
  const [prevRefreshing, setPrevRefreshing] = useState(isRefreshing);

  // reset timer when refresh finishes
  if (prevRefreshing && !isRefreshing) {
    setPrevRefreshing(false);
    setSeconds(60);
  } else if (!prevRefreshing && isRefreshing) {
    setPrevRefreshing(true);
  }

  // tick every second
  useEffect(() => {
    if (isRefreshing) return;
    const interval = setInterval(() => {
      setSeconds(s => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRefreshing]);

  const progress = (seconds / 60) * 100;

  return (
    <div className="flex items-center gap-3 min-w-0">
      {isRefreshing ? (
        <div className="flex items-center gap-1.5 text-brand-400">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span className="text-xs font-medium">Updating…</span>
        </div>
      ) : (
        <span className={cn('text-xs tabular-nums whitespace-nowrap', isDark ? 'text-gray-500' : 'text-gray-400')}>
          Refreshes in {seconds}s
        </span>
      )}
      
      {/* progress bar */}
      <div
        className={cn('h-1 w-20 rounded-full overflow-hidden flex-shrink-0', isDark ? 'bg-white/8' : 'bg-gray-200')}
        role="progressbar"
        aria-valuenow={seconds}
        aria-valuemin={0}
        aria-valuemax={60}
      >
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
