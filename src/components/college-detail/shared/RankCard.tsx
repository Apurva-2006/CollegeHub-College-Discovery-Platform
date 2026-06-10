import { Trophy } from 'lucide-react'

interface Props {
  label: string
  sub: string
  value: number | null
  color: string
}

export default function RankCard({ label, sub, value, color }: Props) {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
      <div className="flex items-start justify-between mb-1">
        <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">{label}</p>
        <Trophy size={14} className={color} />
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value ? `#${value}` : '–'}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  )
}