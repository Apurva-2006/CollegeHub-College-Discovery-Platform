export interface College {
  id: string
  slug: string
  name: string
  shortName: string
  website: string
  collegeType: string
  logo: string
  city: string
  state: string
  country: string
  location: string
  ownership: 'Government' | 'Private' | 'Deemed'
  accreditation: string[]
  establishedYear: number
  campusArea: number
  campusAreaUnit: string
  description: string
  nirfRank: number | null
  stateRank: number | null
  qsRank: number | null
  overallRating: number
  reviewCount: number
  averagePackage: number
  highestPackage: number
  placementPercentage: number
  startingFee: number
  highestCourseFee: number
  popularCourses: string[]
  topRecruiters: string[]
  examsAccepted: string[]
  categories: string[]
  featured: boolean
  topPlacement: boolean
  topRated: boolean
}

export interface CollegeFilters {
  search: string
  states: string[]
  cities: string[]
  feeRange: string[]
  ratings: string[]
  avgPackage: string[]
  highestPackage: string[]
  placementPct: string[]
  nirfRange: string[]
  courses: string[]
  ownership: string[]
  sortBy: string
}