"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSavedCollegesStore } from "@/store/savedcollegestore";
import { useSavedComparisonsStore } from "@/store/savedcomparisonsstore";
import { useRecentComparisonsStore } from "@/store/recentcomparisonsstore";
import { useRecentlyViewedStore } from "@/store/recentlyviewedstore";
import { useCompareTrayStore } from "@/store/comparetraystore";
import { College } from "@/types";
import CollegeCard from "@/components/colleges/CollegeCard";
import {
  Heart,
  Scale,
  Trash2,
  ChevronRight,
  BookmarkX,
  GitCompareArrows,
  Clock,
  Check,
  History,
  X,
  Search as SearchIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "saved-colleges" | "recently-viewed" | "saved-comparisons" | "recent-comparisons";

// ─── Inline Save Modal Component ──────────────────────────────────────────────
function SaveModal({
  initialLabel,
  onSave,
  onClose,
}: {
  initialLabel: string;
  onSave: (label: string) => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState(initialLabel);

  const handleSave = () => {
    const trimmed = label.trim();
    if (!trimmed) return;
    onSave(trimmed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Save Comparison</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
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
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
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
            <Check size={14} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty States ─────────────────────────────────────────────────────────────
function EmptySavedColleges() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-5">
        <BookmarkX size={26} className="text-rose-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">No saved colleges yet</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
        Bookmark colleges while browsing and they'll appear here for quick access.
      </p>
      <button
        onClick={() => router.push("/colleges")}
        className="px-5 py-2.5 bg-[#6D28D9] text-white text-sm font-semibold rounded-xl hover:bg-[#5b21b6] transition-colors shadow-sm"
      >
        Browse Colleges
      </button>
    </div>
  );
}

function EmptyRecentlyViewed() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-5">
        <Clock size={26} className="text-amber-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">No history found</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
        Colleges you view while exploring will show up here so you can easily jump back.
      </p>
      <button
        onClick={() => router.push("/colleges")}
        className="px-5 py-2.5 bg-[#6D28D9] text-white text-sm font-semibold rounded-xl hover:bg-[#5b21b6] transition-colors shadow-sm"
      >
        Explore Colleges
      </button>
    </div>
  );
}

function EmptySavedComparisons() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-5">
        <Scale size={26} className="text-[#6D28D9]" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">No saved comparisons yet</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
        Compare choices side-by-side and save the group comparison to revisit it anytime.
      </p>
      <button
        onClick={() => router.push("/colleges")}
        className="px-5 py-2.5 bg-[#6D28D9] text-white text-sm font-semibold rounded-xl hover:bg-[#5b21b6] transition-colors shadow-sm"
      >
        Start Comparing
      </button>
    </div>
  );
}

function EmptyRecentComparisons() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-5">
        <GitCompareArrows size={26} className="text-teal-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">No comparison history</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
        Run comparisons between multiple colleges to track your multi-school analysis.
      </p>
      <button
        onClick={() => router.push("/colleges")}
        className="px-5 py-2.5 bg-[#6D28D9] text-white text-sm font-semibold rounded-xl hover:bg-[#5b21b6] transition-colors shadow-sm"
      >
        Compare Tools
      </button>
    </div>
  );
}

// ─── No Search Results ─────────────────────────────────────────────────────────
function NoSearchResults({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
        <SearchIcon size={26} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">No matches for &ldquo;{query}&rdquo;</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
        Try a different search term or clear the search to see everything in this tab.
      </p>
      <button
        onClick={onClear}
        className="px-5 py-2.5 bg-[#6D28D9] text-white text-sm font-semibold rounded-xl hover:bg-[#5b21b6] transition-colors shadow-sm"
      >
        Clear search
      </button>
    </div>
  );
}

// ─── Comparison Cards ─────────────────────────────────────────────────────────
function ComparisonSetCard({
  id, label, collegeIds, savedAt, allColleges, onLoad, onDelete,
}: {
  id: string; label: string; collegeIds: string[]; savedAt: string;
  allColleges: Map<string, College>; onLoad: (ids: string[], savedId?: string) => void; onDelete: (id: string) => void;
}) {
  const colleges = collegeIds.map((cid) => allColleges.get(cid)).filter(Boolean) as College[];
  const date = new Date(savedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const bestNirf = Math.min(...colleges.map((c) => c.nirfRank ?? 999).filter((n) => n !== 999));
  const topRating = colleges.length ? Math.max(...colleges.map((c) => c.overallRating)) : 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{label}</h3>
          <p className="text-xs text-gray-400 mt-0.5">Saved on {date}</p>
        </div>
        <button
          onClick={() => onDelete(id)}
          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {colleges.map((college) => (
          <div key={college.id} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full pl-1.5 pr-3 py-1">
            <img
              src={college.logo} alt={college.shortName}
              className="w-5 h-5 rounded-full object-contain bg-white border border-gray-100"
              onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(college.shortName)}&background=6D28D9&color=fff&size=20`; }}
            />
            <span className="text-xs font-medium text-gray-700">{college.shortName}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center mt-auto pt-2">
        <div className="bg-gray-50 rounded-xl py-2 px-1">
          <p className="text-xs text-gray-400 mb-0.5">Colleges</p>
          <p className="text-sm font-bold text-gray-800">{collegeIds.length}</p>
        </div>
        <div className="bg-gray-50 rounded-xl py-2 px-1">
          <p className="text-xs text-gray-400 mb-0.5">Best NIRF</p>
          <p className="text-sm font-bold text-[#6D28D9]">
            {bestNirf !== 999 ? `#${bestNirf}` : "—"}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl py-2 px-1">
          <p className="text-xs text-gray-400 mb-0.5">Top Rating</p>
          <p className="text-sm font-bold text-amber-600">{topRating ? `${topRating.toFixed(1)}★` : "—"}</p>
        </div>
      </div>

      <button
        onClick={() => onLoad(collegeIds, id)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#6D28D9] text-white text-sm font-semibold hover:bg-[#5b21b6] transition-colors shadow-sm"
      >
        Load & Compare <ChevronRight size={15} />
      </button>
    </div>
  );
}

function RecentComparisonCard({
  collegeIds, viewedAt, allColleges, onLoad, onSave, isSaved, customLabel, savedId,
}: {
  collegeIds: string[]; viewedAt: string; allColleges: Map<string, College>;
  onLoad: (ids: string[], savedId?: string) => void; onSave: (ids: string[]) => void; isSaved: boolean;
  customLabel?: string; savedId?: string;
}) {
  const colleges = collegeIds.map((cid) => allColleges.get(cid)).filter(Boolean) as College[];
  const date = new Date(viewedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const autoLabel = colleges.length > 0 ? colleges.map((c) => c.shortName).join(" vs ") : `${collegeIds.length} colleges`;

  const displayLabel = customLabel || autoLabel;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{displayLabel}</h3>
          <p className="text-xs text-gray-400 mt-0.5">Viewed on {date}</p>
        </div>
        <button
          onClick={() => !isSaved && onSave(collegeIds)}
          disabled={isSaved}
          title={isSaved ? "Already saved" : "Save this comparison"}
          className={cn(
            "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
            isSaved
              ? "text-[#FB7185] bg-rose-50 cursor-default"
              : "text-gray-300 hover:text-[#FB7185] hover:bg-rose-50"
          )}
        >
          <Heart size={14} className={isSaved ? "fill-[#FB7185]" : ""} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-auto">
        {colleges.map((college) => (
          <div key={college.id} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200/80 rounded-full pl-1.5 pr-3 py-1">
            <img
              src={college.logo} alt={college.shortName}
              className="w-5 h-5 rounded-full object-contain bg-white border border-gray-100"
              onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(college.shortName)}&background=6D28D9&color=fff&size=20`; }}
            />
            <span className="text-xs font-medium text-gray-700">{college.shortName}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => onLoad(collegeIds, savedId)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:border-[#6D28D9] hover:text-[#6D28D9] transition-colors"
      >
        Load & Compare <ChevronRight size={15} />
      </button>
    </div>
  );
}

// ─── Header Action Bar ─────────────────────────────────────────────────────────
function ActiveTabHeader({ title, count, onClear, clearLabel = "Clear all" }: {
  title: string; count: number; onClear?: () => void; clearLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200/60 pb-4 mb-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {count > 0 && (
          <span className="text-xs font-semibold text-gray-500 bg-gray-200/60 px-2.5 py-0.5 rounded-full">{count}</span>
        )}
      </div>
      {onClear && count > 0 && (
        <button onClick={onClear} className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-semibold transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl">
          <Trash2 size={13} /> {clearLabel}
        </button>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SavedPage() {
  const [tab, setTab] = useState<Tab>("saved-colleges");

  // Clear search whenever the active tab changes
  useEffect(() => {
    router.push("/saved");
  }, [tab]);
  const [collegeMap, setCollegeMap] = useState<Map<string, College>>(new Map());
  const [loading, setLoading] = useState(true);

  const [pendingSave, setPendingSave] = useState<{ ids: string[]; label: string } | null>(null);

  const { savedIds, clearAll: clearSaved } = useSavedCollegesStore();
  const { comparisons, removeComparison, clearAll: clearComparisons, saveComparison } = useSavedComparisonsStore();
  const { recentComparisons, clearRecentComparisons } = useRecentComparisonsStore();
  const { viewedIds, clearHistory: clearRecentlyViewed } = useRecentlyViewedStore();
  const { clear: clearTray, toggle: toggleTray } = useCompareTrayStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Search query from the header search bar (?search=...) ──
  const searchQuery = (searchParams.get("search") || "").trim();
  const clearSearch = () => router.push("/saved");

  useEffect(() => {
    const allIds = Array.from(new Set([
      ...savedIds,
      ...viewedIds,
      ...comparisons.flatMap((c) => c.collegeIds),
      ...recentComparisons.flatMap((r) => r.collegeIds),
    ]));

    if (allIds.length === 0) {
      setCollegeMap(new Map());
      setLoading(false);
      return;
    }

    setLoading(true);
    const params = new URLSearchParams();
    allIds.forEach((id) => params.append("ids", id));
    fetch(`/api/colleges?${params}`)
      .then((r) => r.json())
      .then((json) => {
        const data = json.data as College[];
        setCollegeMap(new Map(data.map((c) => [c.id, c])));
      })
      .catch(() => setCollegeMap(new Map()))
      .finally(() => setLoading(false));
  }, [
    savedIds.join(","),
    viewedIds.join(","),
    comparisons.map((c) => c.id).join(","),
    recentComparisons.map((r) => r.id).join(","),
  ]);

  const handleLoadComparison = (ids: string[], savedId?: string) => {
    clearTray();
    setTimeout(() => {
      ids.forEach((id) => toggleTray(id));

      if (savedId) {
        router.push(`/compare?source=saved&savedId=${savedId}`);
      } else {
        router.push("/compare?source=recent");
      }
    }, 50);
  };

  const handleQuickSave = (ids: string[]) => {
    const names = ids.map((id) => collegeMap.get(id)?.shortName).filter(Boolean) as string[];
    const defaultLabel = names.length > 0 ? names.join(" vs ") : `${ids.length} colleges`;
    setPendingSave({ ids, label: defaultLabel });
  };

  const savedColleges = savedIds.map((id) => collegeMap.get(id)).filter(Boolean) as College[];
  const recentlyViewedColleges = viewedIds.map((id) => collegeMap.get(id)).filter(Boolean) as College[];

  // ── Search matching helpers ──
  const collegeMatches = (college: College) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      college.name.toLowerCase().includes(q) ||
      college.shortName.toLowerCase().includes(q) ||
      college.location.toLowerCase().includes(q)
    );
  };

  const comparisonMatches = (label: string, collegeIds: string[]) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    if (label.toLowerCase().includes(q)) return true;
    return collegeIds.some((id) => {
      const c = collegeMap.get(id);
      return c ? collegeMatches(c) : false;
    });
  };

  const filteredSavedColleges = useMemo(
    () => savedColleges.filter(collegeMatches),
    [savedColleges, searchQuery]
  );

  const filteredRecentlyViewed = useMemo(
    () => recentlyViewedColleges.filter(collegeMatches),
    [recentlyViewedColleges, searchQuery]
  );

  const filteredComparisons = useMemo(
    () => comparisons.filter((c) => comparisonMatches(c.label, c.collegeIds)),
    [comparisons, searchQuery, collegeMap]
  );

  const filteredRecentComparisons = useMemo(
    () =>
      recentComparisons.filter((r) => {
        const autoLabel = r.collegeIds
          .map((id) => collegeMap.get(id)?.shortName)
          .filter(Boolean)
          .join(" vs ");
        return comparisonMatches(autoLabel, r.collegeIds);
      }),
    [recentComparisons, searchQuery, collegeMap]
  );

  const renderSkeletonGrid = (count = 3) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse h-64">
          <div className="h-40 bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">

        <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workspace</h1>
            <p className="text-sm text-gray-500 mt-0.5">Track bookmarks, execution histories, and saved comparison models.</p>
          </div>
          {searchQuery && (
            <div className="flex items-center gap-2 text-sm bg-purple-50 text-[#6D28D9] px-3 py-1.5 rounded-xl border border-purple-100">
              <SearchIcon size={14} />
              <span>Showing results for &ldquo;{searchQuery}&rdquo;</span>
              <button onClick={clearSearch} className="hover:text-[#5b21b6]">
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* 4 Tabs Side-by-Side Strip */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-full overflow-x-auto no-scrollbar mb-8 border border-gray-200/40">
          <button
            onClick={() => setTab("saved-colleges")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0",
              tab === "saved-colleges" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Heart size={14} className="text-[#FB7185] fill-[#FB7185]" /> Saved Colleges
            {savedIds.length > 0 && (
              <span className={cn("w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center", tab === "saved-colleges" ? "bg-[#FB7185] text-white" : "bg-gray-300 text-gray-600")}>
                {savedIds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setTab("recently-viewed")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0",
              tab === "recently-viewed" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Clock size={14} /> Recently Viewed
            {viewedIds.length > 0 && (
              <span className={cn("w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center", tab === "recently-viewed" ? "bg-[#6D28D9] text-white" : "bg-gray-300 text-gray-600")}>
                {viewedIds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setTab("saved-comparisons")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0",
              tab === "saved-comparisons" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Heart size={14} className="text-[#FB7185] fill-[#FB7185]" /> Saved Comparisons
            {comparisons.length > 0 && (
              <span className={cn("w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center", tab === "saved-comparisons" ? "bg-[#6D28D9] text-white" : "bg-gray-300 text-gray-600")}>
                {comparisons.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setTab("recent-comparisons")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0",
              tab === "recent-comparisons" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <History size={14} /> Recent Comparisons
            {recentComparisons.length > 0 && (
              <span className={cn("w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center", tab === "recent-comparisons" ? "bg-[#6D28D9] text-white" : "bg-gray-300 text-gray-600")}>
                {recentComparisons.length}
              </span>
            )}
          </button>
        </div>

        {/* ── TAB CONTENT RENDERING ── */}
        <div className="min-h-[400px]">
          {tab === "saved-colleges" && (
            <section>
              <ActiveTabHeader title="Saved Colleges" count={savedIds.length} onClear={clearSaved} clearLabel="Remove all" />
              {loading ? (
                renderSkeletonGrid()
              ) : savedColleges.length === 0 ? (
                <EmptySavedColleges />
              ) : filteredSavedColleges.length === 0 ? (
                <NoSearchResults query={searchQuery} onClear={clearSearch} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredSavedColleges.map((college) => (
                    <CollegeCard key={college.id} college={college} />
                  ))}
                </div>
              )}
            </section>
          )}

          {tab === "recently-viewed" && (
            <section>
              <ActiveTabHeader title="Recently Viewed Profiles" count={viewedIds.length} onClear={clearRecentlyViewed} clearLabel="Clear history" />
              {loading ? (
                renderSkeletonGrid()
              ) : recentlyViewedColleges.length === 0 ? (
                <EmptyRecentlyViewed />
              ) : filteredRecentlyViewed.length === 0 ? (
                <NoSearchResults query={searchQuery} onClear={clearSearch} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredRecentlyViewed.map((college) => (
                    <CollegeCard key={college.id} college={college} />
                  ))}
                </div>
              )}
            </section>
          )}

          {tab === "saved-comparisons" && (
            <section>
              <ActiveTabHeader title="Saved Target Comparisons" count={comparisons.length} onClear={clearComparisons} clearLabel="Remove all" />
              {comparisons.length === 0 ? (
                <EmptySavedComparisons />
              ) : filteredComparisons.length === 0 ? (
                <NoSearchResults query={searchQuery} onClear={clearSearch} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[...filteredComparisons]
                    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
                    .map((comp) => (
                      <ComparisonSetCard
                        key={comp.id}
                        id={comp.id}
                        label={comp.label}
                        collegeIds={comp.collegeIds}
                        savedAt={comp.savedAt}
                        allColleges={collegeMap}
                        onLoad={handleLoadComparison}
                        onDelete={removeComparison}
                      />
                    ))}
                </div>
              )}
            </section>
          )}

          {tab === "recent-comparisons" && (
            <section>
              <ActiveTabHeader title="Recent Comparison History" count={recentComparisons.length} onClear={clearRecentComparisons} clearLabel="Clear history" />
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse h-48" />
                  ))}
                </div>
              ) : recentComparisons.length === 0 ? (
                <EmptyRecentComparisons />
              ) : filteredRecentComparisons.length === 0 ? (
                <NoSearchResults query={searchQuery} onClear={clearSearch} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredRecentComparisons.map((recent) => {
                    const currentRecentKey = [...recent.collegeIds].sort().join(",");
                    const matchingSaved = comparisons.find(
                      (c) => [...c.collegeIds].sort().join(",") === currentRecentKey
                    );

                    return (
                      <RecentComparisonCard
                        key={recent.id}
                        collegeIds={recent.collegeIds}
                        viewedAt={recent.viewedAt}
                        allColleges={collegeMap}
                        onLoad={handleLoadComparison}
                        onSave={handleQuickSave}
                        isSaved={!!matchingSaved}
                        customLabel={matchingSaved?.label}
                        savedId={matchingSaved?.id}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {pendingSave && (
        <SaveModal
          initialLabel={pendingSave.label}
          onClose={() => setPendingSave(null)}
          onSave={(customLabel) => {
            saveComparison(customLabel, pendingSave.ids);
          }}
        />
      )}
    </div>
  );
}