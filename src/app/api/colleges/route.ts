import { NextRequest, NextResponse } from "next/server";
import colleges from "@/data/colleges.json";
import { College } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search")?.toLowerCase() || "";
  const states = searchParams.getAll("state");
  const cities = searchParams.getAll("city");
  const feeRanges = searchParams.getAll("fee");
  const ratings = searchParams.getAll("rating");
  const avgPackages = searchParams.getAll("avgPackage");
  const highestPackages = searchParams.getAll("highestPackage");
  const placementPcts = searchParams.getAll("placementPct");
  const nirfRanges = searchParams.getAll("nirf");
  const courses = searchParams.getAll("course");
  const ownership = searchParams.getAll("ownership");
  const sortBy = searchParams.get("sortBy") || "nirfRank";

  let result = colleges as College[];

  // Search
  if (search) {
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.shortName.toLowerCase().includes(search) ||
        c.location.toLowerCase().includes(search) ||
        c.popularCourses.some((p) => p.toLowerCase().includes(search))
    );
  }

  // State filter
  if (states.length) result = result.filter((c) => states.includes(c.state));

  // City filter
  if (cities.length) result = result.filter((c) => cities.includes(c.city));

  // Ownership
  if (ownership.length) result = result.filter((c) => ownership.includes(c.ownership));

  // Courses
  if (courses.length)
    result = result.filter((c) =>
      courses.some((course) => c.popularCourses.includes(course))
    );

  // Fee range
  if (feeRanges.length) {
    result = result.filter((c) => {
      return feeRanges.some((range) => {
        if (range === "below1L") return c.startingFee < 100000;
        if (range === "1to5L") return c.startingFee >= 100000 && c.startingFee < 500000;
        if (range === "5to10L") return c.startingFee >= 500000 && c.startingFee < 1000000;
        if (range === "above10L") return c.startingFee >= 1000000;
        return false;
      });
    });
  }

  // Rating
  if (ratings.length) {
    const minRating = Math.max(...ratings.map(Number));
    result = result.filter((c) => c.overallRating >= minRating);
  }

  // Avg package
  if (avgPackages.length) {
    const thresholds: Record<string, number> = {
      above5: 500000, above10: 1000000, above20: 2000000,
    };
    const minPkg = Math.max(...avgPackages.map((k) => thresholds[k] ?? 0));
    result = result.filter((c) => c.averagePackage >= minPkg);
  }

  // Highest package
  if (highestPackages.length) {
    const thresholds: Record<string, number> = {
      above25: 2500000, above50: 5000000, above1Cr: 10000000,
    };
    const minPkg = Math.max(...highestPackages.map((k) => thresholds[k] ?? 0));
    result = result.filter((c) => c.highestPackage >= minPkg);
  }

  // Placement %
  if (placementPcts.length) {
    const thresholds: Record<string, number> = {
      above60: 60, above80: 80, above90: 90,
    };
    const minPct = Math.max(...placementPcts.map((k) => thresholds[k] ?? 0));
    result = result.filter((c) => c.placementPercentage >= minPct);
  }

  // NIRF range
  if (nirfRanges.length) {
    const maxRank = Math.min(
      ...nirfRanges.map((r) => {
        if (r === "top10") return 10;
        if (r === "top50") return 50;
        if (r === "top100") return 100;
        return 9999;
      })
    );
    result = result.filter((c) => c.nirfRank != null && c.nirfRank <= maxRank);
  }

  // Sort
  result = [...result].sort((a, b) => {
    switch (sortBy) {
      case "nirfRank": return (a.nirfRank ?? 9999) - (b.nirfRank ?? 9999);
      case "rating": return b.overallRating - a.overallRating;
      case "avgPackage": return b.averagePackage - a.averagePackage;
      case "highestPackage": return b.highestPackage - a.highestPackage;
      case "fees": return a.startingFee - b.startingFee;
      case "placement": return b.placementPercentage - a.placementPercentage;
      default: return (a.nirfRank ?? 9999) - (b.nirfRank ?? 9999);
    }
  });

  return NextResponse.json({ data: result, total: result.length });
}