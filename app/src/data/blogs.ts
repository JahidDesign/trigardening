export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string; // iso
  readTime?: string;
  category: string;
  image: string; // /images/blog/...
};

export const BLOGS: BlogPost[] = [
  {
    id: "1",
    slug: "10-essential-tips-for-indoor-plant-care",
    title: "10 Essential Tips for Indoor Plant Care",
    excerpt: "Simple, effective habits that will help your indoor plants thrive year-round.",
    content:
      `<p>Indoor plants add life to any home — but they require the right light, water, and soil to thrive. In this guide we cover the most important tips: choosing the right pot, using well-draining soil, rotating plants for even light, and more. ...</p>
       <h3>1. Choose the right pot</h3>
       <p>Pick a pot with drainage. Many houseplants don't like to sit in water.</p>
       <h3>2. Use the right soil</h3>
       <p>Use well-draining mixes for succulents and peat mixes for moisture-loving plants.</p>
       <p>... (add more paragraphs or images)</p>`,
    author: "TriGardening Team",
    date: "2025-10-15",
    readTime: "6 min",
    category: "Plants",
    image: "/images/blog/indoor-plants.jpg",
  },
  {
    id: "2",
    slug: "how-to-make-organic-compost-at-home",
    title: "How to Make Organic Compost at Home",
    excerpt: "Turn kitchen scraps into rich compost — step-by-step method for small spaces.",
    content:
      "<p>Compost is gold for the garden. You can make compost in small bins or even in a tumbler. Start with a 3:1 ratio of brown to green materials...</p>",
    author: "TriGardening Team",
    date: "2025-09-05",
    readTime: "4 min",
    category: "Fertilizers",
    image: "/images/blog/compost.jpg",
  },
  {
    id: "3",
    slug: "best-pruning-tools-and-how-to-use-them",
    title: "Best Pruning Tools and How To Use Them",
    excerpt: "A quick guide to pruning shears, loppers, and saws — and when to use each.",
    content:
      "<p>Good pruning starts with the right tools. Learn how to sharpen and maintain shears, and the proper cutting technique.</p>",
    author: "TriGardening Team",
    date: "2025-08-10",
    readTime: "5 min",
    category: "Tools",
    image: "/images/blog/pruning.jpg",
  },
  // add more posts as needed
];
