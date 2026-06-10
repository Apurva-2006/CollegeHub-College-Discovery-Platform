export const FEE_RANGE_OPTIONS = [
  { label: 'Below ₹1L',    value: 'below-1l' },
  { label: '₹1L – ₹5L',   value: '1l-5l' },
  { label: '₹5L – ₹10L',  value: '5l-10l' },
  { label: 'Above ₹10L',  value: 'above-10l' },
]

export const RATING_OPTIONS = [
  { label: '4.5+', value: '4.5' },
  { label: '4+',   value: '4' },
  { label: '3+',   value: '3' },
]

export const AVG_PACKAGE_OPTIONS = [
  { label: 'Above ₹20 LPA', value: 'above-20' },
  { label: 'Above ₹10 LPA', value: 'above-10' },
  { label: 'Above ₹5 LPA',  value: 'above-5' },
]

export const HIGHEST_PACKAGE_OPTIONS = [
  { label: 'Above ₹1 Cr',   value: 'above-1cr' },
  { label: 'Above ₹50 LPA', value: 'above-50' },
  { label: 'Above ₹25 LPA', value: 'above-25' },
]

export const PLACEMENT_PCT_OPTIONS = [
  { label: 'Above 90%', value: 'above-90' },
  { label: 'Above 80%', value: 'above-80' },
  { label: 'Above 60%', value: 'above-60' },
]

export const NIRF_RANGE_OPTIONS = [
  { label: 'Top 10',  value: 'top-10' },
  { label: 'Top 50',  value: 'top-50' },
  { label: 'Top 100', value: 'top-100' },
]

export const COURSE_OPTIONS = [
  'B.Tech', 'M.Tech', 'MBA', 'BBA', 'BCA', 'MBBS', 'B.Com',
]

export const OWNERSHIP_OPTIONS = [
  { label: 'Government', value: 'Government' },
  { label: 'Private',    value: 'Private' },
  { label: 'Deemed',     value: 'Deemed' },
]

export const SORT_OPTIONS = [
  { label: 'Best NIRF rank',    value: 'nirfRank' },
  { label: 'Highest rating',    value: 'rating' },
  { label: 'Best avg package',  value: 'avgPackage' },
  { label: 'Highest package',   value: 'highestPackage' },
  { label: 'Lowest fees',       value: 'fees' },
  { label: 'Best placement %',  value: 'placement' },
]

export const DETAIL_TABS = [
  { label: 'Overview',   value: 'overview' },
  { label: 'Courses',    value: 'courses' },
  { label: 'Placements', value: 'placements' },
  { label: 'Reviews',    value: 'reviews' },
] as const

export type DetailTab = typeof DETAIL_TABS[number]['value']