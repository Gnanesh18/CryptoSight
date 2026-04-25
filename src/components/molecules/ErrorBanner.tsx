import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../atoms/Button';
import { cn } from '../../utils/cn';

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
  isDark?: boolean;
}

/**
 * Error state banner — shown on API failure.
 * Never shows a blank screen; always provides a retry action.
 */
export function ErrorBanner({ message, onRetry, isDark = true }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="flex flex-col items-center gap-4 max-w-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-danger-500/15 border border-danger-500/25 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-danger-400" aria-hidden="true" />
        </div>
        <div>
          <h3 className={cn('text-base font-semibold mb-1', isDark ? 'text-white' : 'text-gray-900')}>
            Failed to load market data
          </h3>
          <p className={cn('text-sm leading-relaxed', isDark ? 'text-gray-400' : 'text-gray-500')}>{message}</p>
        </div>
        <Button
          variant="ghost"
          size="md"
          onClick={onRetry}
          className={cn('gap-2', !isDark && 'border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100')}
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
