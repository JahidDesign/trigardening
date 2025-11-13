'use client';

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post } from '../lib/posts';

// Respect prefers-reduced-motion
function usePrefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export default function BlogSidebar({ posts }: { posts: Post[] }) {
  const sorted = [...posts].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );
  const recent = sorted.slice(0, 4);

  const counts = sorted.reduce<Record<string, number>>((acc, p) => {
    const key = p.category ?? 'Uncategorized';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const categories = Object.keys(counts);

  const reduced = usePrefersReducedMotion();
  const mountedRef = useRef(false);

  // variants defined after we know `reduced` (optional — keeps logic clear)
  const container = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, when: 'beforeChildren' },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 260, damping: 20 },
    },
  };

  if (typeof window !== 'undefined' && !mountedRef.current) {
    mountedRef.current = true;
  }

  return (
    <aside className="space-y-6 w-full md:w-80" aria-labelledby="sidebar-heading">
      <AnimatePresence>
        <motion.div
          initial={reduced ? false : 'hidden'}
          animate={reduced ? false : 'show'}
          variants={reduced ? undefined : container}
          className="space-y-6"
        >
          {/* Search */}
          <motion.div variants={reduced ? undefined : item} className="bg-white p-4 rounded-xl shadow">
            <label htmlFor="search-articles" className="sr-only">
              Search articles
            </label>
            <input
              id="search-articles"
              type="text"
              placeholder="Search articles..."
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#0E2D1B]/30"
            />
          </motion.div>

          {/* Categories */}
          <motion.details variants={reduced ? undefined : item} className="bg-white p-4 rounded-xl shadow" open>
            <summary className="flex items-center justify-between cursor-pointer list-none text-sm text-gray-700 font-semibold md:hidden">
              Blog Categories
              <span className="text-xs text-gray-400">Show</span>
            </summary>

            <div className="mt-0 md:mt-0">
              <h3 className="hidden md:block font-semibold text-sm text-gray-700 mb-3">
                Blog Categories
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {categories.map((category) => (
                  <li
                    key={category}
                    className="flex items-center justify-between hover:bg-gray-50 rounded-md px-2 py-1 transition"
                  >
                    <span className="text-[#0E2D1B] font-medium truncate">
                      {category}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {counts[category]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.details>

          {/* Recent posts */}
          <motion.details variants={reduced ? undefined : item} className="bg-white p-4 rounded-xl shadow" open>
            <summary className="flex items-center justify-between cursor-pointer list-none text-sm text-gray-700 font-semibold md:hidden">
              Recent Posts
              <span className="text-xs text-gray-400">Show</span>
            </summary>

            <div className="mt-0 md:mt-0">
              <h3 className="hidden md:block font-semibold text-sm text-gray-700 mb-3">
                Recent Posts
              </h3>
              <ul className="space-y-3">
                {recent.map((r) => (
                  <li key={r.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 relative rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={r.hero}
                        alt={r.title}
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-[#0E2D1B] line-clamp-2 block">
                        {r.title}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Intl.DateTimeFormat(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }).format(new Date(r.date))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.details>

          {/* Newsletter */}
          <motion.div
            variants={reduced ? undefined : item}
            className="bg-white p-4 rounded-xl shadow text-center"
          >
            <h4 className="font-semibold text-base text-[#0E2D1B]">
              Subscribe to our Newsletter
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Get the latest gardening tips & updates.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-3 flex gap-2"
              aria-label="Subscribe to newsletter"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Your email"
                className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E2D1B]/30"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#0E2D1B] text-white text-sm rounded-md hover:bg-[#124d2a] transition"
              >
                Join
              </button>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}
