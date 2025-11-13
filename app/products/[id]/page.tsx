// app/products/[id]/page.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById, getAllProducts } from '../../lib/products';
import type { Product } from '../../lib/products';

type Props = { params: { id: string } };

export default async function ProductPage({ params }: Props) {
  const id = Number(params.id);
  const product: Product | undefined = await getProductById(id);

  if (!product) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-[#F6F6EE] p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0E2D1B]">Product Not Found</h1>
          <p className="text-gray-600 mt-2">We couldn’t find this product.</p>
          <Link href="/products" className="inline-block mt-4 bg-[#E58E26] text-white px-6 py-2 rounded-full">Back to Products</Link>
        </div>
      </main>
    );
  }

  const related = (await getAllProducts()).filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <main className="bg-[#F6F6EE] min-h-screen pt-24 pb-16 px-6">
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl shadow p-6 md:p-10">
        <div className="flex justify-center items-center">
          <div className="relative w-full max-w-md h-80 md:h-[420px] rounded-xl overflow-hidden shadow-sm">
            <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">{product.category}</p>
          <h1 className="text-3xl font-extrabold text-[#0E2D1B] mt-1">{product.name}</h1>

          <div className="mt-3 flex items-center gap-1 text-[#E58E26]">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" fill={i < Math.round(product.rating) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.5a.75.75 0 011.04 0l2.37 2.44 3.3.48a.75.75 0 01.42 1.28l-2.39 2.33.56 3.27a.75.75 0 01-1.09.79L12 12.87l-2.93 1.54a.75.75 0 01-1.09-.79l.56-3.27-2.39-2.33a.75.75 0 01.42-1.28l3.3-.48L11.48 3.5z" />
              </svg>
            ))}
            <span className="text-sm text-gray-500 ml-2">({product.reviews} reviews)</span>
          </div>

          <p className="text-2xl font-semibold text-[#E58E26] mt-5">{product.price}</p>

          <p className="mt-4 text-gray-700 leading-relaxed">{product.description}</p>

          <div className="mt-8 flex gap-3">
            <button className="bg-[#E58E26] text-white px-6 py-2 rounded-full hover:bg-[#f7a23a]">Add to Cart</button>
            <Link href="/products" className="bg-white border border-gray-200 text-[#0E2D1B] px-6 py-2 rounded-full hover:bg-gray-50">Back</Link>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="max-w-6xl mx-auto mt-12">
        <h2 className="text-xl font-bold text-[#0E2D1B] mb-6 text-center">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {related.map((rp) => (
            <Link key={rp.id} href={`/products/${rp.id}`} className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
              <div className="relative w-full h-40">
                <Image src={rp.image} alt={rp.name} fill className="object-cover" />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-[#0E2D1B] truncate">{rp.name}</h3>
                <p className="text-sm text-[#E58E26] font-semibold mt-1">{rp.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
