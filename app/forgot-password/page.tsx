"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ Password reset email sent! Check your inbox.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <section className="min-h-screen bg-[#0E2D1B] flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-[#0E2D1B] mb-6">
          Reset Password
        </h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-3">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#E58E26]"
          />

          <button
            type="submit"
            className="w-full bg-[#E58E26] text-white py-2 rounded-lg hover:bg-[#f7a23a] transition"
          >
            Send Reset Link
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          <a href="/login" className="text-[#E58E26] hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </section>
  );
}
