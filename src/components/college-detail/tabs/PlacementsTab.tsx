import { College } from '@/types'
import { formatPackage } from '@/lib/utils'
import { TrendingUp, Trophy, Users } from 'lucide-react'

interface Props { college: College }

export default function PlacementsTab({ college }: Props) {
  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <PlacementCard
          label="Average Package"
          value={formatPackage(college.averagePackage)}
          pct={65}
          color="emerald"
          icon={<TrendingUp size={16} />}
        />
        <PlacementCard
          label="Highest Package"
          value={formatPackage(college.highestPackage)}
          pct={85}
          color="purple"
          icon={<Trophy size={16} />}
        />
        <PlacementCard
          label="Placement Rate"
          value={`${college.placementPercentage}%`}
          pct={college.placementPercentage}
          color="rose"
          icon={<Users size={16} />}
        />
      </div>

      {/* Top recruiters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-3">Top Recruiters</h2>
        <div className="flex flex-wrap gap-2">
          {college.topRecruiters.map((r) => (
            <span key={r} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700">
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const colorMap = {
  emerald: { bg: 'bg-emerald-50',  text: 'text-emerald-600', bar: 'bg-emerald-500' },
  purple:  { bg: 'bg-purple-50',   text: 'text-[#6D28D9]',   bar: 'bg-[#6D28D9]'  },
  rose:    { bg: 'bg-rose-50',     text: 'text-rose-500',    bar: 'bg-rose-500'    },
}

function PlacementCard({
  label, value, pct, color, icon
}: {
  label: string; value: string; pct: number; color: keyof typeof colorMap; icon: React.ReactNode
}) {
  const c = colorMap[color]
  return (
    <div className={`${c.bg} rounded-2xl p-5`}>
      <p className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${c.text}`}>{value}</p>
      <div className="mt-3 h-1.5 bg-white/60 rounded-full overflow-hidden">
        <div className={`h-full ${c.bar} rounded-full`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  )
}