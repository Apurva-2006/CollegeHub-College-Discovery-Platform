import { NextRequest, NextResponse } from 'next/server'
import colleges from '@/data/colleges.json'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const search      = searchParams.get('search')?.toLowerCase()
  const state       = searchParams.get('state')
  const city        = searchParams.get('city')
  const ownership   = searchParams.get('ownership')       // 'Government' | 'Private' | 'Deemed'
  const collegeType = searchParams.get('collegeType')     // 'Engineering' | 'Management' | 'Science' | 'Arts'
  const minRating   = searchParams.get('minRating')
  const maxFee      = searchParams.get('maxFee')          // filters on startingFee
  const minPlacement= searchParams.get('minPlacement')    // placementPercentage
  const maxNirf     = searchParams.get('maxNirf')         // nirfRank <= this value
  const featured    = searchParams.get('featured')        // 'true'
  const topPlacement= searchParams.get('topPlacement')    // 'true'
  const topRated    = searchParams.get('topRated')        // 'true'
  const sortBy      = searchParams.get('sortBy')          // 'nirfRank' | 'overallRating' | 'averagePackage' | 'startingFee'
  const order       = searchParams.get('order') || 'asc' // 'asc' | 'desc'
  const page        = parseInt(searchParams.get('page')  || '1')
  const limit       = parseInt(searchParams.get('limit') || '12')

  let result = [...colleges]

  // --- Filters ---
  if (search) {
    result = result.filter(c =>
      c.name.toLowerCase().includes(search) ||
      c.shortName.toLowerCase().includes(search) ||
      c.city.toLowerCase().includes(search) ||
      c.state.toLowerCase().includes(search)
    )
  }
  if (state)        result = result.filter(c => c.state === state)
  if (city)         result = result.filter(c => c.city === city)
  if (ownership)    result = result.filter(c => c.ownership === ownership)
  if (collegeType)  result = result.filter(c => c.collegeType === collegeType)
  if (minRating)    result = result.filter(c => c.overallRating >= parseFloat(minRating))
  if (maxFee)       result = result.filter(c => c.startingFee <= parseInt(maxFee))
  if (minPlacement) result = result.filter(c => c.placementPercentage >= parseInt(minPlacement))
  if (maxNirf)      result = result.filter(c => c.nirfRank <= parseInt(maxNirf))
  if (featured === 'true')     result = result.filter(c => c.featured)
  if (topPlacement === 'true') result = result.filter(c => c.topPlacement)
  if (topRated === 'true')     result = result.filter(c => c.topRated)

  // --- Sorting ---
  if (sortBy) {
    result.sort((a, b) => {
      const aVal = (a as any)[sortBy] ?? 0
      const bVal = (b as any)[sortBy] ?? 0
      return order === 'desc' ? bVal - aVal : aVal - bVal
    })
  }

  // --- Pagination ---
  const total      = result.length
  const totalPages = Math.ceil(total / limit)
  const paginated  = result.slice((page - 1) * limit, page * limit)

  // --- Filter options (for sidebar dropdowns) ---
  const allStates = [...new Set(colleges.map(c => c.state))].sort()
  const allCities = [...new Set(colleges.map(c => c.city))].sort()

  return NextResponse.json({
    data: paginated,
    meta: { total, page, limit, totalPages },
    filters: { states: allStates, cities: allCities }
  })
}