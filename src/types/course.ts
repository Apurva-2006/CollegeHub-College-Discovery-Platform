export interface Course {
  id: string
  collegeId: string
  courseName: string
  shortName: string
  degreeLevel: 'Undergraduate' | 'Postgraduate' | 'Doctoral'
  stream: string
  duration: number
  durationUnit: string
  mode: string
  totalFee: number
  currency: string
  eligibility: string
  entranceExams: string[]
  specializations: string[]
  seats: number
  description: string
  featured: boolean
}