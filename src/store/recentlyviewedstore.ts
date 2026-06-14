import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RecentlyViewedStore {
  viewedIds: string[]
  addViewedId: (id: string) => void
  clearHistory: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      viewedIds: [],

      addViewedId: (id) =>
        set((state) => {
          // Remove if it already exists to avoid duplicates and move to the front
          const filtered = state.viewedIds.filter((vId) => vId !== id)
          // Keep a rolling history limit of the last 12 viewed profiles
          return {
            viewedIds: [id, ...filtered].slice(0, 12),
          }
        }),

      clearHistory: () => set({ viewedIds: [] }),
    }),
    { name: 'recently-viewed' }
  )
)