import { College } from '@/types'
import { Building2, Users, Trophy } from 'lucide-react'
import RankCard from '@/components/college-detail/shared/RankCard'
interface Props { college: College }

export default function OverviewTab({ college }: Props) {
  return (
    <div className="space-y-4">
      {/* About */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
          <Building2 size={16} className="text-[#6D28D9]" /> About the College
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">{college.description}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
          <Meta label="Established"   value={String(college.establishedYear)} />
          <Meta label="Ownership"     value={college.ownership} />
          <Meta label="Accreditation" value={college.accreditation.join(', ')} />
          <Meta label="State Rank"    value={college.stateRank ? `#${college.stateRank}` : '–'} />
        </div>
      </div>

      {/* Rankings */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
          <Trophy size={16} className="text-[#6D28D9]" /> Rankings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <RankCard
            label="NIRF Rank"
            sub="National Institute Ranking"
            value={college.nirfRank}
            color="text-[#6D28D9]"
          />
          <RankCard
            label="QS World Rank"
            sub="QS World University Rankings"
            value={college.qsRank}
            color="text-emerald-500"
          />
          <RankCard
            label="State Rank"
            sub={`In ${college.state}`}
            value={college.stateRank}
            color="text-rose-400"
          />
        </div>
      </div>

      {/* Top Recruiters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
          <Users size={16} className="text-[#6D28D9]" /> Top Recruiters
        </h2>
        <div className="flex flex-wrap gap-2">
          {college.topRecruiters.map((r) => (
            <span key={r} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">{label}</p>
      <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
    </div>
  )
}

