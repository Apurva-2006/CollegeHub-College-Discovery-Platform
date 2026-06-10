import { Review } from '@/types'

export async function getReviewsByCollegeId(collegeId: string): Promise<Review[]> {
  const res = await fetch(`/api/reviews?collegeId=${collegeId}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch reviews')
  const json = await res.json()
  return json.data
}