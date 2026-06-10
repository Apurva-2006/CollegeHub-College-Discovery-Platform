import { College } from '@/types'

export async function getAllColleges(): Promise<College[]> {
  const res = await fetch('/api/colleges', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch colleges')
  const json = await res.json()
  return json.data
}

export async function getCollegeBySlug(slug: string): Promise<College | null> {
  const res = await fetch(`/api/colleges/${slug}`, { cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch college')
  const json = await res.json()
  return json.data
}