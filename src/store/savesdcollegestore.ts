import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface College {
  id: string
  name: string
  shortName: string        // add this — used in compare tray chips (Image 2: "IIM-A", "IISc")
  location: string
  overallRating: number    // match exact JSON field name
  startingFee: number      // match exact JSON field name
  nirfRank: number         // add this — shown on cards
  logo: string             // add this — shown in saved list
}

interface SavedCollegesStore {
  savedColleges: College[]
  saveCollege: (college: College) => void
  removeCollege: (id: string) => void
  isSaved: (id: string) => boolean
  clearAll: () => void
}

export const useSavedCollegesStore = create<SavedCollegesStore>()(
  persist(
    (set, get) => ({
      savedColleges: [],

      saveCollege: (college) => {
        const already = get().savedColleges.find(c => c.id === college.id)
        if (already) return  // prevent duplicates
        set(state => ({ savedColleges: [...state.savedColleges, college] }))
      },

      removeCollege: (id) =>
        set(state => ({
          savedColleges: state.savedColleges.filter(c => c.id !== id)
        })),

      isSaved: (id) => !!get().savedColleges.find(c => c.id === id),

      clearAll: () => set({ savedColleges: [] })
    }),
    {
      name: 'saved-colleges', // localStorage key
    }
  )
)