import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SavedCollegesStore {
  savedIds: string[]
  toggle: (id: string) => void
  isSaved: (id: string) => boolean
  clearAll: () => void
}

export const useSavedCollegesStore = create<SavedCollegesStore>()(
  persist(
    (set, get) => ({
      savedIds: [],

      toggle: (id) =>
        set((state) => ({
          savedIds: state.savedIds.includes(id)
            ? state.savedIds.filter((s) => s !== id)
            : [...state.savedIds, id],
        })),

      isSaved: (id) => get().savedIds.includes(id),

      clearAll: () => set({ savedIds: [] }),
    }),
    { name: 'saved-colleges' }
  )
)