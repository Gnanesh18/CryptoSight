import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

type BadgeVariant = 'success' | 'danger' | 'neutral' | 'warning';

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success-500/15 text-success-400 border-success-500/25',
  danger:  'bg-danger-500/15  text-danger-400  border-danger-500/25',
  neutral: 'bg-white/8        text-gray-400    border-white/12',
  warning: 'bg-warning-400/15 text-warning-400 border-warning-400/25',
};

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full',
        'text-xs font-semibold border',
        'transition-colors duration-150',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
