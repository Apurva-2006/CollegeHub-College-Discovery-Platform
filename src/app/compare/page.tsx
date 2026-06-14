"use client";

import { useEffect, useState } from "react";
import { useCompareTrayStore } from "@/store/comparetraystore";
import { useSavedComparisonsStore } from "@/store/savedcomparisonsstore";
import { useRecentComparisonsStore } from "@/store/recentcomparisonsstore";
import { College } from "@/types";
import EmptyCompare from "@/components/compare/EmptyCompare";
import { formatPackage, formatFee, cn } from "@/lib/utils";
import { Plus, Bookmark, X, Trophy, Star, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type RowType = "text" | "number" | "rating" | "currency" | "percent" | "tags";

interface Row {
  label: string;
  key: keyof College;
  type: RowType;
  bestIsHighest?: boolean;
  highlight?: boolean;
  format?: (val: unknown, college: College) => string;
}

const ROWS: Row[] = [
  { label: "Location", key: "location", type: "text" },
  { label: "Ownership", key: "ownership", type: "text" },
  { label: "Established", key: "establishedYear", type: "number", format: (v) => String(v) },
  { label: "NIRF Rank", key: "nirfRank", type: "number", bestIsHighest: false, highlight: true, format: (v) => (v ? `#${v}` : "—") },
  { label: "QS Rank", key: "qsRank", type: "number", bestIsHighest: false, highlight: true, format: (v) => (v ? `#${v}` : "—") },
  { label: "Overall Rating", key: "overallRating", type: "rating", bestIsHighest: true, highlight: true },
  { label: "Reviews", key: "reviewCount", type: "number", bestIsHighest: true, highlight: true, format: (v) => Number(v).toLocaleString("en-IN") },
  { label: "Avg Package", key: "averagePackage", type: "currency", bestIsHighest: true, highlight: true, format: (v) => formatPackage(v as number) },
  { label: "Highest Package", key: "highestPackage", type: "currency", bestIsHighest: true, highlight: true, format: (v) => formatPackage(v as number) },
  { label: "Placement %", key: "placementPercentage", type: "percent", bestIsHighest: true, highlight: true, format: (v) => `${v}%` },
  { label: "Starting Fee", key: "startingFee", type: "currency", bestIsHighest: false, highlight: true, format: (v) => formatFee(v as number) },
  { label: "Campus Area", key: "campusArea", type: "number", bestIsHighest: true, format: (v, c) => `${v} ${c.campusAreaUnit}` },
  { label: "Accreditation", key: "accreditation", type: "tags" },
  { label: "Popular Courses", key: "popularCourses", type: "tags" },
  { label: "Exams Accepted", key: "examsAccepted", type: "tags" },
];

function getBestIndex(colleges: College[], row: Row): number {
  if (!row.highlight) return -1;
  const vals = colleges.map((c) => {
    const v = c[row.key];
    return typeof v === "number" ? v : null;
  });
  const defined = vals.filter((v) => v !== null) as number[];
  if (defined.length === 0) return -1;
  const best = row.bestIsHighest ? Math.max(...defined) : Math.min(...defined);
  return vals.findIndex((v) => v === best);
}

function CellValue({ row, college, isBest }: { row: Row; college: College; isBest: boolean }) {
  const raw = college[row.key];

  if (row.type === "tags") {
    const arr = Array.isArray(raw) ? (raw as string[]) : [];
    return (
      <div className="flex flex-wrap gap-1.5">
        {arr.slice(0, 4).map((tag) => (
          <span key={tag} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
            {tag}
          </span>
        ))}
        {arr.length > 4 && <span className="text-[11px] text-gray-400">+{arr.length - 4}</span>}
      </div>
    );
  }

  const display = row.format ? row.format(raw, college) : String(raw ?? "—");

  if (row.type === "rating") {
    return (
      <div className={cn("flex items-center gap-1.5", isBest && "text-[#6D28D9] font-bold")}>
        <Star size={13} className={cn(isBest ? "text-[#6D28D9] fill-[#6D28D9]" : "text-amber-400 fill-amber-400")} />
        <span className="text-sm font-semibold">{display}</span>
        {isBest && <Trophy size={12} className="text-[#6D28D9]" />}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1.5", isBest && "text-[#6D28D9] font-bold")}>
      <span className={cn("text-sm", isBest ? "font-semibold" : "text-gray-700")}>{display}</span>
      {isBest && row.highlight && <Trophy size={12} className="text-[#6D28D9]" />}
    </div>
  );
}

function SaveModal({ onSave, onClose, colleges }: { onSave: (label: string) => void; onClose: () => void; colleges: College[] }) {
  const autoLabel = colleges.map((c) => c.shortName).join(" vs ");
  const [label, setLabel] = useState(autoLabel);

  const handleSave = () => {
    const trimmed = label.trim();
    if (!trimmed) return;
    onSave(trimmed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Save Comparison</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X size={15} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Give this comparison a name so you can find it later in your Saved page.
        </p>
        <input
          autoFocus
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder="e.g. IIT Madras vs IISc vs IIT Bombay"
          maxLength={60}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition mb-4"
        />
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!label.trim()}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5",
              label.trim() ? "bg-[#6D28D9] text-white hover:bg-[#5b21b6]" : "bg-gray-100 text-gray-300 cursor-not-allowed"
            )}
          >
            <Bookmark size={14} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  const { compareIds, toggle, clear } = useCompareTrayStore();
  const { comparisons, saveComparison } = useSavedComparisonsStore();
  const { addRecentComparison } = useRecentComparisonsStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isFromSaved = searchParams.get("source") === "saved";
  const urlSavedId = searchParams.get("savedId");

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // ─── Reactive Lookups ────────────────────────────────────────────────────────
  // Check explicit match via URL query param identifier first
  const isExplicitlySaved = comparisons.some((c) => c.id === urlSavedId);

  // Structural combination matching check (independent fallback helper logic)
  const currentTrayKey = [...compareIds].sort().join(",");
  const isStructuralMatchSaved = comparisons.some(
    (c) => [...c.collegeIds].sort().join(",") === currentTrayKey
  );

  const isCurrentComparisonSaved = isExplicitlySaved || isStructuralMatchSaved;

  // Track dynamic title string label configuration values
  const matchingComparison = comparisons.find(
    (c) => c.id === urlSavedId || [...c.collegeIds].sort().join(",") === currentTrayKey
  );
  const comparisonTitle = matchingComparison ? matchingComparison.label : "Compare Colleges";

  useEffect(() => {
    if (compareIds.length === 0) {
      setColleges([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const params = new URLSearchParams();
    compareIds.forEach((id) => params.append("ids", id));
    fetch(`/api/colleges?${params}`)
      .then((r) => r.json())
      .then((json) => {
        const map = new Map<string, College>((json.data as College[]).map((c) => [c.id, c]));
        const resolved = compareIds.map((id) => map.get(id)).filter(Boolean) as College[];
        setColleges(resolved);
        if (resolved.length >= 2) {
          addRecentComparison(compareIds);
        }
      })
      .catch(() => setColleges([]))
      .finally(() => setLoading(false));
  }, [compareIds]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = (label: string) => {
    saveComparison(label, compareIds);
  };

  const canCompare = colleges.length >= 2;
  const canAddMore = compareIds.length < 5;

  if (!loading && compareIds.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50/60">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Compare Colleges</h1>
          <p className="text-sm text-gray-500 mb-8">Side-by-side comparison. Best values are highlighted.</p>
          <EmptyCompare />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50/60">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">

          <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{comparisonTitle}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Side-by-side comparison of {colleges.length} college{colleges.length !== 1 ? "s" : ""}.{" "}
                <span className="text-[#6D28D9] font-medium">Best values are highlighted.</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              {canAddMore && (
                <button
                  onClick={() => router.push("/colleges")}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 shadow-sm transition"
                >
                  <Plus size={15} /> Add college
                </button>
              )}
              <button
                onClick={() => !isCurrentComparisonSaved && canCompare && setShowSaveModal(true)}
                disabled={!canCompare || isCurrentComparisonSaved}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm",
                  isCurrentComparisonSaved
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default"
                    : canCompare
                      ? "bg-[#6D28D9] text-white hover:bg-[#5b21b6]"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                )}
              >
                {isCurrentComparisonSaved ? (
                  <>
                    <Check size={14} /> Saved!
                  </>
                ) : (
                  <>
                    <Bookmark size={14} /> Save
                  </>
                )}
              </button>
            </div>
          </div>

          {!loading && colleges.length === 1 && (
            <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 font-medium">
              Add at least 1 more college to start comparing.
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-100" />
              <div className="p-6 space-y-4">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded" />)}
              </div>
            </div>
          )}

          {!loading && colleges.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-6 py-5 w-44 shrink-0">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Attribute</span>
                      </th>
                      {colleges.map((college) => (
                        <th key={college.id} className="px-5 py-4 text-left align-top min-w-[220px]">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg border border-gray-100 bg-white shadow-sm flex-shrink-0 overflow-hidden flex items-center justify-center p-1">
                                <img
                                  src={college.logo}
                                  alt={college.shortName}
                                  className="w-full h-full object-contain"
                                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(college.shortName)}&background=6D28D9&color=fff&size=40`; }}
                                />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900 leading-snug">{college.name}</p>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  <div className="flex items-center gap-0.5">
                                    <Star size={10} className="text-amber-400 fill-amber-400" />
                                    <span className="text-[11px] font-semibold text-gray-600">{college.overallRating}</span>
                                  </div>
                                  {college.nirfRank && (
                                    <>
                                      <span className="text-gray-300">·</span>
                                      <span className="text-[11px] text-gray-500 flex items-center gap-0.5">
                                        <Trophy size={10} className="text-[#6D28D9]" /> #{college.nirfRank}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button onClick={() => toggle(college.id)} className="text-gray-300 hover:text-red-400 transition-colors shrink-0 mt-0.5" aria-label={`Remove ${college.shortName}`}>
                              <X size={15} />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((row, rowIdx) => {
                      const bestIdx = canCompare ? getBestIndex(colleges, row) : -1;
                      return (
                        <tr key={row.key as string} className={cn("border-b border-gray-50 last:border-0", rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/40")}>
                          <td className="px-6 py-4 text-sm text-gray-500 font-medium whitespace-nowrap align-top">{row.label}</td>
                          {colleges.map((college, colIdx) => {
                            const isBest = colIdx === bestIdx;
                            return (
                              <td key={college.id} className={cn("px-5 py-4 align-top transition-colors", isBest && "bg-[#6D28D9]/5")}>
                                <CellValue row={row} college={college} isBest={isBest} />
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                <p className="text-xs text-gray-400">
                  <Trophy size={11} className="inline text-[#6D28D9] mr-1" />
                  Highlighted cells show the best value for each metric.
                </p>
                {!isFromSaved && (
                  <button onClick={clear} className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">
                    Clear all & start over
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showSaveModal && <SaveModal onSave={handleSave} onClose={() => setShowSaveModal(false)} colleges={colleges} />}
    </>
  );
}