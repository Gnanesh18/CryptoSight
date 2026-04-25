import { Skeleton } from '../atoms/Skeleton';
import { cn } from '../../utils/cn';

interface CoinRowSkeletonProps {
  isDark?: boolean;
}

/**
 * Skeleton placeholder that mirrors the CoinRow layout.
 * Shown during initial data fetch to give a sense of content structure.
 */
export function CoinRowSkeleton({ isDark = true }: CoinRowSkeletonProps) {
  return (
    <tr className={cn('border-b h-[69px]', isDark ? 'border-white/5' : 'border-gray-100')} aria-hidden="true">
      {/* Rank */}
      <td className="py-4 pl-4 pr-2 w-12">
        <Skeleton variant="text" width={20} />
      </td>
      {/* Asset */}
      <td className="py-4 px-3">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={32} height={32} className="flex-shrink-0" />
          <div className="space-y-1.5">
            <Skeleton variant="text" width={96} />
            <Skeleton variant="text" width={40} className="h-2.5" />
          </div>
        </div>
      </td>
      {/* Price */}
      <td className="py-4 px-3 text-right">
        <div className="flex justify-end">
          <Skeleton variant="text" width={80} />
        </div>
      </td>
      {/* 1h Change */}
      <td className="py-4 px-3 text-right hidden xl:table-cell">
        <div className="flex justify-end">
          <Skeleton variant="text" width={48} />
        </div>
      </td>
      {/* 24h Change */}
      <td className="py-4 px-3 text-right">
        <div className="flex justify-end">
          <Skeleton variant="rectangular" width={64} height={24} className="rounded-full" />
        </div>
      </td>
      {/* 7d Change */}
      <td className="py-4 px-3 text-right hidden lg:table-cell">
        <div className="flex justify-end">
          <Skeleton variant="text" width={48} />
        </div>
      </td>
      {/* Market Cap */}
      <td className="py-4 px-3 text-right hidden sm:table-cell">
        <div className="flex justify-end">
          <Skeleton variant="text" width={80} />
        </div>
      </td>
      {/* Volume */}
      <td className="py-4 px-3 text-right hidden lg:table-cell">
        <div className="flex justify-end">
          <Skeleton variant="text" width={72} />
        </div>
      </td>
      {/* Sparkline */}
      <td className="py-4 px-3 hidden lg:table-cell">
        <Skeleton variant="rectangular" width={100} height={36} />
      </td>
      {/* Star */}
      <td className="py-4 pl-3 pr-4 w-10">
        <Skeleton variant="circular" width={28} height={28} />
      </td>
    </tr>
  );
}
