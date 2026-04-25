import { useCallback, useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sun, Moon, BarChart3 } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useToast } from './hooks/useToast';
import { SearchBar } from './components/molecules/SearchBar';
import { Button } from './components/atoms/Button';
import { ErrorBoundary } from './components/atoms/ErrorBoundary';
import { Skeleton } from './components/atoms/Skeleton';
import { ToastContainer } from './components/atoms/Toast';
import { cn } from './utils/cn';

// Eager load Dashboard
import Dashboard from './pages/Dashboard';

// Lazy load Coin Detail Page
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
  const { toasts, removeToast } = useToast();

  const isDark = theme === 'dark';
  const toggleTheme = useCallback(() => setTheme(isDark ? 'light' : 'dark'), [isDark, setTheme]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <div className={cn('min-h-screen transition-colors duration-300', isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900')}>
      {/* ── Header ── */}
      <header className={cn(
        'sticky top-0 z-30 border-b backdrop-blur-md transition-colors duration-300',
        isDark ? 'bg-gray-950/80 border-white/8' : 'bg-white/80 border-gray-200'
      )}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 no-underline">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold leading-none" style={{ fontFamily: 'var(--font-display)' }}>CryptoSight</h1>
                <p className={cn('text-[10px] sm:text-xs leading-none mt-0.5 hidden sm:block', isDark ? 'text-gray-500' : 'text-gray-400')}>Market Intelligence</p>
              </div>
            </a>

            {/* Search bar with dropdown — self-contained */}
            <div className="flex-1 max-w-sm sm:max-w-md">
              <SearchBar isDark={isDark} />
            </div>

            {/* Theme toggle */}
            <div className="flex items-center flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label={isDark ? 'Light mode' : 'Dark mode'}
                className={cn(isDark ? '' : 'border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100')}>
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Dashboard isDark={isDark} />} />
            <Route path="/coin/:id" element={<CoinDetailPage isDark={isDark} />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
