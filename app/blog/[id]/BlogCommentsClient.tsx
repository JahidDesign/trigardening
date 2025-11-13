// src/app/blog/[id]/BlogCommentsClient.tsx
"use client";

import React, { useEffect, useState } from "react";

type Comment = {
  id: string;
  name: string;
  text: string;
  date: string;
  likes?: number;
  dislikes?: number;
};

const STORAGE_PREFIX = "tg_blog_comments_v1_";
const VOTES_PREFIX = "tg_blog_comment_votes_v1_"; // store per-post votes to prevent repeat votes

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

export default function BlogCommentsClient({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  // votes is a map: { [commentId]: "like" | "dislike" }
  const [votes, setVotes] = useState<Record<string, "like" | "dislike">>({});

  // load comments + votes on mount / post change
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_PREFIX + postId);
    if (raw) {
      try {
        setComments(JSON.parse(raw));
      } catch {
        setComments([]);
      }
    } else {
      setComments([]);
    }

    const rawVotes = localStorage.getItem(VOTES_PREFIX + postId);
    if (rawVotes) {
      try {
        setVotes(JSON.parse(rawVotes));
      } catch {
        setVotes({});
      }
    } else {
      setVotes({});
    }
  }, [postId]);

  // persist comments
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + postId, JSON.stringify(comments));
    } catch {}
  }, [comments, postId]);

  // persist votes
  useEffect(() => {
    try {
      localStorage.setItem(VOTES_PREFIX + postId, JSON.stringify(votes));
    } catch {}
  }, [votes, postId]);

  function addComment(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmedName = name.trim();
    const trimmedText = text.trim();
    if (!trimmedName || !trimmedText) {
      // small inline validation
      window.alert("Please provide your name and a comment.");
      return;
    }

    setBusy(true);
    const c: Comment = {
      id: uid(),
      name: trimmedName,
      text: trimmedText,
      date: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
    };

    // optimistic update
    setComments((s) => [c, ...s]);
    setName("");
    setText("");

    // simulate async persistence (if you later call an API, do it here)
    setTimeout(() => {
      setBusy(false);
    }, 300);
  }

  // toggleLike now respects previous vote: a user can only have one vote per comment.
  // we track vote decisions in `votes` stored per-post.
  function toggleLike(id: string, type: "like" | "dislike") {
    // If user has already voted same type -> remove vote (undo)
    const existing = votes[id];

    if (existing === type) {
      // undo
      setVotes((v) => {
        const copy = { ...v };
        delete copy[id];
        return copy;
      });
      setComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                likes: type === "like" ? Math.max(0, (c.likes ?? 0) - 1) : c.likes,
                dislikes: type === "dislike" ? Math.max(0, (c.dislikes ?? 0) - 1) : c.dislikes,
              }
            : c
        )
      );
      return;
    }

    // If user had opposite vote, remove that first
    if (existing && existing !== type) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                likes: existing === "like" ? Math.max(0, (c.likes ?? 0) - 1) : c.likes,
                dislikes: existing === "dislike" ? Math.max(0, (c.dislikes ?? 0) - 1) : c.dislikes,
              }
            : c
        )
      );
    }

    // apply new vote
    setVotes((v) => ({ ...v, [id]: type }));
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              likes: type === "like" ? (c.likes ?? 0) + 1 : c.likes,
              dislikes: type === "dislike" ? (c.dislikes ?? 0) + 1 : c.dislikes,
            }
          : c
      )
    );
  }

  // optional: allow comment author to delete their own comment in this browser
  function removeComment(id: string) {
    if (!confirm("Delete this comment?")) return;
    setComments((prev) => prev.filter((c) => c.id !== id));
    // also remove vote record for that comment
    setVotes((v) => {
      const copy = { ...v };
      delete copy[id];
      return copy;
    });
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-3">Comments</h3>

      <form onSubmit={addComment} className="space-y-3" aria-label="Add comment form">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full p-3 border rounded col-span-1 md:col-span-1"
            aria-label="Your name"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your comment"
            className="w-full p-3 border rounded col-span-1 md:col-span-3"
            rows={4}
            aria-label="Comment text"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={busy}
            className="bg-[#0E2D1B] text-white px-4 py-2 rounded disabled:opacity-60"
            aria-disabled={busy}
          >
            {busy ? "Posting..." : "Post Comment"}
          </button>
          <button
            type="button"
            onClick={() => {
              setName("");
              setText("");
            }}
            className="px-4 py-2 border rounded"
          >
            Clear
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-4">
        {comments.length === 0 && <div className="text-sm text-gray-500">No comments yet — be the first!</div>}

        {comments.map((c) => {
          const userVote = votes[c.id]; // may be undefined | "like" | "dislike"
          return (
            <div key={c.id} className="border rounded p-3 bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EDEDEA] flex items-center justify-center font-semibold text-[#0E2D1B]">
                    {initials(c.name)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="text-xs text-gray-400">{new Date(c.date).toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLike(c.id, "like")}
                    aria-label={`Like comment by ${c.name}`}
                    className={`px-2 py-1 text-sm rounded ${userVote === "like" ? "bg-[#E58E26] text-white" : "bg-white border"}`}
                  >
                    👍 {c.likes ?? 0}
                  </button>

                  <button
                    onClick={() => toggleLike(c.id, "dislike")}
                    aria-label={`Dislike comment by ${c.name}`}
                    className={`px-2 py-1 text-sm rounded ${userVote === "dislike" ? "bg-[#0E2D1B] text-white" : "bg-white border"}`}
                  >
                    👎 {c.dislikes ?? 0}
                  </button>

                  <button
                    onClick={() => removeComment(c.id)}
                    title="Delete comment"
                    className="text-xs text-red-600 px-2 py-1"
                    aria-label="Delete comment"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-700">{c.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
