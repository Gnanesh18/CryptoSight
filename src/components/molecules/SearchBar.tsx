import { useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Accessible, debounce-ready search bar.
 * Parent is responsible for debouncing the value via useDebounce().
 */
export function SearchBar({ value, onChange, className }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        'relative flex items-center gap-2',
        'rounded-xl border transition-all duration-200',
        'bg-white/5 dark:bg-white/5',
        'border-white/10 focus-within:border-brand-400/60',
        'focus-within:ring-2 focus-within:ring-brand-400/20',
        className
      )}
    >
      <Search
        className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        id="coin-search"
        type="search"
        role="searchbox"
        aria-label="Search cryptocurrencies by name or symbol"
        placeholder="Search coins…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
        className={cn(
          'w-full py-2.5 pl-10 pr-10',
          'bg-transparent text-sm text-white placeholder:text-gray-500',
          'focus:outline-none',
          'font-body'
        )}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={handleClear}
          className="absolute right-3 p-0.5 rounded-full text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
