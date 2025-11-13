// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import LayoutWrapper from "./LayoutWrapper";
import { CartProvider } from "./context/CartContext";

export const metadata: Metadata = {
  title: "TriGardening",
  description: "Nurture your green paradise.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F6F6EE] text-[#0E2D1B]">
       
        <CartProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
