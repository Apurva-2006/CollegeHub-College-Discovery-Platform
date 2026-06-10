'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { College, Course, Review } from '@/types'
import { getCollegeBySlug } from '@/services/collegeService'
import { getCoursesByCollegeId } from '@/services/courseService'
import { getReviewsByCollegeId } from '@/services/reviewService'
import { type DetailTab } from '@/constants/filters'
import CollegeDetailHeader from '@/components/college-detail/CollegeDetailHeader'
import CollegeDetailTabs from '@/components/college-detail/CollegeDetailTabs'
import OverviewTab from '@/components/college-detail/tabs/OverviewTab'
import CoursesTab from '@/components/college-detail/tabs/CoursesTab'
import PlacementsTab from '@/components/college-detail/tabs/PlacementsTab'
import ReviewsTab from '@/components/college-detail/tabs/ReviewsTab'
import { ArrowLeft } from 'lucide-react'

export default function CollegeDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  const [college, setCollege]   = useState<College | null>(null)
  const [courses, setCourses]   = useState<Course[]>([])
  const [reviews, setReviews]   = useState<Review[]>([])
  const [activeTab, setActiveTab] = useState<DetailTab>('overview')
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const c = await getCollegeBySlug(slug)
        if (!c) { setNotFound(true); return }
        setCollege(c)
        const [courseData, reviewData] = await Promise.all([
          getCoursesByCollegeId(c.id),
          getReviewsByCollegeId(c.id),
        ])
        setCourses(courseData)
        setReviews(reviewData)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading) return (
    <div className="min-h-screen bg-gray-50/60 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#6D28D9] border-t-transparent animate-spin" />
    </div>
  )

  if (notFound || !college) return (
    <div className="min-h-screen bg-gray-50/60 flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 text-sm">College not found.</p>
      <button onClick={() => router.push('/colleges')} className="text-[#6D28D9] text-sm underline">
        Back to colleges
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* Back */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-4"
        >
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      <CollegeDetailHeader college={college} />
      <CollegeDetailTabs active={activeTab} onChange={setActiveTab} />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview'   && <OverviewTab   college={college} />}
        {activeTab === 'courses'    && <CoursesTab    courses={courses} />}
        {activeTab === 'placements' && <PlacementsTab college={college} />}
        {activeTab === 'reviews'    && <ReviewsTab    reviews={reviews} />}
      </div>
    </div>
  )
}