"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../lib/firebase";

type Comment = {
  id: string;
  name: string;
  text: string;
  createdAt: any;
  likes?: number;
  dislikes?: number;
};

export default function Comments({ postId }: { postId: string }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const LS_KEY = `tg_comment_votes_${postId}`;
  const loadVotes = (): Record<string, "like" | "dislike"> => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };
  const [votes, setVotes] = useState<Record<string, "like" | "dislike">>(() =>
    typeof window !== "undefined" ? loadVotes() : {}
  );

  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const arr: Comment[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setComments(arr);
      setLoading(false);
    });
    return () => unsub();
  }, [postId]);

  const saveVotes = (next: Record<string, "like" | "dislike">) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {}
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      alert("Please enter name and comment.");
      return;
    }
    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        name: name.trim(),
        text: text.trim(),
        createdAt: serverTimestamp(),
        likes: 0,
        dislikes: 0,
      });
      setName("");
      setText("");
    } catch (err) {
      console.error(err);
      alert("Failed to post comment.");
    }
  };

  const handleVote = async (commentId: string, type: "like" | "dislike") => {
    const existing = votes[commentId];
    if (existing === type) return;

    const commentRef = doc(db, "posts", postId, "comments", commentId);

    try {
      await updateDoc(commentRef, {
        ...(type === "like" ? { likes: increment(1) } : { dislikes: increment(1) }),
        ...(existing === "like" ? { likes: increment(-1) } : {}),
        ...(existing === "dislike" ? { dislikes: increment(-1) } : {}),
      });

      const next = { ...votes, [commentId]: type };
      setVotes(next);
      saveVotes(next);
    } catch (err) {
      console.error("vote error", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">Add a comment</h3>
        <form onSubmit={submit} className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full p-2 border rounded"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Write your comment..."
            className="w-full p-2 border rounded"
          />
          <div>
            <button type="submit" className="bg-[#E58E26] text-white px-4 py-2 rounded-full">
              Post comment
            </button>
          </div>
        </form>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-3">Comments {loading ? "..." : `(${comments.length})`}</h4>

        <div className="space-y-4">
          {comments.length === 0 && <div className="text-gray-500">No comments yet. Be first!</div>}

          {comments.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-gray-500">
                    {c.createdAt?.seconds ? new Date(c.createdAt.seconds * 1000).toLocaleString() : "Just now"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote(c.id, "like")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                      votes[c.id] === "like" ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <span>👍</span>
                    <span className="text-sm">{c.likes ?? 0}</span>
                  </button>

                  <button
                    onClick={() => handleVote(c.id, "dislike")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                      votes[c.id] === "dislike" ? "bg-red-100" : "bg-gray-100"
                    }`}
                  >
                    <span>👎</span>
                    <span className="text-sm">{c.dislikes ?? 0}</span>
                  </button>
                </div>
              </div>

              <div className="mt-3 text-gray-700">{c.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
