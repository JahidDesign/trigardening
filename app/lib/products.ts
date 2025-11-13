// lib/products.ts
import productsJson from '../src/data/products.json';

export type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  description?: string;
};

const products: Product[] = (productsJson as unknown) as Product[];

/**
 * Return all products (simulate async to be compatible with future fetchers)
 */
export async function getAllProducts(): Promise<Product[]> {
  // In real app you might fetch from DB/CMS. Here we return local data.
  return products;
}

/**
 * Return one product by id
 */
export async function getProductById(id: number): Promise<Product | undefined> {
  return products.find((p) => p.id === id);
}

/**
 * Optional: list categories with counts
 */
export async function getCategories(): Promise<{ name: string; count: number }[]> {
  const map = products.reduce<Record<string, number>>((acc, p) => {
    const key = p.category ?? 'Uncategorized';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(map).map((k) => ({ name: k, count: map[k] }));
}
