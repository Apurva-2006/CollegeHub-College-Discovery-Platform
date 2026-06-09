import { NextRequest, NextResponse } from 'next/server'
import courses from '@/data/courses.json'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const collegeId   = searchParams.get('collegeId')    // primary filter — used by detail page
  const degreeLevel = searchParams.get('degreeLevel')  // 'Undergraduate' | 'Postgraduate'
  const stream      = searchParams.get('stream')       // 'Engineering' | 'Management' etc.
  const maxFee      = searchParams.get('maxFee')       // filters on totalFee
  const featured    = searchParams.get('featured')     // 'true' — for overview tab highlights

  let result = [...courses]

  if (collegeId)   result = result.filter(c => c.collegeId === collegeId)
  if (degreeLevel) result = result.filter(c => c.degreeLevel === degreeLevel)
  if (stream)      result = result.filter(c => c.stream === stream)
  if (maxFee)      result = result.filter(c => c.totalFee <= parseInt(maxFee))
  if (featured === 'true') result = result.filter(c => c.featured)

  return NextResponse.json({
    data: result,
    meta: { total: result.length }
  })
}