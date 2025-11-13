"use client";

import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // ✅ Detect user login status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Scroll background effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Lock scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
  }, [open]);

  // ✅ Logout function
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full text-white z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0E2D1B]/95 backdrop-blur-lg shadow-xl"
            : "bg-[#0E2D1B]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              scrolled ? "h-14" : "h-16 sm:h-20"
            }`}
          >
            {/* ---------- Logo ---------- */}
            <a href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#E58E26] to-[#f7a23a] rounded-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                </svg>
              </div>
              <span className="font-bold text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                TriGardening
              </span>
            </a>

            {/* ---------- Desktop Navigation ---------- */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {[
                { name: "Home", href: "/" },
                { name: "Products", href: "/products" },
                { name: "Blog", href: "/blog" },
                { name: "Plant Clinic", href: "/plantclinic" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative px-3 xl:px-4 py-2 text-sm xl:text-base font-medium text-gray-200 hover:text-white transition-colors duration-200 group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#E58E26] to-[#f7a23a] group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </nav>

            {/* ---------- Right Actions ---------- */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Bar */}
              <div className="hidden md:flex items-center">
                <div
                  className={`flex items-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20 transition-all duration-300 ${
                    searchOpen ? "w-64" : "w-10"
                  }`}
                >
                  <button
                    onClick={() => setSearchOpen(!searchOpen)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Search"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M18 11a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                  {searchOpen && (
                    <input
                      type="text"
                      placeholder="Search plants, tools..."
                      className="flex-1 bg-transparent outline-none text-sm px-2 text-white placeholder-gray-400"
                      autoFocus
                    />
                  )}
                </div>
              </div>

              {/* Call Button */}
              <a
                href="tel:+123456789"
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#E58E26] to-[#f7a23a] hover:from-[#f7a23a] hover:to-[#E58E26] text-white font-medium px-4 py-2 rounded-full text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="hidden lg:inline">Call Now</span>
              </a>

              {/* Cart */}
              <a
                href="/cart"
                className="relative p-2 rounded-full hover:bg-white/10 transition-all duration-300 group"
                aria-label="Cart"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 bg-[#E58E26] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  3
                </span>
              </a>

              {/* User Info / Logout */}
              {user ? (
                <div className="flex items-center gap-2">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full border-2 border-[#E58E26]"
                    />
                  )}
                  <span className="hidden sm:inline text-sm text-white">
                    {user.displayName || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-[#E58E26] px-4 py-1.5 rounded-full text-sm hover:bg-[#f7a23a] transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <a
                  href="/login"
                  className="p-2 rounded-full hover:bg-white/10 transition-all duration-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </a>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Mobile Sidebar (Drawer) ---------- */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-[#0E2D1B] to-[#0a1f13] shadow-2xl transform transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#E58E26] to-[#f7a23a] rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                </svg>
              </div>
              <span className="font-bold text-lg">TriGardening</span>
            </a>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="p-6 space-y-2 text-white">
            <a href="/" className="block py-2 hover:text-[#E58E26]">
              Home
            </a>
            <a href="/products" className="block py-2 hover:text-[#E58E26]">
              Products
            </a>
            <a href="/blog" className="block py-2 hover:text-[#E58E26]">
              Blog
            </a>
            <a href="/plant-clinic" className="block py-2 hover:text-[#E58E26]">
              Plant Clinic
            </a>

            {user ? (
              <button
                onClick={handleLogout}
                className="mt-4 w-full bg-[#E58E26] py-2 rounded-lg hover:bg-[#f7a23a]"
              >
                Logout
              </button>
            ) : (
              <a
                href="/login"
                className="mt-4 block w-full bg-[#E58E26] text-center py-2 rounded-lg hover:bg-[#f7a23a]"
              >
                Login
              </a>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
