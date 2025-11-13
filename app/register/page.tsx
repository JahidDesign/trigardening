"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      await updateProfile(userCred.user, { displayName: form.name });
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/home");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <section className="min-h-screen bg-[#0E2D1B] flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-[#0E2D1B] mb-6">
          Create Account
        </h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#E58E26]"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#E58E26]"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#E58E26]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E58E26] text-white py-2 rounded-lg hover:bg-[#f7a23a] transition"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <button
          onClick={handleGoogle}
          className="w-full mt-4 border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition"
        >
          <img src="/images/google.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-[#E58E26] hover:underline">
            Login
          </a>
        </p>
      </div>
    </section>
  );
}
