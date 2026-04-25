import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { Toast } from '../../hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const typeStyles: Record<Toast['type'], string> = {
  success: 'bg-success-500/15 border-success-500/30 text-success-400',
  error:   'bg-danger-500/15 border-danger-500/30 text-danger-400',
  info:    'bg-brand-500/15 border-brand-500/30 text-brand-400',
};

/**
 * Fixed-position toast container that renders notification cards.
 * Positioned at bottom-right with slide-up entrance animation.
 */
export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md',
            'animate-slide-up shadow-lg',
            typeStyles[toast.type]
          )}
        >
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => onRemove(toast.id)}
            className="p-0.5 rounded-full hover:bg-white/10 transition-colors flex-shrink-0 cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
