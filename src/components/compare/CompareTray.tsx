"use client";

import { useEffect, useState } from "react";
import { useCompareTrayStore } from "@/store/comparetraystore";
import { Scale, X, ChevronRight, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { College } from "@/types";
import { cn } from "@/lib/utils";

export default function CompareTray() {
  const { compareIds, toggle, clear } = useCompareTrayStore();
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);

  // Fetch college details for chips
  useEffect(() => {
    if (compareIds.length === 0) {
      setColleges([]);
      return;
    }
    const params = new URLSearchParams();
    compareIds.forEach((id) => params.append("ids", id));
    fetch(`/api/colleges?${params}`)
      .then((r) => r.json())
      .then((json) => {
        // Filter to only the selected ones, preserving tray order
        const map = new Map<string, College>(
          (json.data as College[]).map((c) => [c.id, c])
        );
        setColleges(compareIds.map((id) => map.get(id)).filter(Boolean) as College[]);
      })
      .catch(() => {});
  }, [compareIds]);

  if (compareIds.length === 0) return null;

  const canCompare = compareIds.length >= 2;
  const isFull = compareIds.length >= 5;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4 pointer-events-none">
      <div
        className={cn(
          "pointer-events-auto w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-black/10",
          "flex items-center gap-3 px-4 py-3 transition-all duration-300"
        )}
      >
        {/* Left: icon + count */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#6D28D9] flex items-center justify-center">
            <Scale size={16} className="text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-xs font-bold text-gray-900">
              {compareIds.length}
              <span className="font-normal text-gray-400">/5</span>
            </p>
            <p className="text-[10px] text-gray-400 whitespace-nowrap">
              {canCompare ? "Ready to compare" : "Add 1 more"}
            </p>
          </div>
        </div>

        <div className="w-px h-8 bg-gray-100 shrink-0" />

        {/* College chips */}
        <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-hide min-w-0">
          {colleges.map((college) => (
            <div
              key={college.id}
              className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full pl-1.5 pr-2 py-1 shrink-0"
            >
              <img
                src={college.logo}
                alt={college.shortName}
                className="w-5 h-5 rounded-full object-contain bg-white border border-gray-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(college.shortName)}&background=6D28D9&color=fff&size=20`;
                }}
              />
              <span className="text-xs font-medium text-gray-700 max-w-[80px] truncate">
                {college.shortName}
              </span>
              <button
                onClick={() => toggle(college.id)}
                className="w-4 h-4 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-gray-400 transition-colors"
                aria-label={`Remove ${college.shortName}`}
              >
                <X size={10} />
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {!isFull &&
            Array.from({ length: Math.min(5 - compareIds.length, 2) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-1.5 border border-dashed border-gray-200 rounded-full px-3 py-1 shrink-0"
              >
                <span className="text-[11px] text-gray-300">+ add more</span>
              </div>
            ))}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clear}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} />
            Clear
          </button>
          <button
            onClick={() => canCompare && router.push("/compare")}
            disabled={!canCompare}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
              canCompare
                ? "bg-[#6D28D9] text-white hover:bg-[#5b21b6] shadow-sm"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            )}
          >
            Compare
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}