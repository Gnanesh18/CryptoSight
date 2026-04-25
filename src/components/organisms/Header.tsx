import { Sun, Moon, BarChart3 } from 'lucide-react';
import { SearchBar } from '../molecules/SearchBar';
import { Button } from '../atoms/Button';
import { cn } from '../../utils/cn';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function Header({ isDark, toggleTheme }: HeaderProps) {
  return (
    <header className={cn(
      'sticky top-0 z-30 border-b backdrop-blur-md transition-colors duration-300',
      isDark ? 'bg-gray-950/80 border-white/8' : 'bg-white/80 border-gray-200'
    )}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-16 gap-2 sm:gap-3">
          {/* logo */}
          <a href="/" className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0 no-underline">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xs sm:text-base font-bold leading-none" style={{ fontFamily: 'var(--font-display)' }}>CryptoSight</h1>
              <p className={cn('text-[10px] sm:text-xs leading-none mt-0.5 hidden sm:block', isDark ? 'text-gray-500' : 'text-gray-400')}>Market Intelligence</p>
            </div>
          </a>

          {/* search bar */}
          <div className="flex-1 max-w-full sm:max-w-md ml-1 sm:ml-2">
            <SearchBar isDark={isDark} />
          </div>

          {/* theme toggle */}
          <div className="flex items-center flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label={isDark ? 'Light mode' : 'Dark mode'}
              className={cn(isDark ? '' : 'border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100')}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
