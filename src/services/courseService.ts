import { Course } from '@/types'

export async function getCoursesByCollegeId(collegeId: string): Promise<Course[]> {
  const res = await fetch(`/api/courses?collegeId=${collegeId}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch courses')
  const json = await res.json()
  return json.data
}