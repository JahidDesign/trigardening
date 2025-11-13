// components/CartView.tsx  (client)
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "../lib/products";
import { useCart } from "../context/CartContext";

export default function CartView({ products }: { products: Product[] }) {
  const { items, remove, clear } = useCart();

  const cartProducts = products.filter((p) => items.includes(p.id));
  const total = cartProducts.reduce((s, p) => s + p.price, 0);

  if (cartProducts.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="bg-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-gray-600">Add some plants and gardening gear.</p>
          <Link href="/products" className="inline-block mt-4 px-5 py-2 bg-[#E58E26] text-white rounded-full">Browse products</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 pt-24 pb-20">
      <h1 className="text-2xl font-bold mb-6">Your Cart ({cartProducts.length})</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {cartProducts.map((p) => (
            <div key={p.id} className="flex items-center gap-4 bg-white rounded-lg p-4 shadow">
              <div className="w-24 h-24 relative">
                <Image src={p.image} alt={p.name} fill style={{ objectFit: "cover" }} sizes="96px" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.category} • {p.reviews} reviews</p>
                <p className="mt-2 font-semibold">৳ {p.price}</p>
              </div>
              <div>
                <button onClick={() => remove(p.id)} className="text-sm text-red-600">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Subtotal</span>
            <span className="font-semibold">৳ {total}</span>
          </div>

          <button className="w-full mt-4 bg-[#0E2D1B] text-white py-2 rounded-full">Checkout</button>
          <button onClick={() => clear()} className="w-full mt-2 text-sm border border-gray-200 py-2 rounded-full">Clear cart</button>
        </aside>
      </div>
    </main>
  );
}
