import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-brand-500 hover:bg-brand-600 text-white',
    'shadow-lg shadow-brand-500/25',
    'focus-visible:ring-2 focus-visible:ring-brand-400',
  ].join(' '),
  ghost: [
    'bg-transparent hover:bg-white/8',
    'text-gray-400 hover:text-white',
    'border border-white/10 hover:border-white/20',
    'focus-visible:ring-2 focus-visible:ring-white/30',
  ].join(' '),
  danger: [
    'bg-danger-500/15 hover:bg-danger-500/25 text-danger-400',
    'border border-danger-500/30',
    'focus-visible:ring-2 focus-visible:ring-danger-400',
  ].join(' '),
  icon: [
    'bg-transparent hover:bg-white/8 text-gray-400 hover:text-white',
    'rounded-full focus-visible:ring-2 focus-visible:ring-white/30',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, children, ...props }: ButtonProps,
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg',
        'transition-all duration-150 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
