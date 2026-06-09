import { NextRequest, NextResponse } from 'next/server'
import colleges from '@/data/colleges.json'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  // called as: /api/colleges/compare?ids=iit-madras,iisc-bangalore,iit-delhi
  const idsParam = searchParams.get('ids')

  if (!idsParam) {
    return NextResponse.json(
      { error: 'ids query param is required' },
      { status: 400 }
    )
  }

  const ids = idsParam.split(',').map(id => id.trim()).slice(0, 5) // max 5

  const result = ids
    .map(id => colleges.find(c => c.id === id || c.slug === id))
    .filter(Boolean)

  if (result.length < 2) {
    return NextResponse.json(
      { error: 'At least 2 valid college IDs are required to compare' },
      { status: 400 }
    )
  }

  return NextResponse.json({
    data: result,
    meta: { count: result.length }
  })
}