import { NextRequest, NextResponse } from 'next/server'
import reviews from '@/data/reviews.json'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const review = reviews.find(r => r.id === params.id)

  if (!review) {
    return NextResponse.json(
      { error: 'Review not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: review })
}