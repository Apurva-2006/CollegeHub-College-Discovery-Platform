import { create } from 'zustand'

interface College {
  id: string
  name: string
}

interface CompareTrayStore {
  tray: College[]
  addToTray: (college: College) => void
  removeFromTray: (id: string) => void
  clearTray: () => void
  isInTray: (id: string) => boolean
}

export const useCompareTrayStore = create<CompareTrayStore>()((set, get) => ({
  tray: [],

  addToTray: (college) => {
    if (get().tray.length >= 5) return   // max 5
    if (get().isInTray(college.id)) return // no duplicates
    set(state => ({ tray: [...state.tray, college] }))
  },

  removeFromTray: (id) =>
    set(state => ({ tray: state.tray.filter(c => c.id !== id) })),

  clearTray: () => set({ tray: [] }),

  isInTray: (id) => !!get().tray.find(c => c.id === id)
}))