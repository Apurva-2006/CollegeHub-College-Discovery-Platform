"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { College, CollegeFilters } from "@/types";
import FilterSidebar from "@/components/colleges/FilterSidebar";
import CollegeCard from "@/components/colleges/CollegeCard";
import ActiveFilterTags from "@/components/colleges/ActiveFilterTags";
import { ChevronDown, SlidersHorizontal, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import CompareTray from "@/components/compare/CompareTray";

const DEFAULT_FILTERS: CollegeFilters = {
  search: "", states: [], cities: [], feeRange: [], ratings: [],
  avgPackage: [], highestPackage: [], placementPct: [],
  nirfRange: [], courses: [], ownership: [], sortBy: "nirfRank",
};

const SORT_OPTIONS = [
  { label: "Best NIRF rank", value: "nirfRank" },
  { label: "Highest rating", value: "rating" },
  { label: "Best avg package", value: "avgPackage" },
  { label: "Highest package", value: "highestPackage" },
  { label: "Lowest fees", value: "fees" },
  { label: "Best placement %", value: "placement" },
];

// Maps homepage category names → course filter values
const CATEGORY_COURSE_MAP: Record<string, string[]> = {
  Engineering: ["B.Tech", "BCA"],
  Management: ["MBA", "BBA"],
  Medical: ["MBBS"],
  Commerce: ["B.Com"],
};

function countActiveFilters(f: CollegeFilters): number {
  return f.states.length + f.cities.length + f.feeRange.length + f.ratings.length +
    f.avgPackage.length + f.highestPackage.length + f.placementPct.length +
    f.nirfRange.length + f.courses.length + f.ownership.length;
}

export default function CollegesPage() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  // On mount / URL change: resolve course filters from both ?course= and ?stream= params
  const getInitialCourses = (): string[] => {
    // ?course= can appear multiple times (e.g. ?course=B.Tech&course=BCA)
    const coursesFromUrl = searchParams.getAll("course");
    // ?stream= maps a category name to its courses
    const stream = searchParams.get("stream") || "";
    const coursesFromStream = CATEGORY_COURSE_MAP[stream] ?? [];
    // merge, deduplicate
    return Array.from(new Set([...coursesFromUrl, ...coursesFromStream]));
  };

  const [filters, setFilters] = useState<CollegeFilters>({
    ...DEFAULT_FILTERS,
    search: urlSearch,
    courses: getInitialCourses(),
  });
  const [colleges, setColleges] = useState<College[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Keep search in sync with URL changes (e.g. header search bar)
  useEffect(() => {
    setFilters((f) => ({ ...f, search: urlSearch }));
  }, [urlSearch]);

  // Sync courses when URL params change (e.g. navigating from homepage pill)
  useEffect(() => {
    setFilters((f) => ({ ...f, courses: getInitialCourses() }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchColleges = useCallback(async (f: CollegeFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (f.search) params.set("search", f.search);
      f.states.forEach((s) => params.append("state", s));
      f.cities.forEach((c) => params.append("city", c));
      f.feeRange.forEach((v) => params.append("fee", v));
      f.ratings.forEach((v) => params.append("rating", v));
      f.avgPackage.forEach((v) => params.append("avgPackage", v));
      f.highestPackage.forEach((v) => params.append("highestPackage", v));
      f.placementPct.forEach((v) => params.append("placementPct", v));
      f.nirfRange.forEach((v) => params.append("nirf", v));
      f.courses.forEach((v) => params.append("course", v));
      f.ownership.forEach((v) => params.append("ownership", v));
      params.set("sortBy", f.sortBy);

      const res = await fetch(`/api/colleges?${params}`);
      const json = await res.json();
      setColleges(json.data);
      setTotal(json.total);
    } catch {
      setColleges([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchColleges(filters), 200);
    return () => clearTimeout(timer);
  }, [filters, fetchColleges]);

  const activeCount = countActiveFilters(filters);
  const sortLabel = SORT_OPTIONS.find((o) => o.value === filters.sortBy)?.label ?? "Sort";

  return (
    <div className="min-h-screen bg-gray-50/60 pb-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header with sort on the right */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Browse colleges</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {loading ? "Loading..." : `${total} colleges`}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 shadow-sm transition whitespace-nowrap"
              >
                <SlidersHorizontal size={14} className="text-gray-400" />
                {sortLabel}
                <ChevronDown size={13} className={cn("text-gray-400 transition-transform", sortOpen && "rotate-180")} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-30">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setFilters((f) => ({ ...f, sortBy: opt.value })); setSortOpen(false); }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm transition-colors",
                        filters.sortBy === opt.value
                          ? "bg-purple-50 text-[#6D28D9] font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile filter toggle */}
            <button
              className="lg:hidden flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <SlidersHorizontal size={15} />
              {activeCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#6D28D9] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeCount > 0 && (
          <div className="mb-4">
            <ActiveFilterTags filters={filters} onChange={setFilters} />
          </div>
        )}

        <div className="flex gap-6">
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar filters={filters} onChange={setFilters} activeCount={activeCount} />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-40 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {[...Array(4)].map((_, j) => <div key={j} className="h-8 bg-gray-100 rounded" />)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : colleges.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Inbox size={24} className="text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">No colleges match your filters</h3>
                <p className="text-sm text-gray-500 mb-5 max-w-xs">
                  Try widening your criteria or removing some filters to see more results.
                </p>
                <button
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="px-5 py-2 bg-[#6D28D9] text-white text-sm font-medium rounded-xl hover:bg-[#5b21b6] transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {colleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <CompareTray />

      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative ml-auto w-80 max-w-full h-full bg-white overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
              <span className="font-semibold text-gray-800">Filters</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-gray-500 hover:text-gray-800 text-lg">✕</button>
            </div>
            <div className="p-4">
              <FilterSidebar filters={filters} onChange={setFilters} activeCount={activeCount} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}