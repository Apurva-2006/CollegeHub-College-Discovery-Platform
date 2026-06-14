"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function EmptyCompare() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6D28D9] to-[#06b6d4] flex items-center justify-center mb-5 shadow-lg shadow-purple-200">
        <Plus size={28} className="text-white" strokeWidth={2.5} />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2">Start comparing colleges</h2>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
        Pick 2–5 colleges to compare side-by-side on fees, packages, rankings and more.
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