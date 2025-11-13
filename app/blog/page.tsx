'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { getAllPosts, Post } from '../lib/posts';
import BlogSidebar from '../components/BlogSidebar';
import ShareBar from '../components/ShareBar';

export default function BlogListPage() {
  // read posts synchronously (from local module)
  const allPosts: Post[] = getAllPosts();

  // URL-driven filters (sidebar updates these params)
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get('category') ?? '';
  const qParam = searchParams?.get('q') ?? '';

  // client-side visible count for Show More
  const [visibleCount, setVisibleCount] = useState(6);

  // filtered posts based on category + query
  const filtered = useMemo(() => {
    return allPosts.filter((p) => {
      // category filter
      if (categoryParam && categoryParam.length > 0 && p.category !== categoryParam) return false;
      // query filter (search title + excerpt)
      if (qParam && qParam.length > 0) {
        const q = qParam.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(q);
        const inExcerpt = p.excerpt.toLowerCase().includes(q);
        return inTitle || inExcerpt;
      }
      return true;
    });
  }, [allPosts, categoryParam, qParam]);

  const visiblePosts = filtered.slice(0, visibleCount);

  return (
    <section className="min-h-screen bg-[#F6F6EE] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0E2D1B]">The TriGardening Journal</h1>
          <p className="text-sm text-gray-600 mt-2">Your slogan goes here</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Main list - spans 3 cols on md+ */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visiblePosts.map((p, idx) => (
                <article
                  key={p.id}
                  className="bg-white rounded-2xl shadow overflow-hidden will-animate"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="relative h-44 w-full">
                    <img src={p.hero} alt={p.title}  className="object-cover" />
                  </div>

                  <div className="p-5 animate-fade-up" style={{ animationDelay: `${idx * 60 + 40}ms` }}>
                    <div className="flex items-start justify-between">
                      <div className="text-xs text-gray-400">{p.category} • {p.minutesToRead ?? 3} min read</div>
                      <ShareBar post={p} />
                    </div>

                    {/* Title only is clickable */}
                    <h2 className="text-lg font-semibold text-[#0E2D1B] mt-1">
                      <Link href={`/blog/${p.id}`} className="hover:underline">{p.title}</Link>
                    </h2>

                    <p className="text-sm text-gray-600 mt-2">{p.excerpt}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-gray-500">{new Date(p.date).toLocaleDateString()}</div>
                      <div className="text-sm">
                        <Link href={`/blog/${p.id}`} className="text-[#E58E26] hover:opacity-95">Read More</Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {/* If there are no results */}
              {filtered.length === 0 && (
                <div className="col-span-full bg-white rounded-xl p-6 text-center text-gray-600">
                  No posts found.
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-center">
              {visibleCount < filtered.length ? (
                <button
                  onClick={() => setVisibleCount(c => Math.min(filtered.length, c + 6))}
                  className="px-6 py-2 bg-[#0E2D1B] text-white rounded-full"
                >
                  Show More Articles
                </button>
              ) : (
                filtered.length > 0 && (
                  <button
                    onClick={() => setVisibleCount(6)}
                    className="px-6 py-2 bg-gray-200 text-[#0E2D1B] rounded-full"
                  >
                    Show Less
                  </button>
                )
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <BlogSidebar posts={allPosts} />
          </aside>
        </div>
      </div>
    </section>
  );
}
