'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
};

const productsData: Product[] = [
  { id: 1, name: "Monstera Deliciosa", category: "Indoor Plant", price: "৳ 2,000", rating: 5, reviews: 26, image: "/images/products/monstera.jpg" },
  { id: 2, name: "Organic Compost", category: "Fertilizer", price: "৳ 60", rating: 4, reviews: 12, image: "/images/products/fertilizer.jpg" },
  { id: 3, name: "Pruning Shears", category: "Equipment", price: "৳ 180", rating: 5, reviews: 34, image: "/images/products/shears.jpg" },
  { id: 4, name: "Aloe Vera", category: "Medicinal Plant", price: "৳ 250", rating: 5, reviews: 18, image: "/images/products/aloe.jpg" },
  { id: 5, name: "Snake Plant", category: "Indoor Plant", price: "৳ 1,200", rating: 4, reviews: 40, image: "/images/products/snake.jpg" },
  { id: 6, name: "Ceramic Pot", category: "Pots", price: "৳ 400", rating: 4, reviews: 9, image: "/images/products/pot.jpg" },
  { id: 7, name: "Hose Nozzle", category: "Equipment", price: "৳ 350", rating: 4, reviews: 7, image: "/images/products/nozzle.jpg" },
  { id: 8, name: "Rose Plant", category: "Outdoor Plant", price: "৳ 900", rating: 4, reviews: 15, image: "/images/products/rose.jpg" },
  { id: 9, name: "Liquid Fertilizer", category: "Fertilizer", price: "৳ 150", rating: 4, reviews: 6, image: "/images/products/liquid-fert.jpg" },
  { id: 10, name: "Garden Gloves", category: "Equipment", price: "৳ 120", rating: 4, reviews: 22, image: "/images/products/gloves.jpg" },
  { id: 11, name: "Lavender", category: "Outdoor Plant", price: "৳ 700", rating: 5, reviews: 14, image: "/images/products/lavender.jpg" },
  { id: 12, name: "Cow Manure", category: "Fertilizer", price: "৳ 90", rating: 4, reviews: 5, image: "/images/products/manure.jpg" },
];

export default function ProductsPage(): JSX.Element {
  const INITIAL = 6;
  const STEP = 3;

  const [visible, setVisible] = useState<number>(INITIAL);
  const [cart, setCart] = useState<number[]>([]);
  const [mounted, setMounted] = useState<boolean>(false);

  const reduced = useReducedMotion();

  useEffect(() => {
    // mark mounted so animations run only on first client mount
    setMounted(true);
  }, []);

  const visibleProducts = productsData.slice(0, visible);

  function handleShowMore() {
    setVisible((prev) => Math.min(productsData.length, prev + STEP));
  }

  function handleShowLess() {
    setVisible(INITIAL);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleCart(id: number) {
    setCart((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  // Framer-motion variants (staggered). If reduced motion preferred, disable transforms.
  const containerVariants = {
    hidden: { opacity: 0, y: reduced ? 0 : 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.06,
        when: "beforeChildren",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: reduced ? 0 : 10, scale: reduced ? 1 : 0.995 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 24 },
    },
  };

  return (
    <main className="bg-[#F6F6EE] min-h-screen pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-8">
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={mounted && !reduced ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
            className="text-3xl md:text-4xl font-extrabold text-[#0E2D1B]"
          >
            Our Products
          </motion.h1>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={mounted && !reduced ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="text-gray-600 mt-2"
          >
            Explore our range of plants, fertilizers, and gardening tools.
          </motion.p>
        </header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={mounted ? "show" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {visibleProducts.map((p) => (
            <motion.article
              key={p.id}
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200"
            >
              <div className="relative h-48 w-full">
                {/* keep original img tag to maintain behavior/appearance */}
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>

              <div className="p-4">
                <span className="text-xs text-gray-500">{p.category}</span>
                <h3 className="text-lg font-semibold text-[#0E2D1B] mt-1">{p.name}</h3>

                <div className="mt-2 flex items-center gap-1 text-[#E58E26]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" fill={i < Math.round(p.rating) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.5a.75.75 0 011.04 0l2.37 2.44 3.3.48a.75.75 0 01.42 1.28l-2.39 2.33.56 3.27a.75.75 0 01-1.09.79L12 12.87l-2.93 1.54a.75.75 0 01-1.09-.79l.56-3.27-2.39-2.33a.75.75 0 01.42-1.28l3.3-.48L11.48 3.5z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-500 ml-2">({p.reviews})</span>
                </div>

                <p className="mt-3 text-[#E58E26] font-semibold">{p.price}</p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => toggleCart(p.id)}
                    className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                      cart.includes(p.id)
                        ? "bg-[#0E2D1B] text-white"
                        : "bg-[#E58E26] text-white hover:bg-[#f7a23a]"
                    }`}
                  >
                    {cart.includes(p.id) ? "Added" : "Add to cart"}
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
          {visible < productsData.length && (
            <button onClick={handleShowMore} className="bg-[#E58E26] text-white px-6 py-2 rounded-full hover:bg-[#f7a23a] transition">
              Show more
            </button>
          )}

          {visible > INITIAL && (
            <button onClick={handleShowLess} className="bg-white border border-gray-200 text-[#0E2D1B] px-6 py-2 rounded-full hover:bg-gray-50 transition">
              Show less
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
