import { Review } from '@/types'
import { formatReviewDate } from '@/lib/utils'
import { Star } from 'lucide-react'
import Image from 'next/image'

interface Props { reviews: Review[] }

export default function ReviewsTab({ reviews }: Props) {
  if (!reviews.length) {
    return <p className="text-sm text-gray-400 py-10 text-center">No reviews yet.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {reviews.map((r) => (
        <ReviewCard key={r.id} review={r} />
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const fullStars = Math.floor(review.rating)
  const half      = review.rating % 1 >= 0.5

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">
          {review.category}
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              className={
                i < fullStars ? 'text-amber-400 fill-amber-400'
                : (i === fullStars && half) ? 'text-amber-400 fill-amber-200'
                : 'text-gray-200 fill-gray-200'
              }
            />
          ))}
          <span className="text-xs font-semibold text-gray-700 ml-1">{review.rating}</span>
        </div>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">{review.review}</p>

      <div className="h-px bg-gray-100 my-3" />

      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
          <Image
            src={review.reviewerAvatar}
            alt={review.reviewerName}
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{review.reviewerName}</p>
          <p className="text-xs text-gray-400">{formatReviewDate(review.reviewDate)}</p>
        </div>
      </div>
    </div>
  )
}