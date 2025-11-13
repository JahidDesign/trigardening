"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide Navbar + Footer on login/register pages
  const hideLayout = ["/login", "/register"].includes(pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className={`${!hideLayout ? "pt-20" : ""} min-h-screen`}>
        {children}
      </main>
      {!hideLayout && <Footer />}
    </>
  );
}
