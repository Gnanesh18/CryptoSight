import type { Coin } from '../../types/coin';
import { cn } from '../../utils/cn';
import { Rocket, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Skeleton } from '../atoms/Skeleton';

interface TopGainersPanelProps {
  coins: Coin[];
  isLoading: boolean;
  isDark: boolean;
  onCoinSelect: (id: string) => void;
}

export function TopGainersPanel({ coins, isLoading, isDark, onCoinSelect }: TopGainersPanelProps) {
  const gainers = [...coins]
    .filter((c) => c.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 3);

  return (
    <div className={cn(
      'rounded-2xl border overflow-hidden transition-colors duration-300',
      isDark ? 'bg-white/3 border-white/8' : 'bg-white border-gray-200 shadow-sm'
    )}>
      <div className={cn('flex items-center justify-between px-4 py-3 border-b', isDark ? 'border-white/8' : 'border-gray-100')}>
        <div className="flex items-center gap-1.5">
          <Rocket className="w-4 h-4 text-success-400" />
          <span className="text-sm font-semibold">Top Gainers</span>
        </div>
        <button className={cn('flex items-center gap-0.5 text-xs font-medium transition-colors', isDark ? 'text-brand-400 hover:text-brand-300' : 'text-brand-600 hover:text-brand-700')}>
          View more <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="divide-y divide-white/5">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 h-[52px]">
                <Skeleton variant="circular" width={28} height={28} className="flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton variant="text" width={80} />
                  <Skeleton variant="text" width={40} className="h-2.5" />
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <Skeleton variant="text" width={60} />
                  <Skeleton variant="text" width={40} className="h-2.5" />
                </div>
              </div>
            ))
          : gainers.map((coin) => (
              <button
                key={coin.id}
                onClick={() => onCoinSelect(coin.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer',
                  isDark ? 'hover:bg-white/4' : 'hover:bg-gray-50'
                )}
              >
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-7 h-7 rounded-full"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/28x28/1e293b/94a3b8?text=${coin.symbol[0]}`; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{coin.name}</p>
                  <p className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>{coin.symbol.toUpperCase()}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold tabular-nums">{formatCurrency(coin.current_price)}</p>
                  <p className="text-xs font-bold text-success-400">
                    ▲ {coin.price_change_percentage_24h.toFixed(1)}%
                  </p>
                </div>
              </button>
            ))}
      </div>
    </div>
  );
}
