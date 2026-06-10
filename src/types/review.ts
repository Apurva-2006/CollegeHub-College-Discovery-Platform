export type ReviewCategory =
  | 'Infrastructure'
  | 'Faculty'
  | 'Placements'
  | 'Campus Life'
  | 'Academics'
  | 'Hostel'
  | 'Research'
  | 'Clubs & Events'
  | 'Administration'
  | 'Value for Money'

export interface Review {
  id: string
  collegeId: string
  category: ReviewCategory
  rating: number
  title: string
  review: string
  reviewerName: string
  reviewerAvatar: string
  reviewDate: string   // "YYYY-MM"
  verified: boolean
  helpfulCount: number
}