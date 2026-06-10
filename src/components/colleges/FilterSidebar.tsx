"use client";

import { CollegeFilters } from "@/types";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal"
];

const CITIES = [
  "Ahmedabad","Bangalore","Bhubaneswar","Chennai","Delhi","Guwahati",
  "Hyderabad","Indore","Jaipur","Jalandhar","Kanpur","Kharagpur",
  "Kozhikode","Lucknow","Mumbai","Patna","Pilani","Pune","Raipur",
  "Roorkee","Surat","Vellore","Warangal"
];

interface Section {
  key: string;
  label: string;
  options: { label: string; value: string }[];
  filterKey: keyof CollegeFilters;
}

const FILTER_SECTIONS: Section[] = [
  {
    key: "nirf", label: "NIRF Ranking",
    filterKey: "nirfRange",
    options: [
      { label: "NIRF Top 10", value: "top10" },
      { label: "NIRF Top 50", value: "top50" },
      { label: "NIRF Top 100", value: "top100" },
    ],
  },
  {
    key: "ownership", label: "Ownership",
    filterKey: "ownership",
    options: [
      { label: "Government", value: "Government" },
      { label: "Private", value: "Private" },
      { label: "Deemed", value: "Deemed" },
    ],
  },
  {
    key: "courses", label: "Courses",
    filterKey: "courses",
    options: [
      { label: "B.Tech", value: "B.Tech" },
      { label: "MBA", value: "MBA" },
      { label: "BBA", value: "BBA" },
      { label: "BCA", value: "BCA" },
      { label: "MBBS", value: "MBBS" },
      { label: "B.Com", value: "B.Com" },
    ],
  },
  {
    key: "fee", label: "Fees",
    filterKey: "feeRange",
    options: [
      { label: "Below ₹1L", value: "below1L" },
      { label: "₹1L – ₹5L", value: "1to5L" },
      { label: "₹5L – ₹10L", value: "5to10L" },
      { label: "Above ₹10L", value: "above10L" },
    ],
  },
  {
    key: "rating", label: "Rating",
    filterKey: "ratings",
    options: [
      { label: "4.5+ ★", value: "4.5" },
      { label: "4+ ★", value: "4" },
      { label: "3+ ★", value: "3" },
    ],
  },
  {
    key: "avgPackage", label: "Avg Package",
    filterKey: "avgPackage",
    options: [
      { label: "Above ₹20 LPA", value: "above20" },
      { label: "Above ₹10 LPA", value: "above10" },
      { label: "Above ₹5 LPA", value: "above5" },
    ],
  },
  {
    key: "highestPackage", label: "Highest Package",
    filterKey: "highestPackage",
    options: [
      { label: "Above ₹1 Cr", value: "above1Cr" },
      { label: "Above ₹50 LPA", value: "above50" },
      { label: "Above ₹25 LPA", value: "above25" },
    ],
  },
  {
    key: "placement", label: "Placement %",
    filterKey: "placementPct",
    options: [
      { label: "Above 90%", value: "above90" },
      { label: "Above 80%", value: "above80" },
      { label: "Above 60%", value: "above60" },
    ],
  },
];

interface Props {
  filters: CollegeFilters;
  onChange: (filters: CollegeFilters) => void;
  activeCount: number;
}

function CollapsibleSection({
  label, children, defaultOpen = true,
}: { label: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-sm font-semibold text-gray-800 hover:text-[#6D28D9] transition-colors"
      >
        {label}
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

export default function FilterSidebar({ filters, onChange, activeCount }: Props) {
  const toggleMulti = (key: keyof CollegeFilters, value: string) => {
    const arr = filters[key] as string[];
    const updated = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    onChange({ ...filters, [key]: updated });
  };

  const clearAll = () => {
    onChange({
      search: filters.search,
      states: [], cities: [], feeRange: [], ratings: [],
      avgPackage: [], highestPackage: [], placementPct: [],
      nirfRange: [], courses: [], ownership: [],
      sortBy: filters.sortBy,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-[#6D28D9]" />
          <span className="text-sm font-semibold text-gray-800">Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#6D28D9] text-white text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      <div className="px-4 divide-y divide-gray-50">
        {/* State */}
        <CollapsibleSection label="State">
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
            {STATES.map((state) => (
              <label key={state} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.states.includes(state)}
                  onChange={() => toggleMulti("states", state)}
                  className="w-4 h-4 rounded accent-[#6D28D9]"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{state}</span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        {/* City */}
        <CollapsibleSection label="City" defaultOpen={false}>
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {CITIES.map((city) => (
              <label key={city} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.cities.includes(city)}
                  onChange={() => toggleMulti("cities", city)}
                  className="w-4 h-4 rounded accent-[#6D28D9]"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{city}</span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        {/* All other filter sections */}
        {FILTER_SECTIONS.map((section) => (
          <CollapsibleSection key={section.key} label={section.label} defaultOpen={section.key === "nirf" || section.key === "ownership"}>
            <div className="space-y-1.5">
              {section.options.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={(filters[section.filterKey] as string[]).includes(opt.value)}
                    onChange={() => toggleMulti(section.filterKey, opt.value)}
                    className="w-4 h-4 rounded accent-[#6D28D9]"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{opt.label}</span>
                </label>
              ))}
            </div>
          </CollapsibleSection>
        ))}
      </div>
    </div>
  );
}