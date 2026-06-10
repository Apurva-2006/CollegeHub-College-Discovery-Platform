"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Scale, Bookmark, Search, LogIn, GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCompareTrayStore } from "@/store/comparetraystore";
import { useSavedCollegesStore } from "@/store/savedcollegestore";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const compareIds = useCompareTrayStore((s) => s.compareIds);
  const savedIds = useSavedCollegesStore((s) => s.savedIds);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(value.trim())}`);
    } else {
      router.push("/colleges");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(searchValue);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#6D28D9] flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">CollegeHub</span>
        </Link>

        {/* Colleges nav link only */}
        <nav className="hidden md:flex items-center shrink-0">
          <Link
            href="/colleges"
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              pathname === "/colleges"
                ? "text-[#6D28D9] bg-purple-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            Colleges
          </Link>
        </nav>

        {/* Search bar — takes all remaining space */}
        <div className="hidden md:flex flex-1">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search colleges, courses, locations..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition"
            />
            {searchValue && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-1 shrink-0">
          <Link
            href="/compare"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <Scale size={16} />
            <span>Compare</span>
            {compareIds.length > 0 && (
              <span className="ml-0.5 w-4 h-4 rounded-full bg-[#6D28D9] text-white text-[10px] font-bold flex items-center justify-center">
                {compareIds.length}
              </span>
            )}
          </Link>

          <Link
            href="/saved"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <Bookmark size={16} />
            <span>Saved</span>
            {savedIds.length > 0 && (
              <span className="ml-0.5 w-5 h-5 rounded-full bg-[#FB7185] text-white text-[10px] font-bold flex items-center justify-center">
                {savedIds.length}
              </span>
            )}
          </Link>

          <Link
            href="/signin"
            className="flex items-center gap-1.5 ml-1 px-4 py-1.5 rounded-lg bg-[#6D28D9] text-white text-sm font-medium hover:bg-[#5b21b6] transition-colors"
          >
            <LogIn size={15} />
            <span>Sign in</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden ml-auto p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search colleges, courses..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition"
            />
          </div>
          <Link
            href="/colleges"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === "/colleges"
                ? "text-[#6D28D9] bg-purple-50"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            Colleges
          </Link>
          <Link
            href="/compare"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <Scale size={15} /> Compare
            {compareIds.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#6D28D9] text-white text-[10px] font-bold flex items-center justify-center">
                {compareIds.length}
              </span>
            )}
          </Link>
          <Link
            href="/saved"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <Bookmark size={15} /> Saved
            {savedIds.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#FB7185] text-white text-[10px] font-bold flex items-center justify-center">
                {savedIds.length}
              </span>
            )}
          </Link>
          <Link
            href="/signin"
            className="flex items-center gap-2 mt-2 w-full justify-center py-2 rounded-lg bg-[#6D28D9] text-white text-sm font-medium"
          >
            <LogIn size={15} /> Sign in
          </Link>
        </div>
      )}
    </header>
  );
}