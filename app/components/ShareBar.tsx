'use client';
import { useState } from 'react';
import { Post } from '../lib/posts';


export default function ShareBar({ post }: { post: Post }) {
const [open, setOpen] = useState(false);


const url = typeof window !== 'undefined' ? window.location.origin + `/blog/${post.id}` : `/blog/${post.id}`;


return (
<div className="relative">
<button onClick={() => setOpen(o => !o)} className="text-xs border rounded-full px-2 py-1">Share</button>


{open && (
<div className="absolute right-0 top-8 w-40 bg-white rounded-md shadow p-2 z-10">
<button
onClick={() => navigator.clipboard.writeText(url)}
className="w-full text-left text-sm py-1 hover:bg-gray-50 rounded px-2"
>
Copy link
</button>
<a className="block text-sm py-1 hover:bg-gray-50 rounded px-2" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer">Tweet</a>
<a className="block text-sm py-1 hover:bg-gray-50 rounded px-2" href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">Facebook</a>
</div>
)}
</div>
);
}