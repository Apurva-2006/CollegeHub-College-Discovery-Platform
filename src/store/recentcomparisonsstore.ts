import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RecentComparison {
  id: string
  collegeIds: string[]
  viewedAt: string
}

interface RecentComparisonsStore {
  recentComparisons: RecentComparison[]
  addRecentComparison: (collegeIds: string[]) => void
  clearRecentComparisons: () => void
}

export const useRecentComparisonsStore = create<RecentComparisonsStore>()(
  persist(
    (set) => ({
      recentComparisons: [],

      addRecentComparison: (collegeIds) =>
        set((state) => {
          const sorted = [...collegeIds].sort().join(',')
          const filtered = state.recentComparisons.filter(
            (r) => [...r.collegeIds].sort().join(',') !== sorted
          )
          return {
            recentComparisons: [
              { id: crypto.randomUUID(), collegeIds, viewedAt: new Date().toISOString() },
              ...filtered,
            ].slice(0, 10),
          }
        }),

      clearRecentComparisons: () => set({ recentComparisons: [] }),
    }),
    { name: 'recent-comparisons' }
  )
)