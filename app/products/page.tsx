// app/products/page.tsx
import React from "react";
import ProductsList from "../components/ProductsList";
import { getAllProducts } from "../lib/products";

export default async function ProductsPage() {
  const products = await getAllProducts();

  return <ProductsList products={products} />;
}
