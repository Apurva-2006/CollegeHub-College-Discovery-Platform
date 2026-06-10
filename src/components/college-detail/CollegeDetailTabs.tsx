'use client'

import { DETAIL_TABS, type DetailTab } from '@/constants/filters'
import { cn } from '@/lib/utils'

interface Props {
  active: DetailTab
  onChange: (tab: DetailTab) => void
}

export default function CollegeDetailTabs({ active, onChange }: Props) {
  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {DETAIL_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={cn(
                'px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                active === tab.value
                  ? 'border-[#6D28D9] text-[#6D28D9]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}