import { NextRequest, NextResponse } from 'next/server'
import reviews from '@/data/reviews.json'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const review = reviews.find(r => r.id === id)

  if (!review) {
    return NextResponse.json(
      { error: 'Review not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: review })
}