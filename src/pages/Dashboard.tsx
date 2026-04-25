import { useState, useCallback } from 'react';
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
import { useNavigate, useOutletContext } from 'react-router-dom';

const FILTER_TABS: { id: Tab; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'All', Icon: LayoutGrid },
  { id: 'gainers', label: 'Top Gainers', Icon: TrendingUp },
  { id: 'losers', label: 'Top Losers', Icon: TrendingDown },
  { id: 'trending', label: 'Trending', Icon: Flame },
  { id: 'watchlist', label: 'Watchlist', Icon: Star },
];

interface DashboardProps {
  isDark: boolean;
  searchQuery: string;
}

export default function Dashboard({ isDark, searchQuery }: DashboardProps) {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const { coins, isLoading, isRefreshing, error, lastUpdated, refetch, secondsUntilRefresh } = useMarketData(1);
  const { data: globalData, isLoading: isLoadingGlobal } = useGlobalData();
  const { data: trendingData, isLoading: isLoadingTrending } = useTrending();

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  const handleCoinSelect = useCallback((id: string) => {
    navigate(`/coin/${id}`);
  }, [navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in">
      {/* Global Stats Banner */}
      <GlobalStatsBar data={globalData} isLoading={isLoadingGlobal} isDark={isDark} />

      {/* Trending + Top Gainers panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <TrendingPanel data={trendingData} isLoading={isLoadingTrending} isDark={isDark} onCoinSelect={handleCoinSelect} />
        <TopGainersPanel coins={coins} isLoading={isLoading} isDark={isDark} onCoinSelect={handleCoinSelect} />
      </div>

      {/* Filter Tabs + last updated */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
        <div
          className={cn('flex rounded-xl p-1 gap-1 border overflow-x-auto', isDark ? 'bg-white/5 border-white/8' : 'bg-gray-100 border-gray-200')}
          role="tablist"
          aria-label="Market filter tabs"
        >
          {FILTER_TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => handleTabChange(id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap',
                'transition-all duration-150 cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
                activeTab === id
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-white'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {lastUpdated && (
          <p className={cn('text-xs flex-shrink-0', isDark ? 'text-gray-500' : 'text-gray-400')}>
            Updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Market Table */}
      <div className={cn('rounded-2xl border transition-colors duration-300 min-h-[500px]', isDark ? 'bg-white/3 border-white/8' : 'bg-white border-gray-200 shadow-sm')}>
        <MarketTable
          coins={coins}
          isLoading={isLoading}
          error={error}
          searchQuery={searchQuery}
          onCoinSelect={(coin) => handleCoinSelect(coin.id)}
          onRetry={refetch}
          activeTab={activeTab}
        />
      </div>

      {/* Mobile refresh countdown */}
      <div className="sm:hidden flex justify-center mt-4">
        <RefreshCountdown secondsRemaining={secondsUntilRefresh} totalSeconds={60} isRefreshing={isRefreshing} />
      </div>
    </div>
  );
}
