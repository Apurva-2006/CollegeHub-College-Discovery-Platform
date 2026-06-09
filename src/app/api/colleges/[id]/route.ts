import { NextRequest, NextResponse } from 'next/server'
import colleges from '@/data/colleges.json'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  // supports both slug and id since they're the same in your JSON
  const college = colleges.find(
    c => c.id === params.id || c.slug === params.id
  )

  if (!college) {
    return NextResponse.json(
      { error: 'College not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: college })
}