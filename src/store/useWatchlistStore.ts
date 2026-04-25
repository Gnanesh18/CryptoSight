import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WatchlistStore {
  watchedIds: string[];
  toggle: (id: string) => void;
  isWatched: (id: string) => boolean;
}

/**
 * Watchlist store — persisted to localStorage via zustand/middleware.
 * Uses a string[] (JSON-serializable) instead of Set for persistence compatibility.
 */
export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      watchedIds: [],

      toggle: (id: string) => {
        const current = get().watchedIds;
        const isIn = current.includes(id);
        set({
          watchedIds: isIn
            ? current.filter((wid) => wid !== id)
            : [...current, id],
        });
      },

      isWatched: (id: string) => get().watchedIds.includes(id),
    }),
    {
      name: 'crypto-watchlist', // localStorage key
    }
  )
);
