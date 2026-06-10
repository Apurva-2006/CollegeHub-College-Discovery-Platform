import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CompareTrayStore {
  compareIds: string[]
  toggle: (id: string) => void
  isInTray: (id: string) => boolean
  clear: () => void
}

export const useCompareTrayStore = create<CompareTrayStore>()(
  persist(
    (set, get) => ({
      compareIds: [],

      toggle: (id) => {
        const { compareIds } = get()
        if (compareIds.includes(id)) {
          set({ compareIds: compareIds.filter((c) => c !== id) })
        } else if (compareIds.length < 5) {
          set({ compareIds: [...compareIds, id] })
        }
      },

      isInTray: (id) => get().compareIds.includes(id),

      clear: () => set({ compareIds: [] }),
    }),
    { name: 'compare-tray' }
  )
)