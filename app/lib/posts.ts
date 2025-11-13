// src/lib/posts.ts
import POSTS from "../data/posts.json";   

export type Post = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  hero: string;
  date: string;
  minutesToRead?: number;
  author?: { name: string; avatar?: string };
  category?: string;
};

const posts: Post[] = (POSTS as Post[]) || [];

export function getAllPosts(): Post[] {
  return posts.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostById(id: string): Post | null {
  return posts.find((p) => p.id === id) ?? null;
}
