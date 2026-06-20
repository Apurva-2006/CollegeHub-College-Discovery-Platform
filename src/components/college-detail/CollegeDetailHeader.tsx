'use client'

import Image from 'next/image'
import { MapPin, Calendar, BadgeCheck, Heart, Scale, Star, TrendingUp, Users } from 'lucide-react'
import { College } from '@/types'
import { formatPackage } from '@/lib/utils'
import { useSavedCollegesStore } from '@/store/savedcollegestore'
import { useCompareTrayStore } from '@/store/comparetraystore'
import { cn } from '@/lib/utils'

interface Props { college: College }

export default function CollegeDetailHeader({ college }: Props) {
  const { isSaved, toggle: toggleSave } = useSavedCollegesStore()
  const { isInTray, toggle: toggleCompare } = useCompareTrayStore()

  const saved    = isSaved(college.id)
  const inTray   = isInTray(college.id)

  return (
    <div className="bg-white border-b border-gray-100">
      {/* Banner */}
      <div className="h-44 bg-gradient-to-r from-gray-200 to-gray-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Info card */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm -mt-10 relative z-10 p-5 mb-0">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Logo */}
            <div className="w-16 h-16 rounded-xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              <Image
                src={college.logo}
                alt={college.shortName}
                width={56}
                height={56}
                className="object-contain p-1"
              />
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 leading-tight">{college.name}</h1>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} /> {college.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> Est. {college.establishedYear}
                    </span>
                    {college.accreditation[0] && (
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <BadgeCheck size={13} /> {college.accreditation[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleSave(college.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors',
                      saved
                        ? 'bg-purple-50 border-purple-200 text-[#6D28D9]'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    )}
                  >
                    <Heart size={14} className={saved ? 'fill-[#6D28D9]' : ''} />
                    {saved ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={() => toggleCompare(college.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors',
                      inTray
                        ? 'bg-purple-50 border-purple-200 text-[#6D28D9]'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    )}
                  >
                    <Scale size={14} />
                    {inTray ? 'Added' : 'Compare'}
                  </button>
                </div>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
                <Stat label="Overall Rating" icon={<Star size={13} className="text-amber-500" />}>
                  <span className="text-gray-900 font-semibold">{college.overallRating}</span>
                  <span className="text-gray-400 text-xs ml-1">({college.reviewCount.toLocaleString()})</span>
                </Stat>
                <Stat label="NIRF Rank" icon={<span className="text-[#6D28D9] text-xs">🏆</span>}>
                  <span className="text-[#6D28D9] font-semibold">#{college.nirfRank ?? '–'}</span>
                </Stat>
                <Stat label="Avg Package" icon={<TrendingUp size={13} className="text-emerald-500" />}>
                  <span className="text-emerald-600 font-semibold">{formatPackage(college.averagePackage)}</span>
                </Stat>
                <Stat label="Placement %" icon={<Users size={13} className="text-rose-400" />}>
                  <span className="text-rose-500 font-semibold">{college.placementPercentage}%</span>
                </Stat>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-xl px-3 py-2.5">
      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-1">{label}</p>
      <div className="flex items-center gap-1">{icon}{children}</div>
    </div>
  )
}