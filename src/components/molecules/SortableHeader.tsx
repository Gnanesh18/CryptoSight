import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { SortField, SortDirection } from '../../types/coin';
import { cn } from '../../utils/cn';

interface SortableHeaderProps {
  field: SortField;
  label: string;
  currentField: SortField;
  currentDirection: SortDirection;
  onSort: (field: SortField) => void;
  className?: string;
  align?: 'left' | 'right';
}

/**
 * Column header that toggles sort direction on click.
 * Shows directional icon for active sort, neutral icon for inactive.
 */
export function SortableHeader({
  field,
  label,
  currentField,
  currentDirection,
  onSort,
  className,
  align = 'left',
}: SortableHeaderProps) {
  const isActive = currentField === field;

  const Icon = isActive
    ? currentDirection === 'asc'
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      aria-label={`Sort by ${label} ${isActive && currentDirection === 'asc' ? 'descending' : 'ascending'}`}
      className={cn(
        'group flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider',
        'transition-colors duration-150 cursor-pointer',
        isActive ? 'text-brand-400' : 'text-gray-500 hover:text-gray-300',
        align === 'right' && 'ml-auto',
        className
      )}
    >
      <span>{label}</span>
      <Icon
        className={cn(
          'w-3 h-3 transition-opacity duration-150',
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
        )}
        aria-hidden="true"
      />
    </button>
  );
}
