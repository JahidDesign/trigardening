'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Link from 'next/link';
import { motion, Variants, useReducedMotion } from 'framer-motion';

/* -------------------------
   Types & Mock Data
   ------------------------- */
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  priceLabel?: string;
  rating: number;
  reviews: number;
  image: string;
  description?: string;
};

const productsData: Product[] = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    category: 'Plants',
    price: 2400,
    priceLabel: '৳ 2,000 - 3,400',
    rating: 4.8,
    reviews: 26,
    image: 'https://i.ibb.co/G4VmHMn/plantsdesign.png',
    description: 'A lush indoor plant with large, glossy leaves.',
  },
  {
    id: 2,
    name: 'Organic Compost Fertilizer',
    category: 'Fertilizers',
    price: 300,
    priceLabel: '৳ 60 - 440',
    rating: 4.5,
    reviews: 12,
    image: 'https://i.ibb.co/0pYgQWW/Hip-House-Plants.jpg',
  },
  {
    id: 3,
    name: 'Pruning Shears',
    category: 'Tools',
    price: 220,
    priceLabel: '৳ 180 - 450',
    rating: 4.7,
    reviews: 34,
    image: 'https://i.ibb.co/G3tfdjfk/tree1.jpg',
  },
  {
    id: 4,
    name: 'Aloe Vera',
    category: 'Plants',
    price: 450,
    priceLabel: '৳ 250 - 600',
    rating: 4.9,
    reviews: 18,
    image: 'https://i.ibb.co/7J9mryMP/tree2.jpg',
  },
  {
    id: 5,
    name: 'Snake Plant',
    category: 'Plants',
    price: 1200,
    priceLabel: '৳ 1,200',
    rating: 4.6,
    reviews: 40,
    image: 'https://i.ibb.co/B5hzFN94/tree3.jpg',
  },
  {
    id: 6,
    name: 'Ceramic Pot',
    category: 'Pots',
    price: 400,
    priceLabel: '৳ 400',
    rating: 4.4,
    reviews: 9,
    image: 'https://i.ibb.co/Gv45vTpq/tree4.jpg',
  },
  {
    id: 7,
    name: 'Hose Nozzle',
    category: 'Tools',
    price: 350,
    priceLabel: '৳ 350',
    rating: 4.3,
    reviews: 7,
    image: 'https://i.ibb.co/G4zTZnjD/tree5.jpg',
  },
  {
    id: 8,
    name: 'Rose Plant',
    category: 'Plants',
    price: 900,
    priceLabel: '৳ 900',
    rating: 4.2,
    reviews: 15,
    image: 'https://i.ibb.co/pBhZq72z/tree6.jpg',
  },
  {
    id: 9,
    name: 'Liquid Fertilizer',
    category: 'Fertilizers',
    price: 150,
    priceLabel: '৳ 150',
    rating: 4.1,
    reviews: 6,
    image: 'https://i.ibb.co/Gv625zmG/tree7.jpg',
  },
  {
    id: 10,
    name: 'Garden Gloves',
    category: 'Tools',
    price: 120,
    priceLabel: '৳ 120',
    rating: 4.0,
    reviews: 22,
    image: 'https://i.ibb.co/sJzH7D8k/tree8.jpg',
  },
  {
    id: 11,
    name: 'Lavender',
    category: 'Plants',
    price: 700,
    priceLabel: '৳ 700',
    rating: 4.6,
    reviews: 14,
    image: 'https://i.ibb.co/tMjdMKGB/tree9.jpg',
  },
  {
    id: 12,
    name: 'Cow Manure',
    category: 'Fertilizers',
    price: 90,
    priceLabel: '৳ 90',
    rating: 4.2,
    reviews: 5,
    image: 'https://i.ibb.co/c9jJxmF/tree10.jpg',
  },
];

/* -------------------------
   Simple Cart Context
   ------------------------- */
type CartState = {
  items: number[];
  count: number;
  add: (id: number) => void;
  remove: (id: number) => void;
  toggle: (id: number) => void;
  clear: () => void;
  includes: (id: number) => boolean;
};

const CartContext = createContext<CartState | undefined>(undefined);

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart_items');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart_items', JSON.stringify(items));
    }
  }, [items]);

  const add = useCallback((id: number) => setItems((s) => (s.includes(id) ? s : [...s, id])), []);
  const remove = useCallback((id: number) => setItems((s) => s.filter((x) => x !== id)), []);
  const toggle = useCallback(
    (id: number) => setItems((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
    []
  );
  const clear = useCallback(() => setItems([]), []);
  const includes = useCallback((id: number) => items.includes(id), [items]);

  const value = useMemo(() => ({ items, count: items.length, add, remove, toggle, clear, includes }), [
    items,
    add,
    remove,
    toggle,
    clear,
    includes,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

/* -------------------------
   ProductCard Component
   ------------------------- */
function ProductCard({
  product,
  inCart,
  onToggle,
}: {
  product: Product;
  inCart: boolean;
  onToggle: (id: number) => void;
}) {
  return (
    <article className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
      <div className="relative h-44 w-full">
        <img
          src={product.image}
          alt={product.name}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </div>

      <div className="p-4">
        <span className="text-xs text-gray-500">{product.category}</span>
        <h3 className="text-lg font-semibold text-[#0E2D1B] mt-1">{product.name}</h3>

        <div className="mt-2 flex items-center gap-1 text-[#E58E26]" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.2"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.5a.75.75 0 011.04 0l2.37 2.44 3.3.48a.75.75 0 01.42 1.28l-2.39 2.33.56 3.27a.75.75 0 01-1.09.79L12 12.87l-2.93 1.54a.75.75 0 01-1.09-.79l.56-3.27-2.39-2.33a.75.75 0 01.42-1.28l3.3-.48L11.48 3.5z"
              />
            </svg>
          ))}
          <span className="text-xs text-gray-500 ml-2">({product.reviews})</span>
        </div>

        <p className="mt-3 text-[#E58E26] font-semibold">{product.priceLabel ?? `৳ ${product.price}`}</p>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => onToggle(product.id)}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
              inCart ? 'bg-[#0E2D1B] text-white' : 'bg-[#E58E26] text-white hover:bg-[#f7a23a]'
            }`}
          >
            {inCart ? 'Added' : 'Add to cart'}
          </button>
          <button className="py-2 px-3 rounded-full border border-gray-200 text-sm text-[#0E2D1B] hover:bg-gray-50">
            View
          </button>
        </div>
      </div>
    </article>
  );
}

/* -------------------------
   Cart Button & Safe Hook
   ------------------------- */
function CartButton() {
  // This component will be rendered inside CartProvider, so useCart will work.
  const cart = useCart();
  return (
    <Link href="/cart" className="relative inline-block">
      <span className="text-[#0E2D1B] font-semibold">🛒 Cart</span>
      {cart.count > 0 && (
        <span className="absolute -top-2 -right-3 bg-[#E58E26] text-white text-xs rounded-full px-2 py-[1px]">
          {cart.count}
        </span>
      )}
    </Link>
  );
}

/* -------------------------
   Product Grid (inside provider)
   ------------------------- */
function ProductGrid({
  visibleProducts,
  mounted,
  containerVariants,
  cardVariants,
  visible,
  filteredLength,
  INITIAL,
  handleShowMore,
  handleShowLess,
}: {
  visibleProducts: Product[];
  mounted: boolean;
  containerVariants: Variants | undefined;
  cardVariants: Variants | undefined;
  visible: number;
  filteredLength: number;
  INITIAL: number;
  handleShowMore: () => void;
  handleShowLess: () => void;
}) {
  const cart = useCart();

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial={containerVariants ? 'hidden' : false}
        animate={mounted && containerVariants ? 'show' : containerVariants ? 'hidden' : false}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {visibleProducts.map((p) => (
          <motion.div key={p.id} variants={cardVariants || undefined}>
            <ProductCard product={p} inCart={cart.includes(p.id)} onToggle={cart.toggle} />
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-8 flex items-center justify-center gap-4">
        {visible < filteredLength && (
          <button
            onClick={handleShowMore}
            className="bg-[#E58E26] text-white px-6 py-2 rounded-full hover:bg-[#f7a23a] transition"
          >
            Load more products
          </button>
        )}
        {visible > INITIAL && (
          <button
            onClick={handleShowLess}
            className="bg-white border border-gray-200 text-[#0E2D1B] px-6 py-2 rounded-full hover:bg-gray-50 transition"
          >
            Show less
          </button>
        )}
      </div>
    </>
  );
}

/* -------------------------
   Main Page Component
   ------------------------- */
export default function ProductsPageSingleFile(): React.ReactElement {
  const CATEGORIES = ['Plants', 'Tools', 'Fertilizers', 'Pots'];
  const INITIAL = 6;
  const STEP = 3;

  const [visible, setVisible] = useState(INITIAL);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('popular');
  const [mounted, setMounted] = useState(false);

  const reduced = useReducedMotion(); // framer-motion hook
  // NOTE: do NOT call useCart() here — CartProvider must be in place first.

  useEffect(() => setMounted(true), []);
  useEffect(() => setVisible(INITIAL), [selectedCategories, minPrice, maxPrice, sortBy]);

  const toggleCategory = (c: string) =>
    setSelectedCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const filtered = useMemo(() => {
    let list = [...productsData];
    if (selectedCategories.length) list = list.filter((p) => selectedCategories.includes(p.category));
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [selectedCategories, minPrice, maxPrice, sortBy]);

  const visibleProducts = filtered.slice(0, visible);

  const handleShowMore = () => setVisible((prev) => Math.min(filtered.length, prev + STEP));
  const handleShowLess = () => {
    setVisible(INITIAL);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Typed variants and respect reduced-motion by making them undefined when reduced
  const containerVariants: Variants | undefined = reduced
    ? undefined
    : ({
        hidden: { opacity: 0, y: 8 },
        show: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.06, when: ('beforeChildren' as const) },
        },
      } as Variants);

  const cardVariants: Variants | undefined = reduced
    ? undefined
    : ({
        hidden: { opacity: 0, y: 10, scale: 0.995 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: ('spring' as const), stiffness: 260, damping: 24 },
        },
      } as Variants);

  return (
    <CartProvider>
      <main className="bg-[#F6F6EE] min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <nav className="text-xs text-gray-500 mb-2">
                <Link href="/">Home</Link> <span className="mx-2">/</span> Products
              </nav>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0E2D1B]">Plants</h1>
              <p className="text-sm text-gray-600 mt-1">Showing {filtered.length} products</p>
            </div>
            <CartButton />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-3 bg-white rounded-lg shadow p-4 sticky top-24 self-start h-fit">
              <h3 className="font-semibold text-[#0E2D1B] mb-3">Filter Products</h3>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
                <div className="space-y-2">
                  {CATEGORIES.map((c) => (
                    <label key={c} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={selectedCategories.includes(c)} onChange={() => toggleCategory(c)} className="w-4 h-4" />
                      <span className="text-gray-700">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                <div className="flex gap-2 items-center">
                  <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="w-1/2 p-2 text-sm border rounded" placeholder="Min" />
                  <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-1/2 p-2 text-sm border rounded" placeholder="Max" />
                </div>
              </div>

              <button onClick={() => setVisible(INITIAL)} className="w-full bg-[#0E2D1B] text-white py-2 rounded-md">
                Apply Filters
              </button>
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

              {/* product grid is a child component so it can safely call useCart() */}
              <ProductGrid
                visibleProducts={visibleProducts}
                mounted={mounted}
                containerVariants={containerVariants}
                cardVariants={cardVariants}
                visible={visible}
                filteredLength={filtered.length}
                INITIAL={INITIAL}
                handleShowMore={handleShowMore}
                handleShowLess={handleShowLess}
              />
            </section>
          </div>
        </div>
      </main>
    </CartProvider>
  );
}
