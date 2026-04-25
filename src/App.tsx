import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useToast } from './hooks/useToast';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/organisms/Header';
import { PageFallback } from './components/atoms/PageFallback';
import { ErrorBoundary } from './components/atoms/ErrorBoundary';
import { ToastContainer } from './components/atoms/Toast';
import { cn } from './utils/cn';

// pages
import Dashboard from './pages/Dashboard';
const CoinDetailPage = lazy(() => import('./components/templates/CoinDetailPage').then(m => ({ default: m.CoinDetailPage })));

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const { toasts, removeToast } = useToast();

  return (
    <div className={cn('min-h-screen transition-colors duration-300', isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900')}>
      <Header isDark={isDark} toggleTheme={toggleTheme} />

      <main>
        <ErrorBoundary>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Dashboard isDark={isDark} />} />
              <Route path="/coin/:id" element={<CoinDetailPage isDark={isDark} />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
