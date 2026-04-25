import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Star, ExternalLink, Globe, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { useCoinDetail } from '../../hooks/useCoinDetail';
import { useWatchlistStore } from '../../store/useWatchlistStore';
import { PriceChart } from '../organisms/PriceChart';
import { Skeleton } from '../atoms/Skeleton';
import { cn } from '../../utils/cn';
import { formatCurrency, formatLargeNumber, formatPercent, formatDate } from '../../utils/formatters';
import type { ChartRange } from '../../types/coin';

interface CoinDetailPageProps {
  isDark: boolean;
}

type DetailTab = 'overview' | 'markets' | 'historical';

function StatCard({ label, value, sub, isDark }: { label: string; value: string; sub?: string; isDark: boolean }) {
  return (
    <div className={cn('rounded-xl p-4 border', isDark ? 'bg-white/3 border-white/8' : 'bg-gray-50 border-gray-200')}>
      <p className={cn('text-xs uppercase tracking-wider font-medium mb-1', isDark ? 'text-gray-500' : 'text-gray-400')}>{label}</p>
      <p className="text-base font-bold" style={{ fontFamily: 'var(--font-display)' }}>{value}</p>
      {sub && <p className={cn('text-xs mt-0.5', isDark ? 'text-gray-500' : 'text-gray-400')}>{sub}</p>}
    </div>
  );
}

export function CoinDetailPage({ isDark }: CoinDetailPageProps) {
  const { id: coinId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  
  if (!coinId) return null;

  const onClose = () => navigate('/');

  const { detail, chartData, chartRange, changeRange, isLoadingDetail, isLoadingChart, error } = useCoinDetail(coinId);
  const { toggle, isWatched } = useWatchlistStore();

  const watched = isWatched(coinId);
  const md = detail?.market_data;
  const price = md?.current_price.usd ?? 0;
  const change24h = md?.price_change_percentage_24h ?? 0;
  const isPositive = change24h >= 0;

  // Strip HTML from description
  const description = detail?.description.en
    ?.replace(/<[^>]+>/g, '')
    ?.replace(/\r\n/g, '\n')
    ?.split('\n')[0]
    ?.slice(0, 600) ?? '';

  const tabs: { id: DetailTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'markets', label: 'Markets' },
    { id: 'historical', label: 'Historical Data' },
  ];

  return (
    <div className={cn(
      'animate-fade-in',
      isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'
    )}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        {/* Sticky Header */}
        <div className={cn(
          'sticky top-0 z-10 flex items-center justify-between py-4 border-b backdrop-blur-md',
          isDark ? 'bg-gray-950/90 border-white/8' : 'bg-gray-50/90 border-gray-200'
        )}>
          <button
            onClick={onClose}
            className={cn('flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer',
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Markets
          </button>
          {detail && (
            <div className="flex items-center gap-2">
              <span className={cn('text-sm font-mono', isDark ? 'text-gray-500' : 'text-gray-400')}>
                {detail.symbol.toUpperCase()}
              </span>
              <button
                onClick={() => toggle(coinId)}
                aria-pressed={watched}
                className={cn('p-2 rounded-lg transition-colors cursor-pointer',
                  watched ? 'text-warning-400 bg-warning-400/10' : isDark ? 'text-gray-500 hover:text-white hover:bg-white/8' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100')}
              >
                <Star className="w-4 h-4" fill={watched ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={onClose}
                className={cn('p-2 rounded-lg transition-colors cursor-pointer',
                  isDark ? 'text-gray-500 hover:text-white hover:bg-white/8' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Loading / Error */}
        {isLoadingDetail && (
          <div className="pt-6 pb-4 space-y-6">
            <div className="flex items-start gap-4">
              <Skeleton variant="circular" width={56} height={56} />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width={200} height={32} />
                <Skeleton variant="text" width={100} />
              </div>
              <div className="flex flex-col items-end gap-2">
                <Skeleton variant="text" width={120} height={36} />
                <Skeleton variant="text" width={80} />
              </div>
            </div>
            <Skeleton variant="rectangular" height={6} className="rounded-full" />
            <Skeleton variant="rectangular" height={400} />
          </div>
        )}
        {error && !isLoadingDetail && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-danger-400 text-sm">{error}</p>
            <button onClick={onClose} className="text-brand-400 underline text-sm">Go back</button>
          </div>
        )}

        {detail && (
          <>
            {/* Hero Section */}
            <div className="pt-6 pb-4">
              <div className="flex items-start gap-4 flex-wrap">
                <img
                  src={detail.image.large}
                  alt={detail.name}
                  className="w-14 h-14 rounded-full"
                  onError={(e) => { (e.target as HTMLImageElement).src = detail.image.thumb; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{detail.name}</h1>
                    <span className={cn('text-sm font-mono px-2 py-0.5 rounded-md', isDark ? 'bg-white/8 text-gray-400' : 'bg-gray-100 text-gray-500')}>
                      {detail.symbol.toUpperCase()}
                    </span>
                    {detail.market_cap_rank && (
                      <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', isDark ? 'bg-brand-500/15 text-brand-400' : 'bg-blue-50 text-blue-700')}>
                        #{detail.market_cap_rank}
                      </span>
                    )}
                  </div>
                  {/* Categories */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {detail.categories.slice(0, 4).map((cat) => (
                      <span key={cat} className={cn('text-xs px-2 py-0.5 rounded-full border', isDark ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500')}>
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Price */}
                <div className="text-right">
                  <p className="text-3xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>
                    {formatCurrency(price)}
                  </p>
                  <div className={cn('flex items-center justify-end gap-1 mt-1', isPositive ? 'text-success-400' : 'text-danger-400')}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="text-sm font-semibold">{formatPercent(change24h)}</span>
                    <span className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>24h</span>
                  </div>
                </div>
              </div>

              {/* 24h Range Bar */}
              <div className="mt-4">
                <div className={cn('flex justify-between text-xs mb-1', isDark ? 'text-gray-500' : 'text-gray-400')}>
                  <span>24h Low: {formatCurrency(md?.low_24h.usd ?? 0)}</span>
                  <span>24h High: {formatCurrency(md?.high_24h.usd ?? 0)}</span>
                </div>
                <div className={cn('h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/8' : 'bg-gray-200')}>
                  {md && md.high_24h.usd > md.low_24h.usd && (
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-danger-500 via-warning-400 to-success-500"
                      style={{ width: `${Math.min(100, ((price - md.low_24h.usd) / (md.high_24h.usd - md.low_24h.usd)) * 100)}%` }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Tab Bar */}
            <div className={cn('flex gap-0 border-b mb-6', isDark ? 'border-white/8' : 'border-gray-200')}>
              {tabs.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer -mb-px',
                    activeTab === id
                      ? 'border-brand-500 text-brand-400'
                      : cn('border-transparent', isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── OVERVIEW TAB ── */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Price Chart */}
                <div className={cn('rounded-2xl border p-4', isDark ? 'bg-white/3 border-white/8' : 'bg-white border-gray-200 shadow-sm')}>
                  <PriceChart
                    chartData={chartData}
                    isLoading={isLoadingChart}
                    range={chartRange}
                    onRangeChange={changeRange}
                    isPositive={isPositive}
                  />
                </div>

                {/* Price change badges */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { label: '1h', value: md?.price_change_percentage_24h },
                    { label: '24h', value: md?.price_change_percentage_24h },
                    { label: '7d', value: md?.price_change_percentage_7d },
                    { label: '14d', value: md?.price_change_percentage_14d },
                    { label: '30d', value: md?.price_change_percentage_30d },
                    { label: '1y', value: md?.price_change_percentage_1y },
                  ].map(({ label, value }) => {
                    const pos = (value ?? 0) >= 0;
                    return (
                      <div key={label} className={cn('rounded-xl p-3 border text-center', isDark ? 'bg-white/3 border-white/8' : 'bg-gray-50 border-gray-200')}>
                        <p className={cn('text-xs mb-1', isDark ? 'text-gray-500' : 'text-gray-400')}>{label}</p>
                        <p className={cn('text-sm font-semibold', pos ? 'text-success-400' : 'text-danger-400')}>
                          {formatPercent(value)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Market Stats Grid */}
                <div>
                  <h2 className={cn('text-xs font-semibold uppercase tracking-wider mb-3', isDark ? 'text-gray-500' : 'text-gray-400')}>Market Data</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <StatCard label="Market Cap" value={formatLargeNumber(md?.market_cap.usd, '$')} isDark={isDark} />
                    <StatCard label="24h Volume" value={formatLargeNumber(md?.total_volume.usd, '$')} isDark={isDark} />
                    <StatCard label="Fully Diluted Val." value={md?.fully_diluted_valuation ? formatLargeNumber(md.fully_diluted_valuation.usd, '$') : '—'} isDark={isDark} />
                    <StatCard label="Circulating Supply" value={`${formatLargeNumber(md?.circulating_supply)} ${detail.symbol.toUpperCase()}`} isDark={isDark} />
                    <StatCard label="Total Supply" value={md?.total_supply ? `${formatLargeNumber(md.total_supply)} ${detail.symbol.toUpperCase()}` : '—'} isDark={isDark} />
                    <StatCard label="Max Supply" value={md?.max_supply ? `${formatLargeNumber(md.max_supply)} ${detail.symbol.toUpperCase()}` : '∞'} isDark={isDark} />
                  </div>
                </div>

                {/* ATH / ATL */}
                <div>
                  <h2 className={cn('text-xs font-semibold uppercase tracking-wider mb-3', isDark ? 'text-gray-500' : 'text-gray-400')}>All-Time Records</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <StatCard
                      label="All-Time High"
                      value={formatCurrency(md?.ath.usd ?? 0)}
                      sub={`${formatPercent(md?.ath_change_percentage.usd)} • ${formatDate(md?.ath_date.usd ?? '')}`}
                      isDark={isDark}
                    />
                    <StatCard
                      label="All-Time Low"
                      value={formatCurrency(md?.atl.usd ?? 0)}
                      sub={`${formatPercent(md?.atl_change_percentage.usd)} • ${formatDate(md?.atl_date.usd ?? '')}`}
                      isDark={isDark}
                    />
                  </div>
                </div>

                {/* Description */}
                {description && (
                  <div className={cn('rounded-2xl border p-4', isDark ? 'bg-white/3 border-white/8' : 'bg-white border-gray-200 shadow-sm')}>
                    <h2 className={cn('text-xs font-semibold uppercase tracking-wider mb-3', isDark ? 'text-gray-500' : 'text-gray-400')}>About {detail.name}</h2>
                    <p className={cn('text-sm leading-relaxed', isDark ? 'text-gray-300' : 'text-gray-600')}>{description}…</p>
                  </div>
                )}

                {/* Links & Social */}
                <div>
                  <h2 className={cn('text-xs font-semibold uppercase tracking-wider mb-3', isDark ? 'text-gray-500' : 'text-gray-400')}>Links</h2>
                  <div className="flex flex-wrap gap-2">
                    {detail.links.homepage[0] && (
                      <a href={detail.links.homepage[0]} target="_blank" rel="noopener noreferrer"
                        className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                          isDark ? 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10' : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200')}>
                        <Globe className="w-3.5 h-3.5" /> Website
                      </a>
                    )}
                    {detail.links.twitter_screen_name && (
                      <a href={`https://twitter.com/${detail.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer"
                        className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                          isDark ? 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10' : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200')}>
                        Twitter
                      </a>
                    )}
                    {detail.links.subreddit_url && (
                      <a href={detail.links.subreddit_url} target="_blank" rel="noopener noreferrer"
                        className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                          isDark ? 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10' : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200')}>
                        Reddit
                      </a>
                    )}
                    {detail.links.repos_url.github[0] && (
                      <a href={detail.links.repos_url.github[0]} target="_blank" rel="noopener noreferrer"
                        className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                          isDark ? 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10' : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200')}>
                        GitHub
                      </a>
                    )}
                    <a href={`https://www.coingecko.com/en/coins/${detail.id}`} target="_blank" rel="noopener noreferrer"
                      className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                        isDark ? 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10' : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200')}>
                      <ExternalLink className="w-3.5 h-3.5" /> CoinGecko
                    </a>
                  </div>
                </div>

                {/* Sentiment */}
                {detail.sentiment_votes_up_percentage != null && (
                  <div className={cn('rounded-2xl border p-4', isDark ? 'bg-white/3 border-white/8' : 'bg-white border-gray-200 shadow-sm')}>
                    <h2 className={cn('text-xs font-semibold uppercase tracking-wider mb-3', isDark ? 'text-gray-500' : 'text-gray-400')}>Community Sentiment</h2>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full overflow-hidden bg-danger-500/30">
                        <div className="h-full bg-success-500 rounded-full" style={{ width: `${detail.sentiment_votes_up_percentage}%` }} />
                      </div>
                      <span className="text-xs text-success-400 font-medium">{detail.sentiment_votes_up_percentage.toFixed(0)}% Bullish</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── MARKETS TAB ── */}
            {activeTab === 'markets' && (
              <div className={cn('rounded-2xl border overflow-hidden', isDark ? 'bg-white/3 border-white/8' : 'bg-white border-gray-200 shadow-sm')}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className={cn('text-xs font-semibold uppercase tracking-wider border-b', isDark ? 'text-gray-500 border-white/8' : 'text-gray-400 border-gray-200')}>
                      <th className="py-3 px-4 text-left">#</th>
                      <th className="py-3 px-4 text-left">Exchange</th>
                      <th className="py-3 px-4 text-left">Pair</th>
                      <th className="py-3 px-4 text-right">Price</th>
                      <th className="py-3 px-4 text-right hidden sm:table-cell">Volume (24h)</th>
                      <th className="py-3 px-4 text-right hidden md:table-cell">Spread</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {detail.tickers.slice(0, 20).map((ticker, i) => (
                      <tr key={i} className={cn('transition-colors', isDark ? 'hover:bg-white/3' : 'hover:bg-gray-50')}>
                        <td className={cn('py-3 px-4', isDark ? 'text-gray-500' : 'text-gray-400')}>{i + 1}</td>
                        <td className="py-3 px-4 font-medium">{ticker.market.name}</td>
                        <td className="py-3 px-4">
                          {ticker.trade_url ? (
                            <a href={ticker.trade_url} target="_blank" rel="noopener noreferrer"
                              className="text-brand-400 hover:underline font-mono text-xs">
                              {ticker.base}/{ticker.target}
                            </a>
                          ) : (
                            <span className="font-mono text-xs">{ticker.base}/{ticker.target}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums">{formatCurrency(ticker.converted_last.usd)}</td>
                        <td className="py-3 px-4 text-right hidden sm:table-cell tabular-nums">{formatLargeNumber(ticker.converted_volume.usd, '$')}</td>
                        <td className={cn('py-3 px-4 text-right hidden md:table-cell', isDark ? 'text-gray-500' : 'text-gray-400')}>
                          {ticker.bid_ask_spread_percentage?.toFixed(3)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── HISTORICAL DATA TAB ── */}
            {activeTab === 'historical' && (
              <div className={cn('rounded-2xl border overflow-hidden', isDark ? 'bg-white/3 border-white/8' : 'bg-white border-gray-200 shadow-sm')}>
                {/* Range selector */}
                <div className={cn('flex items-center gap-1 px-4 py-3 border-b', isDark ? 'border-white/8' : 'border-gray-200')}>
                  {([['7', '7D'], ['30', '1M'], ['90', '3M'], ['365', '1Y'], ['max', 'Max']] as [string, string][]).map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() => changeRange(val as ChartRange)}
                      className={cn(
                        'px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                        chartRange === val ? 'bg-brand-500 text-white' : isDark ? 'text-gray-400 hover:text-white hover:bg-white/8' : 'text-gray-500 hover:bg-gray-100'
                      )}
                    >{lbl}</button>
                  ))}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={cn('text-xs font-semibold uppercase tracking-wider border-b', isDark ? 'text-gray-500 border-white/8' : 'text-gray-400 border-gray-200')}>
                        <th className="py-3 px-4 text-left">Date</th>
                        <th className="py-3 px-4 text-right">Price</th>
                        <th className="py-3 px-4 text-right hidden sm:table-cell">Market Cap</th>
                        <th className="py-3 px-4 text-right hidden md:table-cell">Volume</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {isLoadingChart ? (
                        Array.from({ length: 8 }).map((_, i) => (
                          <tr key={i}>
                            <td className="py-3 px-4"><Skeleton variant="text" width={96} /></td>
                            <td className="py-3 px-4"><div className="flex justify-end"><Skeleton variant="text" width={80} /></div></td>
                            <td className="py-3 px-4 hidden sm:table-cell"><div className="flex justify-end"><Skeleton variant="text" width={96} /></div></td>
                            <td className="py-3 px-4 hidden md:table-cell"><div className="flex justify-end"><Skeleton variant="text" width={80} /></div></td>
                          </tr>
                        ))
                      ) : chartData ? (
                        // Sample every Nth point to get ~30 rows
                        chartData.prices
                          .filter((_, i, arr) => {
                            const step = Math.max(1, Math.floor(arr.length / 30));
                            return i % step === 0;
                          })
                          .map(([ts, price], i) => {
                            const mc = chartData.market_caps[i * Math.max(1, Math.floor(chartData.prices.length / 30))]?.[1];
                            const vol = chartData.total_volumes[i * Math.max(1, Math.floor(chartData.prices.length / 30))]?.[1];
                            return (
                              <tr key={ts} className={cn('transition-colors', isDark ? 'hover:bg-white/3' : 'hover:bg-gray-50')}>
                                <td className={cn('py-3 px-4', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                  {new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </td>
                                <td className="py-3 px-4 text-right font-semibold tabular-nums">{formatCurrency(price)}</td>
                                <td className="py-3 px-4 text-right hidden sm:table-cell tabular-nums">{mc ? formatLargeNumber(mc, '$') : '—'}</td>
                                <td className={cn('py-3 px-4 text-right hidden md:table-cell tabular-nums', isDark ? 'text-gray-400' : 'text-gray-500')}>{vol ? formatLargeNumber(vol, '$') : '—'}</td>
                              </tr>
                            );
                          })
                      ) : (
                        <tr><td colSpan={4} className="py-12 text-center text-gray-500">No data available</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
