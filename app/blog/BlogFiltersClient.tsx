// src/app/blog/BlogFiltersClient.tsx
"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function BlogFiltersClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";

  function setQuery(newQ: string) {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (newQ) params.set("q", newQ);
    else params.delete("q");
    const s = params.toString();
    router.push(`/blog${s ? `?${s}` : ""}`);
  }

  function setCategory(cat: string) {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (cat) params.set("category", cat);
    else params.delete("category");
    const s = params.toString();
    router.push(`/blog${s ? `?${s}` : ""}`);
  }

  return (
    <div className="flex gap-3 items-center mt-4">
      <input
        value={q}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
        className="px-3 py-2 border rounded w-full md:w-64"
        aria-label="Search posts"
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 border rounded">
        <option value="">All categories</option>
        <option value="Plant Care">Plant Care</option>
        <option value="Fertilizers">Fertilizers</option>
        <option value="Tools">Tools</option>
      </select>
    </div>
  );
}
