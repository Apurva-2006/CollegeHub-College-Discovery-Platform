"use client";

import { useState, useEffect } from "react";
import { College } from "@/types";
import { formatPackage, formatFee, formatReviewCount, cn } from "@/lib/utils";
import { Bookmark, Scale, MapPin, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useSavedCollegesStore } from "@/store/savedcollegestore";
import { useCompareTrayStore } from "@/store/comparetraystore";

// College cover images mapped to category (fallback)
const COVER_IMAGES: Record<string, string> = {
  Engineering: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=200&fit=crop",
  Management: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop",
  Science: "https://images.unsplash.com/photo-1532094349884-543559ce3c49?w=400&h=200&fit=crop",
  Arts: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=200&fit=crop",
  Medical: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=200&fit=crop",
  default: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&h=200&fit=crop",
};

function getCover(college: College): string {
  for (const cat of college.categories) {
    if (COVER_IMAGES[cat]) return COVER_IMAGES[cat];
  }
  return COVER_IMAGES.default;
}

interface Props {
  college: College;
}

export default function CollegeCard({ college }: Props) {
  const { toggle: toggleSave, isSaved } = useSavedCollegesStore();
  const { toggle: toggleCompare, isInTray, compareIds } = useCompareTrayStore();

  // Guard against SSR/client hydration mismatch caused by
  // localStorage-persisted store state differing from server's initial state.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const saved = mounted && isSaved(college.id);
  const inCompare = mounted && isInTray(college.id);
  const compareFull = mounted && compareIds.length >= 5 && !inCompare;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Cover */}
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <img
          src={getCover(college)}
          alt={college.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* NIRF badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-purple-100 rounded-full px-2.5 py-1">
          <span className="text-[10px] font-bold text-[#6D28D9]">🏆</span>
          <span className="text-[11px] font-semibold text-gray-800">NIRF #{college.nirfRank}</span>
        </div>
        {/* Bookmark */}
        <button
          onClick={() => toggleSave(college.id)}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all",
            saved
              ? "bg-[#6D28D9] text-white shadow"
              : "bg-white/90 backdrop-blur-sm text-gray-500 hover:text-[#6D28D9] hover:bg-white shadow-sm"
          )}
          aria-label={saved ? "Remove from saved" : "Save college"}
        >
          <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Logo + Name */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg border border-gray-100 bg-white shadow-sm flex-shrink-0 overflow-hidden flex items-center justify-center p-1">
            <img
              src={college.logo}
              alt={college.shortName}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(college.shortName)}&background=6D28D9&color=fff&size=40`;
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
              {college.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-gray-500">
              <MapPin size={11} className="shrink-0" />
              <span className="text-xs truncate">{college.location}</span>
            </div>
          </div>
        </div>

        {/* Rating + Ownership */}
        <div className="flex items-center gap-2 mt-2.5">
          <div className="flex items-center gap-1 bg-amber-50 rounded-full px-2 py-0.5">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-amber-700">{college.overallRating}</span>
            <span className="text-xs text-amber-600">({formatReviewCount(college.reviewCount)})</span>
          </div>
          <span className={cn(
            "text-[11px] font-medium px-2 py-0.5 rounded-full border",
            college.ownership === "Government"
              ? "text-emerald-700 bg-emerald-50 border-emerald-100"
              : college.ownership === "Private"
              ? "text-blue-700 bg-blue-50 border-blue-100"
              : "text-orange-700 bg-orange-50 border-orange-100"
          )}>
            {college.ownership}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 grid grid-cols-2 gap-3 border-b border-gray-50">
        <div>
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">Avg Package</p>
          <div className="flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-500" />
            <span className="text-sm font-bold text-emerald-600">{formatPackage(college.averagePackage)}</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">Highest</p>
          <span className="text-sm font-bold text-gray-800">{formatPackage(college.highestPackage)}</span>
        </div>
        <div>
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">Starting Fee</p>
          <span className="text-sm font-semibold text-gray-700">{formatFee(college.startingFee)}</span>
        </div>
        <div>
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">Placement</p>
          <span className="text-sm font-bold text-gray-800">{college.placementPercentage}%</span>
        </div>
      </div>

      {/* Courses */}
      <div className="px-4 py-3 border-b border-gray-50 flex flex-wrap gap-1.5 min-h-[44px]">
        {college.popularCourses.slice(0, 3).map((course) => (
          <span key={course} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
            {course}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 flex gap-2 mt-auto">
        <Link
          href={`/colleges/${college.slug}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#6D28D9] text-white text-sm font-medium hover:bg-[#5b21b6] transition-colors"
        >
          View Details
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
        <button
          onClick={() => !compareFull && toggleCompare(college.id)}
          disabled={compareFull}
          title={compareFull ? "Compare tray full (max 5)" : inCompare ? "Remove from compare" : "Add to compare"}
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
            inCompare
              ? "bg-[#6D28D9] text-white border-[#6D28D9]"
              : compareFull
              ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
              : "bg-white text-gray-500 border-gray-200 hover:border-[#6D28D9] hover:text-[#6D28D9] hover:bg-purple-50"
          )}
          aria-label="Add to compare"
        >
          <Scale size={15} />
        </button>
      </div>
    </div>
  );
}