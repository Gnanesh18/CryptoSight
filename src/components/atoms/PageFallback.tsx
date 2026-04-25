import { Skeleton } from './Skeleton';

export function PageFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Skeleton variant="circular" width={48} height={48} />
      <Skeleton variant="text" width={120} />
    </div>
  );
}
