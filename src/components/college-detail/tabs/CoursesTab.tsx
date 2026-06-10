import { Course } from '@/types'
import { formatFee } from '@/lib/utils'
import { Clock, Users, BookOpen } from 'lucide-react'

interface Props { courses: Course[] }

export default function CoursesTab({ courses }: Props) {
  if (!courses.length) {
    return <p className="text-sm text-gray-400 py-10 text-center">No courses available.</p>
  }

  return (
    <div className="space-y-3">
      {courses.map((course, i) => (
        <div
          key={course.id}
          className={`bg-white rounded-2xl border p-5 ${i === 0 ? 'border-[#6D28D9]/30' : 'border-gray-100'}`}
        >
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h3 className="font-semibold text-gray-900">{course.shortName}</h3>
              <p className="text-sm text-gray-500 mt-0.5">Eligibility: {course.eligibility}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[11px] text-gray-400 uppercase tracking-wide">Total Fees</p>
              <p className="text-[#6D28D9] font-semibold text-base">{formatFee(course.totalFee)}</p>
            </div>
          </div>

          <div className="h-px bg-gray-100 my-3" />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">Duration</p>
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                <Clock size={13} className="text-gray-400" />
                {course.duration} {course.durationUnit}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">Intake</p>
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                <Users size={13} className="text-gray-400" />
                {course.seats} seats
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">Exams</p>
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                <BookOpen size={13} className="text-gray-400" />
                {course.entranceExams.join(', ')}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}