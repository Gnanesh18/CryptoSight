import { useMemo } from 'react';
import { cn } from '../../utils/cn';

interface SparklineChartProps {
  prices: number[];
  width?: number;
  height?: number;
  className?: string;
  positive?: boolean;
}

export function SparklineChart({ prices, width = 120, height = 40, className, positive }: SparklineChartProps) {
  const { path, isPositive } = useMemo(() => {
    if (!prices || prices.length < 2) return { path: '', isPositive: true };

    const validPrices = prices.filter((p) => typeof p === 'number' && !isNaN(p));
    if (validPrices.length < 2) return { path: '', isPositive: true };

    const min = Math.min(...validPrices);
    const max = Math.max(...validPrices);
    const range = max - min || 1;
    const pad = 2;

    const points = validPrices.map((price, i) => {
      const x = pad + (i / (validPrices.length - 1)) * (width - pad * 2);
      const y = pad + ((max - price) / range) * (height - pad * 2);
      return `${x},${y}`;
    });

    const first = validPrices[0];
    const last = validPrices[validPrices.length - 1];
    const isPos = last >= first;

    return {
      path: `M ${points.join(' L ')}`,
      isPositive: isPos,
    };
  }, [prices, width, height]);

  const color = (positive !== undefined ? positive : isPositive)
    ? '#22c55e'   // green
    : '#ef4444';   // red

  if (!path) {
    return <div className={cn('opacity-20 bg-white/10 rounded', className)} style={{ width, height }} />;
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('overflow-visible', className)}
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
