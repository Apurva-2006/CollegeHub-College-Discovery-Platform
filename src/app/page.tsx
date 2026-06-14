import Link from "next/link";
import {
  Search,
  ArrowRight,
  Star,
  MapPin,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Users,
  ShieldCheck,
  RefreshCw,
  Heart,
  Scale,
  ExternalLink,
  Bookmark,
  Cpu,
  Briefcase,
  Stethoscope,
  LayoutGrid,
  Palette,
  BarChart2,
  Code2,
  GraduationCap,
} from "lucide-react";
import colleges from "@/data/colleges.json";
import reviews from "@/data/reviews.json";
import CollegeCard from "@/components/colleges/CollegeCard";

// ─── helpers ────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n >= 10000000
    ? `₹${(n / 10000000).toFixed(1)} Cr`
    : n >= 100000
    ? `₹${(n / 100000).toFixed(1)} L`
    : `₹${(n / 100000).toFixed(0)}K`;

const fmtLPA = (n: number) => `₹${(n / 100000).toFixed(1)} LPA`;

// ─── data slices ─────────────────────────────────────────────────────────────
const featured = (colleges as any[])
  .filter((c) => c.featured)
  .slice(0, 3);

const topRanked = [...(colleges as any[])]
  .filter((c) => c.nirfRank)
  .sort((a, b) => a.nirfRank - b.nirfRank)
  .slice(0, 4);

const topPlacement = [...(colleges as any[])]
  .filter((c) => c.topPlacement)
  .sort((a, b) => b.averagePackage - a.averagePackage)
  .slice(0, 3);

const highlightedReviews = (reviews as any[]).slice(0, 6);

const STREAMS = [
  { name: "B.Tech", desc: "Engineering undergraduate programs", count: "18+", icon: Cpu, color: "bg-purple-50 text-purple-600" },
  { name: "MBA", desc: "Management postgraduate programs", count: "12+", icon: Briefcase, color: "bg-teal-50 text-teal-600" },
  { name: "MBBS", desc: "Medical undergraduate programs", count: "6+", icon: Stethoscope, color: "bg-rose-50 text-rose-500" },
  { name: "B.Com", desc: "Commerce undergraduate programs", count: "4+", icon: LayoutGrid, color: "bg-amber-50 text-amber-600" },
  { name: "BBA", desc: "Business administration programs", count: "7+", icon: BarChart2, color: "bg-green-50 text-green-600" },
  { name: "BCA", desc: "Computer applications programs", count: "6+", icon: Code2, color: "bg-indigo-50 text-indigo-600" },
  { name: "M.Tech", desc: "Engineering postgraduate programs", count: "14+", icon: GraduationCap, color: "bg-violet-50 text-violet-600" },
];

const BROWSE_STREAMS = [
  { name: "Engineering", count: 8 },
  { name: "Management", count: 5 },
  { name: "Medical", count: 4 },
  { name: "Commerce", count: 4 },
];

// ─── sub-components ──────────────────────────────────────────────────────────
function SectionHeader({
  eyebrow,
  title,
  subtitle,
  href,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-7">
      <div>
        <span className="text-xs font-semibold text-[#6D28D9] bg-purple-50 px-3 py-1 rounded-full">{eyebrow}</span>
        <h2 className="text-2xl font-bold text-gray-900 mt-2">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      {href && (
        <Link href={href} className="hidden sm:flex items-center gap-1 text-sm text-[#6D28D9] font-medium hover:underline">
          View all <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-teal-50/40 pt-16 pb-20 px-4">
        {/* Soft blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Trust badge */}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 shadow-sm px-3 py-1.5 rounded-full mb-6">
            <span className="text-[#6D28D9]">✦</span> Trusted by 2.4M+ students across India
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-gray-900">
            Find Your{" "}
            <span className="text-[#6D28D9]">Perfect</span>{" "}
            <span className="text-[#14B8A6]">College</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
            Search, compare and shortlist colleges based on placements,
            rankings, fees and student reviews — all in one beautiful place.
          </p>

          {/* Search bar */}
          <div className="mt-8 flex items-center gap-2 bg-white border border-gray-200 shadow-lg rounded-2xl px-4 py-2.5 max-w-xl mx-auto">
            <Search size={18} className="text-gray-400 shrink-0" />
            <Link href="/colleges" className="flex-1 text-sm text-gray-400 text-left">
              Search by college, course or city...
            </Link>
            <Link
              href="/colleges"
              className="shrink-0 bg-[#6D28D9] hover:bg-[#5b21b6] text-white text-sm font-semibold px-5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              Search <ArrowRight size={14} />
            </Link>
          </div>

          {/* Stream pills */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {[
              { label: "Engineering", icon: "🖥️", course: "B.Tech" },
              { label: "Management", icon: "💼", course: "MBA" },
              { label: "Medical", icon: "🩺", course: "MBBS" },
              { label: "Commerce", icon: "📊", course: "B.Com" },
            ].map((s) => (
              <Link
                key={s.label}
                href={`/colleges?course=${s.course}`}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:border-purple-300 hover:text-[#6D28D9] px-3 py-1.5 rounded-full transition-colors shadow-sm"
              >
                <span>{s.icon}</span> {s.label}
              </Link>
            ))}
          </div>

          {/* Trust signals */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-[#14B8A6]" /> Verified Data</span>
            <span className="flex items-center gap-1.5"><RefreshCw size={13} className="text-[#6D28D9]" /> Updated Daily</span>
            <span className="flex items-center gap-1.5"><Heart size={13} className="text-[#FB7185]" /> Loved by 12K+ students</span>
          </div>
        </div>
      </section>

      {/* ── FEATURED COLLEGES ─────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-16">
        <SectionHeader
          eyebrow="Featured"
          title="Featured Colleges"
          subtitle="Handpicked institutes shaping India's future leaders"
          href="/colleges?featured=true"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((c) => <CollegeCard key={c.id} college={c} />)}
        </div>
      </section>

      {/* ── TOP RANKED ───────────────────────────────────────────────────── */}
      <section className="bg-gray-50/70 py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="NIRF Rankings"
            title="Top Ranked Colleges"
            subtitle="Powered by official NIRF 2024 data"
            href="/rankings"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {topRanked.map((c, i) => <CollegeCard key={c.id} college={c} rank={i + 1} />)}
          </div>
        </div>
      </section>

      {/* ── BEST PLACEMENT ───────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-16">
        <SectionHeader
          eyebrow="Placements"
          title="Best Placement Colleges"
          subtitle="Where the offers come fastest and biggest"
          href="/colleges?sort=avgPackage"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topPlacement.map((c) => <CollegeCard key={c.id} college={c} />)}
        </div>
      </section>

      {/* ── POPULAR COURSES ──────────────────────────────────────────────── */}
      <section className="bg-gray-50/70 py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="Streams"
            title="Popular Courses"
            subtitle="Pick a stream that matches your ambition"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STREAMS.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.name}
                  href={`/colleges?course=${s.name}`}
                  className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md hover:border-purple-100 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{s.name}</p>
                    <p className="text-xs text-[#6D28D9] mt-0.5">{s.desc}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{s.count} colleges</span>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-[#6D28D9] transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STUDENT REVIEWS ──────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-16">
        <SectionHeader
          eyebrow="Reviews"
          title="What Students Say"
          subtitle="Real stories from real campuses"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {highlightedReviews.map((r: any) => {
            const college = (colleges as any[]).find((c) => c.id === r.collegeId);
            return (
              <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                <MessageSquare size={24} className="text-gray-100" />
                <p className="text-sm text-gray-700 leading-relaxed">{r.review}</p>
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#6D28D9] font-bold text-sm">
                      {r.reviewerName[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{r.reviewerName}</p>
                      <p className="text-[11px] text-gray-400">
                        {college?.shortName} • {r.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className={i < Math.round(r.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PLATFORM STATS ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-teal-50/40 py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full">Platform Stats</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-10">
            India's most loved college platform
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, value: "12.4K+", label: "Colleges Indexed", sub: "+120 this month", color: "bg-purple-50 text-[#6D28D9]" },
              { icon: GraduationCap, value: "38.2K+", label: "Courses Tracked", sub: "Across 25+ streams", color: "bg-teal-50 text-[#14B8A6]" },
              { icon: MessageSquare, value: "184.3K+", label: "Student Reviews", sub: "4.7 avg trust score", color: "bg-rose-50 text-[#FB7185]" },
              { icon: Users, value: "2.4M+", label: "Students Helped", sub: "2.4M+ · growing fast", color: "bg-violet-50 text-violet-600" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
                    <Icon size={20} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{s.label}</p>
                  <p className="text-xs text-[#14B8A6] mt-1 font-medium">{s.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BROWSE BY STREAM + CTA ───────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-[11px] font-semibold text-[#6D28D9] uppercase tracking-widest mb-1">Popular</p>
        <h2 className="text-xl font-bold text-gray-900 mb-5">Browse by stream</h2>

        <div className="flex flex-wrap gap-3 mb-12">
          {BROWSE_STREAMS.map((s) => (
            <Link
              key={s.name}
              href={`/colleges?stream=${s.name}`}
              className="flex items-center justify-between gap-6 bg-white border border-gray-200 rounded-xl px-5 py-3 hover:border-purple-300 hover:shadow-sm transition-all group"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-[#6D28D9] transition-colors">{s.name}</p>
                <p className="text-xs text-gray-400">{s.count} colleges</p>
              </div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-[#6D28D9] transition-colors" />
            </Link>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-[#6D28D9] to-violet-500 rounded-3xl p-8 sm:p-10 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Shortlist smarter, not harder</h2>
          <p className="text-purple-200 text-sm mb-6 max-w-md">
            Save colleges, build side-by-side comparisons and track placements — all in one workspace.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signin"
              className="bg-white text-[#6D28D9] font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-purple-50 transition-colors"
            >
              Create free account
            </Link>
            <Link
              href="/colleges"
              className="bg-white/10 border border-white/30 text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-white/20 transition-colors"
            >
              Explore colleges
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}