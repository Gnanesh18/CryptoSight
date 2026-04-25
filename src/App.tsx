import { useState, useCallback, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sun, Moon, BarChart3, Search, X } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SearchBar } from './components/molecules/SearchBar';
import { Button } from './components/atoms/Button';
import { ErrorBoundary } from './components/atoms/ErrorBoundary';
import { Skeleton } from './components/atoms/Skeleton';
import { cn } from './utils/cn';
import './index.css';

// Eager load Dashboard
import Dashboard from './pages/Dashboard';

// Lazy load Coin Detail Page for better performance
const CoinDetailPage = lazy(() => import('./components/templates/CoinDetailPage').then(m => ({ default: m.CoinDetailPage })));

function getInitialTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function PageFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Skeleton variant="circular" width={48} height={48} />
      <Skeleton variant="text" width={120} />
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('crypto-theme', getInitialTheme());
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const isDark = theme === 'dark';
  const toggleTheme = useCallback(() => setTheme(isDark ? 'light' : 'dark'), [isDark, setTheme]);

  // Make sure the HTML tag also gets the dark class if needed by Tailwind
  if (typeof document !== 'undefined') {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }

  return (
    <div className={cn('min-h-screen transition-colors duration-300', isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900')}>
      {/* ── Header ── */}
      <header className={cn(
        'sticky top-0 z-30 border-b backdrop-blur-md transition-colors duration-300',
        isDark ? 'bg-gray-950/80 border-white/8' : 'bg-white/80 border-gray-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold leading-none" style={{ fontFamily: 'var(--font-display)' }}>CryptoSight</h1>
                <p className={cn('text-xs leading-none mt-0.5', isDark ? 'text-gray-500' : 'text-gray-400')}>Market Intelligence</p>
              </div>
            </div>

            {/* Search bar (expandable) */}
            <div className={cn('flex-1 max-w-md transition-all', showSearch ? 'block' : 'hidden sm:block')}>
              <SearchBar value={searchQuery} onChange={setSearchQuery} className={cn(isDark ? '' : 'bg-white border-gray-200 text-gray-900')} />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setShowSearch((s) => !s)} className={cn('sm:hidden p-2 rounded-lg transition-colors', isDark ? 'text-gray-400 hover:text-white hover:bg-white/8' : 'text-gray-500 hover:bg-gray-100')}>
                {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              </button>

              <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label={isDark ? 'Light mode' : 'Dark mode'}
                className={cn(isDark ? '' : 'border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100')}>
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Routing ── */}
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Dashboard isDark={isDark} searchQuery={searchQuery} />} />
            <Route path="/coin/:id" element={<CoinDetailPage isDark={isDark} />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
