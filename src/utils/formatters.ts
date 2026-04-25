/**
 * Format a number as USD currency using Intl.NumberFormat.
 * Handles both large values and micro-cap prices gracefully.
 */
export function formatCurrency(value: number, compact = false): string {
  if (compact) return formatLargeNumber(value, '$');
  if (value === null || value === undefined || isNaN(value)) return '—';

  // For very small prices (< $0.01), show more decimal places
  if (value > 0 && value < 0.01) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumSignificantDigits: 3,
      maximumSignificantDigits: 4,
    }).format(value);
  }

  // For prices >= $1000, no fractional digits
  if (value >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  // Default: 2–4 decimal places
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

/**
 * Format a large number with T/B/M/K suffixes.
 * Used for market cap, volume, supply.
 */
export function formatLargeNumber(value: number | null | undefined, prefix = ''): string {
  if (value === null || value === undefined || isNaN(value)) return '—';

  const abs = Math.abs(value);

  if (abs >= 1e12) {
    return `${prefix}${(value / 1e12).toFixed(2)}T`;
  }
  if (abs >= 1e9) {
    return `${prefix}${(value / 1e9).toFixed(2)}B`;
  }
  if (abs >= 1e6) {
    return `${prefix}${(value / 1e6).toFixed(2)}M`;
  }
  if (abs >= 1e3) {
    return `${prefix}${(value / 1e3).toFixed(1)}K`;
  }

  return `${prefix}${value.toFixed(0)}`;
}

/**
 * Format a percentage with sign and fixed decimal places.
 */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return '—';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}
