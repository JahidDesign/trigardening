// src/app/blog/page.tsx
import React from "react";
import BlogListClient from "./BlogListClient";
import { getAllPosts } from "../lib/posts";

export default async function BlogPage() {
  let posts: any[] = [];

  try {
    const data = await getAllPosts();
    posts = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error loading posts:", error);
    posts = [];
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-[#0E2D1B] mb-8 text-center">
        Latest Blog Articles
      </h1>
      <BlogListClient posts={posts} />
    </main>
  );
}
