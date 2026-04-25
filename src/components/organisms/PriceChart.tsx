import { useMemo, useRef, useState, useCallback } from 'react';
import type { CoinChartData, ChartRange } from '../../types/coin';
import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/formatters';

interface PriceChartProps {
  chartData: CoinChartData | null;
  isLoading: boolean;
  range: ChartRange;
  onRangeChange: (range: ChartRange) => void;
  isPositive: boolean;
}

const RANGES: { label: string; value: ChartRange }[] = [
  { label: '24H', value: '1' },
  { label: '7D', value: '7' },
  { label: '1M', value: '30' },
  { label: '3M', value: '90' },
  { label: '1Y', value: '365' },
  { label: 'Max', value: 'max' },
];

function formatXLabel(timestamp: number, range: ChartRange): string {
  const d = new Date(timestamp);
  if (range === '1') {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (range === '7' || range === '30') {
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
  return d.toLocaleDateString([], { month: 'short', year: '2-digit' });
}

export function PriceChart({ chartData, isLoading, range, onRangeChange, isPositive }: PriceChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; price: number; volume: number; time: number } | null>(null);

  const W = 800;
  const H = 320;
  const PAD = { top: 16, right: 16, bottom: 48, left: 0 };
  const VOL_H = 60;
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom - VOL_H - 8;

  const { pricePath, fillPath, volumeBars, xLabels, priceMin, priceMax } = useMemo(() => {
    if (!chartData || chartData.prices.length < 2) {
      return { pricePath: '', fillPath: '', volumeBars: [], xLabels: [], priceMin: 0, priceMax: 0 };
    }

    const prices = chartData.prices;
    const volumes = chartData.total_volumes;
    const n = prices.length;

    const pMin = Math.min(...prices.map(([, p]) => p));
    const pMax = Math.max(...prices.map(([, p]) => p));
    const pRange = pMax - pMin || 1;

    const vMax = Math.max(...volumes.map(([, v]) => v)) || 1;

    const toX = (i: number) => PAD.left + (i / (n - 1)) * plotW;
    const toPriceY = (p: number) => PAD.top + ((pMax - p) / pRange) * plotH;
    const toVolY = (v: number) => H - PAD.bottom - (v / vMax) * VOL_H;

    const pts = prices.map(([, p], i) => `${toX(i)},${toPriceY(p)}`);
    const line = `M ${pts.join(' L ')}`;
    const fill = `${line} L ${toX(n - 1)},${H - PAD.bottom - VOL_H - 8} L ${PAD.left},${H - PAD.bottom - VOL_H - 8} Z`;

    // Volume bars
    const barW = Math.max(1, plotW / n - 0.5);
    const bars = volumes.map(([t, v], i) => ({
      x: toX(i) - barW / 2,
      y: toVolY(v),
      w: barW,
      h: H - PAD.bottom - toVolY(v),
      t,
    }));

    // X axis labels — pick ~6 evenly spaced
    const step = Math.max(1, Math.floor(n / 6));
    const labels = prices
      .filter((_, i) => i % step === 0 || i === n - 1)
      .map(([t], i, arr) => ({
        x: toX(prices.findIndex(([ts]) => ts === arr[i][0])),
        label: formatXLabel(t, range),
      }));

    return {
      pricePath: line,
      fillPath: fill,
      volumeBars: bars,
      xLabels: labels,
      priceMin: pMin,
      priceMax: pMax,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, range, plotW, plotH]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!chartData || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    const relX = svgX - PAD.left;
    const n = chartData.prices.length;
    const idx = Math.max(0, Math.min(n - 1, Math.round((relX / plotW) * (n - 1))));
    const [t, p] = chartData.prices[idx];
    const [, v] = chartData.total_volumes[idx] ?? [t, 0];

    const pRange = priceMax - priceMin || 1;
    const yPos = PAD.top + ((priceMax - p) / pRange) * plotH;
    const xPos = PAD.left + (idx / (n - 1)) * plotW;
    setTooltip({ x: xPos, y: yPos, price: p, volume: v, time: t });
  }, [chartData, priceMin, priceMax, plotH, plotW, PAD.left, PAD.top, W]);

  const strokeColor = isPositive ? '#22c55e' : '#ef4444';
  const fillId = isPositive ? 'gradGreen' : 'gradRed';
  const fillStart = isPositive ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)';

  return (
    <div className="flex flex-col gap-0">
      {/* Time range buttons */}
      <div className="flex items-center gap-1 mb-3">
        {RANGES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onRangeChange(value)}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer',
              range === value
                ? 'bg-brand-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/8'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative w-full" style={{ aspectRatio: `${W}/${H}` }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-950/50 rounded-xl z-10">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillStart} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Volume bars */}
          {volumeBars.map((bar, i) => (
            <rect
              key={i}
              x={bar.x}
              y={bar.y}
              width={bar.w}
              height={bar.h}
              fill="rgba(107, 114, 128, 0.15)"
              rx="1"
            />
          ))}

          {/* Fill area */}
          {fillPath && (
            <path d={fillPath} fill={`url(#${fillId})`} />
          )}

          {/* Price line */}
          {pricePath && (
            <path
              d={pricePath}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* X-axis labels */}
          {xLabels.map((lbl, i) => (
            <text
              key={i}
              x={lbl.x}
              y={H - 6}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {lbl.label}
            </text>
          ))}

          {/* Tooltip crosshair */}
          {tooltip && (
            <>
              <line
                x1={tooltip.x} y1={PAD.top}
                x2={tooltip.x} y2={H - PAD.bottom - VOL_H - 8}
                stroke="rgba(156, 163, 175, 0.3)"
                strokeWidth="1"
                strokeDasharray="4,3"
              />
              <circle cx={tooltip.x} cy={tooltip.y} r="4" fill={strokeColor} />
              <circle cx={tooltip.x} cy={tooltip.y} r="7" fill={strokeColor} fillOpacity="0.25" />
              {/* Tooltip box */}
              {(() => {
                const bx = Math.min(tooltip.x + 12, W - 170);
                const by = Math.max(PAD.top, tooltip.y - 50);
                return (
                  <g>
                    <rect x={bx} y={by} width={158} height={56} rx="8" fill="rgba(17, 24, 39, 0.95)" />
                    <text x={bx + 10} y={by + 18} fontSize="11" fill="#9ca3af">
                      {new Date(tooltip.time).toLocaleString()}
                    </text>
                    <text x={bx + 10} y={by + 34} fontSize="12" fontWeight="600" fill="white">
                      {formatCurrency(tooltip.price)}
                    </text>
                    <text x={bx + 10} y={by + 50} fontSize="10" fill="#6b7280">
                      Vol: {formatCurrency(tooltip.volume, true)}
                    </text>
                  </g>
                );
              })()}
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
