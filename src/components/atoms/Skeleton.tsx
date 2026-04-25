import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
}

/**
 * Animated shimmer skeleton placeholder.
 * Used during first-load to show content structure before data arrives.
 */
export function Skeleton({ 
  className,
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'bg-gray-200 dark:bg-white/5',
        'animate-shimmer',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded-md h-4 w-full',
        variant === 'rectangular' && 'rounded-xl',
        className
      )}
      style={{
        width: width ?? undefined,
        height: height ?? undefined,
      }}
      aria-hidden="true"
    />
  );
}
