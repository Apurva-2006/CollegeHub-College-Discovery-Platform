import { NextRequest, NextResponse } from 'next/server'
import colleges from '@/data/colleges.json'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const college = colleges.find(
    c => c.id === id || c.slug === id
  )

  if (!college) {
    return NextResponse.json(
      { error: 'College not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: college })
}