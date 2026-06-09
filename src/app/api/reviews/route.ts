import { NextRequest, NextResponse } from 'next/server'
import reviews from '@/data/reviews.json'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const collegeId = searchParams.get('collegeId')   // detail page: filter by college
  const category  = searchParams.get('category')    // 'Infrastructure' | 'Faculty' | 'Placements' | 'Campus Life' | 'Academics' | 'Hostel' | 'Administration'
  const verified  = searchParams.get('verified')    // 'true' — only verified reviews
  const featured  = searchParams.get('featured')    // 'true' — homepage "What Students Say" section
  const minRating = searchParams.get('minRating')
  const sortBy    = searchParams.get('sortBy')      // 'rating' | 'helpfulCount' | 'reviewDate'
  const order     = searchParams.get('order') || 'desc'
  const limit     = parseInt(searchParams.get('limit') || '50')

  let result = [...reviews]

  // --- Filters ---
  if (collegeId)       result = result.filter(r => r.collegeId === collegeId)
  if (category)        result = result.filter(r => r.category === category)
  if (verified === 'true') result = result.filter(r => r.verified === true)
  if (minRating)       result = result.filter(r => r.rating >= parseFloat(minRating))

  // featured mode: pull high-rated verified reviews spread across colleges
  // used by homepage "What Students Say" section (Image 2)
  if (featured === 'true') {
    result = result
      .filter(r => r.verified && r.rating >= 4.5 && r.helpfulCount >= 10)
      .sort((a, b) => b.helpfulCount - a.helpfulCount)
      .slice(0, limit)

    return NextResponse.json({ data: result, meta: { total: result.length } })
  }

  // --- Sorting ---
  if (sortBy) {
    result.sort((a, b) => {
      const aVal = (a as any)[sortBy] ?? 0
      const bVal = (b as any)[sortBy] ?? 0
      if (typeof aVal === 'string') {
        return order === 'desc'
          ? bVal.localeCompare(aVal)
          : aVal.localeCompare(bVal)
      }
      return order === 'desc' ? bVal - aVal : aVal - bVal
    })
  }

  const paginated = result.slice(0, limit)

  // --- Category summary (for average rating per category badge) ---
  // used by the detail page to show avg rating per category tab if needed
  const categorySummary = Object.entries(
    result.reduce((acc, r) => {
      if (!acc[r.category]) acc[r.category] = { total: 0, count: 0 }
      acc[r.category].total += r.rating
      acc[r.category].count += 1
      return acc
    }, {} as Record<string, { total: number; count: number }>)
  ).map(([category, { total, count }]) => ({
    category,
    avgRating: parseFloat((total / count).toFixed(1)),
    count
  }))

  return NextResponse.json({
    data: paginated,
    meta: { total: result.length },
    categorySummary
  })
}