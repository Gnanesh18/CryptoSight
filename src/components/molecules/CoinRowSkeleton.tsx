import { Skeleton } from '../atoms/Skeleton';
import { cn } from '../../utils/cn';

interface CoinRowSkeletonProps {
  isDark?: boolean;
}

/** Desktop-only skeleton — mirrors the CoinRow desktop layout. */
export function CoinRowSkeleton({ isDark = true }: CoinRowSkeletonProps) {
  return (
    <tr className={cn('border-b h-[66px]', isDark ? 'border-white/5' : 'border-gray-100')} aria-hidden="true">
      <td className="py-4 pl-5 pr-3 w-10">
        <Skeleton variant="text" width={20} />
      </td>
      <td className="py-4 px-3">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={32} height={32} className="flex-shrink-0" />
          <div className="space-y-1.5">
            <Skeleton variant="text" width={96} />
            <Skeleton variant="text" width={36} className="h-2.5" />
          </div>
        </div>
      </td>
      <td className="py-4 px-3 text-right">
        <div className="flex justify-end"><Skeleton variant="text" width={80} /></div>
      </td>
      <td className="py-4 px-3 hidden xl:table-cell">
        <div className="flex justify-end"><Skeleton variant="text" width={44} /></div>
      </td>
      <td className="py-4 px-3">
        <div className="flex justify-end">
          <Skeleton variant="rectangular" width={64} height={22} className="rounded-full" />
        </div>
      </td>
      <td className="py-4 px-3 hidden lg:table-cell">
        <div className="flex justify-end"><Skeleton variant="text" width={44} /></div>
      </td>
      <td className="py-4 px-3">
        <div className="flex justify-end"><Skeleton variant="text" width={72} /></div>
      </td>
      <td className="py-4 px-3 hidden lg:table-cell">
        <div className="flex justify-end"><Skeleton variant="text" width={64} /></div>
      </td>
      <td className="py-4 px-3 hidden lg:table-cell">
        <Skeleton variant="rectangular" width={96} height={32} />
      </td>
      <td className="py-4 pl-3 pr-5 w-10">
        <Skeleton variant="circular" width={26} height={26} />
      </td>
    </tr>
  );
}
