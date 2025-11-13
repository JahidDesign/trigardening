'use client';

import Image from "next/image";
import { Post } from "../../lib/posts";

export default function BlogSidebar({ posts }: { posts: Post[] }) {
  // Ensure every post has a category, defaulting to "Uncategorized"
  const categories = Array.from(
    new Set(posts.map((p) => p.category || "Uncategorized"))
  );
  const recent = posts.slice(0, 4);

  return (
    <aside className="space-y-6">
      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow">
        <input
          type="text"
          placeholder="Search articles..."
          className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0E2D1B]/30"
        />
      </div>

      {/* Categories */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold text-sm text-gray-700 mb-3">Blog Categories</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {categories.map((category) => {
            const count = posts.filter(
              (p) => (p.category || "Uncategorized") === category
            ).length;
            return (
              <li
                key={category || "Uncategorized"}
                className="flex items-center justify-between hover:bg-gray-50 rounded-md px-2 py-1 transition"
              >
                <span className="text-[#0E2D1B] font-medium">{category}</span>
                <span className="text-xs text-gray-400">{count}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Recent posts */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold text-sm text-gray-700 mb-3">Recent Posts</h3>
        <ul className="space-y-3">
          {recent.map((r) => (
            <li key={r.id} className="flex items-center gap-3">
              <div className="w-12 h-12 relative rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={r.hero}
                  alt={r.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-medium text-[#0E2D1B] line-clamp-2 block">
                  {r.title}
                </span>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(r.date).toLocaleDateString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter */}
      <div className="bg-white p-4 rounded-xl shadow text-center">
        <h4 className="font-semibold text-base text-[#0E2D1B]">
          Subscribe to our Newsletter
        </h4>
        <p className="text-xs text-gray-500 mt-1">
          Get the latest gardening tips & updates.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="mt-3 flex gap-2">
          <input
            type="email"
            placeholder="Your email"
            className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E2D1B]/30"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#0E2D1B] text-white text-sm rounded-md hover:bg-[#124d2a] transition"
          >
            Join
          </button>
        </form>
      </div>
    </aside>
  );
}
