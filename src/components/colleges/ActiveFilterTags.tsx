"use client";

import { X } from "lucide-react";
import { CollegeFilters } from "@/types";

const LABELS: Record<string, Record<string, string>> = {
  states: {},
  cities: {},
  feeRange: { below1L: "Below ₹1L", "1to5L": "₹1L–₹5L", "5to10L": "₹5L–₹10L", above10L: "Above ₹10L" },
  ratings: { "4.5": "4.5+ ★", "4": "4+ ★", "3": "3+ ★" },
  avgPackage: { above5: "Avg >₹5L", above10: "Avg >₹10L", above20: "Avg >₹20L" },
  highestPackage: { above25: "High >₹25L", above50: "High >₹50L", above1Cr: "High >₹1Cr" },
  placementPct: { above60: "Placement >60%", above80: "Placement >80%", above90: "Placement >90%" },
  nirfRange: { top10: "NIRF Top 10", top50: "NIRF Top 50", top100: "NIRF Top 100" },
  courses: {},
  ownership: {},
};

function getLabel(key: string, value: string): string {
  return LABELS[key]?.[value] || value;
}

interface Props {
  filters: CollegeFilters;
  onChange: (filters: CollegeFilters) => void;
}

type ArrayFilterKey = Exclude<keyof CollegeFilters, "search" | "sortBy">;
const ARRAY_KEYS: ArrayFilterKey[] = [
  "states","cities","feeRange","ratings","avgPackage",
  "highestPackage","placementPct","nirfRange","courses","ownership"
];

export default function ActiveFilterTags({ filters, onChange }: Props) {
  const tags: { key: ArrayFilterKey; value: string }[] = [];

  for (const key of ARRAY_KEYS) {
    for (const val of filters[key] as string[]) {
      tags.push({ key, value: val });
    }
  }

  if (tags.length === 0) return null;

  const removeTag = (key: ArrayFilterKey, value: string) => {
    onChange({ ...filters, [key]: (filters[key] as string[]).filter((v) => v !== value) });
  };

  const clearAll = () => {
    const reset = { ...filters };
    for (const k of ARRAY_KEYS) reset[k] = [] as never;
    onChange(reset);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map(({ key, value }) => (
        <span
          key={`${key}-${value}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-[#6D28D9] border border-purple-100 rounded-full text-xs font-medium"
        >
          {getLabel(key, value)}
          <button
            onClick={() => removeTag(key, value)}
            className="hover:text-red-500 transition-colors"
            aria-label="Remove filter"
          >
            <X size={11} />
          </button>
        </span>
      ))}
      <button
        onClick={clearAll}
        className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-1 underline underline-offset-2"
      >
        Clear all
      </button>
    </div>
  );
}