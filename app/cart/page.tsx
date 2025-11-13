// app/cart/page.tsx  (server)
import React from "react";
import CartView from "../components/CartView";
import { getAllProducts } from "../lib/products";

export default async function CartPage() {
  const products = await getAllProducts();
  return <CartView products={products} />;
}
