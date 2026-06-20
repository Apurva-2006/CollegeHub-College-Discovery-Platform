import { NextRequest, NextResponse } from 'next/server'
import reviews from '@/data/reviews.json'

type SortableReviewKey = 'rating' | 'helpfulCount' | 'reviewDate'

function isSortableReviewKey(key: string): key is SortableReviewKey {
  return key === 'rating' || key === 'helpfulCount' || key === 'reviewDate'
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const collegeId = searchParams.get('collegeId')
  const category  = searchParams.get('category')
  const verified  = searchParams.get('verified')
  const featured  = searchParams.get('featured')
  const minRating = searchParams.get('minRating')
  const sortBy    = searchParams.get('sortBy')
  const order     = searchParams.get('order') || 'desc'
  const limit     = parseInt(searchParams.get('limit') || '50')

  let result = [...reviews]

  if (collegeId)        result = result.filter(r => r.collegeId === collegeId)
  if (category)         result = result.filter(r => r.category === category)
  if (verified === 'true') result = result.filter(r => r.verified === true)
  if (minRating)        result = result.filter(r => r.rating >= parseFloat(minRating))

  if (featured === 'true') {
    result = result
      .filter(r => r.verified && r.rating >= 4.5 && r.helpfulCount >= 10)
      .sort((a, b) => b.helpfulCount - a.helpfulCount)
      .slice(0, limit)
    return NextResponse.json({ data: result, meta: { total: result.length } })
  }

  if (sortBy && isSortableReviewKey(sortBy)) {
    const key = sortBy
    result.sort((a, b) => {
      const aVal = a[key] ?? 0
      const bVal = b[key] ?? 0
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return order === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal)
      }
      return order === 'desc'
        ? (bVal as number) - (aVal as number)
        : (aVal as number) - (bVal as number)
    })
  }

  const paginated = result.slice(0, limit)

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