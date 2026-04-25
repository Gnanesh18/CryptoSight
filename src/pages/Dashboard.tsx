import { useState, useCallback, useRef, useEffect } from 'react';
import { LayoutGrid, Star, TrendingUp, TrendingDown, Flame } from 'lucide-react';
import type { Tab } from '../types/coin';
import { useMarketData } from '../hooks/useMarketData';
import { useGlobalData } from '../hooks/useGlobalData';
import { useTrending } from '../hooks/useTrending';
import { MarketTable } from '../components/organisms/MarketTable';
import { GlobalStatsBar } from '../components/organisms/GlobalStatsBar';
import { TrendingPanel } from '../components/organisms/TrendingPanel';
import { TopGainersPanel } from '../components/organisms/TopGainersPanel';
import { RefreshCountdown } from '../components/molecules/RefreshCountdown';
import { cn } from '../utils/cn';
import { useNavigate } from 'react-router-dom';

const FILTER_TABS: { id: Tab; label: string; shortLabel: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'All Coins', shortLabel: 'All', Icon: LayoutGrid },
  { id: 'gainers', label: 'Top Gainers', shortLabel: 'Gainers', Icon: TrendingUp },
  { id: 'losers', label: 'Top Losers', shortLabel: 'Losers', Icon: TrendingDown },
  { id: 'trending', label: 'Trending', shortLabel: 'Trend', Icon: Flame },
  { id: 'watchlist', label: 'Watchlist', shortLabel: 'Watch', Icon: Star },
];

interface DashboardProps {
  isDark: boolean;
}

export default function Dashboard({ isDark }: DashboardProps) {
  const navigate = useNavigate();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const { coins, isLoading, isRefreshing, error, lastUpdated, refetch } = useMarketData(1);
  const { data: globalData, isLoading: isLoadingGlobal } = useGlobalData();
  const { data: trendingData, isLoading: isLoadingTrending } = useTrending();

  // check for tab overflow to show scroll hint
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const check = () => setShowScrollHint(el.scrollWidth > el.clientWidth + 4);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const tableRef = useRef<HTMLDivElement>(null);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    // scroll to table
    setTimeout(() => tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
  }, []);

  const handleCoinSelect = useCallback((id: string) => navigate(`/coin/${id}`), [navigate]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pb-20 sm:pb-8 animate-fade-in">
      {/* stats bar */}
      <div className="relative">
        <GlobalStatsBar data={globalData} isLoading={isLoadingGlobal} isDark={isDark} />
      </div>

      {/* trending stuff */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <TrendingPanel data={trendingData} isLoading={isLoadingTrending} isDark={isDark} onCoinSelect={handleCoinSelect} onViewMore={() => handleTabChange('trending')} />
        <TopGainersPanel coins={coins} isLoading={isLoading} isDark={isDark} onCoinSelect={handleCoinSelect} onViewMore={() => handleTabChange('gainers')} />
      </div>

      {/* filter tabs */}
      <div className="flex items-center gap-2 sm:gap-3 justify-between mb-3 sm:mb-4">
        <div className={cn('relative flex-1 min-w-0', showScrollHint && 'scroll-fade')}>
          <div
            ref={tabsRef}
            className={cn(
              'scroll-container flex rounded-xl p-1 gap-1 border',
              isDark ? 'bg-white/5 border-white/8' : 'bg-gray-100 border-gray-200'
            )}
            role="tablist"
          >
            {FILTER_TABS.map(({ id, shortLabel, label, Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => handleTabChange(id)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150',
                  activeTab === id
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                    : isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-white'
                )}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="sm:hidden">{shortLabel}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <RefreshCountdown isRefreshing={isRefreshing} isDark={isDark} />
          {lastUpdated && (
            <p className={cn('text-xs flex-shrink-0 hidden lg:block', isDark ? 'text-gray-500' : 'text-gray-400')}>
              Last update: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* actual table */}
      <div
        ref={tableRef}
        className={cn(
          'rounded-xl sm:rounded-2xl border transition-all duration-300 min-h-[400px] sm:min-h-[500px] scroll-mt-20',
          isDark ? 'bg-white/3 border-white/8' : 'bg-white border-gray-200 shadow-sm'
        )}
      >
        <MarketTable
          coins={coins}
          isLoading={isLoading}
          error={error}
          onCoinSelect={(coin) => handleCoinSelect(coin.id)}
          onRetry={refetch}
          activeTab={activeTab}
          isDark={isDark}
        />
      </div>
    </div>
  );
}
