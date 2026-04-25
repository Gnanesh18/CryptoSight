import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

function getInitialTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('crypto-theme', getInitialTheme());
  
  const isDark = theme === 'dark';
  
  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
  }, [isDark, setTheme]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return { theme, isDark, toggleTheme };
}
