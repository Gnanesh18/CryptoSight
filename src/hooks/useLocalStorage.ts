import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * A typed, SSR-safe localStorage hook.
 * Reads from localStorage on mount, writes on update.
 * Falls back to `initialValue` if key doesn't exist or JSON parsing fails.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Keep initialValue stable via ref to avoid dependency issues
  const initialValueRef = useRef(initialValue);

  // SSR guard — localStorage is not available in server environments
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValueRef.current;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValueRef.current;
    } catch {
      return initialValueRef.current;
    }
  }, [key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback(
    (value: T) => {
      if (typeof window === 'undefined') return;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        setStoredValue(value);
      } catch {
        console.warn(`useLocalStorage: Failed to set key "${key}"`);
      }
    },
    [key]
  );

  // Sync with storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue) as T);
        } catch {
          // ignore parse errors from other tabs
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
