import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ComparisonSet {
  id: string           // unique ID for this comparison group
  label: string        // e.g. "Top Engineering Colleges"
  collegeIds: string[] // 2–5 college IDs
  savedAt: string      // ISO date string
}

interface SavedComparisonsStore {
  comparisons: ComparisonSet[]
  saveComparison: (label: string, collegeIds: string[]) => void
  removeComparison: (id: string) => void
  clearAll: () => void
}

export const useSavedComparisonsStore = create<SavedComparisonsStore>()(
  persist(
    (set) => ({
      comparisons: [],

      saveComparison: (label, collegeIds) =>
        set(state => ({
          comparisons: [
            ...state.comparisons,
            {
              id: crypto.randomUUID(),
              label,
              collegeIds,
              savedAt: new Date().toISOString()
            }
          ]
        })),

      removeComparison: (id) =>
        set(state => ({
          comparisons: state.comparisons.filter(c => c.id !== id)
        })),

      clearAll: () => set({ comparisons: [] })
    }),
    {
      name: 'saved-comparisons', // localStorage key
    }
  )
)