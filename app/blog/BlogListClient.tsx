"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import type { Post } from "../lib/posts";
import BlogSidebar from "../components/BlogSidebar";
import ShareBar from "../components/ShareBar";

type Props = { posts?: Post[] };

export default function BlogListClient({ posts = [] }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams?.get("category") ?? "";
  const qParam = searchParams?.get("q") ?? "";

  function setQueryParam(key: string, value?: string) {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value && value.length > 0) params.set(key, value);
    else params.delete(key);
    const s = params.toString();
    router.push(`/blog${s ? `?${s}` : ""}`);
  }

  // ✅ Filter posts safely
  const filtered = useMemo(() => {
    if (!Array.isArray(posts)) return [];
    return posts.filter((p) => {
      if (categoryParam && p.category !== categoryParam) return false;
      if (qParam && qParam.length > 0) {
        const q = qParam.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(q);
        const inExcerpt = p.excerpt.toLowerCase().includes(q);
        return inTitle || inExcerpt;
      }
      return true;
    });
  }, [posts, categoryParam, qParam]);

  const categories = Array.from(new Set(posts.map((p) => p.category))).filter(Boolean);

  if (!posts || posts.length === 0) {
    return <div className="text-center py-10 text-gray-600">No blog posts found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Main list */}
      <div className="md:col-span-3">
        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              aria-label="Search posts"
              defaultValue={qParam}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  setQueryParam("q", (e.target as HTMLInputElement).value);
              }}
              placeholder="Search posts... (press Enter)"
              className="w-full md:w-80 px-3 py-2 border rounded"
            />
            <button
              onClick={() => {
                const el = document.querySelector<HTMLInputElement>(
                  'input[aria-label="Search posts"]'
                );
                setQueryParam("q", el?.value ?? "");
              }}
              className="px-3 py-2 bg-[#0E2D1B] text-white rounded"
            >
              Search
            </button>
            <button
              onClick={() => setQueryParam("q", "")}
              className="px-3 py-2 bg-gray-100 rounded"
            >
              Clear
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <select
              value={categoryParam}
              onChange={(e) => setQueryParam("category", e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, idx) => (
            <article
              key={p.id}
              className="bg-white rounded-2xl shadow overflow-hidden will-animate"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="relative h-44 w-full">
                <img
                  src={p.hero}
                  alt={p.title}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>

              <div
                className="p-5 animate-fade-up"
                style={{ animationDelay: `${idx * 60 + 40}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="text-xs text-gray-400">
                    {p.category} • {p.minutesToRead ?? 3} min read
                  </div>
                  <ShareBar post={p} />
                </div>

                <h2 className="text-lg font-semibold text-[#0E2D1B] mt-1">
                  <Link href={`/blog/${p.id}`} className="hover:underline">
                    {p.title}
                  </Link>
                </h2>

                <p className="text-sm text-gray-600 mt-2">{p.excerpt}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {new Date(p.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    <Link
                      href={`/blog/${p.id}`}
                      className="text-[#E58E26] hover:opacity-95"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full bg-white rounded-xl p-6 text-center text-gray-600">
              No posts match your filters.
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-6">
        <BlogSidebar posts={posts} />
      </aside>
    </div>
  );
}
