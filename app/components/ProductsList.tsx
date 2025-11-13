// components/ProductsList.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Product } from "../lib/products";
import { useCart } from "../context/CartContext";

type Props = { products: Product[] };

export default function ProductsList({ products }: Props) {
  const CATEGORIES = ["Plants", "Tools", "Fertilizers", "Pots"];
  const INITIAL = 6;
  const STEP = 3;

  const [visible, setVisible] = useState<number>(INITIAL);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();

  const { items: cart, toggle, remove, add, count, clear } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  // reset visible when filters/sort change so UI stays consistent
  useEffect(() => {
    setVisible(INITIAL);
  }, [selectedCategories, minPrice, maxPrice, sortBy]);

  const toggleCategory = (c: string) =>
    setSelectedCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const filtered = useMemo(() => {
    let list = products.slice();

    if (selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.category));
    }

    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [products, selectedCategories, minPrice, maxPrice, sortBy]);

  const visibleProducts = filtered.slice(0, visible);

  function handleShowMore() {
    setVisible((prev) => Math.min(filtered.length, prev + STEP));
  }

  function handleShowLess() {
    setVisible(INITIAL);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const containerVariants = {
    hidden: { opacity: 0, y: reduced ? 0 : 8 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06, when: "beforeChildren" } }
  } as const;
  const cardVariants = {
    hidden: { opacity: 0, y: reduced ? 0 : 10, scale: reduced ? 1 : 0.995 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 24 } }
  } as const;

  return (
    <main className="bg-[#F6F6EE] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <nav className="text-xs text-gray-500 mb-2">
              <Link href="/">Home</Link> <span className="mx-2">/</span> <Link href="/products">Products</Link>
            </nav>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0E2D1B]">Plants</h1>
            <p className="text-sm text-gray-600 mt-1">Showing {filtered.length} products</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#0E2D1B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="19" cy="20" r="1" />
              </svg>
              <span className="text-sm">Cart</span>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#E58E26] text-white text-xs font-semibold px-2 py-0.5 rounded-full">{count}</span>
              )}
            </Link>

            <button
              onClick={() => clear()}
              className="text-sm text-gray-600 px-3 py-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50"
              aria-label="Clear cart"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 bg-white rounded-lg shadow p-4 sticky top-24 self-start h-fit">
            <h3 className="font-semibold text-[#0E2D1B] mb-3">Filter Products</h3>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
              <div className="space-y-2">
                {CATEGORIES.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(c)}
                      onChange={() => toggleCategory(c)}
                      className="w-4 h-4"
                      aria-checked={selectedCategories.includes(c)}
                    />
                    <span className="text-gray-700">{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-1/2 p-2 text-sm border rounded"
                  placeholder="Min"
                  min={0}
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-1/2 p-2 text-sm border rounded"
                  placeholder="Max"
                  min={0}
                />
              </div>
            </div>

            <div>
              <button
                onClick={() => {
                  setVisible(INITIAL);
                }}
                className="w-full bg-[#0E2D1B] text-white py-2 rounded-md"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          <section className="lg:col-span-9">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <div className="text-sm text-gray-600">Showing {visibleProducts.length} of {filtered.length} products</div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Sort by</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border rounded text-sm">
                  <option value="popular">Popular</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={mounted ? "show" : "hidden"}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {visibleProducts.map((p) => (
                <motion.article key={p.id} variants={cardVariants} className="bg-white rounded-2xl shadow overflow-hidden hover:shadow-xl transition">
                  <div className="relative h-44 w-full">
                    <Image src={p.image} alt={p.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>

                  <div className="p-4">
                    <span className="text-xs text-gray-500">{p.category}</span>
                    <h3 className="text-lg font-semibold text-[#0E2D1B] mt-1">{p.name}</h3>

                    <div className="mt-2 flex items-center gap-1 text-[#E58E26]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" fill={i < Math.round(p.rating) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2" className="w-4 h-4" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.5a.75.75 0 011.04 0l2.37 2.44 3.3.48a.75.75 0 01.42 1.28l-2.39 2.33.56 3.27a.75.75 0 01-1.09.79L12 12.87l-2.93 1.54a.75.75 0 01-1.09-.79l.56-3.27-2.39-2.33a.75.75 0 01.42-1.28l3.3-.48L11.48 3.5z" />
                        </svg>
                      ))}
                      <span className="text-xs text-gray-500 ml-2">({p.reviews})</span>
                    </div>

                    <p className="mt-3 text-[#E58E26] font-semibold">৳ {p.price}</p>

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => toggle(p.id)}
                        className={`flex-1 py-2 rounded-full text-sm font-medium transition ${cart.includes(p.id) ? "bg-[#0E2D1B] text-white" : "bg-[#E58E26] text-white hover:bg-[#f7a23a]"}`}
                        aria-pressed={cart.includes(p.id)}
                      >
                        {cart.includes(p.id) ? "Added to cart" : "Add to cart"}
                      </button>

                      <Link href={`/products/${p.id}`} className="py-2 px-3 rounded-full border border-gray-200 text-sm text-[#0E2D1B] hover:bg-gray-50">
                        View
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>

            <div className="mt-8 flex items-center justify-center gap-4">
              {visible < filtered.length && (
                <button onClick={handleShowMore} className="bg-[#E58E26] text-white px-6 py-2 rounded-full hover:bg-[#f7a23a] transition">
                  Load more products
                </button>
              )}
              {visible > INITIAL && (
                <button onClick={handleShowLess} className="bg-white border border-gray-200 text-[#0E2D1B] px-6 py-2 rounded-full hover:bg-gray-50 transition">
                  Show less
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
